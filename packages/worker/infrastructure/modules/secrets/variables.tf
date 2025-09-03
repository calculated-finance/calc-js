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

variable "chain_id" {
  description = "Chain ID for worker containers"
  type        = string
  default     = "PLACEHOLDER"
}


variable "signer_mnemonics" {
  description = "Comma separated of mnemonics for Lambda consumers (one per consumer). Leave empty to manage secrets externally."
  type        = string
  sensitive   = true
}
