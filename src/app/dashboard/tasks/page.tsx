"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { RequireAuth } from "@/components/auth/require-auth"
import { Sidebar } from "@/components/sidebar"
import { trpc } from "@/lib/trpc/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { CheckCircle2, Circle, Clock, Trash2, Edit2 } from "lucide-react"
import { cn } from "@/lib/utils"

const taskSchema = z.object({
  title: z.string().min(1, "Título é obrigatório"),
  description: z.string().optional(),
  status: z.enum(["iniciado", "pendente", "finalizado"]),
})

type TaskFormData = z.infer<typeof taskSchema>

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
  const [editingTask, setEditingTask] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TaskFormData>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      status: "pendente",
    },
  })

  const { data, refetch } = trpc.tasks.list.useQuery()
  const createMutation = trpc.tasks.create.useMutation({
    onSuccess: () => {
      reset()
      refetch()
    },
  })
  const updateMutation = trpc.tasks.update.useMutation({
    onSuccess: () => {
      setEditingTask(null)
      reset()
      refetch()
    },
  })
  const deleteMutation = trpc.tasks.delete.useMutation({
    onSuccess: () => {
      refetch()
    },
  })

  const onSubmit = (data: TaskFormData) => {
    if (editingTask) {
      updateMutation.mutate({
        id: editingTask,
        ...data,
      })
    } else {
      createMutation.mutate(data)
    }
  }

  const handleEdit = (task: {
    id: string
    title: string
    description: string | null
    status: "iniciado" | "pendente" | "finalizado"
  }) => {
    setEditingTask(task.id)
    reset({
      title: task.title,
      description: task.description || "",
      status: task.status,
    })
  }

  const handleCancel = () => {
    setEditingTask(null)
    reset()
  }

  const handleDelete = (id: string) => {
    if (confirm("Tem certeza que deseja excluir esta task?")) {
      deleteMutation.mutate({ id })
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
              <div className="lg:col-span-1">
                <Card className="border-zinc-700 bg-zinc-900">
                  <CardHeader>
                    <CardTitle className="text-zinc-100">
                      {editingTask ? "Editar Task" : "Nova Task"}
                    </CardTitle>
                    <CardDescription className="text-zinc-400">
                      {editingTask
                        ? "Atualize os dados da task"
                        : "Crie uma nova task"}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="title" className="text-zinc-200">
                          Título
                        </Label>
                        <Input
                          id="title"
                          className="bg-zinc-800 border-zinc-700 text-zinc-100 placeholder:text-zinc-500"
                          {...register("title")}
                          aria-invalid={errors.title ? "true" : "false"}
                        />
                        {errors.title && (
                          <p className="text-sm text-red-400">
                            {errors.title.message}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="description" className="text-zinc-200">
                          Descrição
                        </Label>
                        <Textarea
                          id="description"
                          className="bg-zinc-800 border-zinc-700 text-zinc-100 placeholder:text-zinc-500"
                          {...register("description")}
                          rows={4}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="status" className="text-zinc-200">
                          Status
                        </Label>
                        <select
                          id="status"
                          className="flex h-9 w-full rounded-md border border-zinc-700 bg-zinc-800 px-3 py-1 text-sm text-zinc-100 placeholder:text-zinc-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-600 disabled:cursor-not-allowed disabled:opacity-50"
                          {...register("status")}
                        >
                          <option value="pendente">Pendente</option>
                          <option value="iniciado">Iniciado</option>
                          <option value="finalizado">Finalizado</option>
                        </select>
                      </div>

                      <div className="flex gap-2">
                        <Button
                          type="submit"
                          className="flex-1 bg-zinc-700 text-zinc-100 hover:bg-zinc-600"
                          disabled={
                            createMutation.isPending || updateMutation.isPending
                          }
                        >
                          {editingTask
                            ? updateMutation.isPending
                              ? "Salvando..."
                              : "Salvar"
                            : createMutation.isPending
                              ? "Criando..."
                              : "Criar"}
                        </Button>
                        {editingTask && (
                          <Button
                            type="button"
                            variant="outline"
                            onClick={handleCancel}
                            className="border-zinc-700 text-zinc-300 hover:bg-zinc-800"
                          >
                            Cancelar
                          </Button>
                        )}
                      </div>
                    </form>
                  </CardContent>
                </Card>
              </div>

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
                                  <span
                                    className={cn(
                                      "text-sm font-medium",
                                      statusInfo.color
                                    )}
                                  >
                                    {statusInfo.label}
                                  </span>
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
    </RequireAuth>
  )
}
