"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { LayoutDashboard, Users, CheckSquare, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { trpc } from "@/lib/trpc/client"

const navigation = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Usuários",
    href: "/dashboard/users",
    icon: Users,
  },
  {
    name: "Tasks",
    href: "/dashboard/tasks",
    icon: CheckSquare,
  },
]

export function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const signOutMutation = trpc.auth.signOut.useMutation({
    onSuccess: () => {
      router.push("/")
    },
  })

  const handleSignOut = () => {
    signOutMutation.mutate()
  }

  return (
    <div className="flex h-screen w-64 flex-col border-r border-zinc-700 bg-zinc-900">
      <div className="flex h-16 items-center border-b border-zinc-700 px-6">
        <h1 className="text-xl font-bold text-zinc-100">Task Manager</h1>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-4">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-zinc-800 text-zinc-100"
                  : "text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100"
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.name}
            </Link>
          )
        })}
      </nav>

      <div className="border-t border-zinc-700 p-4">
        <Button
          onClick={handleSignOut}
          variant="ghost"
          className="w-full justify-start gap-3 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100"
          disabled={signOutMutation.isPending}
        >
          <LogOut className="h-5 w-5" />
          {signOutMutation.isPending ? "Saindo..." : "Logout"}
        </Button>
      </div>
    </div>
  )
}
