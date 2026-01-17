"use client"

import Link from "next/link"
import { trpc } from "@/lib/trpc/client"
import { Clock, Circle, CheckCircle2, ListTodo } from "lucide-react"
import { 
  PieChart, 
  Pie, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Cell 
} from "recharts"

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { RequireAuth } from "@/components/auth/require-auth"
import { Sidebar } from "@/components/sidebar"
import { AccountInfo } from "@/components/AccountInfo"


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

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-6">
            <AccountInfo />

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

            <div className="md:col-span-2 lg:col-span-3 rounded-lg border border-zinc-700 bg-zinc-900 p-6">
              <h2 className="text-xl font-semibold text-zinc-100 mb-4">
                Estatísticas das Tasks
              </h2>
              {stats && stats.total > 0 ? (
                <div className="grid gap-6 md:grid-cols-2">
                  <ChartContainer
                    config={{
                      pendente: {
                        label: "Pendente",
                        color: "#facc15",
                      },
                      iniciado: {
                        label: "Iniciado",
                        color: "#60a5fa",
                      },
                      finalizado: {
                        label: "Finalizado",
                        color: "#4ade80",
                      },
                    }}
                    className="h-[200px]"
                  >
                    <PieChart>
                      <ChartTooltip
                        content={<ChartTooltipContent />}
                      />
                      <Pie
                        data={[
                          {
                            name: "Pendente",
                            value: stats.pendente,
                            fill: "var(--color-pendente)",
                          },
                          {
                            name: "Iniciado",
                            value: stats.iniciado,
                            fill: "var(--color-iniciado)",
                          },
                          {
                            name: "Finalizado",
                            value: stats.finalizado,
                            fill: "var(--color-finalizado)",
                          },
                        ]}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={70}
                        label
                      />
                    </PieChart>
                  </ChartContainer>

                  <ChartContainer
                    config={{
                      quantidade: {
                        label: "Quantidade",
                        color: "#71717a",
                      },
                    }}
                    className="h-[200px]"
                  >
                    <BarChart
                      data={[
                        { status: "Pendente", quantidade: stats.pendente },
                        { status: "Iniciado", quantidade: stats.iniciado },
                        { status: "Finalizado", quantidade: stats.finalizado },
                      ]}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#3f3f46" />
                      <XAxis
                        dataKey="status"
                        tick={{ fill: "#a1a1aa" }}
                        axisLine={{ stroke: "#3f3f46" }}
                      />
                      <YAxis
                        tick={{ fill: "#a1a1aa" }}
                        axisLine={{ stroke: "#3f3f46" }}
                      />
                      <ChartTooltip
                        content={<ChartTooltipContent />}
                      />
                      <Bar
                        dataKey="quantidade"
                        radius={[4, 4, 0, 0]}
                      >
                        {[
                          { status: "Pendente", fill: "#facc15" },
                          { status: "Iniciado", fill: "#60a5fa" },
                          { status: "Finalizado", fill: "#4ade80" },
                        ].map((entry) => (
                          <Cell key={`cell-${entry.status}`} fill={entry.fill} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ChartContainer>
                </div>
              ) : (
                <p className="text-sm text-zinc-400">
                  Crie tasks para ver as estatísticas aqui.
                </p>
              )}
            </div>
          </div>
          </div>
        </main>
      </div>
    </RequireAuth>
  )
}
