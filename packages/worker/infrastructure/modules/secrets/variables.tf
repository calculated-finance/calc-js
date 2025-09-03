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

variable "mnemonic" {
  description = "Mnemonic for worker containers"
  type        = string
  default     = "PLACEHOLDER"
  sensitive   = true
}

variable "chain_id" {
  description = "Chain ID for worker containers"
  type        = string
  default     = "PLACEHOLDER"
}
