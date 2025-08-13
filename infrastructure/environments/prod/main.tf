# CALC Production Infrastructure
# Main Terraform configuration that ties all modules together

terraform {
  required_version = ">= 1.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }

  # Add backend configuration for state management
  # backend "s3" {
  #   bucket = "calc-terraform-state"
  #   key    = "prod/terraform.tfstate"
  #   region = "ap-southeast-1"
  # }
}

# Configure AWS Provider
provider "aws" {
  region = var.aws_region

  default_tags {
    tags = {
      Project     = var.project_name
      Environment = var.environment
      ManagedBy   = "Terraform"
    }
  }
}

# VPC Module
module "vpc" {
  source = "../../modules/vpc"

  project_name = var.project_name
  environment  = var.environment
  vpc_cidr     = var.vpc_cidr
}

# Secrets Module
module "secrets" {
  source = "../../modules/secrets"

  project_name = var.project_name
  environment  = var.environment
}

# ECR Module
module "ecr" {
  source = "../../modules/ecr"

  project_name = var.project_name
  environment  = var.environment
}

# ECS Module
module "ecs" {
  source = "../../modules/ecs"

  project_name      = var.project_name
  environment       = var.environment
  aws_region        = var.aws_region
  subnet_ids        = module.vpc.public_subnet_ids
  security_group_id = module.vpc.security_group_id
  container_image   = var.container_image
  secrets_arn       = module.secrets.secret_arn
  task_cpu          = var.task_cpu
  task_memory       = var.task_memory
}
