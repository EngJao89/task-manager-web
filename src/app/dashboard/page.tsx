"use client"

import { RequireAuth } from "@/components/auth/require-auth"
import { trpc } from "@/lib/trpc/client"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

export default function DashboardPage() {
  const router = useRouter()
  const { data } = trpc.auth.getCurrentUser.useQuery()
  const signOutMutation = trpc.auth.signOut.useMutation({
    onSuccess: () => {
      router.push("/")
    },
  })

  const handleSignOut = () => {
    signOutMutation.mutate()
  }

  return (
    <RequireAuth>
      <div className="min-h-screen bg-zinc-800 p-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-zinc-100">Dashboard</h1>
              <p className="mt-2 text-zinc-400">
                Bem-vindo, {data?.user.name}!
              </p>
            </div>
            <Button
              onClick={handleSignOut}
              variant="outline"
              className="border-zinc-700 text-zinc-300 hover:bg-zinc-700 hover:text-zinc-100"
              disabled={signOutMutation.isPending}
            >
              {signOutMutation.isPending ? "Saindo..." : "Sair"}
            </Button>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-lg border border-zinc-700 bg-zinc-900 p-6">
              <h2 className="text-xl font-semibold text-zinc-100">
                Informações da Conta
              </h2>
              <div className="mt-4 space-y-2 text-sm text-zinc-400">
                <p>
                  <span className="font-medium text-zinc-300">Email:</span>{" "}
                  {data?.user.email}
                </p>
                <p>
                  <span className="font-medium text-zinc-300">Nome:</span>{" "}
                  {data?.user.name}
                </p>
              </div>
            </div>

            <div className="rounded-lg border border-zinc-700 bg-zinc-900 p-6">
              <h2 className="text-xl font-semibold text-zinc-100">Tarefas</h2>
              <p className="mt-4 text-sm text-zinc-400">
                Em breve você poderá gerenciar suas tarefas aqui.
              </p>
            </div>

            <div className="rounded-lg border border-zinc-700 bg-zinc-900 p-6">
              <h2 className="text-xl font-semibold text-zinc-100">Estatísticas</h2>
              <p className="mt-4 text-sm text-zinc-400">
                Visualize suas estatísticas aqui.
              </p>
            </div>
          </div>
        </div>
      </div>
    </RequireAuth>
  )
}
