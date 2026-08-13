import { Asset, assetList } from "@template/domain/assets"
import { Effect } from "effect"

export const useAssets = () => {
    const assets = Effect.runSync(assetList)
    
    return {
        assets, 
        assetsByDenom: assets.reduce<Partial<Record<string, Asset>>>((acc, asset) => ({
            ...acc,
            [asset.denom]: asset,
        }), {})
    }
}
