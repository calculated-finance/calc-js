import {
  ActiveInstanceResponse,
  cancelWorkflow,
  hasInstanceRunning,
  launchWorkflow,
  LaunchWorkflowResult,
} from "@autorujira/workflow-launcher";
import {
  WorkflowOperationMessagesResult,
  WorkflowOperationResult,
} from "@autorujira/workflow-launcher/dist/utils/workflowLifecycleService";
import { useCallback, useMemo, useState } from "react";
import { useAccounts } from "../services/accounts";
import { dataProviders } from "../services/auto";

interface WorkflowConfig {
  config?: {
    wizardDisplay?: "never" | "always" | "auto";
  };
  workflowName: string;
  appId?: string;
  title?: string;
  parameters?: Record<string, any>;
  executionType?: string;
  cronExpression?: string;
  onlyGenerateMessages?: boolean;
  onComplete?: (result: any) => void;
  onError?: (error: Error) => void;
  onClose?: () => void;
}

export interface ModifyWorkflowConfig {
  instanceId: string;
  workflowConfig: WorkflowConfig;
  onlyGenerateMessages?: boolean;
}

interface UseWorkflowLauncherReturn {
  launchWorkflow: (config: WorkflowConfig) => Promise<LaunchWorkflowResult>;
  hasInstanceRunning: (launcherId: string) => Promise<ActiveInstanceResponse>;
  cancelWorkflow: (config: {
    instanceId: string;
    onlyGenerateMessages?: boolean;
    onComplete?: (result: any) => void;
    onError?: (error: Error) => void;
  }) => Promise<WorkflowOperationResult | WorkflowOperationMessagesResult>;
  modifyWorkflow: (
    config: ModifyWorkflowConfig
  ) => Promise<WorkflowOperationMessagesResult>;
  isLoading: boolean;
  error: Error | null;
  clearError: () => void;
}

export const useWorkflowLauncher = (): UseWorkflowLauncherReturn => {
  const { selected } = useAccounts();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Create a single wallet client instance that updates when selected changes
  const walletClient = useMemo(() => {
    if (!selected) {
      return null;
    }
    // Minimal wallet client for message generation
    return {
      getAccounts: async () => [{ address: selected.address.address }],
    };
  }, [selected]);

  const launchWorkflowHandler = useCallback(
    async (config: WorkflowConfig) => {
      if (!walletClient) {
        throw new Error("No wallet connected");
      }

      setIsLoading(true);
      setError(null);

      try {
        // Generate messages without executing
        const result = await launchWorkflow({
          workflowName: config.workflowName,
          title: config.title,
          parameters: config.parameters ?? {},
          executionType: config.executionType as "OneShot" | "Recurrent",
          cronExpression: config.cronExpression,
          walletClient,
          dataProviders,
          theme: "dark",
          appId: config.appId,
          onlyGenerateMessages: true,
          config: {
            wizardDisplay: "never",
          },
          onComplete: config.onComplete,
          onError: config.onError,
          onClose: config.onClose,
        });

        return result;
      } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err));
        setError(error);
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [walletClient]
  );

  const hasInstanceRunningHandler = useCallback(
    async (launcherId?: string) => {
      if (!walletClient) {
        throw new Error("No wallet connected");
      }

      setIsLoading(true);
      setError(null);

      try {
        const result = await hasInstanceRunning(
          walletClient,
          undefined, // workflowId
          launcherId,
          dataProviders
        );
        return result;
      } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err));
        setError(error);
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [walletClient]
  );

  const cancelWorkflowHandler = useCallback(
    async (config: {
      instanceId: string;
      onlyGenerateMessages?: boolean;
      onComplete?: (result: any) => void;
      onError?: (error: Error) => void;
    }) => {
      if (!walletClient) {
        throw new Error("No wallet connected");
      }

      setIsLoading(true);
      setError(null);

      try {
        const result = await cancelWorkflow({
          instanceId: config.instanceId,
          walletClient,
          onlyGenerateMessages: config.onlyGenerateMessages,
          onComplete: config.onComplete,
          onError: config.onError,
        });
        return result;
      } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err));
        setError(error);
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [walletClient]
  );

  const modifyWorkflowHandler = useCallback(
    async (config: ModifyWorkflowConfig) => {
      if (!walletClient) {
        throw new Error("No wallet connected");
      }

      setIsLoading(true);
      setError(null);

      try {
        const cancelResult = await cancelWorkflow({
          instanceId: config.instanceId,
          walletClient,
          onlyGenerateMessages: true,
        });

        const cancelMessages =
          "messages" in cancelResult ? (cancelResult.messages ?? []) : [];
        if (cancelMessages.length === 0) {
          const errMsg =
            "error" in cancelResult
              ? String((cancelResult as { error?: string }).error)
              : "Cancel did not return messages";
          throw new Error(`Failed to generate cancel messages: ${errMsg}`);
        }

        const launchResult = await launchWorkflow({
          workflowName: config.workflowConfig.workflowName,
          title: config.workflowConfig.title,
          parameters: config.workflowConfig.parameters ?? {},
          executionType: (config.workflowConfig.executionType ??
            "Recurrent") as "OneShot" | "Recurrent",
          cronExpression: config.workflowConfig.cronExpression ?? "0 * * * *",
          walletClient,
          dataProviders,
          theme: "dark",
          appId: config.workflowConfig.appId,
          onlyGenerateMessages: true,
          config: { wizardDisplay: "never" as const },
        });

        const launchMessages =
          "messages" in launchResult ? (launchResult.messages ?? []) : [];

        return {
          messages: [...cancelMessages, ...launchMessages],
        } as WorkflowOperationMessagesResult;
      } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err));
        setError(error);
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [walletClient]
  );

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    launchWorkflow: launchWorkflowHandler,
    hasInstanceRunning: hasInstanceRunningHandler,
    cancelWorkflow: cancelWorkflowHandler,
    modifyWorkflow: modifyWorkflowHandler,
    isLoading,
    error,
    clearError,
  };
};
