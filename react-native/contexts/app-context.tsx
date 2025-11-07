import React, { createContext, useContext } from "react";
import type { Product } from "@/lib/types";

const AppContext = createContext({
  products: [],
  updateProduct: (id: string, product: Partial<Product>) => {},
  deleteProduct: (id: string) => {},
});

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const products: Product[] = [
    { id: "1", name: "Product 1", price: 10, quantity: 100, imageUrl: "https://via.placeholder.com/150" },
    { id: "2", name: "Product 2", price: 20, quantity: 5, imageUrl: "https://via.placeholder.com/150" },
  ];

  const updateProduct = (id: string, product: Partial<Product>) => {
    console.log("Updating product", id, product);
  };

  const deleteProduct = (id: string) => {
    console.log("Deleting product", id);
  };

  return (
    <AppContext.Provider value={{ products, updateProduct, deleteProduct }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
