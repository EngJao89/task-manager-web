"use client"

import { trpc } from "@/lib/trpc/client"

import { RequireAuth } from "@/components/auth/require-auth"
import { Sidebar } from "@/components/sidebar"
import { AccountInfo } from "@/components/AccountInfo"
import { TaskInfo } from "@/components/TaskInfo"
import { StaticsInfo } from "@/components/StaticsInfo"

export default function DashboardPage() {
  const { data } = trpc.auth.getCurrentUser.useQuery()

  return (
    <RequireAuth>
      <div className="flex h-screen bg-zinc-800">
        <Sidebar />
        <main className="flex-1 overflow-y-auto">
          <div className="p-8">
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-zinc-100">Dashboard</h1>
              <p className="mt-2 text-zinc-400">
                Bem-vindo, {data?.user.name}!
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-6">
              <AccountInfo />

              <TaskInfo />

              <StaticsInfo />
            </div>
          </div>
        </main>
      </div>
    </RequireAuth>
  )
}
