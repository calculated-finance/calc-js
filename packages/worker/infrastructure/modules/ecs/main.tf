# ECS Module for CALC Workers
# Creates Fargate cluster with 2 background worker services

# ECS Cluster
resource "aws_ecs_cluster" "main" {
  name = "${var.project_name}-cluster"

  setting {
    name  = "containerInsights"
    value = "disabled" # Keep costs minimal
  }

  tags = {
    Name        = "${var.project_name}-cluster"
    Environment = var.environment
    Project     = var.project_name
  }
}

# ECS Task Execution Role
resource "aws_iam_role" "ecs_execution_role" {
  name = "${var.project_name}-ecs-execution-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "ecs-tasks.amazonaws.com"
        }
      }
    ]
  })

  tags = {
    Name        = "${var.project_name}-ecs-execution-role"
    Environment = var.environment
    Project     = var.project_name
  }
}

# Attach basic ECS execution policy
resource "aws_iam_role_policy_attachment" "ecs_execution_role_policy" {
  role       = aws_iam_role.ecs_execution_role.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy"
}

# Policy for ECS execution role to access Secrets Manager
resource "aws_iam_role_policy" "execution_secrets_policy" {
  name = "${var.project_name}-execution-secrets-policy"
  role = aws_iam_role.ecs_execution_role.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "secretsmanager:GetSecretValue"
        ]
        Resource = [
          "arn:aws:secretsmanager:${var.aws_region}:*:secret:${var.project_name}-worker-secret*"
        ]
      }
    ]
  })
}

# ECS Task Role (for accessing AWS services from within containers)
resource "aws_iam_role" "ecs_task_role" {
  name = "${var.project_name}-ecs-task-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "ecs-tasks.amazonaws.com"
        }
      }
    ]
  })

  tags = {
    Name        = "${var.project_name}-ecs-task-role"
    Environment = var.environment
    Project     = var.project_name
  }
}

# Policy for accessing Secrets Manager
resource "aws_iam_role_policy" "secrets_policy" {
  name = "${var.project_name}-secrets-policy"
  role = aws_iam_role.ecs_task_role.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "secretsmanager:GetSecretValue",
          "secretsmanager:DescribeSecret"
        ]
        Resource = [
          "arn:aws:secretsmanager:${var.aws_region}:*:secret:${var.project_name}-worker-secret*"
        ]
      }
    ]
  })
}

# CloudWatch Log Group
resource "aws_cloudwatch_log_group" "workers" {
  name              = "/ecs/${var.project_name}-workers"
  retention_in_days = 7 # Keep costs minimal

  tags = {
    Name        = "${var.project_name}-workers-logs"
    Environment = var.environment
    Project     = var.project_name
  }
}

# Task Definition for Execute Triggers Worker
resource "aws_ecs_task_definition" "execute_triggers" {
  family                   = "${var.project_name}-execute-triggers"
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu                      = var.task_cpu    # 256 (0.25 vCPU) - minimal
  memory                   = var.task_memory # 512 (0.5 GB) - minimal
  execution_role_arn       = aws_iam_role.ecs_execution_role.arn
  task_role_arn            = aws_iam_role.ecs_task_role.arn

  container_definitions = jsonencode([
    {
      name  = "execute-triggers"
      image = var.container_image

      # Override default command to run execute-triggers
      command = ["dumb-init", "./scripts/start-execute-triggers.sh"]

      # Essential - if this container stops, restart the task
      essential = true

      # Environment variables from Secrets Manager
      secrets = [
        {
          name      = "MNEMONIC"
          valueFrom = "${var.secrets_arn}:MNEMONIC::"
        },
        {
          name      = "CHAIN_ID"
          valueFrom = "${var.secrets_arn}:CHAIN_ID::"
        }
      ]

      # Logging
      logConfiguration = {
        logDriver = "awslogs"
        options = {
          awslogs-group         = aws_cloudwatch_log_group.workers.name
          awslogs-region        = var.aws_region
          awslogs-stream-prefix = "execute-triggers"
        }
      }

      # Health check (optional)
      healthCheck = {
        command     = ["CMD-SHELL", "pgrep -f execute-triggers || exit 1"]
        interval    = 30
        timeout     = 5
        retries     = 3
        startPeriod = 60
      }
    }
  ])

  tags = {
    Name        = "${var.project_name}-execute-triggers-task"
    Environment = var.environment
    Project     = var.project_name
  }
}

# Task Definition for Sync Transactions Worker
resource "aws_ecs_task_definition" "sync_transactions" {
  family                   = "${var.project_name}-sync-transactions"
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu                      = var.task_cpu
  memory                   = var.task_memory
  execution_role_arn       = aws_iam_role.ecs_execution_role.arn
  task_role_arn            = aws_iam_role.ecs_task_role.arn

  container_definitions = jsonencode([
    {
      name  = "sync-transactions"
      image = var.container_image

      # Override default command to run sync-transactions
      command = ["dumb-init", "./scripts/start-sync-transactions.sh"]

      essential = true

      secrets = [
        {
          name      = "MNEMONIC"
          valueFrom = "${var.secrets_arn}:MNEMONIC::"
        },
        {
          name      = "CHAIN_ID"
          valueFrom = "${var.secrets_arn}:CHAIN_ID::"
        }
      ]

      logConfiguration = {
        logDriver = "awslogs"
        options = {
          awslogs-group         = aws_cloudwatch_log_group.workers.name
          awslogs-region        = var.aws_region
          awslogs-stream-prefix = "sync-transactions"
        }
      }

      healthCheck = {
        command     = ["CMD-SHELL", "pgrep -f sync-transactions || exit 1"]
        interval    = 30
        timeout     = 5
        retries     = 3
        startPeriod = 60
      }
    }
  ])

  tags = {
    Name        = "${var.project_name}-sync-transactions-task"
    Environment = var.environment
    Project     = var.project_name
  }
}

# ECS Service for Execute Triggers
resource "aws_ecs_service" "execute_triggers" {
  name            = "${var.project_name}-execute-triggers"
  cluster         = aws_ecs_cluster.main.id
  task_definition = aws_ecs_task_definition.execute_triggers.arn
  desired_count   = 1 # Single instance - no autoscaling
  launch_type     = "FARGATE"

  network_configuration {
    subnets          = var.subnet_ids
    security_groups  = [var.security_group_id]
    assign_public_ip = true # Required for Fargate to pull images
  }

  # ECS will automatically restart stopped tasks by default

  tags = {
    Name        = "${var.project_name}-execute-triggers-service"
    Environment = var.environment
    Project     = var.project_name
  }
}

# ECS Service for Sync Transactions
resource "aws_ecs_service" "sync_transactions" {
  name            = "${var.project_name}-sync-transactions"
  cluster         = aws_ecs_cluster.main.id
  task_definition = aws_ecs_task_definition.sync_transactions.arn
  desired_count   = 1
  launch_type     = "FARGATE"

  network_configuration {
    subnets          = var.subnet_ids
    security_groups  = [var.security_group_id]
    assign_public_ip = true
  }

  # ECS will automatically restart stopped tasks by default

  tags = {
    Name        = "${var.project_name}-sync-transactions-service"
    Environment = var.environment
    Project     = var.project_name
  }
}
