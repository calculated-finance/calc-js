output "triggers_queue_arn" {
  description = "ARN of the SQS queue for strategy triggers to be executed"
  value       = aws_sqs_queue.triggers.arn
}

output "triggers_queue_url" {
  description = "URL of the SQS queue for strategy triggers to be executed"
  value       = aws_sqs_queue.triggers.id
}

output "transactions_queue_arn" {
  description = "ARN of the SQS queue for strategy transactions to be indexed"
  value       = aws_sqs_queue.transactions.arn
}

output "transactions_queue_url" {
  description = "URL of the SQS queue for strategy transactions to be indexed"
  value       = aws_sqs_queue.transactions.id
}
