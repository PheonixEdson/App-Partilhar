import { SalesForm } from "@/components/sales-form"
import { SalesList } from "@/components/sales-list"

export default function SalesPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Vendas</h1>
        <p className="text-muted-foreground">Registre e acompanhe suas vendas</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <SalesForm />
        <SalesList />
      </div>
    </div>
  )
}
