import { z } from "zod"
import { router, protectedProcedure } from "../init"
import { tasks } from "@/lib/db/schema"
import { eq, and, desc } from "drizzle-orm"
import { nanoid } from "nanoid"

const taskStatusEnum = z.enum(["iniciado", "pendente", "finalizado"])

const createTaskSchema = z.object({
  title: z.string().min(1, "Título é obrigatório"),
  description: z.string().optional(),
  status: taskStatusEnum.default("pendente"),
})

const updateTaskSchema = z.object({
  id: z.string(),
  title: z.string().min(1, "Título é obrigatório").optional(),
  description: z.string().optional(),
  status: taskStatusEnum.optional(),
})

export const tasksRouter = router({
  create: protectedProcedure
    .input(createTaskSchema)
    .mutation(async ({ input, ctx }) => {
      try {
        if (!ctx.session) {
          throw new Error("Não autenticado")
        }

        const now = new Date()
        const newTask = await ctx.db
          .insert(tasks)
          .values({
            id: nanoid(),
            title: input.title,
            description: input.description && input.description.trim() !== "" ? input.description : null,
            status: input.status || "pendente",
            userId: ctx.session.user.id,
            createdAt: now,
            updatedAt: now,
          })
          .returning()

        if (!newTask[0]) {
          throw new Error("Erro ao criar task")
        }

        return {
          success: true,
          task: newTask[0],
        }
      } catch (error) {
        console.error("Create task error:", error)
        if (error instanceof Error) {
          throw error
        }
        throw new Error("Erro desconhecido ao criar task")
      }
    }),

  list: protectedProcedure.query(async ({ ctx }) => {
    if (!ctx.session) {
      throw new Error("Não autenticado")
    }

    const userTasks = await ctx.db
      .select()
      .from(tasks)
      .where(eq(tasks.userId, ctx.session.user.id))
      .orderBy(desc(tasks.createdAt))

    return {
      tasks: userTasks,
    }
  }),

  update: protectedProcedure
    .input(updateTaskSchema)
    .mutation(async ({ input, ctx }) => {
      try {
        if (!ctx.session) {
          throw new Error("Não autenticado")
        }

        const existingTask = await ctx.db
          .select()
          .from(tasks)
          .where(
            and(
              eq(tasks.id, input.id),
              eq(tasks.userId, ctx.session.user.id)
            )
          )
          .limit(1)

        if (existingTask.length === 0) {
          throw new Error("Task não encontrada")
        }

        const updateData: {
          title?: string
          description?: string | null
          status?: "iniciado" | "pendente" | "finalizado"
          updatedAt: Date
        } = {
          updatedAt: new Date(),
        }

        if (input.title) updateData.title = input.title
        if (input.description !== undefined) {
          updateData.description = input.description && input.description.trim() !== "" 
            ? input.description 
            : null
        }
        if (input.status) updateData.status = input.status

        const updatedTask = await ctx.db
          .update(tasks)
          .set(updateData)
          .where(eq(tasks.id, input.id))
          .returning()

        if (!updatedTask[0]) {
          throw new Error("Erro ao atualizar task")
        }

        return {
          success: true,
          task: updatedTask[0],
        }
      } catch (error) {
        console.error("Update task error:", error)
        if (error instanceof Error) {
          throw error
        }
        throw new Error("Erro desconhecido ao atualizar task")
      }
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input, ctx }) => {
      if (!ctx.session) {
        throw new Error("Não autenticado")
      }

      const existingTask = await ctx.db
        .select()
        .from(tasks)
        .where(
          and(
            eq(tasks.id, input.id),
            eq(tasks.userId, ctx.session.user.id)
          )
        )
        .limit(1)

      if (existingTask.length === 0) {
        throw new Error("Task não encontrada")
      }

      await ctx.db.delete(tasks).where(eq(tasks.id, input.id))

      return {
        success: true,
      }
    }),

  getStats: protectedProcedure.query(async ({ ctx }) => {
    if (!ctx.session) {
      throw new Error("Não autenticado")
    }

    const allTasks = await ctx.db
      .select()
      .from(tasks)
      .where(eq(tasks.userId, ctx.session.user.id))

    const stats = {
      total: allTasks.length,
      pendente: allTasks.filter((t) => t.status === "pendente").length,
      iniciado: allTasks.filter((t) => t.status === "iniciado").length,
      finalizado: allTasks.filter((t) => t.status === "finalizado").length,
    }

    return stats
  }),
})
