export type FoundTx = {
  hash: string;
  height: number;
  index: number;
  events: { type: string; attributes: Record<string, string> }[];
};
