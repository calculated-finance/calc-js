locals {
  executor_log_sources = join(" | ", [
    for function_name in var.executor_function_names :
    "SOURCE '/aws/lambda/${function_name}'"
  ])

  error_log_query = jsonencode(<<-QUERY
    ${local.executor_log_sources} | filter level = "ERROR"
    | fields @timestamp, @message, level
    | sort @timestamp desc
    | limit 100
  QUERY
  )

  execution_log_query = jsonencode(<<-QUERY
    ${local.executor_log_sources} | filter event = "executor_invocation_started"
    | fields @timestamp, @message, event
    | sort @timestamp desc
    | limit 100
  QUERY
  )

  rpc_outcome_query = jsonencode(<<-QUERY
    ${local.executor_log_sources} | filter event in ["executor_rpc_execute_succeeded", "executor_rpc_execute_failed"]
    | fields concat(if(rpcUrl = "https://gateway.liquify.com/chain/thorchain_rpc", "Liquify", if(rpcUrl = "https://rpc-thorchain.rorcual.xyz", "Rorcual", if(rpcUrl = "https://thorchain.ibs.team/rpc/", "IBS", rpcUrl))), " - ", if(event = "executor_rpc_execute_succeeded", "Success", "Failure")) as Series
    | stats count(*) as Count by bin(5m), Series
  QUERY
  )

  unique_strategies_query = jsonencode(<<-QUERY
    ${local.executor_log_sources} | filter event = "executor_strategy_executed"
    | stats count_distinct(strategyAddress) as UniqueStrategies by bin(5m)
  QUERY
  )

  executor_throttle_metrics = jsonencode([
    for function_name in var.executor_function_names : [
      "AWS/Lambda",
      "Throttles",
      "FunctionName",
      function_name,
      { region = var.region },
    ]
  ])

  executor_error_metrics = jsonencode([
    for function_name in var.executor_function_names : [
      "AWS/Lambda",
      "Errors",
      "FunctionName",
      function_name,
      { region = var.region },
    ]
  ])
}

# Dashboard sharing is configured separately in the CloudWatch console because
# AWS does not expose dashboard sharing through the CloudWatch API. Keeping the
# existing dashboard name preserves its public share while Terraform manages
# the dashboard body.
resource "aws_cloudwatch_dashboard" "main" {
  dashboard_name = var.dashboard_name
  dashboard_body = templatefile("${path.module}/dashboard.json.tftpl", {
    chain_id                  = var.chain_id
    cluster_name              = var.cluster_name
    error_log_query           = local.error_log_query
    execution_log_query       = local.execution_log_query
    executor_error_metrics    = local.executor_error_metrics
    executor_throttle_metrics = local.executor_throttle_metrics
    region                    = var.region
    rpc_outcome_query         = local.rpc_outcome_query
    scheduler_service_name    = var.scheduler_service_name
    triggers_queue_name       = var.triggers_queue_name
    unique_strategies_query   = local.unique_strategies_query
  })
}
