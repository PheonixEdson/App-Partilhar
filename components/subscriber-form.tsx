"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useApp } from "@/contexts/app-context"
import { useToast } from "@/hooks/use-toast"
import { UserPlus } from "lucide-react"

export function SubscriberForm() {
  const { addSubscriber } = useApp()
  const { toast } = useToast()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!name.trim() || !email.trim()) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos",
        variant: "destructive",
      })
      return
    }

    if (!email.includes("@")) {
      toast({
        title: "Erro",
        description: "Email inválido",
        variant: "destructive",
      })
      return
    }

    addSubscriber({
      name: name.trim(),
      email: email.trim(),
      isPaid: false,
      lastPaymentDate: null,
    })

    toast({
      title: "Assinante cadastrado",
      description: `${name} foi adicionado à lista de assinantes`,
    })

    setName("")
    setEmail("")
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Cadastrar Assinante</CardTitle>
        <CardDescription>Adicione um novo assinante para receber cobranças mensais</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome</Label>
            <Input id="name" placeholder="Nome do assinante" value={name} onChange={(e) => setName(e.target.value)} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="email@exemplo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <Button type="submit" className="w-full">
            <UserPlus className="h-4 w-4 mr-2" />
            Cadastrar Assinante
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
