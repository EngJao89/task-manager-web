"use client"

import { useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { trpc } from "@/lib/trpc/client"

export function RequireAuth({ children }: Readonly<{ children: React.ReactNode }>) {
  const router = useRouter()
  const hasRedirected = useRef(false)
  const { data, isLoading, error } = trpc.auth.getCurrentUser.useQuery(undefined, {
    retry: false,
    refetchOnWindowFocus: false,
  })

  useEffect(() => {
    if (!isLoading && (error || !data) && !hasRedirected.current) {
      hasRedirected.current = true
      router.push("/")
    }
  }, [isLoading, error, data, router])

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-zinc-400">Carregando...</div>
      </div>
    )
  }

  if (error || !data) {
    return null
  }

  return <>{children}</>
}
