'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ShoppingCart, Trash2, Send } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'

interface Product {
  id: string
  name: string
  description: string
  price: number
  category: string
}

interface CartItem extends Product {
  quantity: number
}

export default function Home() {
  const [products, setProducts] = useState<Product[]>([])
  const [cart, setCart] = useState<CartItem[]>([])
  const [address, setAddress] = useState('')
  const [loading, setLoading] = useState(true)
  const [sendingOrder, setSendingOrder] = useState(false)

  useEffect(() => {
    async function fetchProducts() {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('disponivel', true)

      if (!error && data) setProducts(data)
      setLoading(false)
    }

    fetchProducts()
  }, [])

  const addToCart = (product: Product) => {
    setCart((prevCart) => {
      const existing = prevCart.find((item) => item.id === product.id)
      if (existing) {
        return prevCart.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        )
      }
      return [...prevCart, { ...product, quantity: 1 }]
    })
  }

  const removeFromCart = (id: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== id))
  }

  const totalCart = cart.reduce((acc, item) => acc + item.price * item.quantity, 0)
  const totalItemsCount = cart.reduce((acc, item) => acc + item.quantity, 0)

  const handleSendOrder = async () => {
    if (!address.trim()) {
      alert('Por favor, digite seu endereço de entrega!')
      return
    }

    setSendingOrder(true)

    try {
      // 1. Salva o pedido na tabela 'orders' enviando 'total' e 'total_price'
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .insert({
          total: totalCart,
          total_price: totalCart,
          status: 'pendente',
          address: address,
          delivery_address: address,
        })
        .select()
        .single()

      if (orderError) throw orderError

      // 2. Salva os itens na tabela 'order_items'
      const orderItems = cart.map((item) => ({
        order_id: orderData.id,
        product_id: item.id,
        quantity: item.quantity,
        price: item.price,
      }))

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems)

      if (itemsError) throw itemsError

      // 3. Monta e abre a mensagem do WhatsApp
      const whatsappNumber = process.env.NEXT_PUBLIC_STORE_WHATSAPP || ''
      let message = `*Novo Pedido #${orderData.id.slice(0, 5)} - LocalEats* 🍕\n\n`
      cart.forEach((item) => {
        message += `• ${item.quantity}x ${item.name} - R$ ${(item.price * item.quantity).toFixed(2)}\n`
      })
      message += `\n*Total:* R$ ${totalCart.toFixed(2)}`
      message += `\n*Endereço:* ${address}`

      const encodedMessage = encodeURIComponent(message)
      window.open(`https://wa.me/${whatsappNumber}?text=${encodedMessage}`, '_blank')

      setCart([])
      setAddress('')
    } catch (err) {
      console.error('Erro ao salvar pedido:', err)
      alert('Ocorreu um erro ao processar o pedido. Tente novamente.')
    } finally {
      setSendingOrder(false)
    }
  }

  return (
    <main className="min-h-screen bg-slate-50 p-6 max-w-4xl mx-auto">
      <header className="flex justify-between items-center mb-8 border-b pb-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">LocalEats 🍕</h1>
          <p className="text-slate-600">Faça seu pedido rápido e sem complicação</p>
        </div>

        {/* Modal do Carrinho */}
        <Dialog>
          <DialogTrigger className="relative inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium transition-colors bg-slate-900 text-white hover:bg-slate-800 h-10 px-4 py-2 shadow">
            <ShoppingCart className="w-4 h-4" />
            <span>Carrinho</span>
            {totalItemsCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                {totalItemsCount}
              </span>
            )}
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Seu Carrinho</DialogTitle>
            </DialogHeader>

            {cart.length === 0 ? (
              <p className="text-center text-slate-500 py-6">Seu carrinho está vazio.</p>
            ) : (
              <div className="space-y-4 my-2">
                <div className="max-h-60 overflow-y-auto space-y-3 pr-1">
                  {cart.map((item) => (
                    <div key={item.id} className="flex justify-between items-center border-b pb-2">
                      <div>
                        <p className="font-semibold text-sm">{item.name}</p>
                        <p className="text-xs text-slate-500">
                          {item.quantity}x R$ {Number(item.price).toFixed(2)}
                        </p>
                      </div>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => removeFromCart(item.id)}
                        className="text-red-500 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>

                <div className="border-t pt-2 flex justify-between font-bold text-lg">
                  <span>Total:</span>
                  <span className="text-emerald-600">R$ {totalCart.toFixed(2)}</span>
                </div>

                <div className="space-y-2 pt-2">
                  <label className="text-xs font-semibold text-slate-700">Endereço de Entrega:</label>
                  <Input
                    placeholder="Rua, número e bairro"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                  />
                </div>

                <Button
                  onClick={handleSendOrder}
                  disabled={sendingOrder}
                  className="w-full gap-2 bg-emerald-600 hover:bg-emerald-700"
                >
                  <Send className="w-4 h-4" />
                  {sendingOrder ? 'Processando...' : 'Finalizar via WhatsApp'}
                </Button>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </header>

      {/* Lista de Produtos */}
      {loading ? (
        <p className="text-center text-slate-500">Carregando cardápio...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {products.map((item) => (
            <Card key={item.id} className="flex flex-col justify-between">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-xl">{item.name}</CardTitle>
                  <Badge>{item.category}</Badge>
                </div>
                <p className="text-sm text-slate-500 mt-2">{item.description}</p>
              </CardHeader>
              <CardContent className="flex justify-between items-center pt-2">
                <span className="text-lg font-bold text-emerald-600">
                  R$ {Number(item.price).toFixed(2)}
                </span>
                <Button size="sm" onClick={() => addToCart(item)}>
                  Adicionar
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </main>
  )
}