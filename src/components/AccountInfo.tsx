"use client"

import { trpc } from "@/lib/trpc/client"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

export function AccountInfo() {
  const { data } = trpc.auth.getCurrentUser.useQuery()

  return (
    <Card className="border-zinc-700 bg-zinc-900">
      <CardHeader>
        <CardTitle className="text-zinc-100">
          Informações da Conta
        </CardTitle>
        <CardDescription className="text-zinc-400">
          Dados da sua conta
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-zinc-300">Email</span>
            <span className="text-sm text-zinc-400">{data?.user.email}</span>
          </div>
          <Separator className="bg-zinc-700" />
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-zinc-300">Nome</span>
            <span className="text-sm text-zinc-400">{data?.user.name}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
