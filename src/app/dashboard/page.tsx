"use client"

import { trpc } from "@/lib/trpc/client"

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
import { TaskInfo } from "@/components/TaskInfo"

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

            <TaskInfo />

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
