-- Adicionar uma assinatura de trial para o usuário admin para que ele possa testar a emissão
INSERT INTO public.user_subscriptions (user_id, plan_slug, status, expires_at, billing_period, certificates_allowed)
VALUES ('8531e896-ccb0-4093-89f3-042a1be5b14b', 'academico', 'trial', now() + interval '15 days', 'mensal', 1)
ON CONFLICT DO NOTHING;

-- Garantir privilégios
GRANT SELECT ON public.user_certificates TO authenticated;
GRANT ALL ON public.user_certificates TO service_role;
