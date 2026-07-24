import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const {
      customerName,
      customerPhone,
      address,
      paymentMethod,
      notes,
      items,
      subtotal,
      deliveryFee,
      total,
    } = body

    // 1. Número do WhatsApp da lanchonete
    const phoneOwner = "5587991411216" // <--- Altere para o número real quando quiser!

    // 2. Formatação da lista de itens
    const itemsList = Array.isArray(items)
      ? items.map(
        (item: any) =>
          `• *${item.quantity}x* ${item.name} - R$ ${(
            item.price * item.quantity
          ).toFixed(2)}`
      )
      : []

    // 3. Montagem da mensagem linha por linha (Garante as quebras de linha no WhatsApp)
    const messageLines = [
      "🍔 *NOVO PEDIDO - LOCALEATS*",
      "",
      `*Cliente:* ${customerName || "Não informado"}`,
      `*Telefone:* ${customerPhone || "Não informado"}`,
      `*Endereço:* ${address || "Não informado"}`,
      `*Forma de Pagamento:* ${paymentMethod || "PIX"}`,
      notes ? `*Observações:* ${notes}` : null,
      "----------------------------------",
      "*ITENS DO PEDIDO:*",
      ...itemsList,
      "----------------------------------",
      `*Subtotal:* R$ ${Number(subtotal || 0).toFixed(2)}`,
      `*Taxa de Entrega:* R$ ${Number(deliveryFee || 0).toFixed(2)}`,
      `*TOTAL:* R$ ${Number(total || 0).toFixed(2)}`,
    ].filter((line) => line !== null) // Remove a linha de observação se ela for vazia

    const messageText = messageLines.join("\n")

    // 4. Geração da URL oficial do WhatsApp com codificação correta
    const whatsappUrl = `https://wa.me/${phoneOwner}?text=${encodeURIComponent(
      messageText
    )}`

    return NextResponse.json({ success: true, whatsappUrl })
  } catch (error) {
    console.error("Erro na API de Checkout:", error)
    return NextResponse.json(
      { error: "Erro ao processar checkout" },
      { status: 500 }
    )
  }
}