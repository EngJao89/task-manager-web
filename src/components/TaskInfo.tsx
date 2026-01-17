"use client"

import Link from "next/link"
import { trpc } from "@/lib/trpc/client"
import { Clock, Circle, CheckCircle2, ListTodo } from "lucide-react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

export function TaskInfo() {
  const { data: stats } = trpc.tasks.getStats.useQuery()

  return (
    <Link href="/dashboard/tasks" className="block">
      <Card className="border-zinc-700 bg-zinc-900 hover:border-zinc-600 transition-colors cursor-pointer">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ListTodo className="h-5 w-5 text-zinc-100" />
              <CardTitle className="text-zinc-100">
                Tarefas
              </CardTitle>
            </div>
            <span className="text-2xl font-bold text-zinc-300">
              {stats?.total || 0}
            </span>
          </div>
          <CardDescription className="text-zinc-400">
            Total de tasks criadas
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-yellow-400" />
              <span className="text-sm text-zinc-400">Pendente</span>
            </div>
            <span className="text-lg font-semibold text-yellow-400">
              {stats?.pendente || 0}
            </span>
          </div>
          <Separator className="bg-zinc-700" />
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Circle className="h-4 w-4 text-blue-400" />
              <span className="text-sm text-zinc-400">Iniciado</span>
            </div>
            <span className="text-lg font-semibold text-blue-400">
              {stats?.iniciado || 0}
            </span>
          </div>
          <Separator className="bg-zinc-700" />
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-400" />
              <span className="text-sm text-zinc-400">Finalizado</span>
            </div>
            <span className="text-lg font-semibold text-green-400">
              {stats?.finalizado || 0}
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
