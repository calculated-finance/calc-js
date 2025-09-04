locals {
  lambda_name_prefix = "${var.project_name}-${var.environment}"
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

resource "aws_iam_role" "lambda_role" {
  name               = "${local.lambda_name_prefix}-lambda-role"
  assume_role_policy = data.aws_iam_policy_document.lambda_assume.json
}

data "aws_iam_policy_document" "lambda_policy" {
  statement {
    sid       = "Logs"
    actions   = ["logs:CreateLogGroup", "logs:CreateLogStream", "logs:PutLogEvents"]
    resources = ["*"]
  }

  statement {
    sid       = "SqsAccess"
    actions   = ["sqs:SendMessage", "sqs:ReceiveMessage", "sqs:DeleteMessage", "sqs:GetQueueAttributes", "sqs:ChangeMessageVisibility"]
    resources = [var.triggers_queue_arn]
  }

  statement {
    sid       = "SecretsRead"
    actions   = ["secretsmanager:GetSecretValue"]
    resources = var.signer_secret_arns
  }
}

resource "aws_iam_policy" "lambda_policy" {
  name   = "${local.lambda_name_prefix}-lambda-policy"
  policy = data.aws_iam_policy_document.lambda_policy.json
}

resource "aws_iam_role_policy_attachment" "lambda_attach" {
  role       = aws_iam_role.lambda_role.name
  policy_arn = aws_iam_policy.lambda_policy.arn
}

data "archive_file" "handler_zip" {
  type        = "zip"
  source_dir  = "${path.module}/../../../dist/consumer"
  output_path = "${path.module}/${basename(var.source_dir)}.zip"
}

resource "aws_lambda_function" "consumer" {
  count            = length(var.signer_secret_arns)
  function_name    = "${local.lambda_name_prefix}-consumer-${count.index + 1}"
  role             = aws_iam_role.lambda_role.arn
  runtime          = "nodejs20.x"
  handler          = "consumer.handler"
  filename         = "${path.module}/${basename(var.source_dir)}.zip"
  source_code_hash = filebase64sha256("${path.module}/${basename(var.source_dir)}.zip")
  timeout          = 20
  memory_size      = 512

  environment {
    variables = {
      CHAIN_ID   = var.chain_id
      SECRET_ARN = var.signer_secret_arns[count.index]
    }
  }
}

resource "aws_lambda_event_source_mapping" "consumer_sqs" {
  count                              = length(var.signer_secret_arns)
  event_source_arn                   = var.triggers_queue_arn
  function_name                      = aws_lambda_function.consumer[count.index].arn
  batch_size                         = 10
  maximum_batching_window_in_seconds = 10
  function_response_types            = ["ReportBatchItemFailures"]
}
