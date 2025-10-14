output "cloudfront_domain_name" {
  value = aws_cloudfront_distribution.api.domain_name
}

output "cloudfront_distribution_id" {
  value = aws_cloudfront_distribution.api.id
}
