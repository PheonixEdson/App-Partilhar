import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  Alert,
  TouchableOpacity,
  Image,
} from "react-native";
import { useApp } from "../contexts/app-context";
import { styled } from "nativewind";
import * as ImagePicker from "expo-image-picker";
import { ImageIcon } from "lucide-react-native";

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledTextInput = styled(TextInput);
const StyledTouchableOpacity = styled(TouchableOpacity);

export function ProductForm() {
  const { addProduct } = useApp();
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [image, setImage] = useState<string | null>(null);

  const handleImagePick = async () => {
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
      setImage(pickerResult.assets[0].uri);
    }
  };

  const handleSubmit = () => {
    if (!name || !price || !quantity) {
      Alert.alert("Erro", "Preencha todos os campos");
      return;
    }

    addProduct({
      name,
      price: Number.parseFloat(price),
      quantity: Number.parseInt(quantity),
      imageUrl: image || undefined,
    });

    setName("");
    setPrice("");
    setQuantity("");
    setImage(null);
    Alert.alert("Sucesso", "Produto adicionado com sucesso");
  };

  return (
    <StyledView className="p-4 border border-gray-200 rounded-lg mb-4">
      <StyledText className="text-xl font-bold mb-4">
        Adicionar Novo Produto
      </StyledText>
      <StyledView className="space-y-4">
        <StyledView>
          <StyledText className="mb-2">Nome do Produto</StyledText>
          <StyledTextInput
            className="border border-gray-300 p-2 rounded-lg"
            value={name}
            onChangeText={setName}
          />
        </StyledView>
        <StyledView>
          <StyledText className="mb-2">Preço (R$)</StyledText>
          <StyledTextInput
            className="border border-gray-300 p-2 rounded-lg"
            value={price}
            onChangeText={setPrice}
            keyboardType="numeric"
          />
        </StyledView>
        <StyledView>
          <StyledText className="mb-2">Quantidade</StyledText>
          <StyledTextInput
            className="border border-gray-300 p-2 rounded-lg"
            value={quantity}
            onChangeText={setQuantity}
            keyboardType="numeric"
          />
        </StyledView>
        <StyledView>
          <StyledText className="mb-2">Imagem do Produto</StyledText>
          <StyledTouchableOpacity
            className="flex items-center justify-center w-full h-48 border-2 border-dashed border-gray-300 rounded-lg"
            onPress={handleImagePick}
          >
            {image ? (
              <Image
                source={{ uri: image }}
                className="w-full h-full rounded-lg"
              />
            ) : (
              <ImageIcon className="w-10 h-10 mb-3 text-gray-400" />
            )}
          </StyledTouchableOpacity>
        </StyledView>
        <Button title="Adicionar Produto" onPress={handleSubmit} />
      </StyledView>
    </StyledView>
  );
}
