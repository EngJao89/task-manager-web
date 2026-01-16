"use client"

import { RequireAuth } from "@/components/auth/require-auth"
import { Sidebar } from "@/components/sidebar"
import { trpc } from "@/lib/trpc/client"
import { Clock, Circle, CheckCircle2, ListTodo } from "lucide-react"
import Link from "next/link"

export default function DashboardPage() {
  const { data } = trpc.auth.getCurrentUser.useQuery()
  const { data: stats } = trpc.tasks.getStats.useQuery()

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

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-lg border border-zinc-700 bg-zinc-900 p-6">
              <h2 className="text-xl font-semibold text-zinc-100">
                Informações da Conta
              </h2>
              <div className="mt-4 space-y-2 text-sm text-zinc-400">
                <p>
                  <span className="font-medium text-zinc-300">Email:</span>{" "}
                  {data?.user.email}
                </p>
                <p>
                  <span className="font-medium text-zinc-300">Nome:</span>{" "}
                  {data?.user.name}
                </p>
              </div>
            </div>

            <Link href="/dashboard/tasks">
              <div className="rounded-lg border border-zinc-700 bg-zinc-900 p-6 hover:border-zinc-600 transition-colors cursor-pointer">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-zinc-100 flex items-center gap-2">
                    <ListTodo className="h-5 w-5" />
                    Tarefas
                  </h2>
                  <span className="text-2xl font-bold text-zinc-300">
                    {stats?.total || 0}
                  </span>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-yellow-400" />
                      <span className="text-sm text-zinc-400">Pendente</span>
                    </div>
                    <span className="text-lg font-semibold text-yellow-400">
                      {stats?.pendente || 0}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Circle className="h-4 w-4 text-blue-400" />
                      <span className="text-sm text-zinc-400">Iniciado</span>
                    </div>
                    <span className="text-lg font-semibold text-blue-400">
                      {stats?.iniciado || 0}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-400" />
                      <span className="text-sm text-zinc-400">Finalizado</span>
                    </div>
                    <span className="text-lg font-semibold text-green-400">
                      {stats?.finalizado || 0}
                    </span>
                  </div>
                </div>
              </div>
            </Link>

            <div className="rounded-lg border border-zinc-700 bg-zinc-900 p-6">
              <h2 className="text-xl font-semibold text-zinc-100">Estatísticas</h2>
              <p className="mt-4 text-sm text-zinc-400">
                Visualize suas estatísticas aqui.
              </p>
            </div>
          </div>
          </div>
        </main>
      </div>
    </RequireAuth>
  )
}
