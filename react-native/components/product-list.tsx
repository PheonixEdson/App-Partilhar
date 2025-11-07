import type React from "react"
import { useState } from "react"
import { useApp } from "../contexts/app-context"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog"
import { useToast } from "../hooks/use-toast"
import type { Product } from "../lib/types"
import { View, Text, StyleSheet, Image, TouchableOpacity, Alert } from "react-native"
// Assuming you have a React Native icon library like @expo/vector-icons
// import { Feather } from "@expo/vector-icons";

// Placeholder for icons
const Pencil = () => <Text>✏️</Text>;
const Trash2 = () => <Text>🗑️</Text>;
const ImageIcon = () => <Text>🖼️</Text>;
const X = () => <Text>❌</Text>;

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

  const handleImageChange = () => {
    // This would be replaced with a React Native image picker library
    // For now, we'll just log a message
    console.log("Image picker would be launched here.")
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
    Alert.alert(
      "Confirmar Exclusão",
      `Tem certeza que deseja excluir "${name}"?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          onPress: () => {
            deleteProduct(id)
            toast({
              title: "Sucesso",
              description: "Produto excluído com sucesso",
            })
          },
          style: "destructive",
        },
      ]
    )
  }

  if (products.length === 0) {
    return (
      <Card>
        <CardContent style={styles.centered}>
          <Text style={styles.mutedForeground}>
            Nenhum produto cadastrado. Adicione seu primeiro produto acima.
          </Text>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <Text>Produtos Cadastrados ({products.length})</Text>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <View style={styles.listContainer}>
          {products.map((product) => (
            <View key={product.id} style={styles.productItem}>
              {product.imageUrl ? (
                <Image
                  source={{ uri: product.imageUrl }}
                  style={styles.productImage}
                />
              ) : (
                <View style={[styles.productImage, styles.imagePlaceholder]}>
                  <ImageIcon />
                </View>
              )}
              <View style={styles.productDetails}>
                <Text style={styles.productName}>{product.name}</Text>
                <View style={styles.productMeta}>
                  <Text>{product.price.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</Text>
                  <Text style={product.quantity < 10 ? styles.lowStock : {}}>
                    Estoque: {product.quantity} un.
                  </Text>
                </View>
              </View>
              <View style={styles.productActions}>
                <Button variant="outline" size="icon" onPress={() => handleEdit(product)}>
                  <Pencil />
                </Button>
                <Button variant="outline" size="icon" onPress={() => handleDelete(product.id, product.name)}>
                  <Trash2 />
                </Button>
              </View>
            </View>
          ))}
        </View>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                <Text>Editar Produto</Text>
              </DialogTitle>
            </DialogHeader>
            <View style={styles.dialogBody}>
              <View style={styles.formGroup}>
                <Label>Nome do Produto</Label>
                <Input value={editName} onChangeText={setEditName} />
              </View>

              <View style={styles.grid}>
                <View style={styles.formGroup}>
                  <Label>Preço (R$)</Label>
                  <Input
                    keyboardType="numeric"
                    value={editPrice}
                    onChangeText={setEditPrice}
                  />
                </View>
                <View style={styles.formGroup}>
                  <Label>Quantidade</Label>
                  <Input
                    keyboardType="numeric"
                    value={editQuantity}
                    onChangeText={setEditQuantity}
                  />
                </View>
              </View>

              <View style={styles.formGroup}>
                <Label>Imagem do Produto</Label>
                {editImagePreview ? (
                  <View>
                    <Image
                      source={{ uri: editImagePreview }}
                      style={styles.imagePreview}
                    />
                    <TouchableOpacity
                      style={styles.removeImageButton}
                      onPress={handleRemoveImage}
                    >
                      <X />
                    </TouchableOpacity>
                  </View>
                ) : (
                  <TouchableOpacity onPress={handleImageChange}>
                    <View style={styles.imagePicker}>
                      <ImageIcon />
                      <Text style={styles.mutedForeground}>Clique para adicionar uma imagem</Text>
                    </View>
                  </TouchableOpacity>
                )}
              </View>

              <Button onPress={handleUpdate}>
                <Text>Salvar Alterações</Text>
              </Button>
            </View>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  )
}

const styles = StyleSheet.create({
  centered: {
    justifyContent: "center",
    alignItems: "center",
    padding: 32,
  },
  mutedForeground: {
    color: "#6B7280",
  },
  listContainer: {
    gap: 12,
  },
  productItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 8,
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  imagePlaceholder: {
    backgroundColor: "#F3F4F6",
    justifyContent: "center",
    alignItems: "center",
  },
  productDetails: {
    flex: 1,
  },
  productName: {
    fontWeight: "600",
  },
  productMeta: {
    flexDirection: "row",
    gap: 16,
    marginTop: 4,
    color: "#6B7280",
  },
  lowStock: {
    color: "#EF4444",
    fontWeight: "500",
  },
  productActions: {
    flexDirection: "row",
    gap: 8,
  },
  dialogBody: {
    gap: 16,
  },
  formGroup: {
    gap: 8,
  },
  grid: {
    flexDirection: "row",
    gap: 16,
  },
  imagePreview: {
    width: "100%",
    height: 192,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  removeImageButton: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "#EF4444",
    padding: 8,
    borderRadius: 999,
  },
  imagePicker: {
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: 192,
    borderWidth: 2,
    borderStyle: "dashed",
    borderColor: "#E5E7EB",
    borderRadius: 8,
  },
});
