export interface Product {
  id: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl?: string;
  createdAt: string;
}

export interface Sale {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  totalPrice: number;
  createdAt: string;
}

export interface PaymentReminder {
  lastNotification: string;
  nextNotification: string;
}

export interface Subscriber {
  id: string;
  name: string;
  email: string;
  isPaid: boolean;
  lastPaymentDate: string | null;
  lastResetDate: string;
  createdAt: string;
}
