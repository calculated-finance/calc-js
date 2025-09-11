locals {
  lambda_name_prefix = "${var.project_name}-${var.environment}"
}

resource "aws_sqs_queue" "triggers_dql" {
  name                        = "${local.lambda_name_prefix}-triggers-dlq.fifo"
  fifo_queue                  = true
  content_based_deduplication = true
  deduplication_scope         = "queue"
  visibility_timeout_seconds  = 120
  receive_wait_time_seconds   = 3
  message_retention_seconds   = 1209600
  sqs_managed_sse_enabled     = false
}

resource "aws_sqs_queue" "triggers" {
  name                        = "${local.lambda_name_prefix}-triggers.fifo"
  fifo_queue                  = true
  content_based_deduplication = true
  deduplication_scope         = "queue"
  visibility_timeout_seconds  = 20
  message_retention_seconds   = 200
  receive_wait_time_seconds   = 3
  sqs_managed_sse_enabled     = false
  redrive_policy = jsonencode({
    deadLetterTargetArn = aws_sqs_queue.triggers_dql.arn
    maxReceiveCount     = 10
  })
}

data "aws_iam_policy_document" "lambda_assume" {
  statement {
    actions = ["sts:AssumeRole"]
    principals {
      type        = "Service"
      identifiers = ["lambda.amazonaws.com"]
    }
  }
}
