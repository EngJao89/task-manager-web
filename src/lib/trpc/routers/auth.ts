import { z } from "zod"
import { router, publicProcedure, protectedProcedure } from "../init"
import { users } from "@/lib/db/schema"
import { eq, desc } from "drizzle-orm"
import { nanoid } from "nanoid"
import bcrypt from "bcryptjs"
import { createSession } from "@/lib/session"

const signUpSchema = z.object({
  email: z.string().email("Email inválido"),
  name: z.string().min(2, "Nome deve ter no mínimo 2 caracteres"),
  password: z.string().min(6, "A senha deve ter no mínimo 6 caracteres"),
})

const signInSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "A senha deve ter no mínimo 6 caracteres"),
})

export const authRouter = router({
  signUp: publicProcedure
    .input(signUpSchema)
    .mutation(async ({ input, ctx }) => {
      try {
        const existingUser = await ctx.db
          .select()
          .from(users)
          .where(eq(users.email, input.email))
          .limit(1)

        if (existingUser.length > 0) {
          throw new Error("Email já está em uso")
        }

        const hashedPassword = await bcrypt.hash(input.password, 10)

        const now = new Date()
        const newUser = await ctx.db
          .insert(users)
          .values({
            id: nanoid(),
            email: input.email,
            name: input.name,
            password: hashedPassword,
            createdAt: now,
            updatedAt: now,
          })
          .returning()

        if (!newUser[0]) {
          throw new Error("Erro ao criar usuário")
        }

        return {
          success: true,
          user: {
            id: newUser[0].id,
            email: newUser[0].email,
            name: newUser[0].name,
          },
        }
      } catch (error) {
        console.error("SignUp error:", error)
        if (error instanceof Error) {
          throw error
        }
        throw new Error("Erro desconhecido ao criar conta")
      }
    }),

  signIn: publicProcedure
    .input(signInSchema)
    .mutation(async ({ input, ctx }) => {
      try {
        const user = await ctx.db
          .select()
          .from(users)
          .where(eq(users.email, input.email))
          .limit(1)

        if (user.length === 0) {
          throw new Error("Email ou senha incorretos")
        }

        const isValid = await bcrypt.compare(input.password, user[0].password)

        if (!isValid) {
          throw new Error("Email ou senha incorretos")
        }

        const token = await createSession(user[0].id)

        await ctx.setCookie("session-token", token, { maxAge: 60 * 60 * 24 * 7 })

        return {
          success: true,
          user: {
            id: user[0].id,
            email: user[0].email,
            name: user[0].name,
          },
        }
      } catch (error) {
        console.error("SignIn error:", error)
        if (error instanceof Error) {
          throw error
        }
        throw new Error("Erro desconhecido ao fazer login")
      }
    }),

  getCurrentUser: protectedProcedure.query(async ({ ctx }) => {
    return {
      user: ctx.session.user,
    }
  }),

  signOut: protectedProcedure.mutation(async ({ ctx }) => {
    const cookieStore = await import("next/headers").then((m) => m.cookies())
    const token = cookieStore.get("session-token")?.value

    if (token) {
      const { deleteSession } = await import("@/lib/session")
      await deleteSession(token)
    }

    await ctx.setCookie("session-token", "", { maxAge: 0 })

    return { success: true }
  }),

  list: protectedProcedure.query(async ({ ctx }) => {
    try {
      const allUsers = await ctx.db
        .select({
          id: users.id,
          name: users.name,
          email: users.email,
          createdAt: users.createdAt,
        })
        .from(users)
        .orderBy(desc(users.createdAt))

      return allUsers
    } catch (error) {
      console.error("List users error:", error)
      throw new Error("Erro ao buscar usuários")
    }
  }),
})
