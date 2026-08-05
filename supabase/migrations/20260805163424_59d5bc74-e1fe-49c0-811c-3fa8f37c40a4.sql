-- Tabela de pedidos para rastrear transações de checkout
CREATE TABLE public.orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    plan_slug TEXT NOT NULL,
    amount_cents INTEGER NOT NULL,
    currency TEXT DEFAULT 'BRL',
    status TEXT NOT NULL DEFAULT 'pending', -- pending, paid, failed, expired
    payment_method TEXT, -- pix, credit_card
    external_id TEXT, -- ID no provedor de pagamento (ex: Mercado Pago, Stripe)
    pix_qr_code TEXT,
    pix_copy_paste TEXT,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Permissões para a tabela de pedidos
GRANT SELECT ON public.orders TO authenticated;
GRANT INSERT ON public.orders TO authenticated;
GRANT ALL ON public.orders TO service_role;

-- Habilitar RLS
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Políticas de RLS para pedidos
CREATE POLICY "Users can view their own orders" 
ON public.orders FOR SELECT 
TO authenticated 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own orders" 
ON public.orders FOR INSERT 
TO authenticated 
WITH CHECK (auth.uid() = user_id);

-- Tabela para log de eventos de webhook
CREATE TABLE public.payment_webhooks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    provider TEXT NOT NULL,
    payload JSONB NOT NULL,
    processed BOOLEAN DEFAULT FALSE,
    error_message TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Permissões para webhooks
GRANT ALL ON public.payment_webhooks TO service_role;

-- Gatilho para atualizar updated_at em orders
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_orders_updated_at
BEFORE UPDATE ON public.orders
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();
