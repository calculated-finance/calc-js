import { signers } from "rujira.js";




const cometClient = signers.cosmos.Comet38Client.connect("https://rpc.rujira.network");
export const QUERY_CLIENT = signers.cosmos.QueryClient.withExtensions(
  cometClient,
  signers.cosmos.setupAuthExtension,
  signers.cosmos.setupTxExtension,
  signers.cosmos.setupThorchainExtension
);
