import type { AutoClaimer } from "../trade/hooks/useAutoClaimer";

export type ActiveInstance = AutoClaimer["activeInstance"];

export interface StakingParameters {
  minAmountToClaim: string;
  swapTargetSymbol?: string;
  slippageBps?: string;
  stakedTokenSymbol: string;
}

export interface AutoClaimerStakingContext {
  stakedTokenSymbol: string;
  poolAddress: string;
  rewardSymbol: string;
  swapTargetSymbol?: string;
  minAmountToClaim: string;
  slippageBps: string;
  swapContractAddress?: string;
}

export function parseInstanceParameters(
  activeInstance: ActiveInstance,
  swapTargetAddressMap?: Map<string, string>
): StakingParameters | null {
  if (!activeInstance) return null;
  try {
    const onchainParams =
      typeof activeInstance.onchainParameters === "string"
        ? JSON.parse(activeInstance.onchainParameters)
        : activeInstance.onchainParameters || {};
    const offchainParams =
      typeof activeInstance.offchainParameters === "string"
        ? JSON.parse(activeInstance.offchainParameters)
        : activeInstance.offchainParameters || {};
    const hasSwap =
      onchainParams.swapTemplateId === "fin" &&
      !!onchainParams.swapContractAddress;
    let swapTargetSymbol: string | undefined;
    if (hasSwap && swapTargetAddressMap && onchainParams.swapContractAddress) {
      for (const [symbol, address] of swapTargetAddressMap.entries()) {
        if (address === onchainParams.swapContractAddress) {
          swapTargetSymbol = symbol;
          break;
        }
      }
    }
    const rawSlippage = hasSwap ? offchainParams.slippage : undefined;
    const slippageBps =
      rawSlippage !== undefined && rawSlippage !== ""
        ? String(Math.round(Number(rawSlippage) * 10000))
        : undefined;

    return {
      minAmountToClaim: offchainParams.minAmountToClaim ?? "",
      swapTargetSymbol,
      slippageBps,
      stakedTokenSymbol: offchainParams.stakedTokenSymbol ?? "",
    };
  } catch {
    return null;
  }
}

export function hasParametersChanged(
  current: AutoClaimerStakingContext,
  instanceParams: StakingParameters | null
): boolean {
  if (!instanceParams) return false;
  if (current.minAmountToClaim !== instanceParams.minAmountToClaim) return true;
  const currentHasSwap = !!current.swapTargetSymbol;
  const instanceHasSwap = !!instanceParams.swapTargetSymbol;
  if (currentHasSwap !== instanceHasSwap) return true;
  if (
    currentHasSwap &&
    instanceHasSwap &&
    current.swapTargetSymbol !== instanceParams.swapTargetSymbol
  )
    return true;
  if (currentHasSwap && instanceHasSwap) {
    if (current.slippageBps !== instanceParams.slippageBps) return true;
  }
  return false;
}
