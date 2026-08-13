export const DEFAULT_MAX_BLOCK_AGE_MS = 2 * 60 * 1000;

type Block = {
  header: {
    height: number;
    time: string;
  };
};

type FreshBlockOptions = {
  maxBlockAgeMs?: number;
  nowMs?: number;
};

export const requireFreshBlock = <T extends Block>(
  block: T,
  options: FreshBlockOptions = {}
): T => {
  const blockTimeMs = Date.parse(block.header.time);
  const maxBlockAgeMs =
    options.maxBlockAgeMs ?? DEFAULT_MAX_BLOCK_AGE_MS;
  const nowMs = options.nowMs ?? Date.now();

  if (!Number.isFinite(blockTimeMs)) {
    throw new Error(
      `RPC returned an invalid latest block time: height=${block.header.height} time=${block.header.time}`
    );
  }

  const blockAgeMs = nowMs - blockTimeMs;

  if (blockAgeMs > maxBlockAgeMs) {
    throw new Error(
      `RPC latest block is stale: height=${block.header.height} time=${block.header.time} ageMs=${blockAgeMs} maxAgeMs=${maxBlockAgeMs}`
    );
  }

  return block;
};

export const getFreshBlock = async <T extends Block>(
  getBlock: () => Promise<T>,
  options: FreshBlockOptions = {}
): Promise<T> => requireFreshBlock(await getBlock(), options);
