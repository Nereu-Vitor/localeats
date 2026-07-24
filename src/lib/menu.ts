export type CategoryId = string

export type Category = {
  id: CategoryId
  label: string
}

export type Product = {
  id: string
  name: string
  description?: string
  price: number
  image_url?: string
  category: CategoryId
  is_available?: boolean
  tag?: string
}

export const categories: Category[] = [
  { id: "hamburgueres", label: "Hambúrgueres" },
  { id: "bebidas", label: "Bebidas" },
  { id: "acompanhamentos", label: "Acompanhamentos" },
  { id: "pasteis", label: "Pastéis" },
  { id: "calzones", label: "Calzones" },
]

// 🟢 Adicione esta função abaixo:
export const formatPrice = (price: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(price)
}