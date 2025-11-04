"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useApp } from "@/contexts/app-context"
import { useToast } from "@/hooks/use-toast"

export function SalesForm() {
  const { products, addSale } = useApp()
  const { toast } = useToast()
  const [selectedProductId, setSelectedProductId] = useState("")
  const [quantity, setQuantity] = useState("")

  const selectedProduct = products.find((p) => p.id === selectedProductId)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedProductId || !quantity) {
      toast({
        title: "Erro",
        description: "Selecione um produto e informe a quantidade",
        variant: "destructive",
      })
      return
    }

    const quantityNum = Number.parseInt(quantity)

    if (quantityNum <= 0) {
      toast({
        title: "Erro",
        description: "A quantidade deve ser maior que zero",
        variant: "destructive",
      })
      return
    }

    if (!selectedProduct) {
      toast({
        title: "Erro",
        description: "Produto não encontrado",
        variant: "destructive",
      })
      return
    }

    if (quantityNum > selectedProduct.quantity) {
      toast({
        title: "Erro",
        description: `Estoque insuficiente. Disponível: ${selectedProduct.quantity} unidades`,
        variant: "destructive",
      })
      return
    }

    addSale({
      productId: selectedProduct.id,
      productName: selectedProduct.name,
      quantity: quantityNum,
      totalPrice: selectedProduct.price * quantityNum,
    })

    toast({
      title: "Sucesso",
      description: "Venda registrada com sucesso",
    })

    setSelectedProductId("")
    setQuantity("")
  }

  if (products.length === 0) {
    return (
      <Card>
        <CardContent className="py-8">
          <p className="text-center text-muted-foreground">
            Nenhum produto disponível. Cadastre produtos primeiro na aba Produtos.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Registrar Nova Venda</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="product">Produto</Label>
            <Select value={selectedProductId} onValueChange={setSelectedProductId}>
              <SelectTrigger id="product">
                <SelectValue placeholder="Selecione um produto" />
              </SelectTrigger>
              <SelectContent>
                {products.map((product) => (
                  <SelectItem key={product.id} value={product.id} disabled={product.quantity === 0}>
                    {product.name} - {product.price.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })} (
                    {product.quantity} em estoque)
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedProduct && (
            <div className="p-4 bg-muted rounded-lg space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Preço unitário:</span>
                <span className="font-medium">
                  {selectedProduct.price.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Estoque disponível:</span>
                <span className="font-medium">{selectedProduct.quantity} unidades</span>
              </div>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="quantity">Quantidade</Label>
            <Input
              id="quantity"
              type="number"
              placeholder="0"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              max={selectedProduct?.quantity}
            />
          </div>

          {selectedProduct && quantity && Number.parseInt(quantity) > 0 && (
            <div className="p-4 bg-primary/10 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="font-medium">Total da venda:</span>
                <span className="text-2xl font-bold">
                  {(selectedProduct.price * Number.parseInt(quantity)).toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  })}
                </span>
              </div>
            </div>
          )}

          <Button type="submit" className="w-full" disabled={!selectedProductId || !quantity}>
            Registrar Venda
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
