resource "aws_secretsmanager_secret" "worker_secrets" {
  name        = "${var.project_name}-worker-secrets"
  description = "Secrets for ${var.project_name} worker containers"

  tags = {
    Name        = "${var.project_name}-worker-secrets"
    Environment = var.environment
    Project     = var.project_name
  }
}

resource "aws_secretsmanager_secret_version" "worker_secrets" {
  secret_id = aws_secretsmanager_secret.worker_secrets.id

  secret_string = jsonencode({
    MNEMONIC = var.mnemonic
    CHAIN_ID = var.chain_id
  })

  lifecycle {
    ignore_changes = [secret_string]
  }
}
