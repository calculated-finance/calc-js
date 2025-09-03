terraform {
  required_version = ">= 1.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }

  backend "s3" {
    key            = "terraform.tfstate"
    region         = "ap-southeast-1"
    dynamodb_table = "terraform-state-locks"
    encrypt        = true
  }
}

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

module "vpc" {
  source = "./modules/vpc"

  project_name = var.project_name
  environment  = var.environment
  vpc_cidr     = var.vpc_cidr
}

module "secrets" {
  source = "./modules/secrets"

  project_name     = var.project_name
  environment      = var.environment
  chain_id         = var.chain_id
  signer_mnemonics = var.signer_mnemonics
}

module "sqs" {
  source = "./modules/sqs"

  project_name = var.project_name
  environment  = var.environment
}

module "ecr" {
  source = "./modules/ecr"

  project_name = var.project_name
  environment  = var.environment
}

module "ecs" {
  source = "./modules/ecs"

  project_name      = var.project_name
  environment       = var.environment
  aws_region        = var.aws_region
  subnet_ids        = module.vpc.public_subnet_ids
  security_group_id = module.vpc.security_group_id
  container_image   = var.container_image
  secrets_arn       = module.secrets.secret_arn
  task_cpu          = var.task_cpu
  task_memory       = var.task_memory
  queue_url         = module.sqs.triggers_queue_url
}

module "lambda" {
  source = "./modules/lambda"

  project_name       = var.project_name
  environment        = var.environment
  signer_secret_arns = module.secrets.signer_secret_arns
  chain_id           = var.chain_id
  triggers_queue_arn = module.sqs.triggers_queue_arn
}
