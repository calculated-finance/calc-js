import { Cosmiframe } from "@dao-dao/cosmiframe";
import { CosmosAdapter } from "./cosmos";

const cosmiframe = new Cosmiframe([
  "https://daodao.zone",
  "https://dao.daodao.zone",
  "https://testnet.daodao.zone",
]);

export default new CosmosAdapter(() => cosmiframe.getKeplrClient(), {
  skipSuggest: true,
});
