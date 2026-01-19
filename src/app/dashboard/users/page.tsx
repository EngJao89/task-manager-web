"use client"

import { trpc } from "@/lib/trpc/client"
import { RequireAuth } from "@/components/auth/require-auth"
import { Sidebar } from "@/components/sidebar"
import { UsersEmpty } from "@/components/UsersEmpty"
import { UserCard } from "@/components/UserCard"

export default function UsersPage() {
  const { data: users, isLoading } = trpc.auth.list.useQuery()

  const renderContent = () => {
    if (isLoading) {
      return <div className="text-zinc-400">Carregando usuários...</div>
    }

    if (users && users.length > 0) {
      return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {users.map((user: { id: string; name: string; email: string; createdAt: string | Date }) => (
            <UserCard
              key={user.id}
              name={user.name}
              email={user.email}
              createdAt={new Date(user.createdAt)}
            />
          ))}
        </div>
      )
    }

    return <UsersEmpty />
  }

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

            {renderContent()}
          </div>
        </main>
      </div>
    </RequireAuth>
  )
}
