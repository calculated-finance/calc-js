import { Asset, assetList } from "@template/domain/assets"
import { Effect } from "effect"

const assets = Effect.runSync(assetList)

export const useAssets = () => {
    
    return {
        assets, 
        assetsByDenom: assets.reduce<Partial<Record<string, Asset>>>((acc, asset) => ({
            ...acc,
            [asset.denom]: asset,
        }), {})
    }
}
