"use client"

import { useState } from "react"
import { toast } from "react-toastify"

import type { Task } from "@/types/tasks"
import { trpc } from "@/lib/trpc/client"
import { RequireAuth } from "@/components/auth/require-auth"
import { Sidebar } from "@/components/sidebar"
import { TaskForm } from "@/components/TaskForm"
import { TaskCard } from "@/components/TaskCard"
import { Alert } from "@/components/Alert"
import { CardEmpty } from "@/components/CardEmpty"

export default function TasksPage() {
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [taskToDelete, setTaskToDelete] = useState<string | null>(null)

  const { data, refetch } = trpc.tasks.list.useQuery()
  const deleteMutation = trpc.tasks.delete.useMutation({
    onSuccess: () => {
      toast.success("Task excluída com sucesso!")
      setTaskToDelete(null)
      refetch()
    },
    onError: (error) => {
      console.error("Erro ao excluir task:", error)
      toast.error(error.message || "Erro ao excluir task. Tente novamente.")
      setTaskToDelete(null)
    },
  })
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
      deleteMutation.mutate({ id: taskToDelete })
    }
  }

  const handleStatusChange = (id: string, status: "iniciado" | "pendente" | "finalizado") => {
    updateStatusMutation.mutate({
      id,
      status,
    })
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
                    <CardEmpty />
                  ) : (
                    tasks.map((task: Task) => (
                      <TaskCard
                        key={task.id}
                        task={task}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                        onStatusChange={handleStatusChange}
                        isUpdatingStatus={updateStatusMutation.isPending}
                        isDeleting={deleteMutation.isPending}
                      />
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      <Alert
        open={taskToDelete !== null}
        onOpenChange={(open) => !open && setTaskToDelete(null)}
        onConfirm={confirmDelete}
        title="Confirmar exclusão"
        description="Tem certeza que deseja excluir esta task? Esta ação não pode ser desfeita."
        confirmText="Excluir"
        cancelText="Cancelar"
        isLoading={deleteMutation.isPending}
      />
    </RequireAuth>
  )
}
