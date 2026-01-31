export type NotificationType = "created" | "edited"

export type Notification = {
  id: string
  userId: string
  type: NotificationType
  taskId: string
  taskTitle: string
  createdAt: Date | string
}

export type ExpiringTask = {
  id: string
  title: string
  expiresAt: Date | string
  status: string
}

export type ExpiringTaskItem = {
  id: string
  title: string
  expiresAt: Date | null
  status: string
}
