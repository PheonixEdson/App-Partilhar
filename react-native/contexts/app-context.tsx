import React, { createContext, useContext, type ReactNode } from "react";
import { useLocalStorage } from "../hooks/use-local-storage";
import type { Product, Sale, PaymentReminder, Subscriber } from "../lib/types";
import uuid from "react-native-uuid";

interface AppContextType {
  products: Product[];
  sales: Sale[];
  paymentReminder: PaymentReminder | null;
  subscribers: Subscriber[];
  addProduct: (product: Omit<Product, "id" | "createdAt">) => void;
  updateProduct: (id: string, product: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  addSale: (sale: Omit<Sale, "id" | "createdAt">) => void;
  updatePaymentReminder: (reminder: PaymentReminder) => void;
  addSubscriber: (
    subscriber: Omit<Subscriber, "id" | "createdAt" | "lastResetDate">
  ) => void;
  updateSubscriber: (id: string, subscriber: Partial<Subscriber>) => void;
  deleteSubscriber: (id: string) => void;
  markSubscriberAsPaid: (id: string) => void;
  checkAndResetMonthlyPayments: () => void;
  isLoaded: boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [products, setProducts, productsLoaded] = useLocalStorage<Product[]>(
    "products",
    []
  );
  const [sales, setSales, salesLoaded] = useLocalStorage<Sale[]>("sales", []);
  const [paymentReminder, setPaymentReminder, reminderLoaded] =
    useLocalStorage<PaymentReminder | null>("paymentReminder", null);
  const [subscribers, setSubscribers, subscribersLoaded] = useLocalStorage<
    Subscriber[]
  >("subscribers", []);

  const isLoaded =
    productsLoaded && salesLoaded && reminderLoaded && subscribersLoaded;

  const addProduct = (product: Omit<Product, "id" | "createdAt">) => {
    const newProduct: Product = {
      ...product,
      id: uuid.v4() as string,
      createdAt: new Date().toISOString(),
    };
    setProducts([...products, newProduct]);
  };

  const updateProduct = (id: string, updatedProduct: Partial<Product>) => {
    setProducts(
      products.map((p) => (p.id === id ? { ...p, ...updatedProduct } : p))
    );
  };

  const deleteProduct = (id: string) => {
    setProducts(products.filter((p) => p.id !== id));
  };

  const addSale = (sale: Omit<Sale, "id" | "createdAt">) => {
    const newSale: Sale = {
      ...sale,
      id: uuid.v4() as string,
      createdAt: new Date().toISOString(),
    };
    setSales([...sales, newSale]);

    const product = products.find((p) => p.id === sale.productId);
    if (product) {
      updateProduct(product.id, { quantity: product.quantity - sale.quantity });
    }
  };

  const updatePaymentReminder = (reminder: PaymentReminder) => {
    setPaymentReminder(reminder);
  };

  const addSubscriber = (
    subscriber: Omit<Subscriber, "id" | "createdAt" | "lastResetDate">
  ) => {
    const newSubscriber: Subscriber = {
      ...subscriber,
      id: uuid.v4() as string,
      lastResetDate: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    };
    setSubscribers([...subscribers, newSubscriber]);
  };

  const updateSubscriber = (
    id: string,
    updatedSubscriber: Partial<Subscriber>
  ) => {
    setSubscribers(
      subscribers.map((s) => (s.id === id ? { ...s, ...updatedSubscriber } : s))
    );
  };

  const deleteSubscriber = (id: string) => {
    setSubscribers(subscribers.filter((s) => s.id !== id));
  };

  const markSubscriberAsPaid = (id: string) => {
    updateSubscriber(id, {
      isPaid: true,
      lastPaymentDate: new Date().toISOString(),
    });
  };

  const checkAndResetMonthlyPayments = () => {
    const now = new Date();
    const updatedSubscribers = subscribers.map((subscriber) => {
      const lastReset = new Date(subscriber.lastResetDate);
      const daysSinceReset = Math.floor(
        (now.getTime() - lastReset.getTime()) / (1000 * 60 * 60 * 24)
      );

      if (daysSinceReset >= 30) {
        return {
          ...subscriber,
          isPaid: false,
          lastResetDate: now.toISOString(),
        };
      }
      return subscriber;
    });

    setSubscribers(updatedSubscribers);
  };

  return (
    <AppContext.Provider
      value={{
        products,
        sales,
        paymentReminder,
        subscribers,
        addProduct,
        updateProduct,
        deleteProduct,
        addSale,
        updatePaymentReminder,
        addSubscriber,
        updateSubscriber,
        deleteSubscriber,
        markSubscriberAsPaid,
        checkAndResetMonthlyPayments,
        isLoaded,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
}
