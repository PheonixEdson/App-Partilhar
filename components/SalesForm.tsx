import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  Modal,
  FlatList,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useApp } from "../contexts/app-context";
import { styled } from "nativewind";

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledTextInput = styled(TextInput);
const StyledTouchableOpacity = styled(TouchableOpacity);

export function SalesForm() {
  const { products, addSale } = useApp();
  const [selectedProductId, setSelectedProductId] = useState("");
  const [quantity, setQuantity] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);

  const selectedProduct = products.find((p) => p.id === selectedProductId);

  const handleSubmit = () => {
    if (!selectedProductId || !quantity) {
      Alert.alert("Erro", "Selecione um produto e informe a quantidade");
      return;
    }

    const quantityNum = Number.parseInt(quantity);

    if (quantityNum <= 0) {
      Alert.alert("Erro", "A quantidade deve ser maior que zero");
      return;
    }

    if (!selectedProduct) {
      Alert.alert("Erro", "Produto não encontrado");
      return;
    }

    if (quantityNum > selectedProduct.quantity) {
      Alert.alert(
        "Erro",
        `Estoque insuficiente. Disponível: ${selectedProduct.quantity} unidades`
      );
      return;
    }

    addSale({
      productId: selectedProduct.id,
      productName: selectedProduct.name,
      quantity: quantityNum,
      totalPrice: selectedProduct.price * quantityNum,
    });

    Alert.alert("Sucesso", "Venda registrada com sucesso");
    setSelectedProductId("");
    setQuantity("");
  };

  const renderProductItem = ({ item }: { item: any }) => (
    <StyledTouchableOpacity
      className="p-4 border-b border-gray-200"
      onPress={() => {
        setSelectedProductId(item.id);
        setIsModalVisible(false);
      }}
      disabled={item.quantity === 0}
    >
      <StyledText
        className={`${item.quantity === 0 ? "text-gray-400" : "text-black"}`}
      >
        {item.name} -{" "}
        {item.price.toLocaleString("pt-BR", {
          style: "currency",
          currency: "BRL",
        })}{" "}
        ({item.quantity} em estoque)
      </StyledText>
    </StyledTouchableOpacity>
  );

  if (products.length === 0) {
    return (
      <StyledView className="p-8">
        <StyledText className="text-center text-gray-500">
          Nenhum produto disponível.
        </StyledText>
      </StyledView>
    );
  }

  return (
    <StyledView className="p-4 border border-gray-200 rounded-lg">
      <StyledText className="text-xl font-bold mb-4">
        Registrar Nova Venda
      </StyledText>
      <StyledView className="space-y-4">
        <StyledView>
          <StyledText className="mb-2">Produto</StyledText>
          <StyledTouchableOpacity
            className="border border-gray-300 p-2 rounded-lg"
            onPress={() => setIsModalVisible(true)}
          >
            <StyledText>
              {selectedProduct ? selectedProduct.name : "Selecione um produto"}
            </StyledText>
          </StyledTouchableOpacity>
          <Modal visible={isModalVisible} animationType="slide">
            <StyledView className="mt-10">
              <Button title="Fechar" onPress={() => setIsModalVisible(false)} />
              <FlatList
                data={products}
                renderItem={renderProductItem}
                keyExtractor={(item) => item.id}
              />
            </StyledView>
          </Modal>
        </StyledView>
        {selectedProduct && (
          <StyledView className="p-4 bg-gray-100 rounded-lg space-y-2">
            <StyledView className="flex-row justify-between">
              <StyledText className="text-gray-500">Preço unitário:</StyledText>
              <StyledText className="font-medium">
                {selectedProduct.price.toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                })}
              </StyledText>
            </StyledView>
            <StyledView className="flex-row justify-between">
              <StyledText className="text-gray-500">
                Estoque disponível:
              </StyledText>
              <StyledText className="font-medium">
                {selectedProduct.quantity} unidades
              </StyledText>
            </StyledView>
          </StyledView>
        )}
        <StyledView>
          <StyledText className="mb-2">Quantidade</StyledText>
          <StyledTextInput
            className="border border-gray-300 p-2 rounded-lg"
            placeholder="0"
            value={quantity}
            onChangeText={setQuantity}
            keyboardType="numeric"
          />
        </StyledView>
        {selectedProduct && quantity && Number.parseInt(quantity) > 0 && (
          <StyledView className="p-4 bg-blue-100 rounded-lg">
            <StyledView className="flex-row justify-between items-center">
              <StyledText className="font-medium">Total da venda:</StyledText>
              <StyledText className="text-2xl font-bold">
                {(selectedProduct.price * Number.parseInt(quantity)).toLocaleString(
                  "pt-BR",
                  { style: "currency", currency: "BRL" }
                )}
              </StyledText>
            </StyledView>
          </StyledView>
        )}
        <Button
          title="Registrar Venda"
          onPress={handleSubmit}
          disabled={!selectedProductId || !quantity}
        />
      </StyledView>
    </StyledView>
  );
}
