"use client"

import { useState, useEffect } from "react"
import { createPortal } from "react-dom"
import { X, Send, Loader2 } from "lucide-react"

interface CheckoutModalProps {
    isOpen: boolean
    onClose: () => void
    items: any[]
    subtotal: number
    deliveryFee: number
    total: number
    onSuccess: () => void
}

export function CheckoutModal({
    isOpen,
    onClose,
    items,
    subtotal,
    deliveryFee,
    total,
    onSuccess,
}: CheckoutModalProps) {
    const [mounted, setMounted] = useState(false)
    const [name, setName] = useState("")
    const [phone, setPhone] = useState("")
    const [address, setAddress] = useState("")
    const [paymentMethod, setPaymentMethod] = useState("PIX")
    const [notes, setNotes] = useState("")
    const [isLoading, setIsLoading] = useState(false)

    // Garante que o React Portal só execute no navegador
    useEffect(() => {
        setMounted(true)
    }, [])

    if (!isOpen || !mounted) return null

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)

        try {
            const response = await fetch("/api/checkout", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    customerName: name,
                    customerPhone: phone,
                    address,
                    paymentMethod,
                    notes,
                    items,
                    subtotal,
                    deliveryFee,
                    total,
                }),
            })

            const data = await response.json()

            if (data.whatsappUrl) {
                window.open(data.whatsappUrl, "_blank")
                onSuccess()
                onClose()
            } else {
                alert("Ocorreu um erro ao gerar o pedido. Tente novamente.")
            }
        } catch (error) {
            console.error("Erro no checkout:", error)
            alert("Erro ao conectar com o servidor. Tente novamente.")
        } finally {
            setIsLoading(false)
        }
    }

    // createPortal envia o elemento direto para o body da página
    return createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            {/* Container do Modal */}
            <div
                className="w-full max-w-lg bg-card border border-border rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200 my-auto"
                style={{ maxHeight: "85vh" }}
            >
                {/* Cabeçalho Fixo do Modal */}
                <div className="flex items-center justify-between p-5 border-b border-border shrink-0 bg-card">
                    <div>
                        <h2 className="text-xl font-bold text-foreground">Finalizar Pedido</h2>
                        <p className="text-xs text-muted-foreground">Preencha os dados para entrega</p>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="text-muted-foreground hover:text-foreground font-bold p-1 rounded-lg hover:bg-muted transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Corpo com Formulário e Rolagem Interna */}
                <form onSubmit={handleSubmit} className="p-5 overflow-y-auto space-y-4 flex-1">
                    <div>
                        <label className="block text-sm font-semibold text-foreground mb-1">
                            Seu Nome *
                        </label>
                        <input
                            type="text"
                            required
                            placeholder="Ex: João Silva"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-foreground mb-1">
                            Telefone / WhatsApp *
                        </label>
                        <input
                            type="tel"
                            required
                            placeholder="(87) 99999-9999"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-foreground mb-1">
                            Endereço de Entrega *
                        </label>
                        <input
                            type="text"
                            required
                            placeholder="Rua, número, bairro em Terra Nova"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-foreground mb-1">
                            Forma de Pagamento *
                        </label>
                        <select
                            value={paymentMethod}
                            onChange={(e) => setPaymentMethod(e.target.value)}
                            className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                        >
                            <option value="PIX">PIX</option>
                            <option value="Cartão de Crédito/Débito">Cartão de Crédito/Débito</option>
                            <option value="Dinheiro">Dinheiro</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-foreground mb-1">
                            Observações
                        </label>
                        <textarea
                            rows={2}
                            placeholder="Ex: Tirar cebola do hambúrguer, maionese à parte..."
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                        />
                    </div>

                    {/* Resumo de Valores */}
                    <div className="pt-2 border-t border-border space-y-1 text-sm">
                        <div className="flex justify-between text-muted-foreground">
                            <span>Subtotal:</span>
                            <span>R$ {subtotal.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-muted-foreground">
                            <span>Taxa de Entrega:</span>
                            <span>R$ {deliveryFee.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between font-bold text-base text-foreground pt-1">
                            <span>Total:</span>
                            <span className="text-primary">R$ {total.toFixed(2)}</span>
                        </div>
                    </div>

                    {/* Botão de Envio */}
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full flex items-center justify-center gap-2 rounded-xl bg-primary py-3 font-bold text-primary-foreground hover:opacity-90 transition-all shadow-md disabled:opacity-50 mt-4"
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                <span>Gerando pedido...</span>
                            </>
                        ) : (
                            <>
                                <Send className="w-4 h-4" />
                                <span>Confirmar e Enviar para WhatsApp 🚀</span>
                            </>
                        )}
                    </button>
                </form>
            </div>
        </div>,
        document.body
    )
}