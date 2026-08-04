DROP POLICY IF EXISTS "Usuário pode atualizar seu próprio uso via função" ON public.relatorio_uses;
REVOKE UPDATE ON public.relatorio_uses FROM authenticated;