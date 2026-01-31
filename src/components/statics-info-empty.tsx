"use client"

import { BarChart3 } from "lucide-react"
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"

export function StaticsInfoEmpty() {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia>
          <BarChart3 className="h-12 w-12 text-zinc-500" />
        </EmptyMedia>
        <EmptyTitle className="text-zinc-200">
          Nenhuma estatística disponível
        </EmptyTitle>
        <EmptyDescription className="text-zinc-400">
          Crie tasks para ver as estatísticas aqui.
        </EmptyDescription>
      </EmptyHeader>
    </Empty>
  )
}
