import React, { useState } from "react";
import {
  ScrollView,
  FlatList,
  Button,
  Alert,
  View,
  Text,
  Modal,
} from "react-native";
import { styled } from "nativewind";
import { useApp } from "../contexts/app-context";
import type { Subscriber } from "../lib/types";
import { SubscriberForm } from "../components/SubscriberForm";
import { PixPayment } from "../components/PixPayment";

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledScrollView = styled(ScrollView);

export function PaymentScreen() {
  const { subscribers, markSubscriberAsPaid } = useApp();
  const [isPixModalVisible, setIsPixModalVisible] = useState(false);

  const handleMarkAsPaid = (id: string, name: string) => {
    Alert.alert(
      "Confirmar Pagamento",
      `Tem certeza que deseja marcar ${name} como pago?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Confirmar",
          onPress: () => markSubscriberAsPaid(id),
          style: "default",
        },
      ]
    );
  };

  const renderItem = ({ item }: { item: Subscriber }) => (
    <StyledView className="flex-row items-center justify-between p-4 border-b border-gray-200">
      <StyledView>
        <StyledText className="font-semibold">{item.name}</StyledText>
        <StyledText className="text-gray-500">{item.email}</StyledText>
      </StyledView>
      <StyledView>
        {item.isPaid ? (
          <StyledText className="text-green-500">Pago</StyledText>
        ) : (
          <Button
            title="Marcar como Pago"
            onPress={() => handleMarkAsPaid(item.id, item.name)}
          />
        )}
      </StyledView>
    </StyledView>
  );

  return (
    <StyledScrollView className="flex-1 p-4">
      <SubscriberForm />
      <StyledView className="my-4">
        <Button
          title="Pagar com PIX"
          onPress={() => setIsPixModalVisible(true)}
        />
      </StyledView>
      <StyledText className="text-2xl font-bold mb-4">
        Assinantes ({subscribers.length})
      </StyledText>
      <FlatList
        data={subscribers}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
      />
      <Modal visible={isPixModalVisible} animationType="slide">
        <StyledView className="flex-1 justify-center">
          <PixPayment
            pixKey="YOUR_PIX_KEY"
            amount={29.9}
            description="Mensalidade"
          />
          <Button title="Fechar" onPress={() => setIsPixModalVisible(false)} />
        </StyledView>
      </Modal>
    </StyledScrollView>
  );
}
