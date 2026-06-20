
-- 1) Track columns on mini_apps
ALTER TABLE public.mini_apps
  ADD COLUMN IF NOT EXISTS track_academico boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS track_tecnico boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS track_enfermeiro boolean NOT NULL DEFAULT false;

-- 2) subscription_plans
CREATE TABLE IF NOT EXISTS public.subscription_plans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  name text NOT NULL,
  description text,
  price_cents integer NOT NULL DEFAULT 0,
  cakto_checkout_url text,
  is_active boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.subscription_plans TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.subscription_plans TO authenticated;
GRANT ALL ON public.subscription_plans TO service_role;

ALTER TABLE public.subscription_plans ENABLE ROW LEVEL SECURITY;

CREATE POLICY "plans_public_read" ON public.subscription_plans
  FOR SELECT USING (true);
CREATE POLICY "plans_admin_write" ON public.subscription_plans
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER trg_subscription_plans_updated
  BEFORE UPDATE ON public.subscription_plans
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 3) user_subscriptions
CREATE TABLE IF NOT EXISTS public.user_subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  plan_slug text NOT NULL,
  status text NOT NULL DEFAULT 'active',
  started_at timestamptz NOT NULL DEFAULT now(),
  expires_at timestamptz NOT NULL,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_user_subscriptions_user ON public.user_subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_active ON public.user_subscriptions(user_id, plan_slug, expires_at);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.user_subscriptions TO authenticated;
GRANT ALL ON public.user_subscriptions TO service_role;

ALTER TABLE public.user_subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "usersub_owner_read" ON public.user_subscriptions
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "usersub_admin_write" ON public.user_subscriptions
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER trg_user_subscriptions_updated
  BEFORE UPDATE ON public.user_subscriptions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 4) Seed default plans (idempotent)
INSERT INTO public.subscription_plans (slug, name, description, price_cents, sort_order)
VALUES
  ('academico', 'Academia do Acadêmico', 'Assinatura mensal — libera todos os mini apps da trilha Acadêmico.', 2900, 1),
  ('tecnico', 'Academia do Técnico', 'Assinatura mensal — libera todos os mini apps da trilha Técnico.', 3900, 2),
  ('enfermeiro', 'Academia do Enfermeiro', 'Assinatura mensal — libera todos os mini apps da trilha Enfermeiro.', 4900, 3)
ON CONFLICT (slug) DO NOTHING;

-- 5) Update has_app_access to include track subscriptions
CREATE OR REPLACE FUNCTION public.has_app_access(_user_id uuid, _mini_app_id uuid)
 RETURNS boolean
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path = public
AS $function$
  SELECT
    CASE
      WHEN EXISTS (SELECT 1 FROM public.mini_apps WHERE id = _mini_app_id AND gratuito = true) THEN true
      WHEN EXISTS (
        SELECT 1 FROM public.user_app_access a
        WHERE a.user_id = _user_id AND a.mini_app_id = _mini_app_id AND a.expires_at > now()
      ) THEN true
      ELSE EXISTS (
        SELECT 1
        FROM public.user_subscriptions s
        JOIN public.mini_apps m ON m.id = _mini_app_id
        WHERE s.user_id = _user_id
          AND s.status = 'active'
          AND s.expires_at > now()
          AND (
            (s.plan_slug = 'academico' AND m.track_academico)
            OR (s.plan_slug = 'tecnico' AND m.track_tecnico)
            OR (s.plan_slug = 'enfermeiro' AND m.track_enfermeiro)
          )
      )
    END
$function$;

-- 6) Initial track classification (only sets to true; admin can adjust)
UPDATE public.mini_apps SET track_academico = true WHERE slug IN (
  'sbv','sinais-vitais','sv-gestante','sv-pediatrico','medicamentosecalculos',
  'exame-fisico-escalas','quizzes','postura-etica','manual-sobrevivencia',
  'relatorio-abnt','seguranca','saude-mental'
);
UPDATE public.mini_apps SET track_tecnico = true WHERE slug IN (
  'sbv','sinais-vitais','sv-gestante','sv-pediatrico','medicamentosecalculos',
  'procedimentos-enfermagem','curativos','seguranca','iras','IRAS',
  'postura-etica','manual-sobrevivencia'
);
UPDATE public.mini_apps SET track_enfermeiro = true WHERE slug IN (
  'uti','iras','IRAS','farmacologia-avancada','procedimentos-enfermagem',
  'acls','simulacoes-reais','curativos','sbv','exame-fisico-escalas','saude-mental'
);
