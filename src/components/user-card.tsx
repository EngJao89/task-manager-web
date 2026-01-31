"use client"

import { User } from "lucide-react"
import type { UserCardProps } from "@/types/users"
import { Card, CardContent } from "@/components/ui/card"

export function UserCard({ name, email, createdAt }: UserCardProps) {
  return (
    <Card className="border-zinc-700 bg-zinc-900">
      <CardContent className="p-6">
        <div className="flex items-center gap-4">
          <div className="flex-shrink-0">
            <div className="h-12 w-12 rounded-full bg-zinc-800 flex items-center justify-center border border-zinc-700">
              <User className="h-6 w-6 text-zinc-400" />
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-zinc-100 mb-1">
              {name}
            </h3>
            <p className="text-sm text-zinc-400 truncate">
              {email}
            </p>
            <p className="text-xs text-zinc-500 mt-1">
              Cadastrado em:{" "}
              {new Date(createdAt).toLocaleDateString("pt-BR")}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
