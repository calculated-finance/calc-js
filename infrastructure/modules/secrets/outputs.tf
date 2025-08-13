output "secret_arn" {
  description = "ARN of the secrets manager secret"
  value       = aws_secretsmanager_secret.worker_secrets.arn
}

output "secret_name" {
  description = "Name of the secrets manager secret"
  value       = aws_secretsmanager_secret.worker_secrets.name
}
