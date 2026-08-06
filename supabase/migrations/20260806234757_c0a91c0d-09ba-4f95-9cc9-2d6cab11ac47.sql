-- Corrigindo a política de inserção na tabela relatorio_uses (ID: relatorio_uses_self_grant_credits)
DROP POLICY IF EXISTS "Users insert own relatorio_uses" ON public.relatorio_uses;

CREATE POLICY "Users insert own relatorio_uses"
ON public.relatorio_uses
FOR INSERT
TO authenticated
WITH CHECK (
  auth.uid() = user_id AND 
  opens_left <= 1 AND 
  total_opens <= 1
);

GRANT SELECT, INSERT, UPDATE ON public.relatorio_uses TO authenticated;
GRANT ALL ON public.relatorio_uses TO service_role;

-- Corrigindo a política de inserção na tabela orders (ID: orders_self_reported_status_amount)
DROP POLICY IF EXISTS "Users can create their own orders" ON public.orders;

CREATE POLICY "Users can create their own orders"
ON public.orders
FOR INSERT
TO authenticated
WITH CHECK (
  auth.uid() = user_id AND 
  status = 'pending'
);

GRANT SELECT, INSERT, UPDATE ON public.orders TO authenticated;
GRANT ALL ON public.orders TO service_role;
