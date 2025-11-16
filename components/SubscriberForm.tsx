import React, { useState } from "react";
import { View, Text, TextInput, Button, Alert } from "react-native";
import { useApp } from "../contexts/app-context";
import { styled } from "nativewind";

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledTextInput = styled(TextInput);

export function SubscriberForm() {
  const { addSubscriber } = useApp();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const handleSubmit = () => {
    if (!name || !email) {
      Alert.alert("Erro", "Preencha todos os campos");
      return;
    }

    addSubscriber({
      name,
      email,
      isPaid: false,
      lastPaymentDate: null,
    });

    setName("");
    setEmail("");
    Alert.alert("Sucesso", "Assinante adicionado com sucesso");
  };

  return (
    <StyledView className="p-4 border border-gray-200 rounded-lg mb-4">
      <StyledText className="text-xl font-bold mb-4">
        Adicionar Novo Assinante
      </StyledText>
      <StyledView className="space-y-4">
        <StyledView>
          <StyledText className="mb-2">Nome</StyledText>
          <StyledTextInput
            className="border border-gray-300 p-2 rounded-lg"
            value={name}
            onChangeText={setName}
          />
        </StyledView>
        <StyledView>
          <StyledText className="mb-2">Email</StyledText>
          <StyledTextInput
            className="border border-gray-300 p-2 rounded-lg"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
          />
        </StyledView>
        <Button title="Adicionar Assinante" onPress={handleSubmit} />
      </StyledView>
    </StyledView>
  );
}
