import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Home, Package, ShoppingCart, CreditCard } from "lucide-react-native";
import { DashboardScreen } from "../screens/DashboardScreen";
import { ProductsScreen } from "../screens/ProductsScreen";
import { SalesScreen } from "../screens/SalesScreen";
import { PaymentScreen } from "../screens/PaymentScreen";

const Tab = createBottomTabNavigator();

const navItems = [
  { name: "Dashboard", component: DashboardScreen, icon: Home },
  { name: "Produtos", component: ProductsScreen, icon: Package },
  { name: "Vendas", component: SalesScreen, icon: ShoppingCart },
  { name: "Mensalidade", component: PaymentScreen, icon: CreditCard },
];

export function Navigation() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size, focused }) => {
          const Icon = navItems.find((item) => item.name === route.name)?.icon;
          return Icon ? (
            <Icon
              size={size}
              color={focused ? "#007BFF" : color}
              strokeWidth={focused ? 3 : 2}
            />
          ) : null;
        },
        tabBarActiveTintColor: "#007BFF",
        tabBarInactiveTintColor: "gray",
        tabBarStyle: {
          display: "flex",
        },
      })}
    >
      {navItems.map((item) => (
        <Tab.Screen
          key={item.name}
          name={item.name}
          component={item.component}
        />
      ))}
    </Tab.Navigator>
  );
}
