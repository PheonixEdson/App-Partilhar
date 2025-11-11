import React from "react";
import { View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { Navigation } from "./components/navigation";
import { AppProvider } from "./contexts/app-context";
import { styled } from "nativewind";

const StyledView = styled(View);

export default function App() {
  return (
    <AppProvider>
      <StyledView className="flex-1 items-center justify-center bg-gray-100">
        <StyledView className="w-full max-w-sm h-full bg-white shadow-lg">
          <NavigationContainer>
            <Navigation />
          </NavigationContainer>
        </StyledView>
      </StyledView>
    </AppProvider>
  );
}
