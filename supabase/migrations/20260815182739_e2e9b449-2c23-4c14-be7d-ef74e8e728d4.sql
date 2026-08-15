-- 1. Inserir o Plano de Assinatura para o 5º App
INSERT INTO public.subscription_plans (name, slug, description, price_cents, price_novo_cents, is_active, sort_order)
VALUES (
  'Terapia Intensiva & Emergência Crítica',
  'uti-emergencia',
  'Módulo Master: Farmacologia Intensiva, Ventilação Mecânica, Monitorização Hemodinâmica e ACLS. Design Premium Plus.',
  9990, 
  4990, 
  true,
  5
);

-- 2. Inserir Ofertas de Período
-- billing_period pode ser 'mensal', 'semestral', 'anual'
INSERT INTO public.plan_offers (plan_slug, billing_period, period_days, price_cents, is_active, sort_order)
VALUES 
  ('uti-emergencia', 'mensal', 30, 4990, true, 1),
  ('uti-emergencia', 'semestral', 180, 24990, true, 2),
  ('uti-emergencia', 'anual', 365, 39990, true, 3);
