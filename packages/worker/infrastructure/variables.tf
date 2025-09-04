variable "project_name" {
  description = "Name of the project"
  type        = string
  default     = "calc"
}

variable "environment" {
  description = "Environment (dev, staging, prod)"
  type        = string
  default     = "staging"
}

variable "aws_region" {
  description = "AWS region"
  type        = string
  default     = "ap-southeast-1"
}

variable "vpc_cidr" {
  description = "CIDR block for VPC"
  type        = string
  default     = "10.0.0.0/16"
}

variable "container_image" {
  description = "Docker image URI for the worker containers"
  type        = string
  default     = "placeholder-image-uri"
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

variable "signer_mnemonics" {
  description = "Comma delimited list of signer mnemonics"
  type        = string
  sensitive   = true
}

variable "chain_id" {
  description = "Chain ID for worker containers"
  type        = string
  default     = "thorchain-stagenet-2"
}
