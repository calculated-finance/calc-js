output "cluster_id" {
  description = "ID of the ECS cluster"
  value       = aws_ecs_cluster.main.id
}

output "cluster_name" {
  description = "Name of the ECS cluster"
  value       = aws_ecs_cluster.main.name
}

output "scheduler_service_name" {
  description = "Name of the fetch triggers ECS service"
  value       = aws_ecs_service.scheduler.name
}

output "scheduler_log_group_name" {
  description = "Name of the scheduler CloudWatch log group"
  value       = aws_cloudwatch_log_group.scheduler.name
}

output "indexer_service_name" {
  description = "Name of the indexer ECS service"
  value       = aws_ecs_service.indexer.name
}

output "indexer_log_group_name" {
  description = "Name of the indexer CloudWatch log group"
  value       = aws_cloudwatch_log_group.indexer.name
}
