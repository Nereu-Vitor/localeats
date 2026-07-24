"use client"

interface Category {
  id: string
  label: string
}

const DEFAULT_CATEGORIES: Category[] = [
  { id: "hamburgueres", label: "Hambúrgueres" },
  { id: "bebidas", label: "Bebidas" },
  { id: "acompanhamentos", label: "Acompanhamentos" },
  { id: "pasteis", label: "Pastéis" },
  { id: "calzones", label: "Calzones" },
]

interface CategoryTabsProps {
  categories?: Category[]
  selectedCategory?: string
  activeCategory?: string
  active?: string
  onSelectCategory?: (id: string) => void
  onCategoryChange?: (id: string) => void
  onChange?: (id: string) => void
}

export function CategoryTabs({
  categories = DEFAULT_CATEGORIES,
  selectedCategory,
  activeCategory,
  active,
  onSelectCategory,
  onCategoryChange,
  onChange,
}: CategoryTabsProps) {
  const currentActive = activeCategory || selectedCategory || active || "hamburgueres"
  const handleSelect = onSelectCategory || onCategoryChange || onChange || (() => { })

  // Garantia de que a lista de categorias nunca seja undefined
  const categoryList = Array.isArray(categories) && categories.length > 0 ? categories : DEFAULT_CATEGORIES

  return (
    <div
      role="tablist"
      aria-label="Categorias do cardápio"
      className="sticky top-[132px] z-20 -mx-4 flex gap-2 overflow-x-auto bg-background/85 px-4 py-3 backdrop-blur supports-[backdrop-filter]:bg-background/60 scrollbar-none"
    >
      {categoryList.map((category) => {
        const isActive = category.id === currentActive

        return (
          <button
            key={category.id}
            role="tab"
            aria-selected={isActive}
            onClick={() => handleSelect(category.id)}
            className={`flex shrink-0 items-center justify-center rounded-xl px-4 py-2 text-sm font-semibold transition-all ${isActive
                ? "bg-primary text-primary-foreground shadow-sm"
                : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground"
              }`}
          >
            {category.label}
          </button>
        );
      })}
    </div>
  )
}