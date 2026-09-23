output "executor_function_names" {
  description = "Names of the executor Lambda functions"
  value       = aws_lambda_function.executor[*].function_name
}

output "prices_lambda_invoke_arn" {
  value = aws_lambda_function.prices.invoke_arn
}

output "prices_lambda_function_name" {
  value = aws_lambda_function.prices.function_name
}
