resource "aws_secretsmanager_secret" "worker_secret" {
  name        = "${var.project_name}-worker-secret"
  description = "Secrets for ${var.project_name} worker containers"
}

resource "aws_secretsmanager_secret_version" "worker_secret" {
  secret_id = aws_secretsmanager_secret.worker_secret.id

  secret_string = jsonencode({
    MNEMONIC = var.mnemonic
    CHAIN_ID = var.chain_id
  })

  lifecycle {
    ignore_changes = [secret_string]
  }
}
