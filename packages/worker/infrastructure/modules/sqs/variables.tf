
variable "project_name" {
  description = "The name of the project"
  type        = string
}

variable "environment" {
  description = "The deployment environment (e.g., dev, staging, prod)"
  type        = string
}

variable "alarm_actions" {
  description = "ARNs notified when an SQS alarm enters ALARM state"
  type        = list(string)
  default     = []
}

variable "oldest_message_age_alarm_seconds" {
  description = "Oldest trigger-message age that raises an alarm"
  type        = number
  default     = 300
}

variable "visible_messages_alarm_threshold" {
  description = "Visible trigger-message count that raises a backlog alarm"
  type        = number
  default     = 10
}
