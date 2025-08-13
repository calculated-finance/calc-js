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

variable "mnemonic_placeholder" {
  description = "Placeholder value for mnemonic (will be updated via GitHub Actions)"
  type        = string
  default     = "PLACEHOLDER_MNEMONIC_TO_BE_UPDATED"
  sensitive   = true
}

variable "chain_id_placeholder" {
  description = "Placeholder value for chain ID"
  type        = string
  default     = "PLACEHOLDER_CHAIN_ID"
}
