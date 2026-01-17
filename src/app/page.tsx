"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "react-toastify"
import * as z from "zod"

import { trpc } from "@/lib/trpc/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

const signInSchema = z.object({
  email: z.string().email({ message: "Email inválido" }),
  password: z.string().min(6, { message: "A senha deve ter no mínimo 6 caracteres" }),
})

type SignInFormData = z.infer<typeof signInSchema>

export default function Home() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
  })

  const signInMutation = trpc.auth.signIn.useMutation({
    onSuccess: () => {
      toast.success("Login realizado com sucesso!")
      router.push("/dashboard")
    },
    onError: (error) => {
      const errorMessage = error.message || "Erro ao fazer login"
      setError(errorMessage)
      toast.error(errorMessage)
    },
  })

  const onSubmit = (data: SignInFormData) => {
    setError(null)
    signInMutation.mutate({
      email: data.email,
      password: data.password,
    })
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <h1 className="mb-8 animate-fade-in-down text-5xl font-bold text-zinc-100 tracking-tight transition-transform duration-300 hover:scale-105">
        Task Manager
      </h1>
      <Card className="w-full max-w-md border-zinc-700 bg-zinc-900">
        <CardHeader>
          <CardTitle className="text-2xl text-zinc-100">Entrar</CardTitle>
          <CardDescription className="text-zinc-400">
            Digite suas credenciais para acessar sua conta
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            {error && (
              <div className="rounded-md bg-red-500/10 border border-red-500/50 p-3 text-sm text-red-400">
                {error}
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-zinc-200">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                className="bg-zinc-800 border-zinc-700 text-zinc-100 placeholder:text-zinc-500"
                {...register("email")}
                aria-invalid={errors.email ? "true" : "false"}
              />
              {errors.email && (
                <p className="text-sm text-red-400">{errors.email.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-zinc-200">
                Senha
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                className="bg-zinc-800 border-zinc-700 text-zinc-100 placeholder:text-zinc-500"
                {...register("password")}
                aria-invalid={errors.password ? "true" : "false"}
              />
              {errors.password && (
                <p className="text-sm text-red-400">{errors.password.message}</p>
              )}
            </div>
          </CardContent>
          <CardFooter className="mt-4">
            <Button
              type="submit"
              className="w-full bg-zinc-700 text-zinc-100 hover:bg-zinc-600"
              disabled={signInMutation.isPending}
            >
              {signInMutation.isPending ? "Entrando..." : "Entrar"}
            </Button>
          </CardFooter>
        </form>
      </Card>
      <div className="mt-6 text-center">
        <p className="text-sm text-zinc-400 mb-3">
          Não tem uma conta?
        </p>
        <Button
          type="button"
          variant="outline"
          className="bg-transparent border-zinc-700 text-zinc-300 hover:bg-zinc-800 hover:text-zinc-100"
          onClick={() => router.push("/signup")}
        >
          Criar conta
        </Button>
      </div>
    </div>
  )
}
