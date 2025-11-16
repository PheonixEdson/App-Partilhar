import React from "react";
import { View, Text, FlatList } from "react-native";
import { useApp } from "../contexts/app-context";
import { styled } from "nativewind";
import { Calendar, Package, DollarSign } from "lucide-react-native";

const StyledView = styled(View);
const StyledText = styled(Text);

export function SalesList() {
  const { sales } = useApp();

  const sortedSales = [...sales].sort(
    (a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  const renderItem = ({ item }: { item: any }) => (
    <StyledView className="p-4 border border-gray-200 rounded-lg mb-3">
      <StyledView className="flex-row justify-between">
        <StyledView className="flex-1">
          <StyledText className="font-semibold flex-row items-center gap-2">
            <Package className="h-4 w-4 text-gray-500" />
            {item.productName}
          </StyledText>
        </StyledView>
        <StyledView className="text-right">
          <StyledText className="font-bold text-lg">
            {item.totalPrice.toLocaleString("pt-BR", {
              style: "currency",
              currency: "BRL",
            })}
          </StyledText>
        </StyledView>
      </StyledView>
      <StyledView className="flex-row items-center gap-4 mt-2">
        <StyledView className="flex-row items-center gap-1">
          <DollarSign className="h-3 w-3 text-gray-500" />
          <StyledText className="text-sm text-gray-500">
            {item.quantity} unidade(s)
          </StyledText>
        </StyledView>
        <StyledView className="flex-row items-center gap-1">
          <Calendar className="h-3 w-3 text-gray-500" />
          <StyledText className="text-sm text-gray-500">
            {new Date(item.createdAt).toLocaleDateString("pt-BR", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </StyledText>
        </StyledView>
      </StyledView>
    </StyledView>
  );

  if (sales.length === 0) {
    return (
      <StyledView className="p-8">
        <StyledText className="text-center text-gray-500">
          Nenhuma venda registrada ainda.
        </StyledText>
      </StyledView>
    );
  }

  return (
    <StyledView className="p-4">
      <StyledText className="text-xl font-bold mb-4">
        Histórico de Vendas ({sales.length})
      </StyledText>
      <FlatList
        data={sortedSales}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
      />
    </StyledView>
  );
}
