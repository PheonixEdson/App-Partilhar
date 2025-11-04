import { PixPayment } from "@/components/pix-payment"
import { SubscriberForm } from "@/components/subscriber-form"
import { SubscribersList } from "@/components/subscribers-list"

export default function PaymentPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Mensalidade</h1>
        <p className="text-muted-foreground">Gerencie assinantes e pagamentos mensais via PIX</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <SubscriberForm />
        <PixPayment />
      </div>

      <SubscribersList />
    </div>
  )
}
