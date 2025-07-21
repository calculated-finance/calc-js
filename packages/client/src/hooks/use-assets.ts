import { assetList } from "@template/domain/src/assets"
import { Effect } from "effect"

export const useAssets = () => Effect.runSync(assetList)
