import { CosmWasmClient } from "@cosmjs/cosmwasm-stargate"
import { Effect } from "effect"
import { type ChainId, CHAINS_BY_ID } from "./chains.js"

export class CalcService extends Effect.Service<CalcService>()("CalcService", {
    succeed: {
        strategies: (
            chainId: ChainId,
            owner: string | undefined,
            status: "active" | "paused" | "archived" | undefined
        ) => Effect.gen(function*() {
            const chain = CHAINS_BY_ID[chainId]

            if (chain.type !== "cosmos") {
                throw new Error(`Chain type ${chain.displayName} is not supported for strategies`)
            }

            const client = yield* Effect.tryPromise(() => CosmWasmClient.connect(chain.rpcUrls[0]))

            const strategies = yield* Effect.tryPromise(() =>
                // TODO: use config to get the contract address
                client.queryContractSmart("sthor1xg6qsvyktr0zyyck3d67mgae0zun4lhwwn3v9pqkl5pk8mvkxsnscenkc0", {
                    strategies: {
                        owner,
                        status
                    }
                })
            )

            return strategies
        })
    }
}) {}
