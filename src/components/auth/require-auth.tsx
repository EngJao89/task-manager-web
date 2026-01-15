"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { trpc } from "@/lib/trpc/client"

export function RequireAuth({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const { data, isLoading, error } = trpc.auth.getCurrentUser.useQuery()

  useEffect(() => {
    if (!isLoading && (error || !data)) {
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
