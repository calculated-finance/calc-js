import { Effect, Schema, Stream, SubscriptionRef } from "effect"
import { Connection } from "./model.js"
import { StorageService } from "../storage.js"

const decodeConnection = Schema.decodeUnknownEither(Connection)

/**
 * Shared connection-state scaffolding for wallet integrations: a
 * SubscriptionRef seeded from persisted storage (malformed or stale payloads
 * fall back to disconnected instead of poisoning startup) and a forked stream
 * that keeps storage in sync with every state change.
 */
export const makeConnectionStore = (storageKey: string) =>
    Effect.gen(function*() {
        const storage = yield* StorageService

        const raw = yield* storage.get(storageKey)

        let stored: Connection = { status: "disconnected" }
        if (raw) {
            try {
                const decoded = decodeConnection(JSON.parse(raw))
                if (decoded._tag === "Right") stored = decoded.right
            } catch {
                // Malformed JSON: treat as no stored connection.
            }
        }

        const ref = yield* SubscriptionRef.make<Connection>(stored)

        // forkScoped: a plain fork would parent to the layer-build fiber and be
        // interrupted the moment construction finishes, silently killing
        // persistence. Scoped to the layer's lifetime instead.
        yield* Effect.forkScoped(
            Stream.runForEach(ref.changes, (connection) =>
                connection.status === "connected"
                    ? storage.set(storageKey, JSON.stringify(Schema.encodeSync(Connection)(connection)))
                    : storage.remove(storageKey))
        )

        return { ref, stored }
    })
