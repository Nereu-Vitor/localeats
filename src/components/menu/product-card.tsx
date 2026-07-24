"use client"

import Image from "next/image"
import { Plus, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { formatPrice, type Product } from "@/lib/menu"

type ProductCardProps = {
  product: Product
  quantityInCart: number
  onAdd: () => void
}

export function ProductCard({ product, quantityInCart, onAdd }: ProductCardProps) {
  return (
    <div className="flex flex-col justify-between rounded-2xl border border-border bg-card p-4 transition-all hover:border-primary/50">
      <div className="flex gap-4">        
        <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-muted flex items-center justify-center">
          {product.image_url ? (
            <Image
              src={product.image_url}
              alt={product.name}
              fill
              sizes="80px"
              className="object-cover"
            />
          ) : (
            <span className="text-3xl">🍔</span>
          )}
        </div>

        <div className="flex flex-1 flex-col justify-center">
          {product.tag && (
            <span className="mb-1 w-fit rounded-md bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary uppercase tracking-wider">
              {product.tag}
            </span>
          )}
          <h3 className="font-heading text-base font-bold text-card-foreground">
            {product.name}
          </h3>
          {product.description && (
            <p className="line-clamp-2 text-xs text-muted-foreground mt-0.5">
              {product.description}
            </p>
          )}
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between pt-2 border-t border-border/50">
        <span className="font-heading text-base font-bold text-primary">
          {formatPrice(product.price)}
        </span>

        <Button
          type="button"
          onClick={onAdd}
          size="sm"
          className="gap-1.5 rounded-lg px-3 font-semibold"
        >
          {quantityInCart > 0 ? (
            <>
              <Check className="h-4 w-4" />
              <span>{quantityInCart} no carrinho</span>
            </>
          ) : (
            <>
              <Plus className="h-4 w-4" />
              <span>Adicionar</span>
            </>
          )}
        </Button>
      </div>
    </div>
  )
}