locals {
  lambda_name_prefix = "${var.project_name}-${var.environment}"
}

resource "aws_sqs_queue" "triggers_dlq" {
  name = "${local.lambda_name_prefix}-triggers-dlq.fifo"

  fifo_queue                  = true
  content_based_deduplication = true
  visibility_timeout_seconds  = 120
  message_retention_seconds   = 86400
}

resource "aws_sqs_queue" "triggers" {
  name                        = "${local.lambda_name_prefix}-triggers.fifo"
  fifo_queue                  = true
  content_based_deduplication = true
  visibility_timeout_seconds  = 10
  message_retention_seconds   = 120
  redrive_policy = jsonencode({
    deadLetterTargetArn = aws_sqs_queue.triggers_dlq.arn
    maxReceiveCount     = 5
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
