import { IconDenom } from "rujira.ui";
import { Code } from "../components/Code";
import { GitLabIcon } from "../components/GitLabIcon";

const icons = [
  "aave",
  "acre",
  "akt",
  "amber",
  "ampkuji",
  "ampluna",
  "ampmnta",
  "ampwhale",
  "andr",
  "aqla",
  "aqua",
  "arb",
  "arch",
  "astro",
  "atom",
  "auto",
  "avax",
  "axl",
  "axleth",
  "bad",
  "bch",
  "bfit",
  "bnb",
  "btc",
  "btcb",
  "cbbtc",
  "cheq",
  "cmdx",
  "cmst",
  "cnto",
  "core",
  "crbrus",
  "cre",
  "cro",
  "cub",
  "dai",
  "demo",
  "doge",
  "dot",
  "dpi",
  "dvpn",
  "dydx",
  "dym",
  "eth",
  "evmos",
  "flip",
  "flix",
  "fox",
  "frnz",
  "ftm",
  "fury",
  "furylegacy",
  "fuzn",
  "glmr",
  "glto",
  "gpaxg",
  "grav",
  "graviton",
  "gusd",
  "inj",
  "jkl",
  "juno",
  "kart",
  "kuji",
  "kune",
  "link",
  "local",
  "loop",
  "ltc",
  "luna",
  "lunc",
  "lusd",
  "lvn",
  "mars",
  "matic",
  "mnta",
  "mntl",
  "nami",
  "nausd",
  "nbtc",
  "neok",
  "newt",
  "nstk",
  "ntrn",
  "odin",
  "osmo",
  "paxg",
  "pepe",
  "plnk",
  "plq",
  "qcatom",
  "qcfuzn",
  "qckuji",
  "qcmnta",
  "rac",
  "raclegacy",
  "ratom",
  "raze",
  "regen",
  "rfuzn",
  "rio",
  "rkuji",
  "roar",
  "ruji",
  "rune",
  "sayve",
  "scrt",
  "shd",
  "shdlegacy",
  "silk",
  "snx",
  "sol",
  "somm",
  "stars",
  "statom",
  "stinj",
  "stluna",
  "stosmo",
  "strd",
  "swth",
  "tao",
  "tgt",
  "tia",
  "ton",
  "tori",
  "thor",
  "trx",
  "twt",
  "umee",
  "uni",
  "usdc",
  "usdp",
  "usdt",
  "usk",
  "ustc",
  "vthor",
  "wavax",
  "wbnb",
  "wbtc",
  "weth",
  "wftm",
  "wglmr",
  "whale",
  "whlocal",
  "whsol",
  "wink",
  "wmatic",
  "wsteth",
  "wtao",
  "xastro",
  "xdefi",
  "xrune",
  "yfi",
  "yfuzn",
  "yieldeth",
  "yum",
];

export const DenomIcons = () => (
  <>
    <h1 className="h1">Denom Icons</h1>
    <Code language="tsx" code={`import { IconDenom } from "rujira.ui";`} />
    <p className="flex ai-c p-1 br-1 bg-primary5 fs-12 fw-500 mt-2">
      <GitLabIcon className="w-a h-2 block" />{" "}
      <a
        href="https://gitlab.com/thorchain/rujira.ui/-/blob/main/packages/rujira.ui/src/components/icons/IconDenom.tsx?ref_type=heads"
        className="color-grey hover-purple ml-1 block no-underline"
        target="_blank">
        https://gitlab.com/thorchain/rujira.ui/-/blob/main/packages/rujira.ui/src/components/icons/IconDenom.tsx?ref_type=heads
      </a>
    </p>
    <table className="table mt-4 table--big table--va-t table--lined">
      <thead className="border">
        <tr>
          <th>Attribute</th>
          <th>Description</th>
          <th>Default</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td className="color-primary1">denom</td>
          <td>string</td>
          <td>-</td>
        </tr>
        <tr>
          <td className="color-primary1">className</td>
          <td>(optional) string</td>
          <td>
            <code>null</code>
          </td>
        </tr>
      </tbody>
    </table>
    <div className="flex jc-c wrap mt-6 dark-bg br-2">
      {icons.map((i) => (
        <div className="flex dir-c p-2.5 ai-c" key={i}>
          <IconDenom denom={i} className="block w-6 h-6" />
          <p className="mono fs-10 mt-1 color-white">{i}</p>
        </div>
      ))}
    </div>

    <hr className="hr mt-5 mb-4" />
  </>
);
