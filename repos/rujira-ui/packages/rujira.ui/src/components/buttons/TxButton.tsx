import clsx from "clsx";
import {
  ElementType,
  FC,
  ReactElement,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import toast, { Renderable } from "react-hot-toast";
import { Trans } from "react-i18next";
import { Tooltip } from "react-tooltip";
import {
  AVAX,
  BSC,
  InsufficientAllowanceError,
  Msg,
  MsgErc20IncreaseAllowance,
  MsgErc20ResetAllowance,
  Network,
  Simulation,
  TxError,
  TxResult,
  networkTxLink,
  translateError,
} from "rujira.js";
import txSimulateError from "../../assets/images/exclamation.gif";
import txFail from "../../assets/images/txfail.gif";
import txSign from "../../assets/images/txsign.gif";
import txSimulate from "../../assets/images/txsimulate.gif";
import txSuccess from "../../assets/images/txsuccess.gif";
import lock from "../../assets/images/unlock.gif";
import { useTranslation } from "../../i18n";
import { AccountProvider } from "../../wallets";
import { Loader } from "../loader/Loader";
import { Warning } from "../notices/Warning";
import { Decimal } from "../numbers/Decimal";
import { Button, ButtonProps } from "./Button";

// Helper to identify spacing/layout classes
const SPACING_CLASS_REGEX = /^(m|p)(l|r|t|b|x|y)?-\d+$/;
const isSpacingClass = (className: string) =>
  SPACING_CLASS_REGEX.test(className);

// Separate spacing classes from styling classes
const separateClasses = (className?: string) => {
  const classes = className?.split(" ") || [];
  return {
    spacing: classes.filter(isSpacingClass),
    styling: classes.filter((c) => !isSpacingClass(c)),
  };
};

export type SimulationState = {
  simulation: Simulation | undefined;
  status: "none" | "running" | "completed" | "failed";
};

export type TxButtonProps<T extends ElementType = "button"> = ButtonProps<T> & {
  accountProvider: AccountProvider;
  msg: Msg | null;
  SimulationComponent?: ElementType<{
    simulation?: Simulation;
    error?: Error;
  }>;
  onError?: (err: any) => void;
  onSuccess?: (res: TxResult) => void;
  onSimulation?: (simulationState: SimulationState) => void;
  hideSimulation?: boolean;
  animateSimulation?: boolean;
  toastOpts?: {
    loading?: Renderable;
    success?: Renderable | ((res: TxResult) => Renderable);
    error?: Renderable | ((err: any) => Renderable);
  };
};

// Add chains here that do not require the extra reset step, for USDT allowance approvals,
// when there is already a non-zero allowance approved. We default to the 3-step process
// to avoid failing deposits for future chain integrations.
const TWO_STEP_ALLOWANCE_CHAINS = new Set<Network>([BSC, AVAX]);

export const TxButton: FC<TxButtonProps> = (props) => {
  const { t } = useTranslation("common");
  const {
    accountProvider,
    msg,
    onSuccess,
    onError,
    onSimulation,
    SimulationComponent = DefaultSimulationComponent,
    children,
    toastOpts = {},
    className,
    hideSimulation,
    animateSimulation = true,
    onClick,
    ...rest
  } = props;

  const [simulation, setSimulation] = useState<Simulation>();
  const [simulationError, setSimulationError] = useState<Error>();
  const [isSimulating, setIsSimulating] = useState(false);
  const simulationSeqRef = useRef(0);
  const { loading, success, error } = toastOpts;
  const [isSigning, setIsSigning] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isRejected, setIsRejected] = useState(false);
  const [allowanceWasReset, setAllowanceWasReset] = useState(false);

  // Callers commonly pass an inline lambda, so `onSimulation` is a new value on
  // every render. Read it through a ref instead of making it an effect dependency,
  // which would restart the debounce below on every render and the simulation would never
  // fire on a view that re-renders faster than the timeout.
  const onSimulationRef = useRef(onSimulation);
  onSimulationRef.current = onSimulation;

  const doSimulate = (msg: Msg | null) => {
    setSimulationError(undefined);
    setSimulation(undefined);
    onSimulationRef.current?.({ simulation: undefined, status: "none" });
    if (msg) {
      const seq = ++simulationSeqRef.current;
      setIsSimulating(true);
      onSimulationRef.current?.({ simulation: undefined, status: "running" });
      const signer = accountProvider.signer(msg.account.address);
      signer
        .simulate(msg)
        .then((sim) => {
          //ignore stale simulations
          if (seq !== simulationSeqRef.current) return;

          setIsSimulating(false);
          setSimulation(sim);
          onSimulationRef.current?.({ simulation: sim, status: "completed" });
        })
        .catch((err) => {
          //ignore stale simulation errors
          if (seq !== simulationSeqRef.current) return;

          setIsSimulating(false);
          console.error(err);
          setSimulationError(err);
          onError && onError(new TxError(msg, err, "simulation"));
          onSimulationRef.current?.({
            simulation: undefined,
            status: "failed",
          });
        });
    }
  };

  useEffect(() => {
    setIsSimulating(false);
    onSimulationRef.current?.({ simulation: undefined, status: "none" });
    const timeout = setTimeout(() => doSimulate(msg), 1000);
    return () => clearTimeout(timeout);
  }, [msg]);

  const handleSign = (e: any) => {
    if (isSigning || isSuccess || isRejected) return;
    if (!simulation) throw new Error(`Simulation required`);
    if (!msg) throw new Error(`Msg required`);

    setIsSigning(true);
    const signer = accountProvider.signer(msg.account.address);

    if (onClick) onClick(e);

    const p = signer
      .signAndBroadcast(simulation, msg)
      .then((res) => {
        onSuccess && onSuccess(res);
        setIsSigning(false);
        setIsSuccess(true);
        setTimeout(() => {
          setIsSuccess(false);
        }, 3000);
        return res;
      })
      .catch((err) => {
        console.error(err);
        onError && onError(new TxError(msg, err, "signAndBroadcast"));
        setIsSigning(false);

        setIsRejected(true);
        setTimeout(() => {
          setIsRejected(false);
        }, 3000);

        throw err;
      });

    toast.promise(p, {
      loading: loading || t("submittingTransaction"),
      success: success || ((res: TxResult) => successHandler(res, t)),
      error:
        error ||
        ((err: any) => {
          console.error(err);
          const defaultError = t("errorSubmittingTransaction");
          switch (typeof err) {
            case "string":
              return translateError(err) || defaultError;
            case "object":
              return "message" in err
                ? translateError(err.message) || defaultError
                : defaultError;

            default:
              return defaultError;
          }
        }),
    });
  };

  const disabled = !msg || !simulation || !!simulationError || rest.disabled;

  // Separate spacing classes (always applied) from styling classes (conditionally applied)
  const { spacing: spacingClasses, styling: stylingClasses } =
    separateClasses(className);

  // Determine if tooltip should be shown
  const showTooltip = simulationError && simulationError.message !== "";

  const allowanceMsg = useMemo(() => {
    if (!msg) return null;
    if (!simulationError) return null;
    if (!(simulationError instanceof InsufficientAllowanceError)) return null;
    return new MsgErc20IncreaseAllowance(msg.account, simulationError);
  }, [msg, simulationError]);

  const resetAllowanceMsg = useMemo(() => {
    if (!msg) return null;
    if (!simulationError) return null;
    if (!(simulationError instanceof InsufficientAllowanceError)) return null;
    if (simulationError.current === 0n) return null;
    if (simulationError.asset.symbol.toUpperCase() !== "USDT") return null;
    if (TWO_STEP_ALLOWANCE_CHAINS.has(msg.account.network)) return null;
    return new MsgErc20ResetAllowance(msg.account, simulationError);
  }, [msg, simulationError]);

  if (resetAllowanceMsg)
    return (
      <>
        <TxButton
          {...props}
          toastOpts={{
            loading: t("resettingAllowance"),
            success: t("allowanceReset"),
          }}
          label={t("stepReset")}
          msg={resetAllowanceMsg}
          onSuccess={() => {
            setAllowanceWasReset(true);
            doSimulate(msg);
          }}
        />
        <ResetAllowanceWarning
          error={simulationError as InsufficientAllowanceError}
        />
      </>
    );

  if (allowanceMsg)
    return (
      <>
        <TxButton
          {...props}
          toastOpts={{
            loading: t("increasingAllowance"),
            success: t("allowanceIncreased"),
          }}
          label={allowanceWasReset ? t("stepApprove2of3") : t("stepApprove")}
          msg={allowanceMsg}
          onSuccess={() => doSimulate(msg)}
        />
        <InsufficientAllowanceWarning isStep2={allowanceWasReset} />
      </>
    );

  const modProps = {
    ...rest,
    ...(rest.label && {
      label: `${
        isSuccess
          ? t("success")
          : isSigning
            ? t("waiting")
            : isRejected
              ? t("rejected")
              : isSimulating && animateSimulation
                ? t("simulating")
                : rest.label
      }`,
    }),
  };
  return (
    <>
      <Button
        {...modProps}
        onClick={handleSign}
        className={clsx(
          stylingClasses.length > 0 ? stylingClasses : "button",
          spacingClasses,
          {
            "button--grey":
              disabled &&
              !isSimulating &&
              !stylingClasses.includes("transparent"),
            "button--waiting":
              (isSigning ||
                isRejected ||
                isSuccess ||
                (isSimulating && animateSimulation)) &&
              !className?.includes("transparent"),
            "button--success": isSuccess,
            "button--rejected": isRejected,
            "button--simulating": isSimulating && animateSimulation,
          }
        )}
        style={{
          cursor:
            isSigning ||
            isSuccess ||
            isRejected ||
            (isSimulating && animateSimulation)
              ? "default"
              : undefined,
          ...rest.style,
        }}
        disabled={disabled}
        data-tooltip-id="tx-button-tip"
        data-tooltip-html={
          showTooltip
            ? `<p class="fs-12 lh-16 fw-400 w-36 mb-0.5">${translateError(simulationError.message)}</p>`
            : undefined
        }>
        {(isSuccess ||
          isRejected ||
          isSigning ||
          (isSimulating && animateSimulation) ||
          !!simulationError) &&
          !className?.includes("transparent") && (
            <img
              className="w-4 h-4 filter-white big"
              src={
                isSimulating
                  ? txSimulate
                  : !!simulationError
                    ? txSimulateError
                    : isSigning
                      ? txSign
                      : isSuccess
                        ? txSuccess
                        : txFail
              }
              alt="lock"
            />
          )}
        {(isSigning || isRejected || isSuccess) &&
        className?.includes("transparent") ? (
          <Loader className="w-full h-full" />
        ) : (
          ((!isSigning && !isRejected && !isSuccess) ||
            className?.includes("transparent")) &&
          children
        )}
      </Button>
      {hideSimulation ? null : msg ? (
        <SimulationComponent simulation={simulation} error={simulationError} />
      ) : null}
    </>
  );
};

export const TxButtonTip = () => (
  <Tooltip
    id="tx-button-tip"
    className="tooltip"
    float={true}
    style={{ zIndex: 203 }}
  />
);
export interface SimulationComponentProps {
  simulation?: Simulation;
  error?: Error;
  isSimulating?: boolean;
}

const DefaultSimulationComponent = ({
  simulation,
  error,
  isSimulating,
}: SimulationComponentProps): ReactElement => {
  const { t } = useTranslation("common");
  if (error instanceof InsufficientAllowanceError) {
    return <InsufficientAllowanceWarning />;
  }
  if (error) return <span>&nbsp;</span>;
  if (!simulation && !isSimulating) return <span>&nbsp;</span>;

  return (
    <small className="fs-12 text-center mt-1 color-grey block">
      <>
        {t("networkFee")}{" "}
        {simulation ? (
          <Decimal
            subscript
            amount={simulation.amount}
            decimals={simulation.decimals}
            symbol={simulation.symbol}
            className="color-white"
          />
        ) : (
          <span>{t("calculating")}</span>
        )}
      </>
    </small>
  );
};

const InsufficientAllowanceWarning = ({
  isStep2 = false,
}: {
  isStep2?: boolean;
}) => {
  const { t } = useTranslation("common");
  return (
    <Warning
      className="warning warning--borderless mt-2 condensed flex ai-c"
      color="teal">
      <img src={lock} alt="lock" style={{ height: "2.25rem" }} />
      <div className="text-left">
        {t(
          isStep2
            ? "insufficientAllowanceWarningStep2"
            : "insufficientAllowanceWarning"
        )}
      </div>
    </Warning>
  );
};

const ResetAllowanceWarning = ({
  error,
}: {
  error: InsufficientAllowanceError;
}) => {
  return (
    <Warning
      className="warning warning--borderless mt-2 condensed flex ai-c"
      color="teal">
      <img src={lock} alt="lock" style={{ height: "2.25rem" }} />
      <div className="text-left">
        <Trans
          i18nKey="common:resetAllowanceWarning"
          components={{
            allowance: (
              <Decimal
                amount={error.current}
                decimals={error.asset.decimals}
                symbol={error.asset.symbol}
                className="color-white"
              />
            ),
          }}
        />
      </div>
    </Warning>
  );
};

const successHandler = (
  res: TxResult,
  t: (key: string) => string
): Renderable =>
  res.label ? (
    <p>{res.label}</p>
  ) : (
    <p>
      {t("transactionSucceeded")}
      <br />
      <a
        href={networkTxLink(res)}
        target="_blank"
        className="color-white no-underline fs-12">
        {res.txHash.slice(0, 8) + "..." + res.txHash.slice(-8)}
      </a>
    </p>
  );
