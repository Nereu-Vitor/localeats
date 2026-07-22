# Specification Document (SDD) - LocalEats

## 1. Escopo Geral
* **Nome do Projeto:** LocalEats
* **Objetivo:** Sistema de Cardápio Digital e Gestão de Pedidos para Lanchonetes (Terra Nova - PE).
* **Foco Visual:** Mobile-First (otimizado para smartphones).

## 2. Atores do Sistema
* **Cliente:** Acessa o cardápio público, monta o carrinho, faz login, informa o endereço e fecha o pedido.
* **Lojista (Admin):** Acessa a rota protegida `/admin` para gerenciar produtos (preço, estoque) e atualizar o status da fila de pedidos da cozinha.

## 3. Requisitos da Solução

### 3.1. Requisitos Funcionais (RF)
* **RF01 - Cardápio Online:** Listar produtos cadastrados divididos por categorias (Ex: Hambúrgueres, Bebidas, Porções).
* **RF02 - Carrinho de Compras:** Adicionar, alterar quantidades e remover itens antes de finalizar.
* **RF03 - Controle de Acesso:** Cadastro/Login de clientes comuns e login seguro para o administrador (lojista).
* **RF04 - Painel do Lojista:** Tela exclusiva para gerenciar pedidos e alterar o status (Pendente, Em Preparo, Saiu para Entrega, Entregue).
* **RF05 - Notificação e Contingência:** Gerar link de redirecionamento com o resumo do pedido para o WhatsApp do lojista (`wa.me`) e disparar e-mail automático via Resend notificando a chegada de um novo pedido.

### 3.2. Requisitos Não-Funcionais (RNF)
* **RNF01 - Interface Mobile-First:** Layout responsivo focado em celulares.
* **RNF02 - Segurança de Dados (RLS):** Banco de dados com Row Level Security para impedir que clientes vejam pedidos de outros usuários.
* **RNF03 - Infraestrutura Free Tier:** Hospedagem e serviços baseados inteiramente em camadas gratuitas na nuvem.

## 4. Arquitetura Inicial
* **Frontend:** Next.js hospedado na Vercel (sincronizado com o GitHub).
* **Backend, Banco de Dados e Auth:** Supabase (PostgreSQL + Supabase Auth).
* **Serviço de E-mail:** Resend API para notificações automáticas.

## 5. Regras de Negócio e Fluxos (Modelo Mínimo)
* **Regras:** Bloquear finalização de carrinhos vazios; ocultar do cardápio produtos com disponibilidade `false`; impedir que usuários comuns acessem a rota `/admin`.
* **Fluxo Principal:** Cliente monta carrinho -> Faz login -> Confirma endereço -> Finaliza pedido. O sistema grava os dados no Supabase, envia o e-mail pelo Resend, libera o botão do WhatsApp para contingência e atualiza o painel do lojista instantaneamente.

## 6. Modelo de Dados (Tabelas do Supabase)

### Tabela: profiles
* `id` (uuid, primary key -> auth.users) - Identificador único do usuário
* `full_name` (text) - Nome do usuário
* `phone` (text) - Telefone para contato/WhatsApp
* `is_admin` (boolean, default: false) - Define nível de acesso (true = lojista)

### Tabela: products
* `id` (uuid, primary key) - Identificador único do produto
* `name` (text) - Nome do lanche ou bebida
* `description` (text) - Ingredientes ou detalhes
* `price` (numeric) - Preço de venda (maior que zero)
* `category` (text) - Categoria (Hambúrguer, Bebida, etc.)
* `disponivel` (boolean, default: true) - Status do estoque

### Tabela: orders
* `id` (uuid, primary key) - Identificador único do pedido
* `user_id` (uuid -> auth.users) - Cliente que fez o pedido
* `status` (text, default: 'pendente') - Estados: pendente, em_preparo, saiu_para_entrega, entregue
* `total_price` (numeric) - Valor total do pedido
* `delivery_address` (text) - Endereço completo informado
* `created_at` (timestamptz) - Data e hora automática do pedido

### Tabela: order_items
* `id` (uuid, primary key) - Identificador único do item
* `order_id` (uuid -> orders.id) - Vínculo com o pedido geral
* `product_id` (uuid -> products.id) - Vínculo com o produto cadastrado
* `quantity` (integer) - Quantidade comprada (maior que zero)
* `price_unit` (numeric) - Preço unitário do produto no momento da compra
