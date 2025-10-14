variable "project_name" {
  description = "Name of the project"
  type        = string
  default     = "calc"
}

variable "apigw_invoke_url" {
  description = "API Gateway endpoint (e.g. https://xxxxxx.execute-api.us-east-1.amazonaws.com/prod)"
  type        = string
}
