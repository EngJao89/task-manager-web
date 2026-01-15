"use client"

import { RequireAuth } from "@/components/auth/require-auth"
import { Sidebar } from "@/components/sidebar"

export default function TasksPage() {
  return (
    <RequireAuth>
      <div className="flex h-screen bg-zinc-800">
        <Sidebar />
        <main className="flex-1 overflow-y-auto">
          <div className="p-8">
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-zinc-100">Tasks</h1>
              <p className="mt-2 text-zinc-400">
                Gerencie suas tarefas
              </p>
            </div>

            <div className="rounded-lg border border-zinc-700 bg-zinc-900 p-6">
              <p className="text-zinc-400">
                Gerenciamento de tarefas em breve...
              </p>
            </div>
          </div>
        </main>
      </div>
    </RequireAuth>
  )
}
