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
  visibility_timeout_seconds  = 30
  message_retention_seconds   = 300
  sqs_managed_sse_enabled     = false
  redrive_policy = jsonencode({
    deadLetterTargetArn = aws_sqs_queue.triggers_dql.arn
    maxReceiveCount     = 10
  })
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
