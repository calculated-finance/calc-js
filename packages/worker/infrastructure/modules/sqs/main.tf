locals {
  lambda_name_prefix = "${var.project_name}-${var.environment}"
}

resource "aws_sqs_queue" "triggers" {
  name                        = "${local.lambda_name_prefix}-triggers.fifo"
  fifo_queue                  = true
  content_based_deduplication = true
  deduplication_scope         = "queue"
  visibility_timeout_seconds  = 20
  message_retention_seconds   = 60
  sqs_managed_sse_enabled     = false
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
