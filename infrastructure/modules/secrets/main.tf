# Secrets Module for CALC Application
# Creates AWS Secrets Manager secret for storing sensitive environment variables

resource "aws_secretsmanager_secret" "worker_secrets" {
  name        = "${var.project_name}-worker-secrets"
  description = "Secrets for CALC worker containers"

  # Enable automatic rotation if needed in the future
  # rotation_lambda_arn = var.rotation_lambda_arn

  tags = {
    Name        = "${var.project_name}-worker-secrets"
    Environment = var.environment
    Project     = var.project_name
  }
}

# Secret version with placeholder values
# In production, these will be updated via GitHub Actions or manually
resource "aws_secretsmanager_secret_version" "worker_secrets" {
  secret_id = aws_secretsmanager_secret.worker_secrets.id

  # JSON format for multiple secrets
  secret_string = jsonencode({
    MNEMONIC = var.mnemonic_placeholder
    CHAIN_ID = var.chain_id_placeholder
  })

  lifecycle {
    ignore_changes = [secret_string]
  }
}
