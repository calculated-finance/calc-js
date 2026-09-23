import { TransactionMessage } from "@autorujira/workflow-launcher";
import { useEffect, useMemo, useState } from "react";
import { graphql, useFragment, useRelayEnvironment } from "react-relay";
import { Disposable, requestSubscription } from "relay-runtime";
import {
  Account,
  Address,
  Msg,
  MsgAuthzGrant,
  MsgExecute,
  THOR,
} from "rujira.js";
import { useTranslation } from "rujira.ui";
import { useWorkflowLauncher } from "../../hooks/useWorkflowLauncher";
import { usePreloadedAccountData } from "../../services/accountData";
import { useAccounts } from "../../services/accounts";
import { useTradeContext } from "../components/Context";
import type { useAutoClaimerCreatedSubscription } from "./__generated__/useAutoClaimerCreatedSubscription.graphql";
import type {
  useAutoClaimerFragment$data,
  useAutoClaimerFragment$key,
} from "./__generated__/useAutoClaimerFragment.graphql";
import type { useAutoClaimerUpdatedSubscription } from "./__generated__/useAutoClaimerUpdatedSubscription.graphql";

export const useAutoClaimerFragment = graphql`
  fragment useAutoClaimerFragment on Account {
    address
    auto {
      workflows(states: ["RUNNING"], first: 100000)
        @connection(key: "useAutoClaimerFragment_workflows") {
        __id
        edges {
          node {
            id
            instanceId
            workflowId
            requester
            executionType
            cronExpression
            onchainParameters
            offchainParameters
            expirationDate
            launcherId
            state
            workflow {
              id
              name
            }
            schedule {
              status
              nextExecutionTimes
              runningWorkflows
            }
            lastRun {
              state
              startTime
              endTime
            }
          }
          cursor
        }
        pageInfo {
          hasNextPage
          hasPreviousPage
          startCursor
          endCursor
        }
      }
    }
  }
`;

const useAutoClaimerUpdatedSubscription = graphql`
  subscription useAutoClaimerUpdatedSubscription($id: ID!) {
    node(id: $id) {
      __typename
      ... on AutoWorkflowInstance {
        id
        instanceId
        workflowId
        requester
        executionType
        cronExpression
        onchainParameters
        offchainParameters
        expirationDate
        launcherId
        state
        workflow {
          id
          name
        }
        schedule {
          status
          nextExecutionTimes
          runningWorkflows
        }
        lastRun {
          state
          startTime
          endTime
        }
      }
    }
  }
`;

const useAutoClaimerCreatedSubscription = graphql`
  subscription useAutoClaimerCreatedSubscription(
    $owner: Address!
    $connection: ID!
  ) {
    autoInstanceCreated(owner: $owner) @appendEdge(connections: [$connection]) {
      cursor
      node {
        ... on AutoWorkflowInstance {
          id
          instanceId
          workflowId
          requester
          executionType
          cronExpression
          onchainParameters
          offchainParameters
          expirationDate
          launcherId
          state
          workflow {
            id
            name
          }
          schedule {
            status
            nextExecutionTimes
            runningWorkflows
          }
          lastRun {
            state
            startTime
            endTime
          }
        }
      }
    }
  }
`;

export type ActiveInstance = NonNullable<
  NonNullable<
    NonNullable<useAutoClaimerFragment$data["auto"]>["workflows"]["edges"]
  >[number]
>["node"];

export interface AutoClaimer {
  launcherId?: string;
  activeInstance: ActiveInstance | null;
  msgs: Msg[] | "loading";
}

interface StakingContext {
  stakedTokenSymbol: string;
  poolAddress: string;
  rewardSymbol: string;
  swapTargetSymbol?: string;
  minAmountToClaim: string;
  slippageBps: string;
  swapContractAddress?: string;
}

export type AutoClaimerIntent = "cancel" | "launch" | "modify";

interface UseAutoClaimerOptions {
  appId: "RUJI-Trade" | "RUJI-Staking";
  context?: StakingContext;
  intent?: AutoClaimerIntent;
  onError?: () => void;
}

export const useAutoClaimer = (options: UseAutoClaimerOptions): AutoClaimer => {
  const tradeContext = useTradeContext();
  const { t } = useTranslation();
  const { launchWorkflow, cancelWorkflow, modifyWorkflow } =
    useWorkflowLauncher();
  type Result = Awaited<
    | ReturnType<typeof launchWorkflow>
    | ReturnType<typeof cancelWorkflow>
    | ReturnType<typeof modifyWorkflow>
  >;
  const [result, setResult] = useState<Result>();
  const [workflowError, setWorkflowError] = useState<Error | null>(null);

  const { selected } = useAccounts();
  const env = useRelayEnvironment();
  const { accountData } = usePreloadedAccountData();

  const account = useFragment<useAutoClaimerFragment$key>(
    useAutoClaimerFragment,
    accountData || null
  );

  const appId = options.appId;
  const context = options.context;
  const onError = options.onError;

  // Get context values based on appId
  const { base, quote, address: tradeAddress } = tradeContext;

  // Calculate launcherId based on appId
  const launcherId = useMemo(() => {
    if (appId === "RUJI-Trade") {
      if (!base || !quote) return undefined;
      return `RUJI_TRADE_${base}_${quote}`;
    } else if (appId === "RUJI-Staking") {
      if (!context?.stakedTokenSymbol) return undefined;
      return `RUJI_STAKING_${context.stakedTokenSymbol}`;
    }
    return undefined;
  }, [appId, base, quote, context?.stakedTokenSymbol]);

  const activeInstance: null | ActiveInstance = useMemo(() => {
    if (!account?.auto?.workflows?.edges || !launcherId) {
      return null;
    }
    const workflows = account.auto.workflows.edges;
    const matchingWorkflow = workflows?.find(
      (edge) =>
        edge?.node?.launcherId === launcherId && edge?.node?.state === "RUNNING"
    );
    return matchingWorkflow?.node || null;
  }, [account, launcherId]);

  const intent =
    options.intent ??
    (appId === "RUJI-Trade"
      ? activeInstance
        ? "cancel"
        : "launch"
      : undefined);

  // Build workflow config based on appId
  const workflowConfig = useMemo(() => {
    if (appId === "RUJI-Trade") {
      if (!base || !quote || !tradeAddress || !launcherId) return null;
      return {
        workflowName: "AutoClaimer RUJI Trade",
        appId: "RUJI-Trade",
        title: `${t("AutoClaim")} ${base}-${quote} ${t("filled orders")}`,
        parameters: {
          onchain_parameters: {
            claimContractAddress: { string: tradeAddress },
          },
          offchain_parameters: {
            claimTemplateId: { string: "fin" },
            notificationType: { string: "telegram" },
            minAmountToClaim: { string: "5" },
            launcherId: { string: launcherId },
          },
        },
      };
    } else if (appId === "RUJI-Staking") {
      if (!context || !launcherId) return null;
      const hasSwap =
        !!context.swapTargetSymbol && !!context.swapContractAddress;
      const onchainParams: Record<string, any> = {
        claimContractAddress: { string: context.poolAddress },
      };
      if (hasSwap) {
        onchainParams.swapTemplateId = { string: "fin" };
        onchainParams.swapContractAddress = {
          string: context.swapContractAddress,
        };
      }
      const offchainParams: Record<string, any> = {
        claimTemplateId: { string: "ruji" },
        notificationType: { string: "telegram" },
        minAmountToClaim: { string: context.minAmountToClaim },
        stakedTokenSymbol: { string: context.stakedTokenSymbol },
        launcherId: { string: launcherId },
      };
      if (hasSwap) {
        offchainParams.side = { string: "base" };
        offchainParams.slippage = {
          string: (Number(context.slippageBps) / 10000).toString(),
        };
        offchainParams.percentageToSwap = { string: "1" };
      }
      return {
        workflowName: "AutoClaimer RUJI Staking",
        appId: "RUJI-Staking",
        title: `${t("AutoClaim")} ${context.stakedTokenSymbol}`,
        parameters: {
          onchain_parameters: onchainParams,
          offchain_parameters: offchainParams,
        },
      };
    }
    return null;
  }, [appId, base, quote, tradeAddress, launcherId, context]);

  useEffect(() => {
    if (!selected || !launcherId) return;
    if (appId === "RUJI-Trade" && (!base || !quote || !tradeAddress)) return;
    if (appId === "RUJI-Staking" && !context) return;

    const subscriptions: Disposable[] = [];

    if (activeInstance?.id) {
      subscriptions.push(
        requestSubscription<useAutoClaimerUpdatedSubscription>(env, {
          subscription: useAutoClaimerUpdatedSubscription,
          variables: { id: activeInstance.id },
        })
      );
    }

    if (
      selected?.address &&
      launcherId &&
      account?.auto?.workflows?.__id &&
      (!activeInstance?.id || intent === "modify")
    ) {
      subscriptions.push(
        requestSubscription<useAutoClaimerCreatedSubscription>(env, {
          subscription: useAutoClaimerCreatedSubscription,
          variables: {
            owner: selected.address.address,
            connection: account.auto.workflows.__id,
          },
        })
      );
    }

    if (intent) {
      if (intent === "cancel" && !activeInstance) return;
      if (intent === "launch" && !workflowConfig) return;
      if (intent === "modify" && (!activeInstance || !workflowConfig)) return;

      setResult(undefined);
      setWorkflowError(null);

      const executionType = "Recurrent" as const;
      const cronExpression =
        appId === "RUJI-Staking" ? "0 0 * * *" : "0 * * * *";
      const schedule = { executionType, cronExpression };

      const onErr = (err: Error) => {
        setWorkflowError(err);
        onError?.();
      };

      if (intent === "cancel" && activeInstance?.instanceId) {
        cancelWorkflow({
          instanceId: activeInstance.instanceId,
          onlyGenerateMessages: true,
        })
          .then(setResult)
          .catch(onErr);
      } else if (intent === "launch" && workflowConfig) {
        launchWorkflow({
          ...workflowConfig,
          ...schedule,
          onlyGenerateMessages: true,
        })
          .then(setResult)
          .catch(onErr);
      } else if (
        intent === "modify" &&
        activeInstance?.instanceId &&
        workflowConfig
      ) {
        modifyWorkflow({
          instanceId: activeInstance.instanceId,
          workflowConfig: { ...workflowConfig, ...schedule },
          onlyGenerateMessages: true,
        })
          .then(setResult)
          .catch(onErr);
      }
    }

    return () => {
      subscriptions.forEach((s) => s.dispose());
    };
  }, [intent, activeInstance, workflowConfig, selected, account, env]);

  const msgs = useMemo(() => {
    if (!intent) return [];
    if (!selected) return [];
    if (workflowError) return [];
    if (!result) return "loading";
    if ("messages" in result)
      return result.messages?.map(mapMessage(selected.address)) || [];
    throw new Error(`Unhandled Auto result`);
  }, [intent, activeInstance, result, workflowError, selected]);

  return {
    launcherId,
    activeInstance,
    msgs,
  };
};

const mapMessage =
  (address: Address) =>
  (msg: TransactionMessage): Msg => {
    const msgType = msg.typeUrl;

    switch (msgType) {
      case "/cosmos.authz.v1beta1.MsgGrant":
        return new MsgAuthzGrant(
          Account.fromAddress(address, THOR),
          msg.value.granter,
          msg.value.grantee,
          "/cosmwasm.wasm.v1.MsgExecuteContract"
        );

      case "/cosmwasm.wasm.v1.MsgExecuteContract": {
        const msgBody =
          msg.readableValue?.msg ||
          JSON.parse(new TextDecoder().decode(msg.value.msg));

        return new MsgExecute(
          Account.fromAddress(address, THOR),
          msg.value.funds || [],
          msg.value.contract,
          msgBody
        );
      }

      default:
        throw new Error(`Unsupported Msg type ${msgType}`);
    }
  };
