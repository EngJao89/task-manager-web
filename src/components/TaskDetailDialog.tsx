"use client"

import { CheckCircle2, Circle, Clock, Calendar, FileText } from "lucide-react"

import type { TaskDetailDialogProps } from "@/types/tasks"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"

const statusConfig = {
  pendente: {
    label: "Pendente",
    icon: Clock,
    color: "text-yellow-400",
    bgColor: "bg-yellow-400/10",
  },
  iniciado: {
    label: "Iniciado",
    icon: Circle,
    color: "text-blue-400",
    bgColor: "bg-blue-400/10",
  },
  finalizado: {
    label: "Finalizado",
    icon: CheckCircle2,
    color: "text-green-400",
    bgColor: "bg-green-400/10",
  },
} as const

export function TaskDetailDialog({
  task,
  open,
  onOpenChange,
}: Readonly<TaskDetailDialogProps>) {
  if (!task) return null

  const statusInfo = statusConfig[task.status]
  const StatusIcon = statusInfo.icon

  const formatDate = (date: Date) =>
    new Date(date).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="border-zinc-700 bg-zinc-900 text-zinc-100 sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <StatusIcon className={`h-5 w-5 ${statusInfo.color}`} />
            <DialogTitle className="text-xl text-zinc-100">
              {task.title}
            </DialogTitle>
          </div>
          <DialogDescription className="sr-only">
            Detalhes da task: {task.title}, status {statusInfo.label}
          </DialogDescription>
          <Badge
            variant="secondary"
            className={`mt-1 w-fit ${statusInfo.bgColor} ${statusInfo.color} border-0`}
          >
            {statusInfo.label}
          </Badge>
        </DialogHeader>

        <div className="space-y-4">
          {task.description ? (
            <>
              <div className="flex gap-2">
                <FileText className="h-4 w-4 text-zinc-500 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-zinc-400 mb-1">
                    Descrição
                  </p>
                  <p className="text-zinc-300 text-sm whitespace-pre-wrap">
                    {task.description}
                  </p>
                </div>
              </div>
              <Separator className="bg-zinc-700" />
            </>
          ) : (
            <p className="text-sm text-zinc-500 italic">Sem descrição</p>
          )}

          <div className="flex gap-2">
            <Calendar className="h-4 w-4 text-zinc-500 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="text-sm font-medium text-zinc-400">Criada em</p>
              <p className="text-zinc-300 text-sm">
                {formatDate(task.createdAt)}
              </p>
              <p className="text-sm font-medium text-zinc-400 mt-2">
                Atualizada em
              </p>
              <p className="text-zinc-300 text-sm">
                {formatDate(task.updatedAt)}
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
