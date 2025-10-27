resource "aws_ecs_cluster" "main" {
  name = "${var.project_name}-cluster"

  setting {
    name  = "containerInsights"
    value = "disabled"
  }

  tags = {
    Name        = "${var.project_name}-cluster"
    Environment = var.environment
    Project     = var.project_name
  }
}

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

resource "aws_iam_role_policy_attachment" "ecs_execution_role_policy" {
  role       = aws_iam_role.ecs_execution_role.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy"
}

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

resource "aws_iam_role_policy" "sqs_policy" {
  name = "${var.project_name}-ecs-sqs-policy"
  role = aws_iam_role.ecs_task_role.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "sqs:SendMessage"
        ]
        Resource = [
          var.triggers_queue_arn,
          var.transactions_queue_arn
        ]
      }
    ]
  })
}

resource "aws_iam_role_policy" "dynamodb_policy" {
  name = "${var.project_name}-ecs-dynamodb-policy"
  role = aws_iam_role.ecs_task_role.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "dynamodb:GetItem",
          "dynamodb:PutItem",
          "dynamodb:UpdateItem"
        ]
        Resource = [
          var.indexer_checkpoint_table_arn,
          var.events_table_arn,
          var.strategies_table_arn
        ]
      }
    ]
  })
}


resource "aws_cloudwatch_log_group" "scheduler" {
  name              = "/ecs/${var.project_name}-scheduler"
  retention_in_days = 7

  tags = {
    Name        = "${var.project_name}-scheduler-logs"
    Environment = var.environment
    Project     = var.project_name
  }
}

resource "aws_ecs_task_definition" "scheduler" {
  family                   = "${var.project_name}-scheduler"
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu                      = var.task_cpu
  memory                   = var.task_memory
  execution_role_arn       = aws_iam_role.ecs_execution_role.arn
  task_role_arn            = aws_iam_role.ecs_task_role.arn

  container_definitions = jsonencode([
    {
      name      = "scheduler"
      image     = var.container_image
      command   = ["./build/esm/runners/scheduler/app.js"]
      essential = true

      environment = [
        {
          name  = "CHAIN_ID"
          value = var.chain_id
        },
        {
          name  = "QUEUE_URL"
          value = var.triggers_queue_url
        },
        {
          name  = "FETCH_DELAY"
          value = var.fetch_delay
        }
      ]

      logConfiguration = {
        logDriver = "awslogs"
        options = {
          awslogs-group         = aws_cloudwatch_log_group.scheduler.name
          awslogs-region        = var.aws_region
          awslogs-stream-prefix = "scheduler"
        }
      }

      healthCheck = {
        command     = ["CMD-SHELL", "pgrep -f scheduler || exit 1"]
        interval    = 30
        timeout     = 5
        retries     = 3
        startPeriod = 60
      }
    }
  ])

  tags = {
    Name        = "${var.project_name}-scheduler-task"
    Environment = var.environment
    Project     = var.project_name
  }
}

resource "aws_ecs_service" "scheduler" {
  name            = "${var.project_name}-scheduler"
  cluster         = aws_ecs_cluster.main.id
  task_definition = aws_ecs_task_definition.scheduler.arn
  desired_count   = 1
  launch_type     = "FARGATE"

  network_configuration {
    subnets          = var.subnet_ids
    security_groups  = [var.security_group_id]
    assign_public_ip = true
  }

  tags = {
    Name        = "${var.project_name}-scheduler-service"
    Environment = var.environment
    Project     = var.project_name
  }
}


resource "aws_cloudwatch_log_group" "indexer" {
  name              = "/ecs/${var.project_name}-indexer"
  retention_in_days = 7

  tags = {
    Name        = "${var.project_name}-indexer-logs"
    Environment = var.environment
    Project     = var.project_name
  }
}

resource "aws_ecs_task_definition" "indexer" {
  family                   = "${var.project_name}-indexer"
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu                      = var.task_cpu
  memory                   = var.task_memory
  execution_role_arn       = aws_iam_role.ecs_execution_role.arn
  task_role_arn            = aws_iam_role.ecs_task_role.arn

  container_definitions = jsonencode([
    {
      name      = "indexer"
      image     = var.container_image
      command   = ["./build/esm/runners/indexer/app.js"]
      essential = true

      environment = [
        {
          name  = "CHAIN_ID"
          value = var.chain_id
        },
        {
          name  = "QUEUE_URL"
          value = var.transactions_queue_url
        },
        {
          name  = "FETCH_DELAY"
          value = var.fetch_delay
        },
        {
          name  = "CHECKPOINT_TABLE",
          value = var.indexer_checkpoint_table_name
        }
      ]

      logConfiguration = {
        logDriver = "awslogs"
        options = {
          awslogs-group         = aws_cloudwatch_log_group.indexer.name
          awslogs-region        = var.aws_region
          awslogs-stream-prefix = "indexer"
        }
      }

      healthCheck = {
        command     = ["CMD-SHELL", "pgrep -f indexer || exit 1"]
        interval    = 30
        timeout     = 5
        retries     = 3
        startPeriod = 60
      }
    }
  ])

  tags = {
    Name        = "${var.project_name}-indexer-task"
    Environment = var.environment
    Project     = var.project_name
  }
}

resource "aws_ecs_service" "indexer" {
  name            = "${var.project_name}-indexer"
  cluster         = aws_ecs_cluster.main.id
  task_definition = aws_ecs_task_definition.indexer.arn
  desired_count   = 1
  launch_type     = "FARGATE"

  network_configuration {
    subnets          = var.subnet_ids
    security_groups  = [var.security_group_id]
    assign_public_ip = true
  }

  tags = {
    Name        = "${var.project_name}-indexer-service"
    Environment = var.environment
    Project     = var.project_name
  }
}
