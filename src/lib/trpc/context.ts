import { db } from "@/lib/db"
import { getSession } from "@/lib/session"
import { cookies } from "next/headers"

export async function createContext(opts?: { req?: Request }) {
  let sessionToken: string | undefined
  
  if (opts?.req) {
    const cookieHeader = opts.req.headers.get("cookie")
    if (cookieHeader) {
      const cookieMap = cookieHeader.split(";").reduce((acc: Record<string, string>, cookie: string) => {
        const [key, value] = cookie.trim().split("=")
        if (key && value) {
          acc[key] = decodeURIComponent(value)
        }
        return acc
      }, {} as Record<string, string>)
      sessionToken = cookieMap["session-token"]
    }
  }

  let session = null
  if (sessionToken) {
    const { verifySession } = await import("@/lib/session")
    session = await verifySession(sessionToken)
  } else {
    session = await getSession()
  }

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
