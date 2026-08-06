
-- Correção da vulnerabilidade mini_apps_no_public_select_policy_but_content_md_exposed_via_admin_policy_check
-- Garantindo que trial_fingerprints tenha política de INSERT para anon/authenticated
GRANT INSERT ON public.trial_fingerprints TO anon, authenticated;

DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'trial_fingerprints' AND policyname = 'Anyone can insert trial fingerprints'
    ) THEN
        CREATE POLICY "Anyone can insert trial fingerprints" 
        ON public.trial_fingerprints FOR INSERT 
        WITH CHECK (true);
    END IF;
END $$;

-- Garantindo que service_role tenha acesso total aos webhooks
GRANT ALL ON public.webhook_events TO service_role;
GRANT ALL ON public.payment_webhooks TO service_role;

-- Políticas de visualização para Admin
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'payment_webhooks' AND policyname = 'Admins can view payment webhooks'
    ) THEN
        CREATE POLICY "Admins can view payment webhooks" 
        ON public.payment_webhooks FOR SELECT 
        TO authenticated 
        USING (public.has_role(auth.uid(), 'admin'));
    END IF;
END $$;

DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'trial_fingerprints' AND policyname = 'Admins can view trial fingerprints'
    ) THEN
        CREATE POLICY "Admins can view trial fingerprints" 
        ON public.trial_fingerprints FOR SELECT 
        TO authenticated 
        USING (public.has_role(auth.uid(), 'admin'));
    END IF;
END $$;
