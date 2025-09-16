
variable "project_name" {
  description = "The name of the project"
  type        = string
}

variable "environment" {
  description = "The deployment environment (e.g., dev, staging, prod)"
  type        = string
}

variable "signer_secret_arns" {
  description = "List of ARNs for the signer secrets"
  type        = list(string)
}

variable "triggers_queue_arn" {
  description = "ARN of the SQS queue to trigger the Lambda function"
  type        = string
}

variable "triggers_fifo_queue_url" {
  description = "URL of the SQS FIFO queue to trigger the Lambda function"
  type        = string
}

variable "triggers_fifo_queue_arn" {
  description = "ARN of the SQS FIFO queue to trigger the Lambda function"
  type        = string
}

variable "chain_id" {
  description = "The ID of the blockchain network"
  type        = string
}

variable "source_dir" {
  description = "The source directory for the Lambda function code (Terraform zips it)"
  type        = string
}
