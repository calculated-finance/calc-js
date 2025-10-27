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
    actions   = ["sqs:SendMessage", "sqs:ReceiveMessage", "sqs:DeleteMessage", "sqs:GetQueueAttributes", "sqs:ChangeMessageVisibility", "dynamodb:GetItem", "dynamodb:PutItem"]
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

data "archive_file" "executor_zip" {
  type        = "zip"
  source_dir  = "${path.module}/../../../dist/handlers/executor"
  output_path = "${path.module}/${basename(var.source_dir)}-executor.zip"
}

resource "aws_lambda_function" "executor" {
  count                          = length(var.signer_secret_arns)
  function_name                  = "${local.lambda_name_prefix}-executor-${count.index + 1}"
  role                           = aws_iam_role.lambda_role.arn
  runtime                        = "nodejs20.x"
  handler                        = "app.handler"
  filename                       = data.archive_file.executor_zip.output_path
  source_code_hash               = filebase64sha256(data.archive_file.executor_zip.output_path)
  timeout                        = 30
  memory_size                    = 512
  reserved_concurrent_executions = 1

  environment {
    variables = {
      CHAIN_ID   = var.chain_id
      SECRET_ARN = var.signer_secret_arns[count.index]
    }
  }
}

resource "aws_lambda_event_source_mapping" "executor_sqs" {
  count            = length(var.signer_secret_arns)
  event_source_arn = var.triggers_queue_arn
  function_name    = aws_lambda_function.executor[count.index].arn
  batch_size       = 10
}

data "archive_file" "counter_zip" {
  type        = "zip"
  source_dir  = "${path.module}/../../../dist/handlers/counter"
  output_path = "${path.module}/${basename(var.source_dir)}-counter.zip"
}

resource "aws_lambda_function" "counter" {
  function_name    = "${local.lambda_name_prefix}-counter"
  role             = aws_iam_role.lambda_role.arn
  runtime          = "nodejs20.x"
  handler          = "app.handler"
  filename         = data.archive_file.counter_zip.output_path
  source_code_hash = filebase64sha256(data.archive_file.counter_zip.output_path)
  timeout          = 10
  memory_size      = 128

  environment {
    variables = {
      CHAIN_ID = var.chain_id
    }
  }
}

resource "aws_cloudwatch_event_rule" "counter_schedule" {
  name                = "${local.lambda_name_prefix}-counter-schedule"
  schedule_expression = "rate(5 minutes)"
}

resource "aws_cloudwatch_event_target" "counter_target" {
  rule      = aws_cloudwatch_event_rule.counter_schedule.name
  target_id = "counter"
  arn       = aws_lambda_function.counter.arn
}

resource "aws_lambda_permission" "counter_events" {
  statement_id  = "AllowEventsInvoke"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.counter.function_name
  principal     = "events.amazonaws.com"
  source_arn    = aws_cloudwatch_event_rule.counter_schedule.arn
}

data "archive_file" "tvl_zip" {
  type        = "zip"
  source_dir  = "${path.module}/../../../dist/handlers/tvl"
  output_path = "${path.module}/${basename(var.source_dir)}-tvl.zip"
}

resource "aws_lambda_function" "tvl" {
  function_name    = "${local.lambda_name_prefix}-tvl"
  role             = aws_iam_role.lambda_role.arn
  runtime          = "nodejs20.x"
  handler          = "app.handler"
  filename         = data.archive_file.tvl_zip.output_path
  source_code_hash = filebase64sha256(data.archive_file.tvl_zip.output_path)
  timeout          = 60
  memory_size      = 128

  environment {
    variables = {
      CHAIN_ID          = var.chain_id
      COINGECKO_API_KEY = var.coingecko_api_key
    }
  }
}

resource "aws_cloudwatch_event_rule" "tvl_schedule" {
  name                = "${local.lambda_name_prefix}-tvl-schedule"
  schedule_expression = "rate(5 minutes)"
}

resource "aws_cloudwatch_event_target" "tvl_target" {
  rule      = aws_cloudwatch_event_rule.tvl_schedule.name
  target_id = "tvl"
  arn       = aws_lambda_function.tvl.arn
}

resource "aws_lambda_permission" "tvl_events" {
  statement_id  = "AllowEventsInvoke"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.tvl.function_name
  principal     = "events.amazonaws.com"
  source_arn    = aws_cloudwatch_event_rule.tvl_schedule.arn
}

data "archive_file" "prices_zip" {
  type        = "zip"
  source_dir  = "${path.module}/../../../dist/handlers/prices"
  output_path = "${path.module}/${basename(var.source_dir)}-prices.zip"
}

resource "aws_lambda_function" "prices" {
  function_name    = "${local.lambda_name_prefix}-prices"
  role             = aws_iam_role.lambda_role.arn
  runtime          = "nodejs20.x"
  handler          = "app.handler"
  filename         = data.archive_file.prices_zip.output_path
  source_code_hash = filebase64sha256(data.archive_file.prices_zip.output_path)
  timeout          = 60
  memory_size      = 128

  environment {
    variables = {
      COINGECKO_API_KEY = var.coingecko_api_key
    }
  }
}

data "archive_file" "sync_zip" {
  type        = "zip"
  source_dir  = "${path.module}/../../../dist/handlers/sync"
  output_path = "${path.module}/${basename(var.source_dir)}-sync.zip"
}

resource "aws_lambda_function" "sync" {
  function_name    = "${local.lambda_name_prefix}-sync"
  role             = aws_iam_role.lambda_role.arn
  runtime          = "nodejs20.x"
  handler          = "app.handler"
  filename         = data.archive_file.sync_zip.output_path
  source_code_hash = filebase64sha256(data.archive_file.sync_zip.output_path)
  timeout          = 60
  memory_size      = 128

  environment {
    variables = {
      EVENTS_TABLE     = var.events_table_name
      STRATEGIES_TABLE = var.strategies_table_name
    }
  }
}

resource "aws_lambda_event_source_mapping" "sync_sqs" {
  event_source_arn = var.transactions_queue_arn
  function_name    = aws_lambda_function.sync.arn
  batch_size       = 10
}
