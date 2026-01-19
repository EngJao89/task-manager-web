"use client"

import { useEffect, useMemo } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "react-toastify"
import * as z from "zod"

import type { TaskFormData, TaskFormProps } from "@/types/tasks"
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

const taskSchema = z.object({
  title: z.string().min(1, "Título é obrigatório"),
  description: z.string().optional(),
  status: z.enum(["iniciado", "pendente", "finalizado"]),
})

function useCurrentUserId() {
  const { data } = trpc.auth.getCurrentUser.useQuery(undefined, {
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    staleTime: Infinity,
  })
  return data?.user.id
}

export function TaskForm({
  editingTask,
  onCancel,
  onSuccess,
}: Readonly<TaskFormProps>) {
  const currentUserId = useCurrentUserId()
  
  const defaultValues = useMemo(() => {
    if (editingTask) {
      return {
        title: editingTask.title,
        description: editingTask.description || "",
        status: editingTask.status,
      }
    }
    return {
      title: "",
      description: "",
      status: "pendente" as const,
    }
  }, [editingTask])

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TaskFormData>({
    resolver: zodResolver(taskSchema),
    defaultValues,
  })

  const createMutation = trpc.tasks.create.useMutation({
    onSuccess: () => {
      reset({
        title: "",
        description: "",
        status: "pendente",
      })
      toast.success("Task criada com sucesso!")
      onSuccess()
    },
    onError: (error) => {
      console.error("Erro ao criar task:", error)
      toast.error(error.message || "Erro ao criar task. Tente novamente.")
    },
  })

  const updateMutation = trpc.tasks.update.useMutation({
    onSuccess: () => {
      reset({
        title: "",
        description: "",
        status: "pendente",
      })
      toast.success("Task atualizada com sucesso!")
      onSuccess()
    },
    onError: (error) => {
      console.error("Erro ao atualizar task:", error)
      toast.error(error.message || "Erro ao atualizar task. Tente novamente.")
    },
  })

  useEffect(() => {
    if (editingTask) {
      reset({
        title: editingTask.title,
        description: editingTask.description || "",
        status: editingTask.status,
      }, { keepDefaultValues: false })
      
      if (globalThis.window !== undefined) {
        setTimeout(() => {
          const formElement = document.getElementById("task-form")
          formElement?.scrollIntoView({ behavior: "smooth", block: "start" })
        }, 100)
      }
    } else {
      reset({
        title: "",
        description: "",
        status: "pendente",
      }, { keepDefaultValues: false })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editingTask?.id, reset])

  const handleFormSubmit = (data: TaskFormData) => {
    if (editingTask) {
      updateMutation.mutate({
        id: editingTask.id,
        ...data,
      })
    } else {
      createMutation.mutate(data)
    }
  }

  const handleCancel = () => {
    reset({
      title: "",
      description: "",
      status: "pendente",
    })
    onCancel()
  }

  return (
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
          <form
            key={`${currentUserId || "loading"}-${editingTask?.id || "new-task"}`}
            id="task-form"
            onSubmit={handleSubmit(handleFormSubmit)}
            className="space-y-4"
          >
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
                disabled={createMutation.isPending || updateMutation.isPending}
              >
                {(() => {
                  if (editingTask) {
                    return updateMutation.isPending ? "Salvando..." : "Salvar"
                  }
                  return createMutation.isPending ? "Criando..." : "Criar"
                })()}
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
  )
}
