import React from "react";
import { View, Text } from "react-native";
import { styled } from "nativewind";
import { useApp } from "../contexts/app-context";

const StyledView = styled(View);
const StyledText = styled(Text);

export function DashboardScreen() {
  const { products, sales } = useApp();

  return (
    <StyledView className="flex-1 p-4">
      <StyledText className="text-2xl font-bold mb-4">Dashboard</StyledText>
      <StyledView className="flex-row justify-around">
        <StyledView className="items-center">
          <StyledText className="text-4xl font-bold">{products.length}</StyledText>
          <StyledText className="text-lg">Produtos</StyledText>
        </StyledView>
        <StyledView className="items-center">
          <StyledText className="text-4xl font-bold">{sales.length}</StyledText>
          <StyledText className="text-lg">Vendas</StyledText>
        </StyledView>
      </StyledView>
    </StyledView>
  );
}
