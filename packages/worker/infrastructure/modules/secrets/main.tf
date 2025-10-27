locals {
  signer_mnemonics = split(",", var.signer_mnemonics)
}

resource "aws_secretsmanager_secret" "signer" {
  count       = length(local.signer_mnemonics)
  name        = "${var.project_name}-${var.environment}-signer-${count.index + 1}"
  description = "Signer mnemonic for ${var.project_name} ${var.environment} executor ${count.index + 1}"
}

resource "aws_secretsmanager_secret_version" "signer" {
  count     = length(local.signer_mnemonics)
  secret_id = aws_secretsmanager_secret.signer[count.index].id

  secret_string = jsonencode({
    MNEMONIC = local.signer_mnemonics[count.index]
  })

  lifecycle {
    ignore_changes = [secret_string]
  }
}
