variable "chain_id" {
  description = "Chain ID represented by custom dashboard metrics"
  type        = string
}

variable "cluster_name" {
  description = "ECS cluster monitored by the dashboard"
  type        = string
}

variable "dashboard_name" {
  description = "CloudWatch dashboard name"
  type        = string
}

variable "executor_function_names" {
  description = "Executor Lambda function names monitored by the dashboard"
  type        = list(string)
}

variable "region" {
  description = "AWS region containing the monitored resources"
  type        = string
}

variable "scheduler_service_name" {
  description = "ECS scheduler service monitored by the dashboard"
  type        = string
}

variable "triggers_queue_name" {
  description = "SQS trigger queue monitored by the dashboard"
  type        = string
}
