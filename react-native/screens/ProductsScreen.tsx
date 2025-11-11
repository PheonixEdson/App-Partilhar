import React from "react";
import { ScrollView } from "react-native";
import { styled } from "nativewind";
import { ProductForm } from "../components/ProductForm";
import { ProductList } from "../components/product-list";

const StyledScrollView = styled(ScrollView);

export function ProductsScreen() {
  return (
    <StyledScrollView className="flex-1 p-4">
      <ProductForm />
      <ProductList />
    </StyledScrollView>
  );
}
