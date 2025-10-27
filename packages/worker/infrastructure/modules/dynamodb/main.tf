resource "aws_dynamodb_table" "indexer_checkpoint" {
  name         = "${var.project_name}-${var.environment}-indexer-checkpoint"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "chain_id"

  attribute {
    name = "chain_id"
    type = "S"
  }
}

resource "aws_dynamodb_table" "strategies" {
  name         = "${var.project_name}-${var.environment}-strategies"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "strategy_address"

  attribute {
    name = "strategy_address"
    type = "S"
  }

  global_secondary_index {
    name            = "strategy_updated_at"
    hash_key        = "strategy_address"
    range_key       = "updated_at"
    projection_type = "ALL"
  }
}

resource "aws_dynamodb_table" "totals" {
  name         = "${var.project_name}-${var.environment}-totals"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "key"

  attribute {
    name = "key"
    type = "S"
  }
}

resource "aws_dynamodb_table" "events" {
  name         = "${var.project_name}-${var.environment}-events"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "strategy_address"
  range_key    = "block_height"

  attribute {
    name = "strategy_address"
    type = "S"
  }

  attribute {
    name = "block_height"
    type = "N"
  }
}

output "indexer_checkpoint_table_name" {
  value = aws_dynamodb_table.indexer_checkpoint.name
}

output "indexer_checkpoint_table_arn" {
  value = aws_dynamodb_table.indexer_checkpoint.arn
}

output "strategies_table_name" {
  value = aws_dynamodb_table.strategies.name
}

output "strategies_table_arn" {
  value = aws_dynamodb_table.strategies.arn
}

output "totals_table_name" {
  value = aws_dynamodb_table.totals.name
}

output "totals_table_arn" {
  value = aws_dynamodb_table.totals.arn
}

output "events_table_name" {
  value = aws_dynamodb_table.events.name
}

output "events_table_arn" {
  value = aws_dynamodb_table.events.arn
}
