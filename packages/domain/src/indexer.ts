import { Socket } from "@effect/platform"
import { Effect, Option, PubSub, Ref, Schedule, Schema, Stream } from "effect"
import { FinPair } from "./rujira.js"

/**
 * Client for the Rujira indexer (the same API the official UI uses):
 * one-shot GraphQL queries over HTTP, and GraphQL subscriptions over a
 * Phoenix WebSocket speaking the Absinthe protocol — implemented directly on
 * @effect/platform Socket rather than the phoenix/absinthe npm clients.
 */

export const RUJIRA_API_URL = "https://api.rujira.network/api/graphql"
export const RUJIRA_SOCKET_URL = "wss://api.rujira.network/socket/websocket?vsn=2.0.0"

const CONTROL_TOPIC = "__absinthe__:control"
const JOIN_REF = "1"

export class RujiraIndexerError extends Schema.TaggedError<RujiraIndexerError>()("RujiraIndexerError", {
    cause: Schema.Defect
}) {}

/**
 * Phoenix channel serializer v2 frames: [join_ref, ref, topic, event, payload].
 * Exported for tests.
 */
export interface PhoenixFrame {
    readonly joinRef: string | null
    readonly ref: string | null
    readonly topic: string
    readonly event: string
    readonly payload: unknown
}

export const encodePhoenixFrame = (frame: PhoenixFrame): string =>
    JSON.stringify([frame.joinRef, frame.ref, frame.topic, frame.event, frame.payload])

export const decodePhoenixFrame = (raw: string): PhoenixFrame | undefined => {
    try {
        const parsed: unknown = JSON.parse(raw)
        if (!Array.isArray(parsed) || parsed.length !== 5) return undefined
        const [joinRef, ref, topic, event, payload] = parsed as [
            string | null,
            string | null,
            unknown,
            unknown,
            unknown
        ]
        if (typeof topic !== "string" || typeof event !== "string") return undefined
        return { joinRef, ref, topic, event, payload }
    } catch {
        return undefined
    }
}

const ReplyPayload = Schema.Struct({
    status: Schema.String,
    response: Schema.Unknown
})

const SubscriptionReply = Schema.Struct({
    subscriptionId: Schema.NonEmptyTrimmedString
})

const SubscriptionData = Schema.Struct({
    result: Schema.Struct({
        data: Schema.Unknown
    })
})

/** The finV2 pair listing, decoded down to the app's FinPair shape. */
const IndexerAsset = Schema.Struct({
    variants: Schema.Struct({
        native: Schema.NullOr(Schema.Struct({ denom: Schema.NonEmptyTrimmedString }))
    })
})

const FinPairsResult = Schema.Struct({
    finV2: Schema.Struct({
        edges: Schema.Array(Schema.Struct({
            node: Schema.Struct({
                address: Schema.NonEmptyTrimmedString,
                assetBase: IndexerAsset,
                assetQuote: IndexerAsset
            })
        }))
    })
})

const FIN_PAIRS_QUERY = `{
  finV2(first: 100, sortBy: NAME, sortDir: ASC) {
    edges { node {
      address
      assetBase { variants { native { denom } } }
      assetQuote { variants { native { denom } } }
    } }
  }
}`

export class RujiraIndexer extends Effect.Service<RujiraIndexer>()("RujiraIndexer", {
    scoped: Effect.gen(function*() {
        const frames = yield* PubSub.unbounded<PhoenixFrame>()
        const refCounter = yield* Ref.make(1)

        const socket = yield* Socket.makeWebSocket(RUJIRA_SOCKET_URL)
        const write = yield* socket.writer

        // Incoming frame pump. Lives for the service scope; on socket failure
        // the pub-sub is shut down so every open subscription stream ends
        // instead of hanging silently.
        yield* Effect.forkScoped(
            socket.runRaw((data) => {
                const frame = decodePhoenixFrame(typeof data === "string" ? data : new TextDecoder().decode(data))
                return frame ? PubSub.publish(frames, frame) : undefined
            }).pipe(
                Effect.tapErrorCause((cause) => Effect.logWarning("rujira indexer socket closed", cause)),
                Effect.ensuring(PubSub.shutdown(frames))
            )
        )

        /** Push a frame on the control topic and await its phx_reply. */
        const request = (event: string, payload: unknown) =>
            Effect.scoped(Effect.gen(function*() {
                const ref = String(yield* Ref.updateAndGet(refCounter, (n) => n + 1))
                const subscription = yield* PubSub.subscribe(frames)

                yield* write(encodePhoenixFrame({ joinRef: JOIN_REF, ref, topic: CONTROL_TOPIC, event, payload })).pipe(
                    Effect.mapError((cause) => new RujiraIndexerError({ cause }))
                )

                const reply = yield* Stream.fromQueue(subscription).pipe(
                    Stream.filter((frame) => frame.event === "phx_reply" && frame.ref === ref),
                    Stream.runHead,
                    Effect.flatMap(Option.match({
                        onNone: () => Effect.fail(new RujiraIndexerError({ cause: `socket closed awaiting ${event} reply` })),
                        onSome: Effect.succeed
                    })),
                    Effect.timeoutFail({
                        duration: "10 seconds",
                        onTimeout: () => new RujiraIndexerError({ cause: `timed out awaiting ${event} reply` })
                    })
                )

                const decoded = yield* Schema.decodeUnknown(ReplyPayload)(reply.payload).pipe(
                    Effect.mapError((cause) => new RujiraIndexerError({ cause }))
                )

                if (decoded.status !== "ok") {
                    return yield* Effect.fail(
                        new RujiraIndexerError({ cause: `${event} rejected: ${JSON.stringify(decoded.response)}` })
                    )
                }

                return decoded.response
            }))

        yield* request("phx_join", {})

        // Phoenix drops quiet connections; heartbeat keeps ours alive.
        yield* Effect.forkScoped(
            Effect.gen(function*() {
                const ref = String(yield* Ref.updateAndGet(refCounter, (n) => n + 1))
                yield* write(encodePhoenixFrame({ joinRef: null, ref, topic: "phoenix", event: "heartbeat", payload: {} }))
            }).pipe(
                Effect.ignore,
                Effect.repeat(Schedule.spaced("30 seconds"))
            )
        )

        /**
         * Subscribe to a GraphQL subscription document; the stream emits each
         * schema-decoded payload and unsubscribes upstream when it is closed.
         */
        const subscribe = <A, I>(schema: Schema.Schema<A, I, never>, document: string, variables?: Record<string, unknown>) =>
            Stream.unwrapScoped(Effect.gen(function*() {
                const subscription = yield* PubSub.subscribe(frames)

                const response = yield* request("doc", { query: document, variables: variables ?? {} })
                const { subscriptionId } = yield* Schema.decodeUnknown(SubscriptionReply)(response).pipe(
                    Effect.mapError((cause) => new RujiraIndexerError({ cause }))
                )

                yield* Effect.addFinalizer(() => request("unsubscribe", { subscriptionId }).pipe(Effect.ignore))

                return Stream.fromQueue(subscription).pipe(
                    Stream.filter((frame) => frame.topic === subscriptionId && frame.event === "subscription:data"),
                    Stream.mapEffect((frame) =>
                        Schema.decodeUnknown(SubscriptionData)(frame.payload).pipe(
                            Effect.flatMap((data) => Schema.decodeUnknown(schema)(data.result.data)),
                            Effect.mapError((cause) => new RujiraIndexerError({ cause }))
                        )
                    )
                )
            }))

        /** One-shot GraphQL query over HTTP, decoded at the boundary. */
        const query = <A, I>(schema: Schema.Schema<A, I, never>, document: string, variables?: Record<string, unknown>) =>
            Effect.gen(function*() {
                const response = yield* Effect.tryPromise({
                    try: async () => {
                        const res = await fetch(RUJIRA_API_URL, {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ query: document, variables: variables ?? {} })
                        })
                        if (!res.ok) throw new Error(`indexer responded ${res.status}`)
                        return (await res.json()) as { data?: unknown; errors?: ReadonlyArray<{ message: string }> }
                    },
                    catch: (cause) => new RujiraIndexerError({ cause })
                })

                if (response.errors?.length) {
                    return yield* Effect.fail(
                        new RujiraIndexerError({ cause: response.errors.map((e) => e.message).join("; ") })
                    )
                }

                return yield* Schema.decodeUnknown(schema)(response.data).pipe(
                    Effect.mapError((cause) => new RujiraIndexerError({ cause }))
                )
            })

        return {
            query,
            subscribe,

            /** All live FIN pairs, in the app's FinPair shape. */
            finPairs: query(FinPairsResult, FIN_PAIRS_QUERY).pipe(
                Effect.map(({ finV2 }) =>
                    finV2.edges.flatMap(({ node }): Array<FinPair> => {
                        const base = node.assetBase.variants.native?.denom
                        const quote = node.assetQuote.variants.native?.denom
                        return base && quote ? [{ address: node.address, denoms: [base, quote] }] : []
                    })
                )
            ),

            /**
             * Fires whenever the indexer observes a CALC order create/update
             * for the owner. Payload is treated as an opaque tick; consumers
             * refetch rather than patch.
             */
            calcOrdersUpdated: (owner: string) =>
                subscribe(Schema.Unknown, `subscription { calcOrdersUpdated(owner: "${owner}") { node { __typename } } }`)
        }
    })
}) {}
