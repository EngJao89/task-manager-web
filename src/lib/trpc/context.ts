import { db } from "@/lib/db"
import { getSession } from "@/lib/session"
import { cookies } from "next/headers"

export async function createContext() {
  const session = await getSession()
  const cookieStore = await cookies()

  return {
    db,
    session,
    setCookie: async (name: string, value: string, options?: { maxAge?: number }) => {
      cookieStore.set(name, value, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: options?.maxAge,
      })
    },
  }
}

export type Context = Awaited<ReturnType<typeof createContext>>
