output "cluster_id" {
  description = "ID of the ECS cluster"
  value       = aws_ecs_cluster.main.id
}

output "cluster_name" {
  description = "Name of the ECS cluster"
  value       = aws_ecs_cluster.main.name
}

output "execute_triggers_service_name" {
  description = "Name of the execute triggers ECS service"
  value       = aws_ecs_service.execute_triggers.name
}

output "sync_transactions_service_name" {
  description = "Name of the sync transactions ECS service"
  value       = aws_ecs_service.sync_transactions.name
}

output "log_group_name" {
  description = "Name of the CloudWatch log group"
  value       = aws_cloudwatch_log_group.workers.name
}
