"use client"

import Link from "next/link"
import { ArrowRight } from "lucide-react"

import { trpc } from "@/lib/trpc/client"
import type { Task } from "@/types/tasks"
import { RequireAuth } from "@/components/auth/require-auth"
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card"
import { Sidebar } from "@/components/sidebar"
import { AccountInfo } from "@/components/AccountInfo"
import { TaskInfo } from "@/components/TaskInfo"
import { StaticsInfo } from "@/components/StaticsInfo"
import { CardEmpty } from "@/components/CardEmpty"
import { TaskCard } from "@/components/TaskCard"
import { Button } from "@/components/ui/button"

export default function DashboardPage() {
  const { data } = trpc.auth.getCurrentUser.useQuery()
  const { data: tasksData } = trpc.tasks.list.useQuery()

  const recentTasks = tasksData?.tasks?.slice(0, 3) || []

  return (
    <RequireAuth>
      <div className="flex h-screen bg-zinc-800">
        <Sidebar />
        <main className="flex-1 overflow-y-auto">
          <div className="p-8">
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-zinc-100">Dashboard</h1>
              <p className="mt-2 text-zinc-400">
                Bem-vindo, {data?.user.name}!
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-6">
              <AccountInfo />

              <TaskInfo />

              <StaticsInfo />
            </div>

            <div className="mt-6">
              <Card className="border-zinc-700 bg-zinc-900">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-zinc-100">
                        Tasks Mais Recentes
                      </CardTitle>
                      <CardDescription className="text-zinc-400">
                        Suas 3 tasks mais recentes
                      </CardDescription>
                    </div>
                    <Link href="/dashboard/tasks">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-zinc-400 hover:text-zinc-100"
                      >
                        Ver todas
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </CardHeader>
                <CardContent>
                  {recentTasks.length > 0 ? (
                    <div className="space-y-4">
                      {recentTasks.map((task: Task) => (
                        <TaskCard
                          key={task.id}
                          task={task}
                          onEdit={() => {}}
                          onDelete={() => {}}
                          onStatusChange={() => {}}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="-mx-6 -mb-6">
                      <CardEmpty />
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </RequireAuth>
  )
}
