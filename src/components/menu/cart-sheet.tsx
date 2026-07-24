"use client"

import { useState, useEffect } from "react"
import { createPortal } from "react-dom"
import { ShoppingBag, Trash2 } from "lucide-react"
import { useSelector, useDispatch } from "react-redux"
import { removeFromCart, updateQuantity, clearCart } from "@/store/cartSlice"
import { CheckoutModal } from "./checkout-modal"

export function CartSheet() {
  const [mounted, setMounted] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false)

  const dispatch = useDispatch()
  const items = useSelector((state: any) => state.cart?.items || [])

  useEffect(() => {
    setMounted(true)
  }, [])

  const subtotal = items.reduce(
    (acc: number, item: any) => acc + item.price * item.quantity,
    0
  )
  const deliveryFee = 2.0
  const total = subtotal > 0 ? subtotal + deliveryFee : 0
  const totalItems = items.reduce(
    (acc: number, item: any) => acc + item.quantity,
    0
  )

  return (
    <>
      {/* Botão do Carrinho no Cabeçalho */}
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2 font-semibold text-primary-foreground shadow-lg hover:opacity-90 transition-all"
      >
        <ShoppingBag className="w-5 h-5" />
        <span>Carrinho</span>
        {totalItems > 0 && (
          <span className="ml-1 rounded-full bg-white px-2 py-0.5 text-xs font-bold text-primary">
            {totalItems}
          </span>
        )}
      </button>

      {/* Gaveta do Carrinho (Portal no body) */}
      {isOpen && mounted && createPortal(
        <div className="fixed inset-0 z-[9998] flex justify-end bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-md bg-card p-6 shadow-xl flex flex-col h-screen max-h-screen border-l border-border animate-in slide-in-from-right duration-300">

            {/* Cabecalho Fixo */}
            <div className="flex items-center justify-between pb-4 border-b border-border shrink-0">
              <h2 className="text-xl font-bold flex items-center gap-2 text-foreground">
                <ShoppingBag className="text-primary w-5 h-5" /> Seu pedido
                <span className="text-sm font-normal text-muted-foreground">
                  ({totalItems} ite{totalItems === 1 ? "m" : "ns"})
                </span>
              </h2>
              <button
                onClick={() => setIsOpen(false)}
                className="text-muted-foreground hover:text-foreground font-bold text-lg"
              >
                ✕
              </button>
            </div>

            {/* Lista de Itens */}
            <div className="flex-1 min-h-0 overflow-y-auto py-4 space-y-4 pr-1">
              {items.length === 0 ? (
                <div className="text-center py-16 text-muted-foreground">
                  <ShoppingBag className="w-16 h-16 mx-auto mb-3 opacity-30 text-primary" />
                  <p className="font-semibold text-lg">Seu carrinho está vazio</p>
                  <p className="text-sm">Adicione itens do cardápio para começar seu pedido.</p>
                </div>
              ) : (
                items.map((item: any) => (
                  <div key={item.id} className="flex items-center justify-between border-b border-border pb-4 gap-2">
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-foreground truncate">{item.name}</h4>
                      <p className="text-sm text-muted-foreground">R$ {Number(item.price).toFixed(2)}</p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <div className="flex items-center border border-border rounded-lg bg-background">
                        <button
                          onClick={() => dispatch(updateQuantity({ id: item.id, quantity: item.quantity - 1 }))}
                          className="px-2.5 py-1 text-muted-foreground hover:text-foreground"
                        >
                          -
                        </button>
                        <span className="text-sm font-semibold px-2 text-foreground">{item.quantity}</span>
                        <button
                          onClick={() => dispatch(updateQuantity({ id: item.id, quantity: item.quantity + 1 }))}
                          className="px-2.5 py-1 text-muted-foreground hover:text-foreground"
                        >
                          +
                        </button>
                      </div>
                      <button
                        onClick={() => dispatch(removeFromCart(item.id))}
                        className="text-destructive hover:opacity-80 p-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Rodapé Fixo */}
            {items.length > 0 && (
              <div className="pt-4 border-t border-border space-y-2 shrink-0 mt-auto bg-card">
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Subtotal</span>
                  <span>R$ {subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Taxa de entrega</span>
                  <span>R$ {deliveryFee.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-lg font-bold text-foreground pt-2 border-t border-border">
                  <span>Total</span>
                  <span className="text-primary">R$ {total.toFixed(2)}</span>
                </div>

                <button
                  onClick={() => {
                    setIsOpen(false)
                    setIsCheckoutOpen(true)
                  }}
                  className="w-full mt-4 rounded-xl bg-primary py-3.5 font-bold text-primary-foreground hover:opacity-90 transition-all shadow-md"
                >
                  Finalizar Pedido
                </button>
              </div>
            )}
          </div>
        </div>,
        document.body
      )}

      {/* Modal de Checkout */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        items={items}
        subtotal={subtotal}
        deliveryFee={deliveryFee}
        total={total}
        onSuccess={() => {
          dispatch(clearCart())
        }}
      />
    </>
  )
}