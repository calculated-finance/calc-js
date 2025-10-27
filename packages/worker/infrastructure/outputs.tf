output "vpc_id" {
  description = "ID of the VPC"
  value       = module.vpc.vpc_id
}

output "ecr_repository_url" {
  description = "URL of the ECR repository"
  value       = module.ecr.repository_url
}

output "ecs_cluster_name" {
  description = "Name of the ECS cluster"
  value       = module.ecs.cluster_name
}

output "scheduler_service_name" {
  description = "Name of the scheduler ECS service"
  value       = module.ecs.scheduler_service_name
}

output "cloudwatch_log_group" {
  description = "Name of the scheduler CloudWatch log group"
  value       = module.ecs.scheduler_log_group_name
}

output "indexer_service_name" {
  description = "Name of the indexer ECS service"
  value       = module.ecs.indexer_service_name
}

output "cloudwatch_log_group" {
  description = "Name of the indexer CloudWatch log group"
  value       = module.ecs.indexer_log_group_name
}
