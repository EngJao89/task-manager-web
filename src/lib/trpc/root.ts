import { router } from "./init"
import { authRouter } from "./routers/auth"
import { tasksRouter } from "./routers/tasks"
import { notificationsRouter } from "./routers/notifications"

export const appRouter = router({
  auth: authRouter,
  tasks: tasksRouter,
  notifications: notificationsRouter,
})

export type AppRouter = typeof appRouter
