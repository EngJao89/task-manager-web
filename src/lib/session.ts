import { SignJWT, jwtVerify } from "jose"
import { cookies } from "next/headers"
import { db } from "./db"
import { sessions, users } from "./db/schema"
import { eq, and, gt } from "drizzle-orm"
import { nanoid } from "nanoid"

const secret = new TextEncoder().encode(
  process.env.JWT_SECRET || "your-secret-key-change-in-production"
)

export async function createSession(userId: string) {
  const token = await new SignJWT({ userId })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secret)

  const expiresAt = new Date()
  expiresAt.setDate(expiresAt.getDate() + 7)

  const sessionId = nanoid()

  await db.insert(sessions).values({
    id: sessionId,
    userId,
    token,
    expiresAt,
    createdAt: new Date(),
  })

  return token
}

export async function verifySession(token: string) {
  try {
    const { payload } = await jwtVerify(token, secret)
    const userId = payload.userId as string

    const session = await db
      .select()
      .from(sessions)
      .where(
        and(
          eq(sessions.token, token),
          eq(sessions.userId, userId),
          gt(sessions.expiresAt, new Date())
        )
      )
      .limit(1)

    if (session.length === 0) {
      return null
    }

    const user = await db
      .select()
      .from(users)
      .where(eq(users.id, userId))
      .limit(1)

    if (user.length === 0) {
      return null
    }

    return {
      user: {
        id: user[0].id,
        email: user[0].email,
        name: user[0].name,
      },
    }
  } catch {
    return null
  }
}

export async function getSession() {
  const cookieStore = await cookies()
  const token = cookieStore.get("session-token")?.value

  if (!token) {
    return null
  }

  return await verifySession(token)
}

export async function deleteSession(token: string) {
  await db.delete(sessions).where(eq(sessions.token, token))
}
