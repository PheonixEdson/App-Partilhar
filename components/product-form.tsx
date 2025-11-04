"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useApp } from "@/contexts/app-context"
import { useToast } from "@/hooks/use-toast"
import { ImageIcon, X } from "lucide-react"

export function ProductForm() {
  const { addProduct } = useApp()
  const { toast } = useToast()
  const [name, setName] = useState("")
  const [price, setPrice] = useState("")
  const [quantity, setQuantity] = useState("")
  const [imagePreview, setImagePreview] = useState<string | null>(null)

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "Erro",
          description: "A imagem deve ter no máximo 5MB",
          variant: "destructive",
        })
        return
      }

      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleRemoveImage = () => {
    setImagePreview(null)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!name || !price || !quantity) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos",
        variant: "destructive",
      })
      return
    }

    const priceNum = Number.parseFloat(price)
    const quantityNum = Number.parseInt(quantity)

    if (priceNum <= 0 || quantityNum <= 0) {
      toast({
        title: "Erro",
        description: "Preço e quantidade devem ser maiores que zero",
        variant: "destructive",
      })
      return
    }

    addProduct({
      name,
      price: priceNum,
      quantity: quantityNum,
      imageUrl: imagePreview || undefined,
    })

    toast({
      title: "Sucesso",
      description: "Produto adicionado com sucesso",
    })

    setName("")
    setPrice("")
    setQuantity("")
    setImagePreview(null)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Adicionar Novo Produto</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome do Produto</Label>
            <Input id="name" placeholder="Ex: Camiseta Básica" value={name} onChange={(e) => setName(e.target.value)} />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="price">Preço (R$)</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="quantity">Quantidade</Label>
              <Input
                id="quantity"
                type="number"
                placeholder="0"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="image">Imagem do Produto (opcional)</Label>
            {imagePreview ? (
              <div className="relative">
                <img
                  src={imagePreview || "/placeholder.svg"}
                  alt="Preview"
                  className="w-full h-48 object-cover rounded-lg border border-border"
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  className="absolute top-2 right-2"
                  onClick={handleRemoveImage}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div className="flex items-center justify-center w-full">
                <label
                  htmlFor="image"
                  className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-border rounded-lg cursor-pointer hover:bg-accent/50 transition-colors"
                >
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <ImageIcon className="w-10 h-10 mb-3 text-muted-foreground" />
                    <p className="mb-2 text-sm text-muted-foreground">
                      <span className="font-semibold">Clique para adicionar</span> ou arraste uma imagem
                    </p>
                    <p className="text-xs text-muted-foreground">PNG, JPG ou WEBP (máx. 5MB)</p>
                  </div>
                  <Input id="image" type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                </label>
              </div>
            )}
          </div>

          <Button type="submit" className="w-full">
            Adicionar Produto
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
