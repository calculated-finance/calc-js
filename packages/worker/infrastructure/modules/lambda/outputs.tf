output "prices_lambda_invoke_arn" {
  value = aws_lambda_function.prices.invoke_arn
}

output "prices_lambda_function_name" {
  value = aws_lambda_function.prices.function_name
}
