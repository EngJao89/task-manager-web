import { db } from "./db"
import { users } from "./db/schema"
import { eq } from "drizzle-orm"
import bcrypt from "bcryptjs"
import { nanoid } from "nanoid"

export const drizzleAdapter = {
  async getUserByEmail(email: string) {
    const result = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1)

    if (result.length === 0) return null

    const user = result[0]
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      emailVerified: null,
      image: null,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    }
  },

  async getUserById(id: string) {
    const result = await db
      .select()
      .from(users)
      .where(eq(users.id, id))
      .limit(1)

    if (result.length === 0) return null

    const user = result[0]
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      emailVerified: null,
      image: null,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    }
  },

  async createUser(data: {
    email: string
    name?: string
    password: string
    emailVerified?: boolean
    image?: string
  }) {
    const hashedPassword = await bcrypt.hash(data.password, 10)
    const now = new Date()

    const result = await db
      .insert(users)
      .values({
        id: nanoid(),
        email: data.email,
        name: data.name || "",
        password: hashedPassword,
        createdAt: now,
        updatedAt: now,
      })
      .returning()

    const user = result[0]
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      emailVerified: data.emailVerified || false,
      image: data.image || null,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    }
  },

  async updateUser(id: string, data: Partial<{
    email: string
    name: string
    password: string
    emailVerified: boolean
    image: string
  }>) {
    const updateData: {
      updatedAt: Date
      email?: string
      name?: string
      password?: string
    } = {
      updatedAt: new Date(),
    }

    if (data.email) updateData.email = data.email
    if (data.name) updateData.name = data.name
    if (data.password) {
      updateData.password = await bcrypt.hash(data.password, 10)
    }

    const result = await db
      .update(users)
      .set(updateData)
      .where(eq(users.id, id))
      .returning()

    if (result.length === 0) return null

    const user = result[0]
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      emailVerified: false,
      image: null,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    }
  },

  async deleteUser(id: string) {
    await db.delete(users).where(eq(users.id, id))
  },

  async verifyPassword(email: string, password: string) {
    const result = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1)

    if (result.length === 0) return false

    return await bcrypt.compare(password, result[0].password)
  },
}
