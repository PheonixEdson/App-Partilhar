"use client"

import type React from "react"

import { useState } from "react"
import { useApp } from "@/contexts/app-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Pencil, Trash2, ImageIcon, X } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import type { Product } from "@/lib/types"

export function ProductList() {
  const { products, updateProduct, deleteProduct } = useApp()
  const { toast } = useToast()
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [editName, setEditName] = useState("")
  const [editPrice, setEditPrice] = useState("")
  const [editQuantity, setEditQuantity] = useState("")
  const [editImagePreview, setEditImagePreview] = useState<string | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const handleEdit = (product: Product) => {
    setEditingProduct(product)
    setEditName(product.name)
    setEditPrice(product.price.toString())
    setEditQuantity(product.quantity.toString())
    setEditImagePreview(product.imageUrl || null)
    setIsDialogOpen(true)
  }

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
        setEditImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleRemoveImage = () => {
    setEditImagePreview(null)
  }

  const handleUpdate = () => {
    if (!editingProduct) return

    if (!editName || !editPrice || !editQuantity) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos",
        variant: "destructive",
      })
      return
    }

    updateProduct(editingProduct.id, {
      name: editName,
      price: Number.parseFloat(editPrice),
      quantity: Number.parseInt(editQuantity),
      imageUrl: editImagePreview || undefined,
    })

    toast({
      title: "Sucesso",
      description: "Produto atualizado com sucesso",
    })

    setIsDialogOpen(false)
    setEditingProduct(null)
  }

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Tem certeza que deseja excluir "${name}"?`)) {
      deleteProduct(id)
      toast({
        title: "Sucesso",
        description: "Produto excluído com sucesso",
      })
    }
  }

  if (products.length === 0) {
    return (
      <Card>
        <CardContent className="py-8">
          <p className="text-center text-muted-foreground">
            Nenhum produto cadastrado. Adicione seu primeiro produto acima.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Produtos Cadastrados ({products.length})</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {products.map((product) => (
            <div key={product.id} className="flex items-center gap-4 p-4 border border-border rounded-lg">
              {product.imageUrl ? (
                <img
                  src={product.imageUrl || "/placeholder.svg"}
                  alt={product.name}
                  className="w-16 h-16 md:w-20 md:h-20 object-cover rounded-md flex-shrink-0"
                />
              ) : (
                <div className="w-16 h-16 md:w-20 md:h-20 bg-muted rounded-md flex items-center justify-center flex-shrink-0">
                  <ImageIcon className="w-8 h-8 text-muted-foreground" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold truncate">{product.name}</h3>
                <div className="flex gap-4 mt-1 text-sm text-muted-foreground">
                  <span>{product.price.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</span>
                  <span className={product.quantity < 10 ? "text-destructive font-medium" : ""}>
                    Estoque: {product.quantity} un.
                  </span>
                </div>
              </div>
              <div className="flex gap-2 flex-shrink-0">
                <Button variant="outline" size="icon" onClick={() => handleEdit(product)}>
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" onClick={() => handleDelete(product.id, product.name)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Editar Produto</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Nome do Produto</Label>
                <Input id="edit-name" value={editName} onChange={(e) => setEditName(e.target.value)} />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="edit-price">Preço (R$)</Label>
                  <Input
                    id="edit-price"
                    type="number"
                    step="0.01"
                    value={editPrice}
                    onChange={(e) => setEditPrice(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-quantity">Quantidade</Label>
                  <Input
                    id="edit-quantity"
                    type="number"
                    value={editQuantity}
                    onChange={(e) => setEditQuantity(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-image">Imagem do Produto</Label>
                {editImagePreview ? (
                  <div className="relative">
                    <img
                      src={editImagePreview || "/placeholder.svg"}
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
                      htmlFor="edit-image"
                      className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-border rounded-lg cursor-pointer hover:bg-accent/50 transition-colors"
                    >
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <ImageIcon className="w-10 h-10 mb-3 text-muted-foreground" />
                        <p className="mb-2 text-sm text-muted-foreground">
                          <span className="font-semibold">Clique para adicionar</span> ou arraste uma imagem
                        </p>
                        <p className="text-xs text-muted-foreground">PNG, JPG ou WEBP (máx. 5MB)</p>
                      </div>
                      <Input
                        id="edit-image"
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={handleImageChange}
                      />
                    </label>
                  </div>
                )}
              </div>

              <Button onClick={handleUpdate} className="w-full">
                Salvar Alterações
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  )
}
