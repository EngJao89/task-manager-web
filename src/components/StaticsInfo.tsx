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
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { StaticsInfoEmpty } from "@/components/StaticsInfoEmpty"

export function StaticsInfo() {
  const { data: stats } = trpc.tasks.getStats.useQuery()

  return (
    <Card className="md:col-span-2 lg:col-span-3 border-zinc-700 bg-zinc-900">
      <CardHeader>
        <CardTitle className="text-zinc-100">
          Estatísticas das Tasks
        </CardTitle>
        <CardDescription className="text-zinc-400">
          Visualização gráfica da distribuição de tasks por status
        </CardDescription>
      </CardHeader>
      <CardContent>
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
          <StaticsInfoEmpty />
        )}
      </CardContent>
    </Card>
  )
}
