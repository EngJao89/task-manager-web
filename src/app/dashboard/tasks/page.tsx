"use client"

import { useState } from "react"
import { CheckCircle2, Circle, Clock, Trash2, Edit2 } from "lucide-react"
import { toast } from "react-toastify"

import type { Task } from "@/types/tasks"
import { cn } from "@/lib/utils"
import { trpc } from "@/lib/trpc/client"
import { RequireAuth } from "@/components/auth/require-auth"
import { Sidebar } from "@/components/sidebar"
import { TaskForm } from "@/components/TaskForm"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
} from "@/components/ui/card"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

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
}

export default function TasksPage() {
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [taskToDelete, setTaskToDelete] = useState<string | null>(null)

  const { data, refetch } = trpc.tasks.list.useQuery()
  const updateStatusMutation = trpc.tasks.update.useMutation({
    onSuccess: () => {
      refetch()
      toast.success("Status atualizado com sucesso!")
    },
    onError: (error) => {
      console.error("Erro ao atualizar status:", error)
      toast.error(error.message || "Erro ao atualizar status. Tente novamente.")
    },
  })
  const deleteMutation = trpc.tasks.delete.useMutation({
    onSuccess: () => {
      refetch()
    },
  })

  const handleEdit = (task: Task) => {
    setEditingTask(task)
  }

  const handleCancel = () => {
    setEditingTask(null)
  }

  const handleFormSuccess = () => {
    setEditingTask(null)
    refetch()
  }

  const handleDelete = (id: string) => {
    setTaskToDelete(id)
  }

  const confirmDelete = () => {
    if (taskToDelete) {
      deleteMutation.mutate(
        { id: taskToDelete },
        {
          onSuccess: () => {
            toast.success("Task excluída com sucesso!")
            setTaskToDelete(null)
          },
          onError: (error) => {
            console.error("Erro ao excluir task:", error)
            toast.error(error.message || "Erro ao excluir task. Tente novamente.")
            setTaskToDelete(null)
          },
        }
      )
    }
  }

  const tasks = data?.tasks || []

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

            <div className="grid gap-6 lg:grid-cols-3">
              <TaskForm
                editingTask={editingTask}
                onCancel={handleCancel}
                onSuccess={handleFormSuccess}
              />

              <div className="lg:col-span-2">
                <div className="space-y-4">
                  {tasks.length === 0 ? (
                    <Card className="border-zinc-700 bg-zinc-900">
                      <CardContent className="py-12 text-center">
                        <p className="text-zinc-400">
                          Nenhuma task criada ainda. Crie sua primeira task!
                        </p>
                      </CardContent>
                    </Card>
                  ) : (
                    tasks.map((task: {
                      id: string
                      title: string
                      description: string | null
                      status: "iniciado" | "pendente" | "finalizado"
                      createdAt: Date
                      updatedAt: Date
                    }) => {
                      const statusInfo = statusConfig[task.status]
                      const StatusIcon = statusInfo.icon

                      return (
                        <Card
                          key={task.id}
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
                                      updateStatusMutation.mutate({
                                        id: task.id,
                                        status: newStatus,
                                      })
                                    }}
                                    disabled={updateStatusMutation.isPending}
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
                                  onClick={() => handleEdit(task)}
                                  className="text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800"
                                >
                                  <Edit2 className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleDelete(task.id)}
                                  className="text-zinc-400 hover:text-red-400 hover:bg-zinc-800"
                                  disabled={deleteMutation.isPending}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      )
                    })
                  )}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      <AlertDialog open={taskToDelete !== null} onOpenChange={(open) => !open && setTaskToDelete(null)}>
        <AlertDialogContent className="bg-zinc-900 border-zinc-700">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-zinc-100">
              Confirmar exclusão
            </AlertDialogTitle>
            <AlertDialogDescription className="text-zinc-400">
              Tem certeza que deseja excluir esta task? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-zinc-700 text-zinc-300 hover:bg-zinc-800">
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-red-600 text-white hover:bg-red-700"
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? "Excluindo..." : "Excluir"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </RequireAuth>
  )
}
