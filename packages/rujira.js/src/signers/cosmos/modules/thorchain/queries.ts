import { InboundAddress } from "../../../../accounts";
import { createProtobufRpcClient, QueryClient } from "../../queryclient";
import { QueryClientImpl } from "../../types/thorchain/types/query";
import {
  QueryEip712TypedDataRequest,
  QueryEip712TypedDataResponse,
} from "../../types/thorchain/types/query_eip712";
import { QueryInboundAddressesRequest } from "../../types/thorchain/types/query_inbound_address";
import { setupAuthExtension } from "../auth/queries";
import { THOR } from "../../../../network";

export interface QuoteSwapRequest {
  fromAsset: string;
  toAsset: string;
  amount: bigint;
  streamingInterval?: bigint;
  streamingQuantity?: bigint;
  destination: string;
  toleranceBps?: bigint;
  liquidityToleranceBps?: bigint;
  refundAddress?: string;
  affiliates?: { id: string; bps: bigint }[];
  height?: bigint;
}

export interface QuoteSwap {
  inboundAddress: string;
  inboundConfirmationBlocks: bigint;
  inboundConfirmationSeconds: bigint;
  outboundDelayBlocks: bigint;
  outboundDelaySeconds: bigint;
  fees?: QuoteFees;
  router?: string;
  expiry: Date;
  warning: string;
  notes: string;
  dustThreshold: bigint;
  recommendedMinAmountIn: bigint;
  recommendedGasRate: bigint;
  gasRateUnits: string;
  memo: string;
  expectedAmountOut: bigint;
  maxStreamingQuantity: bigint;
  streamingSwapBlocks: bigint;
  streamingSwapSeconds: bigint;
  totalSwapSeconds: bigint;
}

export interface QuoteFees {
  asset: string;
  affiliate: bigint;
  outbound: bigint;
  liquidity: bigint;
  total: bigint;
  slippageBps: bigint;
  totalBps: bigint;
}

export interface ThorchainExtension {
  readonly thorchain: {
    getEip712TypedData: (
      signBytes: Uint8Array
    ) => Promise<QueryEip712TypedDataResponse>;
    getInboundAddress: (chain: string) => Promise<InboundAddress>;
    getSwapQuote: (request: {
      fromAsset: string;
      toAsset: string;
      amount: bigint;
      streamingInterval?: bigint;
      streamingQuantity?: bigint;
      destination: string;
      toleranceBps?: bigint;
      liquidityToleranceBps?: bigint;
      refundAddress?: string;
      affiliates?: { id: string; bps: bigint }[];
      height?: bigint;
    }) => Promise<QuoteSwap>;
  };
}

export function setupThorchainExtension(base: QueryClient): ThorchainExtension {
  const rpc = createProtobufRpcClient(base);
  const queryService = new QueryClientImpl(rpc);

  return {
    thorchain: {
      getEip712TypedData: async (signBytes: Uint8Array) => {
        const request: QueryEip712TypedDataRequest = {
          signBytes,
        };
        return queryService.Eip712TypedData(request);
      },
      getInboundAddress: async function (
        chain: string
      ): Promise<InboundAddress> {
        if (chain === THOR) {
          const res =
            await setupAuthExtension(base).auth.moduleAccountByName(
              "thorchain"
            );

          if (!res?.baseAccount)
            throw new Error(`No thorchain module account found`);
          return {
            address: res.baseAccount.address,
            dustThreshold: 0n,
            gasRate: 0n,
          };
        }

        const request: QueryInboundAddressesRequest = { height: "" };
        const addresses = await queryService.InboundAddresses(request);
        const address = addresses.inboundAddresses.find(
          (x) => x.chain === chain
        );
        if (!address) throw new Error(`No Inbound Address found for ${chain}`);
        return {
          address: address.address,
          dustThreshold: BigInt(address.dustThreshold),
          router: address.router || undefined,
          gasRate: BigInt(address.gasRate),
        };
      },
      getSwapQuote: async function (
        request: QuoteSwapRequest
      ): Promise<QuoteSwap> {
        const res = await queryService.QuoteSwap({
          fromAsset: request.fromAsset,
          toAsset: request.toAsset,
          amount: request.amount.toString(),
          streamingInterval: request.streamingInterval?.toString() || "",
          streamingQuantity: request.streamingQuantity?.toString() || "",
          destination: request.destination,
          toleranceBps: request.toleranceBps?.toString() || "",
          liquidityToleranceBps:
            request.liquidityToleranceBps?.toString() || "",
          refundAddress: request.refundAddress || "",
          affiliate: request.affiliates?.map((a) => a.id).join("/") || "",
          affiliateBps:
            request.affiliates?.map((x) => x.bps.toString()).join("/") || "",
          height: request.height?.toString() || "",
        });

        return {
          inboundAddress: res.inboundAddress,
          inboundConfirmationBlocks: BigInt(res.inboundConfirmationBlocks),
          inboundConfirmationSeconds: BigInt(res.inboundConfirmationSeconds),
          outboundDelayBlocks: BigInt(res.outboundDelayBlocks),
          outboundDelaySeconds: BigInt(res.outboundDelaySeconds),
          fees: res.fees
            ? {
                asset: res.fees.asset,
                affiliate: BigInt(res.fees.affiliate),
                outbound: BigInt(res.fees.outbound),
                liquidity: BigInt(res.fees.liquidity),
                total: BigInt(res.fees.total),
                slippageBps: BigInt(res.fees.slippageBps),
                totalBps: BigInt(res.fees.totalBps),
              }
            : undefined,
          router: res.router ? res.router : undefined,
          expiry: new Date(res.expiry * 1000),
          warning: res.warning,
          notes: res.notes,
          dustThreshold: BigInt(res.dustThreshold),
          recommendedMinAmountIn: BigInt(res.recommendedMinAmountIn),
          recommendedGasRate: BigInt(res.recommendedGasRate),
          gasRateUnits: res.gasRateUnits,
          memo: res.memo,
          expectedAmountOut: BigInt(res.expectedAmountOut),
          maxStreamingQuantity: BigInt(res.maxStreamingQuantity),
          streamingSwapBlocks: BigInt(res.streamingSwapBlocks),
          streamingSwapSeconds: BigInt(res.streamingSwapSeconds),
          totalSwapSeconds: BigInt(res.totalSwapSeconds),
        };
      },
    },
  };
}
