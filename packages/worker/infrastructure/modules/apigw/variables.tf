variable "project_name" {
  description = "Name of the project"
  type        = string
  default     = "calc"
}

variable "prices_lambda_invoke_arn" {
  description = "ARN of the prices Lambda function"
  type        = string
}

variable "prices_lambda_function_name" {
  description = "Name of the prices Lambda function"
  type        = string
}
