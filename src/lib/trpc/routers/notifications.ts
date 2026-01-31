import { router, protectedProcedure } from "../init"
import { notifications } from "@/lib/db/schema"
import { eq, desc } from "drizzle-orm"

export const notificationsRouter = router({
  list: protectedProcedure.query(async ({ ctx }) => {
    if (!ctx.session) {
      throw new Error("Não autenticado")
    }

    const list = await ctx.db
      .select()
      .from(notifications)
      .where(eq(notifications.userId, ctx.session.user.id))
      .orderBy(desc(notifications.createdAt))
      .limit(50)

    return { notifications: list }
  }),
})
