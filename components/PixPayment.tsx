import React from "react";
import { View, Text } from "react-native";
import QRCode from "react-native-qrcode-svg";
import { styled } from "nativewind";

const StyledView = styled(View);
const StyledText = styled(Text);

interface PixPaymentProps {
  pixKey: string;
  amount: number;
  description: string;
}

export function PixPayment({ pixKey, amount, description }: PixPaymentProps) {
  const pixPayload = `00020126330014br.gov.bcb.pix0111${pixKey}520400005303986540${amount
    .toFixed(2)
    .toString()
    .replace(".", ",")}5802BR5913${description}6009SAO PAULO62070503***6304E4B2`;

  return (
    <StyledView className="items-center p-4">
      <StyledText className="text-lg font-bold mb-4">
        Pague com PIX
      </StyledText>
      <QRCode value={pixPayload} size={200} />
      <StyledText className="mt-4 text-center">
        Abra o aplicativo do seu banco e escaneie o QR code para pagar.
      </StyledText>
    </StyledView>
  );
}
