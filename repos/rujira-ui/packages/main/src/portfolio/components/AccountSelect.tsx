import clsx from "clsx";
import { AnimatePresence, motion } from "motion/react";
import { FC, MouseEventHandler, PropsWithChildren, useState } from "react";
import toast from "react-hot-toast";
import { useLocation, useNavigate } from "react-router-dom";
import { Address, THOR, isThor } from "rujira.js";
import {
  Icons,
  NetworkIcon,
  Provider,
  ProviderIcon,
  useClickOutside,
  useLocale,
} from "rujira.ui";
import combined from "rujira.ui/assets/images/combined.gif";
import { useAccounts } from "../../services/accounts";

const groupThorAccountsByAddress = (
  accounts: { address: Address; provider: Provider.Key }[]
): { address: Address; providers: Provider.Key[] }[] => {
  const byAddress = new Map<
    string,
    { address: Address; providers: Provider.Key[] }
  >();
  accounts
    .filter((x) => isThor(x.address))
    .forEach(({ address, provider }) => {
      const current = byAddress.get(address.address) ?? {
        address,
        providers: [],
      };
      if (!current.providers.includes(provider)) {
        current.providers.push(provider);
      }

      byAddress.set(address.address, current);
    });
  return Array.from(byAddress.values());
};

export const AccountSelect: FC = () => {
  const [showSwitch, setShowSwitch] = useState(false);
  const { accounts, selected, select } = useAccounts();
  const ref = useClickOutside(() => setShowSwitch(false));
  const loc = useLocation();
  const history = useNavigate();
  const { toRoot } = useLocale();
  const portfolioPath = toRoot("portfolio");

  const thorAccounts = groupThorAccountsByAddress(accounts ?? []);

  return (
    <div className="flex wrap ai-c">
      <a
        id="portfolio__switcher"
        className="portfolio__switcher"
        onClick={() => setShowSwitch(true)}>
        {selected ? (
          <>
            <NetworkIcon network={THOR} className="block w-2 h-2 mr-1" />

            {
              /* width > BreakPoints.large
              ? data?.address
              :  */ selected.address.address.substring(0, 12) +
                "..." +
                selected.address.address.slice(-12)
            }
          </>
        ) : (
          <>
            <div
              className="block w-2 h-2 mr-1 br-2 bg-primary2 color-white"
              style={{ padding: 2 }}>
              {/* <Combine className="block" /> */}
              <img
                src={combined}
                alt="combined"
                className="portfolio__switcher-all"
              />
            </div>
            Combined View (read only)
          </>
        )}
        <Icons.AngleDown className="w-2 h-2 ml-1" />

        <AnimatePresence>
          {showSwitch && (
            <motion.nav
              ref={ref}
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}>
              <>
                {thorAccounts.map(({ address, providers }) => (
                  <AccountItem
                    key={address.address}
                    account={{ address, providers }}
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowSwitch(false);
                      loc.pathname !== portfolioPath && history(portfolioPath);
                      select({ address, provider: providers[0] });
                    }}
                  />
                ))}
              </>
            </motion.nav>
          )}
        </AnimatePresence>
      </a>
      <div
        className={clsx({
          "div bg-black w-4 h-4 flex ai-c jc-c ml-1 color-grey br-3 transition":
            true,
          "bg-hover-darkGrey hover-white": selected,
        })}>
        <Icons.Copy
          className={clsx({ "w-2": true, "opacity-10": !selected })}
          onClick={() => {
            if (!selected) return;
            toast.success("Address copied to clipboard");
            navigator.clipboard.writeText(selected.address.address);
          }}
        />
      </div>
    </div>
  );
};

export const AccountItem: FC<
  PropsWithChildren<{
    account: { address: Address; providers: Provider.Key[] };
    onClick: MouseEventHandler<HTMLButtonElement>;
  }>
> = ({ account, onClick, children }) => {
  return (
    <button onClick={onClick}>
      <div className="flex ai-c w-full">
        <div className="flex">
          <NetworkIcon network={THOR} className="block w-3.5 h-3.5 mr-1" />
        </div>
        <div className="mr-2 flex dir-c ai-s">
          <span className="fs-12 color-white">
            {account.address.address.substring(0, 12) +
              "..." +
              account.address.address.slice(-12)}
          </span>
          <div className="fs-10 mt-0.5 flex ai-c">
            {account.providers.map((p, index) => (
              <div className={"flex dir-r"}>
                <ProviderIcon
                  key={p}
                  provider={p}
                  className="block w-1.5 h-a mr-0.5"
                  selected={true}
                />
                <span className={"mr-1"}>{account.providers[index]}</span>
              </div>
            ))}
          </div>
        </div>
        {children}
      </div>
    </button>
  );
};
