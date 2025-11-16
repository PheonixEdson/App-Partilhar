import React from "react";
import { ScrollView } from "react-native";
import { styled } from "nativewind";
import { SalesForm } from "../components/SalesForm";
import { SalesList } from "../components/SalesList";

const StyledScrollView = styled(ScrollView);

export function SalesScreen() {
  return (
    <StyledScrollView className="flex-1 p-4">
      <SalesForm />
      <SalesList />
    </StyledScrollView>
  );
}
