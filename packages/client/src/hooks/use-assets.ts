import { Asset, assetList } from "@template/domain/src/assets"
import { Effect } from "effect"

export const useAssets = () => {
    const assets = Effect.runSync(assetList)
    
    return {
        assets, 
        assetsByDenom: assets.reduce((acc, asset) => ({
            ...acc,
            [asset.denom]: asset,
        }), {} as Record<string, Asset>)
    }
}
