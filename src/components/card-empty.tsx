"use client"

import { CheckSquare } from "lucide-react"
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

export function CardEmpty() {
  return (
    <Card className="border-zinc-700 bg-zinc-900">
      <CardContent className="py-12">
        <Empty>
          <EmptyHeader>
            <EmptyMedia>
              <CheckSquare className="h-12 w-12 text-zinc-500" />
            </EmptyMedia>
            <EmptyTitle className="text-zinc-200">
              Nenhuma task criada ainda
            </EmptyTitle>
            <EmptyDescription className="text-zinc-400">
              Crie sua primeira task para começar a organizar suas tarefas!
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      </CardContent>
    </Card>
  )
}
