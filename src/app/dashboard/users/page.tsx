"use client"

import { RequireAuth } from "@/components/auth/require-auth"
import { Sidebar } from "@/components/sidebar"
import { UsersEmpty } from "@/components/UsersEmpty"

export default function UsersPage() {
  return (
    <RequireAuth>
      <div className="flex h-screen bg-zinc-800">
        <Sidebar />
        <main className="flex-1 overflow-y-auto">
          <div className="p-8">
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-zinc-100">Usuários</h1>
              <p className="mt-2 text-zinc-400">
                Visualização de usuários do sistema
              </p>
            </div>

            <UsersEmpty />
          </div>
        </main>
      </div>
    </RequireAuth>
  )
}
