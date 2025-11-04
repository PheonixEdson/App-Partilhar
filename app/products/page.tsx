import { ProductForm } from "@/components/product-form"
import { ProductList } from "@/components/product-list"

export default function ProductsPage() {
  return (
    <div className="space-y-6 md:space-y-8">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Produtos</h1>
        <p className="text-sm md:text-base text-muted-foreground">Gerencie seu catálogo de produtos</p>
      </div>

      <div className="grid gap-4 md:gap-6 lg:grid-cols-2">
        <ProductForm />
        <ProductList />
      </div>
    </div>
  )
}
