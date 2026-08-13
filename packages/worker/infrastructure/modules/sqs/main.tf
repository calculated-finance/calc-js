locals {
  lambda_name_prefix = "${var.project_name}-${var.environment}"
}

resource "aws_sqs_queue" "triggers_dql" {
  name                        = "${local.lambda_name_prefix}-triggers-dlq.fifo"
  fifo_queue                  = true
  content_based_deduplication = true
  deduplication_scope         = "queue"
  visibility_timeout_seconds  = 120
  message_retention_seconds   = 1209600
  sqs_managed_sse_enabled     = false
}

resource "aws_sqs_queue" "triggers" {
  name                        = "${local.lambda_name_prefix}-triggers.fifo"
  fifo_queue                  = true
  content_based_deduplication = true
  deduplication_scope         = "queue"
  # AWS recommends at least six times the Lambda timeout. The executors have
  # a 60-second timeout, so 360 seconds prevents immediate redelivery while a
  # failed invocation is still unwinding or Lambda is backing off.
  visibility_timeout_seconds = 360

  # Keep triggers through an upstream chain or RPC outage instead of expiring
  # them after five minutes. The scheduler contract re-checks each trigger and
  # skips IDs that were already executed or are no longer executable.
  message_retention_seconds = 86400
  sqs_managed_sse_enabled   = false
  redrive_policy = jsonencode({
    deadLetterTargetArn = aws_sqs_queue.triggers_dql.arn
    maxReceiveCount     = 10
  })
}

resource "aws_cloudwatch_metric_alarm" "triggers_oldest_message_age" {
  alarm_name          = "${local.lambda_name_prefix}-triggers-oldest-message-age"
  alarm_description   = "Trigger queue contains messages older than the expected retry window"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = 2
  datapoints_to_alarm = 2
  metric_name         = "ApproximateAgeOfOldestMessage"
  namespace           = "AWS/SQS"
  period              = 60
  statistic           = "Maximum"
  threshold           = var.oldest_message_age_alarm_seconds
  treat_missing_data  = "notBreaching"
  alarm_actions       = var.alarm_actions

  dimensions = {
    QueueName = aws_sqs_queue.triggers.name
  }
}

resource "aws_cloudwatch_metric_alarm" "triggers_visible_messages" {
  alarm_name          = "${local.lambda_name_prefix}-triggers-visible-messages"
  alarm_description   = "Trigger queue backlog exceeds the normal batch size"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = 2
  datapoints_to_alarm = 2
  metric_name         = "ApproximateNumberOfMessagesVisible"
  namespace           = "AWS/SQS"
  period              = 60
  statistic           = "Maximum"
  threshold           = var.visible_messages_alarm_threshold
  treat_missing_data  = "notBreaching"
  alarm_actions       = var.alarm_actions

  dimensions = {
    QueueName = aws_sqs_queue.triggers.name
  }
}

resource "aws_cloudwatch_metric_alarm" "triggers_dlq_visible_messages" {
  alarm_name          = "${local.lambda_name_prefix}-triggers-dlq-visible-messages"
  alarm_description   = "One or more trigger messages reached the dead-letter queue"
  comparison_operator = "GreaterThanOrEqualToThreshold"
  evaluation_periods  = 1
  datapoints_to_alarm = 1
  metric_name         = "ApproximateNumberOfMessagesVisible"
  namespace           = "AWS/SQS"
  period              = 60
  statistic           = "Maximum"
  threshold           = 1
  treat_missing_data  = "notBreaching"
  alarm_actions       = var.alarm_actions

  dimensions = {
    QueueName = aws_sqs_queue.triggers_dql.name
  }
}

# resource "aws_sqs_queue" "transactions_dql" {
#   name                        = "${local.lambda_name_prefix}-transactions-dlq.fifo"
#   fifo_queue                  = true
#   content_based_deduplication = true
#   deduplication_scope         = "queue"
#   visibility_timeout_seconds  = 120
#   message_retention_seconds   = 1209600
#   sqs_managed_sse_enabled     = false
# }

# resource "aws_sqs_queue" "transactions" {
#   name                        = "${local.lambda_name_prefix}-transactions.fifo"
#   fifo_queue                  = true
#   content_based_deduplication = true
#   deduplication_scope         = "queue"
#   visibility_timeout_seconds  = 60
#   message_retention_seconds   = 600
#   sqs_managed_sse_enabled     = false
#   redrive_policy = jsonencode({
#     deadLetterTargetArn = aws_sqs_queue.transactions_dql.arn
#     maxReceiveCount     = 10
#   })
# }
