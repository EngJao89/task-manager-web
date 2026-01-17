"use client"

import { CheckCircle2, Circle, Clock, Trash2, Edit2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import type { TaskCardProps } from "@/types/tasks"

const statusConfig = {
  pendente: {
    label: "Pendente",
    icon: Clock,
    color: "text-yellow-400",
    bgColor: "bg-yellow-400/10",
    borderColor: "border-yellow-400/20",
  },
  iniciado: {
    label: "Iniciado",
    icon: Circle,
    color: "text-blue-400",
    bgColor: "bg-blue-400/10",
    borderColor: "border-blue-400/20",
  },
  finalizado: {
    label: "Finalizado",
    icon: CheckCircle2,
    color: "text-green-400",
    bgColor: "bg-green-400/10",
    borderColor: "border-green-400/20",
  },
} as const

export function TaskCard({
  task,
  onEdit,
  onDelete,
  onStatusChange,
  isUpdatingStatus = false,
  isDeleting = false,
}: TaskCardProps) {
  const statusInfo = statusConfig[task.status]
  const StatusIcon = statusInfo.icon

  return (
    <Card
      className={cn(
        "border-zinc-700 bg-zinc-900",
        statusInfo.borderColor
      )}
    >
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <StatusIcon
                className={cn("h-5 w-5", statusInfo.color)}
              />
              <select
                value={task.status}
                onChange={(e) => {
                  const newStatus = e.target.value as "iniciado" | "pendente" | "finalizado"
                  onStatusChange(task.id, newStatus)
                }}
                disabled={isUpdatingStatus}
                className={cn(
                  "text-sm font-medium bg-zinc-800/50 border border-zinc-700 rounded-md px-3 py-1.5 cursor-pointer focus:outline-none focus:ring-2 focus:ring-zinc-600 focus:border-zinc-600 transition-all",
                  statusInfo.color,
                  "hover:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed"
                )}
              >
                <option value="pendente" className="bg-zinc-900 text-yellow-400">
                  Pendente
                </option>
                <option value="iniciado" className="bg-zinc-900 text-blue-400">
                  Iniciado
                </option>
                <option value="finalizado" className="bg-zinc-900 text-green-400">
                  Finalizado
                </option>
              </select>
            </div>
            <h3 className="text-lg font-semibold text-zinc-100 mb-2">
              {task.title}
            </h3>
            {task.description && (
              <p className="text-zinc-400 text-sm mb-4">
                {task.description}
              </p>
            )}
            <p className="text-xs text-zinc-500">
              Criada em:{" "}
              {new Date(task.createdAt).toLocaleDateString(
                "pt-BR"
              )}
            </p>
          </div>
          <div className="flex gap-2 ml-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onEdit(task)}
              className="text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800"
            >
              <Edit2 className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onDelete(task.id)}
              className="text-zinc-400 hover:text-red-400 hover:bg-zinc-800"
              disabled={isDeleting}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
