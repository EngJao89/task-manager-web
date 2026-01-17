export type Task = {
  id: string
  title: string
  description: string | null
  status: "iniciado" | "pendente" | "finalizado"
  createdAt: Date
  updatedAt: Date
}

export type TaskFormData = {
  title: string
  description?: string
  status: "iniciado" | "pendente" | "finalizado"
}

export interface TaskFormProps {
  readonly editingTask: Task | null
  readonly onCancel: () => void
  readonly onSuccess: () => void
}
