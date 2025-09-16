locals {
  lambda_name_prefix = "${var.project_name}-${var.environment}"
}

resource "aws_sqs_queue" "triggers_fifo_dql" {
  name                        = "${local.lambda_name_prefix}-triggers-fifo-dlq.fifo"
  fifo_queue                  = true
  content_based_deduplication = true
  deduplication_scope         = "queue"
  visibility_timeout_seconds  = 120
  message_retention_seconds   = 1209600
  sqs_managed_sse_enabled     = false
}

resource "aws_sqs_queue" "triggers_fifo" {
  name                        = "${local.lambda_name_prefix}-triggers-fifo.fifo"
  fifo_queue                  = true
  content_based_deduplication = true
  deduplication_scope         = "queue"
  visibility_timeout_seconds  = 20
  message_retention_seconds   = 200
  sqs_managed_sse_enabled     = false
  redrive_policy = jsonencode({
    deadLetterTargetArn = aws_sqs_queue.triggers_fifo_dql.arn
    maxReceiveCount     = 10
  })
}

resource "aws_sqs_queue" "triggers_dql" {
  name                       = "${local.lambda_name_prefix}-triggers-dlq"
  fifo_queue                 = false
  visibility_timeout_seconds = 120
  message_retention_seconds  = 1209600
  sqs_managed_sse_enabled    = false
}

resource "aws_sqs_queue" "triggers" {
  name                       = "${local.lambda_name_prefix}-triggers"
  fifo_queue                 = false
  visibility_timeout_seconds = 20
  message_retention_seconds  = 200
  sqs_managed_sse_enabled    = false

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
