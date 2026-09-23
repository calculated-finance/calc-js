import {
  DataProviders,
  GetWorkflowInstancesOptions,
  PaymentConfig,
  PaymentSource,
  Workflow,
  WorkflowInstance,
  WorkflowInstancesData,
} from "@autorujira/workflow-launcher";
import { fetchQuery, graphql } from "react-relay";
import { Id } from "../node";
import { autoGetWorkflowInstancesQuery } from "./__generated__/autoGetWorkflowInstancesQuery.graphql";
import { autoGetWorkflowQuery } from "./__generated__/autoGetWorkflowQuery.graphql";
import { autoHasRequiredGrantsQuery } from "./__generated__/autoHasRequiredGrantsQuery.graphql";
import { autoPaymentConfigQuery } from "./__generated__/autoPaymentConfigQuery.graphql";
import { environment } from "./relay";

const paymentConfigQuery = graphql`
  query autoPaymentConfigQuery($id: ID!) {
    node(id: $id) {
      ... on Account {
        auto {
          paymentConfig {
            type
            usdAllowance
          }
        }
      }
    }
  }
`;

const hasRequiredGrantsQuery = graphql`
  query autoHasRequiredGrantsQuery($id: ID!) {
    node(id: $id) {
      ... on Account {
        auto {
          hasRequiredGrants
        }
      }
    }
  }
`;

const getWorkflowQuery = graphql`
  query autoGetWorkflowQuery($id: String, $name: String) {
    rujira {
      auto {
        workflow(id: $id, name: $name) {
          id
          name
          description
          creationTimestamp
          publisher
          status
        }
      }
    }
  }
`;

const getWorkflowInstancesQuery = graphql`
  query autoGetWorkflowInstancesQuery(
    $id: ID!
    $workflowId: String
    $launcherId: String
    $states: [String!]
    $after: String
    $first: Int
    $before: String
    $last: Int
    $pageNumber: Int
  ) {
    node(id: $id) {
      ... on Account {
        auto {
          workflows(
            workflowId: $workflowId
            launcherId: $launcherId
            states: $states
            after: $after
            first: $first
            before: $before
            last: $last
            pageNumber: $pageNumber
          ) {
            edges {
              node {
                instanceId
                workflowId
                requester
                executionType
                cronExpression
                onchainParameters
                offchainParameters
                expirationDate
                launcherId
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
                state
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
    }
  }
`;

export async function getPaymentConfig(
  userAddress: string
): Promise<PaymentConfig | null> {
  try {
    const result = await fetchQuery<autoPaymentConfigQuery>(
      environment,
      paymentConfigQuery,
      { id: Id.account({ address: userAddress }) }
    ).toPromise();

    const paymentConfig = result?.node?.auto?.paymentConfig;

    if (!paymentConfig) {
      return null;
    }

    return {
      allowance: paymentConfig.usdAllowance
        ? String(paymentConfig.usdAllowance)
        : undefined,
      source:
        paymentConfig.type === "WALLET"
          ? PaymentSource.Wallet
          : PaymentSource.Prepaid,
    };
  } catch (error) {
    console.error("Error fetching payment config:", error);
    throw error;
  }
}

export async function checkGrantStatus(granter: string): Promise<boolean> {
  try {
    const result = await fetchQuery<autoHasRequiredGrantsQuery>(
      environment,
      hasRequiredGrantsQuery,
      { id: Id.account({ address: granter }) }
    ).toPromise();

    return result?.node?.auto?.hasRequiredGrants ?? false;
  } catch (error) {
    console.error("Error checking grant status:", error);
    throw error;
  }
}

export async function getWorkflow(
  workflowId?: string,
  workflowName?: string
): Promise<Workflow> {
  try {
    const variables: { id?: string; name?: string } = {};
    if (workflowId) {
      variables.id = workflowId;
    }
    if (workflowName) {
      // Codificar el nombre para manejar espacios y caracteres especiales
      variables.name = encodeURIComponent(workflowName);
    }

    const result = await fetchQuery<autoGetWorkflowQuery>(
      environment,
      getWorkflowQuery,
      variables
    ).toPromise();

    const workflow = result?.rujira?.auto?.workflow;

    if (!workflow) {
      throw new Error("Workflow not found");
    }

    return {
      id: workflow.id,
      name: workflow.name,
      description: workflow.description ?? undefined,
      creationTimestamp: workflow.creationTimestamp ?? undefined,
      publisher: workflow.publisher ?? "",
      status: workflow.status?.toLowerCase() ?? "",
    };
  } catch (error) {
    console.error("Error fetching workflow:", error);
    throw error;
  }
}

export async function getWorkflowInstances(
  options: GetWorkflowInstancesOptions
): Promise<WorkflowInstancesData> {
  try {
    const variables: {
      id: string;
      workflowId?: string;
      launcherId?: string;
      states?: string[];
      pageNumber?: number;
      resultsPerPage?: number;
    } = {
      id: Id.account({ address: options.requester }),
    };

    if (options.workflowId) {
      variables.workflowId = options.workflowId;
    }
    if (options.launcherId) {
      variables.launcherId = options.launcherId;
    }
    if (options.states && options.states.length > 0) {
      variables.states = options.states;
    }
    if (options.pageNumber !== undefined) {
      variables.pageNumber = options.pageNumber;
    }
    if (options.resultsPerPage !== undefined) {
      variables.resultsPerPage = options.resultsPerPage;
    }

    const result = await fetchQuery<autoGetWorkflowInstancesQuery>(
      environment,
      getWorkflowInstancesQuery,
      variables
    ).toPromise();

    const connection = result?.node?.auto?.workflows;

    if (!connection || !connection.edges) {
      const page = options.pageNumber ?? 1;
      const resultsPerPage = options.resultsPerPage ?? 10;
      return {
        pagination: {
          page,
          resultsPerPage,
          total: 0,
          totalPages: 0,
        },
        instances: [],
      };
    }

    const instances = connection.edges
      .map((edge: any) => {
        const node = edge?.node;
        if (!node) {
          return null;
        }

        // Parse JSON parameters
        let onchainParameters: Record<string, any> = {};
        let offchainParameters: Record<string, any> = {};

        try {
          onchainParameters =
            typeof node.onchainParameters === "string"
              ? JSON.parse(node.onchainParameters)
              : node.onchainParameters || {};
        } catch (e) {
          console.warn("Error parsing onchainParameters:", e);
        }

        try {
          offchainParameters =
            typeof node.offchainParameters === "string"
              ? JSON.parse(node.offchainParameters)
              : node.offchainParameters || {};
        } catch (e) {
          console.warn("Error parsing offchainParameters:", e);
        }

        return {
          id: node.instanceId,
          workflowId: node.workflow.id,
          requester: node.requester,
          executionType: node.executionType.toLowerCase(),
          cronExpression: node.cronExpression ?? null,
          onchainParameters,
          offchainParameters,
          expirationDate: node.expirationDate ?? undefined,
          launcherId: node.launcherId ?? undefined,
          workflow: {
            id: node.workflow.id,
            name: node.workflow.name,
          },
          schedule: node.schedule
            ? {
                status: node.schedule.status.toLowerCase(),
                nextExecutionTimes: node.schedule.nextExecutionTimes || [],
                runningWorkflows: node.schedule.runningWorkflows || [],
              }
            : {
                status: "",
                nextExecutionTimes: [],
                runningWorkflows: [],
              },
          state: node.state.toLowerCase(),
          lastRun: node.lastRun
            ? {
                state: node.lastRun.state.toLowerCase(),
                startTime: node.lastRun.startTime,
                endTime: node.lastRun.endTime,
              }
            : null,
        } as WorkflowInstance;
      })
      .filter(
        (instance: any): instance is WorkflowInstance => instance !== null
      );

    const page = options.pageNumber ?? 1;
    const resultsPerPage = options.resultsPerPage ?? 10;
    const pageInfo = connection.pageInfo;

    // Calculate total and totalPages based on whether there are more pages
    // If we don't have the real total, we estimate based on hasNextPage
    // If there are more pages, we assume there are at least (page * resultsPerPage) + 1 results
    // If there are no more pages, the total is exactly the current number of results
    const total = pageInfo.hasNextPage
      ? page * resultsPerPage + 1 // Minimum estimate
      : instances.length + (page - 1) * resultsPerPage;
    const totalPages = Math.ceil(total / resultsPerPage);

    return {
      pagination: {
        page,
        resultsPerPage,
        total,
        totalPages,
      },
      instances,
    };
  } catch (error) {
    console.error("Error fetching workflow instances:", error);
    throw error;
  }
}

/**
 * Creates data providers for workflow launcher.
 * These providers use fetchQuery outside of React context, which is why
 * they're defined in services rather than hooks.
 */
export const dataProviders: DataProviders = {
  getUserPaymentConfig: async (userAddress: string) =>
    getPaymentConfig(userAddress),
  checkGrantStatus: async (userAddress: string) =>
    checkGrantStatus(userAddress),
  getWorkflow: async (workflowId?: string, workflowName?: string) =>
    getWorkflow(workflowId, workflowName),
  getWorkflowInstances: async (options: GetWorkflowInstancesOptions) =>
    getWorkflowInstances(options),
};
