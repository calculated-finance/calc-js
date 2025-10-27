output "signer_secret_arns" {
  description = "ARNs of signer mnemonics for Lambda executors (ordered)"
  value       = [for s in aws_secretsmanager_secret.signer : s.arn]
}
