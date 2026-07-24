import { supabase } from "@/lib/supabase" // ou seu cliente do banco
import { MenuView } from "@/components/menu/menu-view"

export default async function HomePage() {
  // Busca os produtos diretamente da tabela do banco de dados
  const { data: products, error } = await supabase
    .from("products")
    .select("*")

  if (error) {
    console.error("Erro ao buscar produtos do banco:", error)
  }

  return <MenuView products={products || []} />
}