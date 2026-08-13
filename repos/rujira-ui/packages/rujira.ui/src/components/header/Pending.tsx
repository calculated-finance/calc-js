import { AnimatePresence, motion } from "motion/react";
import { FC, useEffect, useState } from "react";
import clsx from "clsx";
import { DepositProvider, networkTxLink, PendingDeposit } from "rujira.js";
import alert from "../../assets/images/alert.gif";
import alertStatic from "../../assets/images/alert.png";
import { nFormatter } from "../../helpers";
import { Xmark } from "../icons/Icons";
import { NetworkIcon } from "../icons/NetworkIcon";

export interface PendingDepositProps {
  /** deprecated - use depositProvider to prevent unncessary re-renders */
  deposits: PendingDeposit[];
  dismissDeposit: (hash: string) => void;
  depositProvider?: DepositProvider;
  clearAll?: () => void;
}

export const PendingDeposits = ({
  deposits,
  dismissDeposit,
  clearAll,
}: PendingDepositProps) => {
  const [showMenu, setShowMenu] = useState(false);
  if (!deposits.length) return null;
  const isAlert = !!deposits.find((x) => x.status === "succeeded");

  return (
    <div
      className={clsx({
        "rujira-header__pending": true,
        "rujira-header__alert": isAlert,
      })}
      onMouseOver={() => setShowMenu(true)}
      onMouseLeave={() => setShowMenu(false)}>
      <img src={isAlert ? alert : alertStatic} alt="Pending transactions" />
      <AnimatePresence>
        {showMenu && (
          <motion.div
            className="rujira-header__popup sub-nav fw-400 px-2 py-1.5"
            initial={{ opacity: 0, marginTop: -4 }}
            animate={{ opacity: 1, marginTop: 0 }}
            exit={{ opacity: 0, marginTop: -4 }}>
            {deposits.length > 0 && (
              <div className="text-right mb-1.5">
                <a className="tag tag--md hover-white" onClick={clearAll}>
                  clear all
                </a>
              </div>
            )}
            {deposits.sort(sorter).map((x) => (
              <Deposit
                key={x.hash}
                deposit={x}
                dismiss={() => dismissDeposit(x.hash)}
              />
            ))}

          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const Deposit: FC<{ deposit: PendingDeposit; dismiss: () => void }> = ({
  deposit,
  dismiss,
}) => {
  const { hash, status, network, timestamp, message } = deposit;

  const [elapsed, setElapsed] = useState(
    (new Date().getTime() - timestamp.getTime()) / 1000
  );
  useEffect(() => {
    const int = setInterval(() => {
      setElapsed((new Date().getTime() - timestamp.getTime()) / 1000);
    }, 1000);
    return () => clearInterval(int);
  }, []);

  return (
    <div className="flex rujira-header__pending-tx mb-2">
      <NetworkIcon network={network} className="w-3 h-3 mr-1" />
      <div className="flex dir-c grow">
        <div className="flex">
          <div className="fs-14 condensed color-white">
            {nFormatter(deposit.coin.amount, 6, 8)} {deposit.coin.symbol}
          </div>

          <div className="ar flex">
            {status === "pending" && (
              <div className="fs-12 condensed color-grey mr-2 wrap-reset">
                <span className="color-white">
                  {elapsed < 60
                    ? `${elapsed}s`
                    : elapsed < 3600
                      ? `${Math.floor(elapsed / 60)}m ${Math.floor(elapsed % 60)}s`
                      : elapsed < 36000
                        ? `${Math.floor(elapsed / 3600)}h ${Math.floor((elapsed % 3600) / 60)}m ${Math.floor(elapsed % 60)}s`
                        : "> 10h"}
                </span>
              </div>
            )}

            <div
              className={clsx({
                "tag tag--sm": true,
                "tag--orange": status === "pending",
                "tag--teal": status === "succeeded",
                "tag--red": ["refunded", "failed"].includes(status),
              })}>
              <b /> {status}
            </div>
          </div>
        </div>
        <div className="flex mt-0.5">
          <span className="fs-13 condensed color-grey no-underline mr-3">
            {timestamp.toLocaleTimeString()} {timestamp.toLocaleDateString()}
          </span>
          <a
            href={networkTxLink({ network, txHash: hash })}
            target="_blank"
            className="fs-13 condensed color-grey no-underline hover-white ar">
            {hash.slice(0, 4)}...{hash.slice(-6)}
          </a>
        </div>
        {message && (
          <div className="flex mt-0.5">
            <span className="fs-13 condensed color-orange no-underline mr-3">
              {message}
            </span>
          </div>
        )}
      </div>
      {status !== "pending" && (
        <button
          className="transparent ml-1.5 mr-0 color-grey hover-white pointer"
          onClick={dismiss}>
          <Xmark className="w-2 h-2" />
        </button>
      )}
    </div>
  );
};

const sorter = (a: PendingDeposit, b: PendingDeposit): number =>
  b.timestamp.getTime() - a.timestamp.getTime();
