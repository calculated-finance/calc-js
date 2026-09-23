import { Chain, VaultBase, VaultCreationStep, Vultisig } from "@vultisig/sdk";
import {
  createContext,
  FC,
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
//import toast from "react-hot-toast";
import clsx from "clsx";
import {
  Button,
  Icons,
  Input,
  Loader,
  useGlobalModalContext,
  useTranslation,
  vultisig,
  WalletIcons,
} from "rujira.ui";
import { AddressItem } from "../portfolio/components/WalletOption";

import vaultGif from "rujira.ui/assets/images/vault.gif";
import vault from "rujira.ui/assets/images/vault.png";

import toast from "react-hot-toast";
import lockedGif from "rujira.ui/assets/images/locked.gif";
import shieldCheckGif from "rujira.ui/assets/images/shield-check.gif";
import shieldErrorGif from "rujira.ui/assets/images/shield-error.gif";
import unlockedGif from "rujira.ui/assets/images/unlocked.gif";
import { useAccounts } from "../services/accounts";

declare global {
  interface Window {
    vultisigSdk?: Vultisig;
  }
}

interface VultisigContext {
  sdk: Vultisig;
  vaults: VaultBase[] | undefined;
  setVaults: (vaults: VaultBase[]) => void;
  refreshVaults: () => Promise<void>;
}

const ConnectContext = createContext<VultisigContext>(
  undefined as unknown as VultisigContext
);

const PasswordPrompt: FC<{ passwordRef: React.MutableRefObject<string> }> = ({
  passwordRef,
}) => {
  const { t } = useTranslation("common");
  const [password, setPassword] = useState("");

  useEffect(() => {
    passwordRef.current = password;
  }, [password, passwordRef]);

  return (
    <div>
      <Input
        type="password"
        value={password}
        onChange={(e) => {
          setPassword(e.currentTarget.value);
        }}
        label={t("vultisigPasswordLabel")}
      />
    </div>
  );
};

export const VultisigProvider: FC<PropsWithChildren> = ({ children }) => {
  const { t } = useTranslation("common");
  const [vaults, setVaults] = useState<VaultBase[]>();
  const [sdk, setSdk] = useState<Vultisig>();
  const { showModal, hideModal } = useGlobalModalContext();
  const { connect } = useAccounts();

  const refreshVaults = async () => {
    sdk?.listVaults().then(setVaults);
  };
  const passwordRef = useRef("");
  const onPasswordRequired = useCallback(
    (_id: string, name: string) => {
      return new Promise<string>((resolve) => {
        showModal({
          title: t("vultisigPasswordRequiredTitle", { name }),
          children: <PasswordPrompt passwordRef={passwordRef} />,
          confirm: () => {
            const nextPassword = passwordRef.current;
            passwordRef.current = "";
            hideModal();
            return resolve(nextPassword);
          },
        });
      });
    },
    [showModal, hideModal, t]
  );

  useEffect(() => {
    const sdk = new Vultisig({
      onPasswordRequired,
      defaultChains: [
        Chain.Bitcoin,
        Chain.Ethereum,
        Chain.THORChain,
        Chain.Ripple,
        Chain.BitcoinCash,
        Chain.Dogecoin,
        Chain.Litecoin,
        Chain.Solana,
        Chain.Ton,
        Chain.Tron,
      ],
    });

    window.vultisigSdk = sdk;
    setSdk(sdk);
    connect("Vultisig");
  }, []);

  useEffect(() => {
    refreshVaults();
  }, [sdk]);

  if (!sdk) return;

  const value: VultisigContext = {
    sdk,
    vaults,
    setVaults,
    refreshVaults,
  };

  return (
    <ConnectContext.Provider value={value}>{children}</ConnectContext.Provider>
  );
};

export const useConnect = (): VultisigContext => {
  const { t } = useTranslation("common");
  const context = useContext(ConnectContext);
  if (!context) {
    throw new Error(t("vultisigConnectProviderError"));
  }
  return context;
};

export const VultisigManager: FC = () => {
  const { t } = useTranslation("common");
  const { t: tPortfolio } = useTranslation("portfolio");
  const ctx = useConnect();
  const { vaults, refreshVaults } = ctx;
  const [hover, setHover] = useState(false);
  const { showModal, hideModal } = useGlobalModalContext();
  const { connect } = useAccounts();

  const openCreateVault = () => {
    showModal({
      title: t("vultisigCreateVaultTitle"),
      children: (
        <VaultCreate
          ctx={ctx}
          onSuccess={() => {
            refreshVaults();
            hideModal();
            connect("Vultisig");
          }}
        />
      ),
    });
  };

  const networkCount = Object.values(vultisig.chains()).length;
  const addressCount = networkCount;

  if (!vaults?.length)
    return (
      <Container>
        <div className="flex wrap ai-c jc-sb w-full gap-1">
          <div className="portfolio__wallet-logo portfolio__wallet-logo--small">
            <WalletIcons.VultisigText />
          </div>
          <Button
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
            onClick={openCreateVault}
            className="button--sm button--blue"
            label={t("vultisigCreateVaultButton")}>
            <img
              src={hover ? vaultGif : vault}
              alt={t("vultisigVaultLinkAlt")}
              className="filter-black"
            />
          </Button>
        </div>
        <div
          className="tag tag--borderless tag--primary no-shrink mt-1"
          data-tooltip-content={tPortfolio("embeddedTooltip")}
          data-tooltip-id="global-tip">
          {tPortfolio("embeddedLabel")}
        </div>
      </Container>
    );

  return (
    <Container>
      <div className="flex wrap ai-c jc-sb w-full gap-1">
        <div className="portfolio__wallet-logo portfolio__wallet-logo--small">
          <WalletIcons.VultisigText />
        </div>
        <Button
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
          onClick={openCreateVault}
          className="button--xs button--blue"
          label={t("vultisigCreateVaultButton")}>
          <img
            src={hover ? vaultGif : vault}
            alt={t("vultisigVaultLinkAlt")}
            className="filter-black"
          />
        </Button>
      </div>
      <div
        className="tag tag--borderless tag--primary no-shrink mt-1"
        data-tooltip-content={tPortfolio("embeddedTooltip")}
        data-tooltip-id="global-tip">
        {tPortfolio("embeddedLabel")}
      </div>
      <div className="block w-full mt-1.5">
        <p className="fs-12 fw-500 color-grey hover-white mb-1">
          {t("vultisigConnected")}{" "}
          <span className="color-white">
            {vaults ? addressCount * vaults.length : 0}
          </span>{" "}
          {t("vultisigAddressesOn")}{" "}
          <span className="color-white">{networkCount}</span>{" "}
          {t("vultisigNetworks")}
        </p>

        <div
          className="flex dir-c gap-1"
          style={{
            marginLeft: "-0.5rem",
            marginRight: "-0.5rem",
            marginBottom: "-0.5rem",
          }}>
          {vaults?.map((v) => <Vault vault={v} key={v.id} />)}
        </div>
      </div>
    </Container>
  );
};

const Container: FC<PropsWithChildren> = ({ children }) => (
  <div className="col-12 col-md-6 col-lg-12">
    <div className="card h-full flex p-2.5 dir-c ai-s portfolio__wallet">
      {children}
    </div>
  </div>
);

const Vault: FC<{ vault: VaultBase }> = ({ vault }) => {
  const { t } = useTranslation("common");
  const [addresses, setAddresses] = useState<Record<string, string>>({});
  const [showFull, setShowFull] = useState(vault.isUnlocked());
  const [expand, setExpand] = useState(vault.isUnlocked());

  useEffect(() => {
    vault.addresses().then(setAddresses);
  }, []);

  return (
    <div className="connect__vault">
      <button
        className="transparent flex ai-c w-full color-grey hover-white pointer"
        onClick={() => setShowFull(!showFull)}>
        <h4 className="fs-13 fw-600 color-white">{vault.name}</h4>
        <div className="flex ai-c gap-0.5 ml-1">
          {/* <div
            className={clsx({
              icon: true,
              "icon--red": !vault.isBackedUp,
              "icon--teal": vault.isBackedUp,
            })}
            data-tooltip-content={
              vault.isBackedUp
                ? t("vultisigBackedUp")
                : t("vultisigNotBackedUp")
            }
            data-tooltip-id="global-tip">
            <img
              src={downloadGif}
              alt={
                vault.isBackedUp
                  ? t("vultisigBackedUp")
                  : t("vultisigNotBackedUp")
              }
            />
          </div> */}
          <div
            className={clsx({
              icon: true,
              "icon--orange": !vault.isEncrypted,
              "icon--teal": vault.isEncrypted,
            })}
            data-tooltip-content={
              vault.isEncrypted
                ? t("vultisigEncrypted")
                : t("vultisigNotEncrypted")
            }
            data-tooltip-id="global-tip">
            <img
              src={vault.isEncrypted ? shieldCheckGif : shieldErrorGif}
              alt={
                vault.isEncrypted
                  ? t("vultisigEncrypted")
                  : t("vultisigNotEncrypted")
              }
            />
          </div>
          <div
            className={clsx({
              icon: true,
              "icon--orange": vault.isUnlocked(),
              "icon--teal": !vault.isUnlocked(),
            })}
            data-tooltip-content={
              vault.isUnlocked() ? t("vultisigUnlocked") : t("vultisigLocked")
            }
            data-tooltip-id="global-tip">
            <img
              src={!vault.isUnlocked() ? lockedGif : unlockedGif}
              alt={
                !vault.isUnlocked()
                  ? t("vultisigLocked")
                  : t("vultisigUnlocked")
              }
            />
          </div>
        </div>
        {!showFull ? (
          <Icons.AngleDown className="w-2 h-2 ml-a" />
        ) : (
          <Icons.AngleUp className="w-2 h-2 ml-a" />
        )}
      </button>
      {showFull && (
        <div className="flex dir-c gap-1 w-full mt-1">
          <small className="fs-12 color-grey flex jc-sb w-full">
            {t("vultisigCreated")}{" "}
            <span className="color-white">
              {new Date(vault.createdAt).toLocaleString()}
            </span>
          </small>
          <small className="fs-12 color-grey flex jc-sb w-full">
            {t("vultisigSigners")}{" "}
            <span className="color-white">
              {t("vultisigThreshold", {
                threshold: vault.threshold,
                total: vault.signers.length,
              })}
            </span>
          </small>
          <div className="table table--no-hover fs-12">
            {vault.signers.map((x) => (
              <div key={x.id} className="flex jc-sb ml-1">
                <span>
                  {x.id.startsWith("sdk")
                    ? t("vultisigSignerLocal")
                    : x.id.startsWith("Server")
                      ? t("vultisigSignerVultiserver")
                      : t("vultisigSignerUnknown")}
                </span>
                {x.id.startsWith("sdk") ? (
                  <Button
                    className="button--xs"
                    label={t("vultisigExport")}
                    onClick={async () => {
                      vault
                        .export()
                        .then(({ data, filename }) => {
                          const blob = new Blob([data], {
                            type: "text/plain",
                          });
                          const url = URL.createObjectURL(blob);
                          const a = document.createElement("a");
                          a.href = url;
                          a.download = filename;
                          a.click();
                          URL.revokeObjectURL(url);
                        })
                        .catch(() => toast.error(t("vultisigInvalidPassword")));
                    }}
                  />
                ) : null}
              </div>
            ))}
          </div>
          <button
            className="transparent fs-12 fw-500 color-grey hover-white mt-2 mb-0 flex ai-c jc-sb w-full pointer"
            onClick={() => setExpand(!expand)}>
            <span>
              {expand ? t("vultisigHide") : t("vultisigShow")}{" "}
              <span className="color-white">
                {Object.values(addresses)?.length || 0}
              </span>{" "}
              {t("vultisigAddresses")}
            </span>
            {!expand ? (
              <Icons.AngleDown className="w-2 h-2" />
            ) : (
              <Icons.AngleUp className="w-2 h-2" />
            )}
          </button>
          {expand && Object.values(addresses)?.length > 0 && (
            <div className="portfolio__wallet-addresses">
              {Object.entries(addresses)?.map(([chain, address]) => {
                const network = vultisig.chains()[chain];
                return (
                  <AddressItem
                    key={`${chain}:${address}`}
                    address={address}
                    networks={network ? [network] : undefined}
                    duplicate={false}
                  />
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const VaultCreate = ({
  onSuccess,
  ctx,
}: {
  onSuccess: () => void;
  ctx?: VultisigContext;
}) => {
  const { t } = useTranslation("common");
  const [name, setName] = useState(() => t("vultisigFastVaultDefaultName"));
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [progress, onProgress] = useState<VaultCreationStep | "saved">();
  const [id, setId] = useState<string>();
  const [code, setCode] = useState<string>("");
  if (!ctx?.sdk) return null;

  const { sdk } = ctx;
  const create = () => {
    sdk.createFastVault({ name, email, password, onProgress }).then(setId);
  };

  const confirm = () => {
    id && code && sdk.verifyVault(id, code).then(onSuccess);
  };

  return (
    <>
      <p className="fs-14 lh-18">
        {t("vultisigFastVaultDescription1")}{" "}
        <a
          target="_blank"
          rel="nofollow"
          className="color-teal"
          href="https://docs.vultisig.com/vultisig-infrastructure/what-is-vultisigner">
          {t("vultisigVultiserver")}
        </a>
        {t("vultisigFastVaultDescription2")}
        <br />
        <br />
        {t("vultisigFastVaultDescription3")}
      </p>
      <div className="flex dir-c gap-1 mt-2">
        {id ? (
          <>
            <Input
              label={t("vultisigVerifyCodeLabel", { email })}
              type="text"
              value={code}
              onChange={(x) => setCode(x.target.value)}
            />
            <Button label={t("vultisigVerify")} onClick={confirm} />
          </>
        ) : progress &&
          typeof progress !== "string" &&
          progress.step !== "complete" ? (
          <>
            <div className="flex ai-c mb-2">
              <Loader className="w-4 h-4 mr-2" />
              <small>{progress.message}...</small>
            </div>
            <Button label={t("vultisigCreateVaultButton")} disabled />
          </>
        ) : (
          <>
            <Input
              label={t("vultisigNameLabel")}
              value={name}
              onChange={(x) => setName(x.target.value)}
            />
            <Input
              label={t("vultisigEmailLabel")}
              value={email}
              type="email"
              onChange={(x) => setEmail(x.target.value)}
            />
            <Input
              label={t("vultisigPasswordLabel")}
              type="password"
              value={password}
              onChange={(x) => setPassword(x.target.value)}
            />
            <Button label={t("vultisigCreateVaultButton")} onClick={create} />
          </>
        )}
      </div>
    </>
  );
};
