import { router } from "./init"
import { authRouter } from "./routers/auth"
import { tasksRouter } from "./routers/tasks"

export const appRouter = router({
  auth: authRouter,
  tasks: tasksRouter,
})

export type AppRouter = typeof appRouter
