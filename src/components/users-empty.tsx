"use client"

import { Users } from "lucide-react"
import {
  Card,
  CardContent,
} from "@/components/ui/card"
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"

export function UsersEmpty() {
  return (
    <Card className="border-zinc-700 bg-zinc-900">
      <CardContent className="py-12">
        <Empty>
          <EmptyHeader>
            <EmptyMedia>
              <Users className="h-12 w-12 text-zinc-500" />
            </EmptyMedia>
            <EmptyTitle className="text-zinc-200">
              Nenhum usuário encontrado
            </EmptyTitle>
            <EmptyDescription className="text-zinc-400">
              Não há usuários cadastrados no sistema ainda.
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      </CardContent>
    </Card>
  )
}
