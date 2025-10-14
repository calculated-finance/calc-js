resource "aws_apigatewayv2_api" "http" {
  name          = "${var.project_name}-api"
  protocol_type = "HTTP"
}

resource "aws_apigatewayv2_integration" "lambda" {
  api_id                 = aws_apigatewayv2_api.http.id
  integration_type       = "AWS_PROXY"
  integration_uri        = var.prices_lambda_invoke_arn
  payload_format_version = "2.0"
  timeout_milliseconds   = 10000
}

# Route: GET /cg/{proxy+}
resource "aws_apigatewayv2_route" "cg_get" {
  api_id    = aws_apigatewayv2_api.http.id
  route_key = "GET /cg/{proxy+}"
  target    = "integrations/${aws_apigatewayv2_integration.lambda.id}"
}

# Preflight handled by API GW (optional; you can also do it in Lambda)
resource "aws_apigatewayv2_route" "cg_options" {
  api_id    = aws_apigatewayv2_api.http.id
  route_key = "OPTIONS /cg/{proxy+}"
  target    = "integrations/${aws_apigatewayv2_integration.lambda.id}"
}

# Stage with CORS (allow only your origins)
resource "aws_apigatewayv2_stage" "default" {
  api_id      = aws_apigatewayv2_api.http.id
  name        = "$default"
  auto_deploy = true

  access_log_settings {
    destination_arn = aws_cloudwatch_log_group.api_gw.arn
    format = jsonencode({
      requestId = "$context.requestId",
      routeKey  = "$context.routeKey",
      status    = "$context.status",
      ip        = "$context.identity.sourceIp",
      ua        = "$context.identity.userAgent",
      error     = "$context.error.message"
    })
  }

  default_route_settings {
    detailed_metrics_enabled = true
  }
}

resource "aws_cloudwatch_log_group" "api_gw" {
  name              = "/aws/apigwv2/${var.project_name}"
  retention_in_days = 14
}

# Permission for API GW to invoke Lambda
resource "aws_lambda_permission" "apigw_invoke" {
  statement_id  = "AllowAPIGWInvoke"
  action        = "lambda:InvokeFunction"
  function_name = var.prices_lambda_invoke_arn
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_apigatewayv2_api.http.execution_arn}/*/*"
}
