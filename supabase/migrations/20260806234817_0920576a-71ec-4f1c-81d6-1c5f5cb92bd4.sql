-- 1. Corrigindo relatorio_uses_self_grant_credits
DROP POLICY IF EXISTS "Users insert own relatorio_uses" ON public.relatorio_uses;
CREATE POLICY "Users insert own relatorio_uses"
ON public.relatorio_uses FOR INSERT TO authenticated
WITH CHECK (auth.uid() = user_id AND opens_left <= 1 AND total_opens <= 1);

-- 2. Corrigindo orders_self_reported_status_amount
DROP POLICY IF EXISTS "Users can create their own orders" ON public.orders;
CREATE POLICY "Users can create their own orders"
ON public.orders FOR INSERT TO authenticated
WITH CHECK (auth.uid() = user_id AND status = 'pending');

-- 3. Resolvendo os avisos do linter: Revogando execução pública de funções SECURITY DEFINER
-- O linter avisou sobre funções SECURITY DEFINER executáveis por usuários autenticados.
-- Vamos restringir o acesso apenas ao service_role para segurança máxima, 
-- ou revogar de PUBLIC/authenticated conforme as boas práticas da Supabase.

DO $$
DECLARE
    func_record RECORD;
BEGIN
    FOR func_record IN 
        SELECT n.nspname as schema_name, p.proname as function_name, pg_get_function_identity_arguments(p.oid) as args
        FROM pg_proc p
        JOIN pg_namespace n ON p.pronamespace = n.oid
        WHERE p.prosecdef = true 
          AND n.nspname = 'public'
    LOOP
        EXECUTE format('REVOKE EXECUTE ON FUNCTION %I.%I(%s) FROM PUBLIC, authenticated, anon;', 
                       func_record.schema_name, func_record.function_name, func_record.args);
        EXECUTE format('GRANT EXECUTE ON FUNCTION %I.%I(%s) TO service_role;', 
                       func_record.schema_name, func_record.function_name, func_record.args);
    END LOOP;
END $$;
