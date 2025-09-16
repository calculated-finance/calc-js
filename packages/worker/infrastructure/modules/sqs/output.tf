output "triggers_fifo_queue_arn" {
  description = "ARN of the SQS queue for strategy triggers to be executed"
  value       = aws_sqs_queue.triggers_fifo.arn
}

output "triggers_fifo_queue_url" {
  description = "URL of the SQS queue for strategy triggers to be executed"
  value       = aws_sqs_queue.triggers_fifo.id
}

output "triggers_queue_arn" {
  description = "ARN of the SQS queue for strategy triggers to be executed"
  value       = aws_sqs_queue.triggers.arn
}

output "triggers_queue_url" {
  description = "URL of the SQS queue for strategy triggers to be executed"
  value       = aws_sqs_queue.triggers.id
}
