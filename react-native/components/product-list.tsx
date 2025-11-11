import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  Modal,
  TextInput,
  Button,
  StyleSheet,
  Alert,
} from "react-native";
import { Pencil, Trash2, ImageIcon, X } from "lucide-react-native";
import { useApp } from "../contexts/app-context";
import type { Product } from "../lib/types";
import * as ImagePicker from "expo-image-picker";
import { styled } from "nativewind";

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledTouchableOpacity = styled(TouchableOpacity);
const StyledImage = styled(Image);
const StyledTextInput = styled(TextInput);

export function ProductList() {
  const { products, updateProduct, deleteProduct } = useApp();
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editName, setEditName] = useState("");
  const [editPrice, setEditPrice] = useState("");
  const [editQuantity, setEditQuantity] = useState("");
  const [editImagePreview, setEditImagePreview] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setEditName(product.name);
    setEditPrice(product.price.toString());
    setEditQuantity(product.quantity.toString());
    setEditImagePreview(product.imageUrl || null);
    setIsDialogOpen(true);
  };

  const handleImageChange = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      Alert.alert("Permission to access camera roll is required!");
      return;
    }

    const pickerResult = await ImagePicker.launchImageLibraryAsync();
    if (pickerResult.canceled === true) {
      return;
    }

    if (pickerResult.assets && pickerResult.assets.length > 0) {
      setEditImagePreview(pickerResult.assets[0].uri);
    }
  };

  const handleRemoveImage = () => {
    setEditImagePreview(null);
  };

  const handleUpdate = () => {
    if (!editingProduct) return;

    if (!editName || !editPrice || !editQuantity) {
      Alert.alert("Erro", "Preencha todos os campos");
      return;
    }

    updateProduct(editingProduct.id, {
      name: editName,
      price: Number.parseFloat(editPrice),
      quantity: Number.parseInt(editQuantity),
      imageUrl: editImagePreview || undefined,
    });

    setIsDialogOpen(false);
    setEditingProduct(null);
  };

  const handleDelete = (id: string, name: string) => {
    Alert.alert("Confirmar", `Tem certeza que deseja excluir "${name}"?`, [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Excluir",
        onPress: () => deleteProduct(id),
        style: "destructive",
      },
    ]);
  };

  const renderItem = ({ item }: { item: Product }) => (
    <StyledView className="flex-row items-center gap-4 p-4 border border-gray-200 rounded-lg mb-3">
      {item.imageUrl ? (
        <StyledImage
          source={{ uri: item.imageUrl }}
          className="w-16 h-16 rounded-md"
        />
      ) : (
        <StyledView className="w-16 h-16 bg-gray-200 rounded-md flex items-center justify-center">
          <ImageIcon className="w-8 h-8 text-gray-400" />
        </StyledView>
      )}
      <StyledView className="flex-1">
        <StyledText className="font-semibold text-lg">{item.name}</StyledText>
        <StyledView className="flex-row gap-4 mt-1">
          <StyledText className="text-sm text-gray-500">
            {item.price.toLocaleString("pt-BR", {
              style: "currency",
              currency: "BRL",
            })}
          </StyledText>
          <StyledText
            className={`text-sm ${
              item.quantity < 10 ? "text-red-500 font-medium" : "text-gray-500"
            }`}
          >
            Estoque: {item.quantity} un.
          </StyledText>
        </StyledView>
      </StyledView>
      <StyledView className="flex-row gap-2">
        <StyledTouchableOpacity onPress={() => handleEdit(item)}>
          <Pencil className="h-5 w-5 text-blue-500" />
        </StyledTouchableOpacity>
        <StyledTouchableOpacity onPress={() => handleDelete(item.id, item.name)}>
          <Trash2 className="h-5 w-5 text-red-500" />
        </StyledTouchableOpacity>
      </StyledView>
    </StyledView>
  );

  if (products.length === 0) {
    return (
      <StyledView className="p-8">
        <StyledText className="text-center text-gray-500">
          Nenhum produto cadastrado.
        </StyledText>
      </StyledView>
    );
  }

  return (
    <StyledView className="p-4">
      <StyledText className="text-xl font-bold mb-4">
        Produtos Cadastrados ({products.length})
      </StyledText>
      <FlatList
        data={products}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
      />
      <Modal visible={isDialogOpen} animationType="slide">
        <StyledView className="p-4 mt-10">
          <StyledText className="text-xl font-bold mb-4">Editar Produto</StyledText>
          <StyledView className="space-y-4">
            <StyledView>
              <StyledText className="mb-2">Nome do Produto</StyledText>
              <StyledTextInput
                className="border border-gray-300 p-2 rounded-lg"
                value={editName}
                onChangeText={setEditName}
              />
            </StyledView>
            <StyledView>
              <StyledText className="mb-2">Preço (R$)</StyledText>
              <StyledTextInput
                className="border border-gray-300 p-2 rounded-lg"
                value={editPrice}
                onChangeText={setEditPrice}
                keyboardType="numeric"
              />
            </StyledView>
            <StyledView>
              <StyledText className="mb-2">Quantidade</StyledText>
              <StyledTextInput
                className="border border-gray-300 p-2 rounded-lg"
                value={editQuantity}
                onChangeText={setEditQuantity}
                keyboardType="numeric"
              />
            </StyledView>
            <StyledView>
              <StyledText className="mb-2">Imagem do Produto</StyledText>
              {editImagePreview ? (
                <StyledView className="relative">
                  <StyledImage
                    source={{ uri: editImagePreview }}
                    className="w-full h-48 rounded-lg"
                  />
                  <StyledTouchableOpacity
                    className="absolute top-2 right-2 bg-red-500 p-1 rounded-full"
                    onPress={handleRemoveImage}
                  >
                    <X className="h-4 w-4 text-white" />
                  </StyledTouchableOpacity>
                </StyledView>
              ) : (
                <StyledTouchableOpacity
                  className="flex items-center justify-center w-full h-48 border-2 border-dashed border-gray-300 rounded-lg"
                  onPress={handleImageChange}
                >
                  <ImageIcon className="w-10 h-10 mb-3 text-gray-400" />
                  <StyledText className="text-sm text-gray-500">
                    Clique para adicionar uma imagem
                  </StyledText>
                </StyledTouchableOpacity>
              )}
            </StyledView>
            <Button title="Salvar Alterações" onPress={handleUpdate} />
            <Button title="Cancelar" onPress={() => setIsDialogOpen(false)} color="red" />
          </StyledView>
        </StyledView>
      </Modal>
    </StyledView>
  );
}
