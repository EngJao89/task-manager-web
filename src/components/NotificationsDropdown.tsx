"use client"

import { useState } from "react"
import Link from "next/link"
import {
  Bell,
  AlertTriangle,
  Plus,
  Pencil,
  CheckSquare,
  ChevronRight,
} from "lucide-react"
import { format, formatDistanceToNow } from "date-fns"
import { ptBR } from "date-fns/locale"

import type { Notification, ExpiringTaskItem } from "@/types/notifications"
import { trpc } from "@/lib/trpc/client"
import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Separator } from "@/components/ui/separator"

export function NotificationsDropdown() {
  const [open, setOpen] = useState(false)

  const { data: notificationsData } = trpc.notifications.list.useQuery(
    undefined,
    { enabled: open }
  )
  const { data: expiringData } = trpc.tasks.getExpiringSoon.useQuery(
    undefined,
    { enabled: open }
  )

  const notifications = notificationsData?.notifications ?? []

  const expiringTasks: ExpiringTaskItem[] = (expiringData?.tasks ?? []).map(
    (t: { id: string; title: string; expiresAt: Date | string | null; status: string }) => ({
      ...t,
      expiresAt: t.expiresAt ? new Date(t.expiresAt) : null,
    })
  )
  const totalCount = notifications.length + expiringTasks.length

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100"
          aria-label="Notificações"
        >
          <Bell className="h-5 w-5" />
          {totalCount > 0 && (
            <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-amber-500 text-[10px] font-bold text-zinc-900">
              {totalCount > 9 ? "9+" : totalCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-80 border-zinc-700 bg-zinc-900 p-0"
        align="end"
        sideOffset={8}
      >
        <div className="border-b border-zinc-700 px-4 py-3">
          <h3 className="font-semibold text-zinc-100">Notificações</h3>
          <p className="text-xs text-zinc-500">
            Tasks criadas, editadas e próximas do prazo
          </p>
        </div>

        <div className="max-h-[360px] overflow-y-auto">
          {expiringTasks.length > 0 && (
            <>
              <div className="px-4 py-2">
                <p className="flex items-center gap-2 text-xs font-medium text-amber-400">
                  <AlertTriangle className="h-4 w-4" />
                  Próximas do prazo (não finalizadas)
                </p>
              </div>
              <ul className="space-y-0.5 px-2 pb-2">
                {expiringTasks.map((task: ExpiringTaskItem) => (
                  <li key={task.id}>
                    <Link
                      href="/dashboard/tasks"
                      onClick={() => setOpen(false)}
                      className="flex items-center gap-3 rounded-md px-2 py-2.5 text-sm text-zinc-300 transition-colors hover:bg-zinc-800 hover:text-zinc-100"
                    >
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-amber-500/20 text-amber-400">
                        <AlertTriangle className="h-4 w-4" />
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-medium">{task.title}</p>
                        <p className="text-xs text-zinc-500">
                          Expira em{" "}
                          {task.expiresAt
                            ? format(task.expiresAt, "dd/MM/yyyy", {
                                locale: ptBR,
                              })
                            : "—"}
                        </p>
                      </div>
                      <ChevronRight className="h-4 w-4 shrink-0 text-zinc-500" />
                    </Link>
                  </li>
                ))}
              </ul>
              {notifications.length > 0 && (
                <Separator className="bg-zinc-700" />
              )}
            </>
          )}

          {notifications.length > 0 && (
            <>
              <div className="px-4 py-2">
                <p className="text-xs font-medium text-zinc-400">
                  Atividades recentes
                </p>
              </div>
              <ul className="space-y-0.5 px-2 pb-4">
                {notifications.map((n: Notification) => (
                  <li key={n.id}>
                    <Link
                      href="/dashboard/tasks"
                      onClick={() => setOpen(false)}
                      className="flex items-center gap-3 rounded-md px-2 py-2.5 text-sm text-zinc-300 transition-colors hover:bg-zinc-800 hover:text-zinc-100"
                    >
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-zinc-800 text-zinc-400">
                        {n.type === "created" ? (
                          <Plus className="h-4 w-4" />
                        ) : (
                          <Pencil className="h-4 w-4" />
                        )}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-medium">{n.taskTitle}</p>
                        <p className="text-xs text-zinc-500">
                          {n.type === "created"
                            ? "Task criada"
                            : "Task editada"}{" "}
                          ·{" "}
                          {formatDistanceToNow(new Date(n.createdAt), {
                            addSuffix: true,
                            locale: ptBR,
                          })}
                        </p>
                      </div>
                      <ChevronRight className="h-4 w-4 shrink-0 text-zinc-500" />
                    </Link>
                  </li>
                ))}
              </ul>
            </>
          )}

          {totalCount === 0 && (
            <div className="flex flex-col items-center justify-center gap-2 px-4 py-8 text-center">
              <CheckSquare className="h-10 w-10 text-zinc-600" />
              <p className="text-sm text-zinc-500">Nenhuma notificação</p>
              <p className="text-xs text-zinc-600">
                Crie ou edite tasks para ver atividades. Tasks próximas do
                prazo aparecerão aqui.
              </p>
            </div>
          )}
        </div>

        {totalCount > 0 && (
          <>
            <Separator className="bg-zinc-700" />
            <div className="p-2">
              <Link
                href="/dashboard/tasks"
                onClick={() => setOpen(false)}
                className="flex w-full items-center justify-center gap-2 rounded-md py-2 text-sm font-medium text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-zinc-100"
              >
                Ver todas as tasks
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
          </>
        )}
      </PopoverContent>
    </Popover>
  )
}
