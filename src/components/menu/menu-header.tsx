"use client"

import { UtensilsCrossed, MapPin, Search } from "lucide-react"
import { CartSheet } from "./cart-sheet"

interface MenuHeaderProps {
  searchQuery?: string
  onSearchChange?: (query: string) => void
}

export function MenuHeader({ searchQuery = "", onSearchChange }: MenuHeaderProps) {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex flex-col gap-4 p-4">
        {/* Topo: Logo + Localização + Carrinho */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-md">
              <UtensilsCrossed className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-foreground">LocalEats</h1>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <MapPin className="h-3 w-3 text-primary" />
                <span>Terra Nova - PE e região</span>
              </div>
            </div>
          </div>

          {/* Carrinho conectado ao Redux no Canto Superior Direito */}
          <CartSheet />
        </div>

        {/* Barra de Busca */}
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Buscar por hambúrgueres, bebidas..."
            value={searchQuery}
            onChange={(e) => onSearchChange && onSearchChange(e.target.value)}
            className="w-full rounded-xl border border-input bg-background pl-9 pr-4 py-2.5 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      </div>
    </header>
  )
}