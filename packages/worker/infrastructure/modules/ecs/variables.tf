variable "project_name" {
  description = "Name of the project"
  type        = string
  default     = "calc"
}

variable "environment" {
  description = "Environment (dev, staging, prod)"
  type        = string
  default     = "prod"
}

variable "aws_region" {
  description = "AWS region"
  type        = string
  default     = "ap-southeast-1"
}

variable "subnet_ids" {
  description = "List of subnet IDs for ECS tasks"
  type        = list(string)
}

variable "security_group_id" {
  description = "Security group ID for ECS tasks"
  type        = string
}

variable "container_image" {
  description = "Docker image URI for the worker containers"
  type        = string
}

variable "task_cpu" {
  description = "CPU for ECS tasks (256, 512, 1024, etc.)"
  type        = string
  default     = "256"
}

variable "task_memory" {
  description = "Memory for ECS tasks (512, 1024, 2048, etc.)"
  type        = string
  default     = "512"
}

variable "triggers_queue_url" {
  description = "URL of the SQS queue for the producer to write to"
  type        = string

}

variable "chain_id" {
  description = "Chain ID for worker containers"
  type        = string
  default     = "thorchain-stagenet-2"
}

variable "fetch_delay" {
  description = "Delay between fetch trigger calls"
  type        = string
  default     = "4000"
}

variable "triggers_queue_arn" {
  description = "ARN of the SQS triggers queue"
  type        = string
}
