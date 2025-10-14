locals {
  apigw_domain = replace(var.apigw_invoke_url, "https://", "")
}

resource "aws_cloudfront_cache_policy" "all_query" {
  name = "${var.project_name}-cache-all-query"
  parameters_in_cache_key_and_forwarded_to_origin {
    enable_accept_encoding_brotli = true
    enable_accept_encoding_gzip   = true

    headers_config {
      header_behavior = "none"
    }
    cookies_config {
      cookie_behavior = "none"
    }
    query_strings_config {
      query_string_behavior = "all"
    }
  }
  default_ttl = 120
  max_ttl     = 300
  min_ttl     = 0
}

resource "aws_cloudfront_origin_request_policy" "all_query" {
  name = "${var.project_name}-originreq-all-query"
  cookies_config { cookie_behavior = "none" }
  headers_config {
    header_behavior = "whitelist"
    headers {
      items = ["Origin", "Access-Control-Request-Method", "Access-Control-Request-Headers"]
    }
  }
  query_strings_config { query_string_behavior = "all" }
}

resource "aws_cloudfront_distribution" "api" {
  enabled         = true
  comment         = "${var.project_name} cf → apigw"
  is_ipv6_enabled = true
  http_version    = "http2"


  origin {
    domain_name = local.apigw_domain
    origin_id   = "apigw-origin"

    custom_origin_config {
      http_port                = 80
      https_port               = 443
      origin_protocol_policy   = "https-only"
      origin_keepalive_timeout = 30
      origin_read_timeout      = 30
      origin_ssl_protocols     = ["TLSv1.2"]
    }
  }

  default_cache_behavior {
    target_origin_id       = "apigw-origin"
    viewer_protocol_policy = "redirect-to-https"

    allowed_methods = ["GET", "HEAD", "OPTIONS"]
    cached_methods  = ["GET", "HEAD", "OPTIONS"]

    cache_policy_id          = aws_cloudfront_cache_policy.all_query.id
    origin_request_policy_id = aws_cloudfront_origin_request_policy.all_query.id
    compress                 = true
  }

  viewer_certificate {
    cloudfront_default_certificate = true
  }

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  price_class = "PriceClass_100"
}

