output "dashboard_arn" {
  description = "ARN of the Terraform-managed CloudWatch dashboard"
  value       = aws_cloudwatch_dashboard.main.dashboard_arn
}

output "dashboard_name" {
  description = "Name of the Terraform-managed CloudWatch dashboard"
  value       = aws_cloudwatch_dashboard.main.dashboard_name
}
