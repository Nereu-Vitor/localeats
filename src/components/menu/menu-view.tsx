"use client"

import { useState } from "react"
import { useSelector, useDispatch } from "react-redux"
import { addToCart } from "@/store/cartSlice"
import { MenuHeader } from "./menu-header"
import { CategoryTabs } from "./category-tabs"
import { ProductCard } from "./product-card"

interface Product {
  id: string | number
  name: string
  description: string
  price: number
  category: string
  image_url?: string
  [key: string]: any
}

interface MenuViewProps {
  products?: Product[]
}

// Remove acentos e padroniza para comparação
const normalizeString = (str: string) =>
  str
    ? str
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
    : ""

export function MenuView({ products = [] }: MenuViewProps) {
  const [selectedCategory, setSelectedCategory] = useState("hamburgueres")
  const [searchQuery, setSearchQuery] = useState("")

  const dispatch = useDispatch()
  const cartItems = useSelector((state: any) => state.cart?.items || [])

  const normSearch = normalizeString(searchQuery).trim()
  const isSearching = normSearch.length > 0

  // Filtra os produtos REAIS vindos do seu banco de dados
  const filteredProducts = products.filter((product) => {
    const normCategory = normalizeString(product.category)
    const normSelected = normalizeString(selectedCategory)

    // Se o usuário digitou na busca, pesquisa em TODOS os produtos do banco
    if (isSearching) {
      return (
        normalizeString(product.name).includes(normSearch) ||
        normalizeString(product.description).includes(normSearch) ||
        normCategory.includes(normSearch)
      )
    }

    // Se não está buscando, filtra pela aba selecionada
    return (
      selectedCategory === "todos" ||
      normCategory === normSelected ||
      normCategory.includes(normSelected) ||
      normSelected.includes(normCategory)
    )
  })

  return (
    <div className="min-h-screen bg-background pb-12">
      {/* 1. Cabeçalho com Busca */}
      <MenuHeader
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      <main className="container mx-auto px-4 py-6 space-y-6">
        {/* 2. Abas de Categorias */}
        <CategoryTabs
          {...({
            selectedCategory,
            onSelectCategory: setSelectedCategory,
            activeCategory: selectedCategory,
            onCategoryChange: setSelectedCategory,
          } as any)}
        />

        {/* 3. Título */}
        <div>
          <h2 className="text-xl font-bold capitalize text-foreground">
            {isSearching ? `Resultados para "${searchQuery}"` : selectedCategory}
          </h2>
          <p className="text-sm text-muted-foreground">
            {filteredProducts.length} ite
            {filteredProducts.length === 1 ? "m disponível" : "ns disponíveis"}
          </p>
        </div>

        {/* 4. Lista de Produtos */}
        {filteredProducts.length === 0 ? (
          <div className="py-12 text-center text-muted-foreground">
            <p className="text-lg font-medium">Nenhum item encontrado</p>
            <p className="text-sm">
              {isSearching
                ? "Nenhum produto cadastrado no banco bate com essa pesquisa."
                : "Não há produtos cadastrados no banco para esta categoria."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredProducts.map((product) => {
              const itemInCart = cartItems.find((item: any) => item.id === product.id)
              const quantityInCart = itemInCart ? itemInCart.quantity : 0

              return (
                <ProductCard
                  key={product.id}
                  {...({
                    product,
                    quantityInCart,
                    onAdd: () => dispatch(addToCart(product as any)),
                  } as any)}
                />
              )
            })}
          </div>
        )}
      </main>
    </div>
  )
}