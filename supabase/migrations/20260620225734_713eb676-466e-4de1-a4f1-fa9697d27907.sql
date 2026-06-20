
-- 1) profiles: novos campos
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS phone TEXT,
  ADD COLUMN IF NOT EXISTS categoria TEXT CHECK (categoria IN ('academico','tecnico','enfermeiro'));

-- 2) subscription_plans: novos campos de preço e migração
ALTER TABLE public.subscription_plans
  ADD COLUMN IF NOT EXISTS price_novo_cents INTEGER,
  ADD COLUMN IF NOT EXISTS price_original_migracao_cents INTEGER,
  ADD COLUMN IF NOT EXISTS price_promo_migracao_cents INTEGER,
  ADD COLUMN IF NOT EXISTS cakto_link_novo TEXT,
  ADD COLUMN IF NOT EXISTS cakto_link_migracao TEXT;

-- Preencher novos campos com defaults solicitados
UPDATE public.subscription_plans SET
  name = 'Academia do Acadêmico',
  price_cents = 2499,
  price_novo_cents = 2499,
  price_original_migracao_cents = 3999,
  price_promo_migracao_cents = 3399
WHERE slug = 'academico';

UPDATE public.subscription_plans SET
  name = 'Academia do Técnico',
  price_cents = 1699,
  price_novo_cents = 1699,
  price_original_migracao_cents = 2499,
  price_promo_migracao_cents = 1999
WHERE slug = 'tecnico';

UPDATE public.subscription_plans SET
  name = 'Academia do Enfermeiro',
  price_cents = 3999,
  price_novo_cents = 3999
WHERE slug = 'enfermeiro';

-- 3) user_subscriptions: aceitar status 'trial' (adiciona check)
ALTER TABLE public.user_subscriptions DROP CONSTRAINT IF EXISTS user_subscriptions_status_check;
ALTER TABLE public.user_subscriptions ADD CONSTRAINT user_subscriptions_status_check
  CHECK (status IN ('active','trial','expired','canceled'));

-- 4) has_app_access: liberar trial também
CREATE OR REPLACE FUNCTION public.has_app_access(_user_id uuid, _mini_app_id uuid)
RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER SET search_path TO 'public'
AS $$
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
          AND s.status IN ('active','trial')
          AND s.expires_at > now()
          AND (
            (s.plan_slug = 'academico' AND m.track_academico)
            OR (s.plan_slug = 'tecnico' AND m.track_tecnico)
            OR (s.plan_slug = 'enfermeiro' AND m.track_enfermeiro)
          )
      )
    END
$$;

-- 5) handle_new_user: criar trial de 30 dias na trilha da categoria escolhida
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public'
AS $$
DECLARE
  _categoria TEXT;
  _phone TEXT;
  _full_name TEXT;
BEGIN
  _full_name := COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', '');
  _phone := NEW.raw_user_meta_data->>'phone';
  _categoria := NEW.raw_user_meta_data->>'categoria';

  INSERT INTO public.profiles (id, full_name, email, phone, categoria)
  VALUES (NEW.id, _full_name, NEW.email, _phone, _categoria);

  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'aluno');

  -- Trial de 30 dias só na trilha da categoria escolhida
  IF _categoria IN ('academico','tecnico','enfermeiro') THEN
    INSERT INTO public.user_subscriptions (user_id, plan_slug, status, started_at, expires_at, notes)
    VALUES (NEW.id, _categoria, 'trial', now(), now() + interval '30 days', 'Trial inicial de 30 dias');
  END IF;

  RETURN NEW;
END;
$$;

-- Garantir que o trigger existe em auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 6) Cascade delete: garantir que ao excluir user, dados associados são removidos
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_id_fkey;
ALTER TABLE public.profiles ADD CONSTRAINT profiles_id_fkey
  FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE;

ALTER TABLE public.user_roles DROP CONSTRAINT IF EXISTS user_roles_user_id_fkey;
ALTER TABLE public.user_roles ADD CONSTRAINT user_roles_user_id_fkey
  FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

ALTER TABLE public.user_subscriptions DROP CONSTRAINT IF EXISTS user_subscriptions_user_id_fkey;
ALTER TABLE public.user_subscriptions ADD CONSTRAINT user_subscriptions_user_id_fkey
  FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

ALTER TABLE public.user_app_access DROP CONSTRAINT IF EXISTS user_app_access_user_id_fkey;
ALTER TABLE public.user_app_access ADD CONSTRAINT user_app_access_user_id_fkey
  FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- 7) admin_actions: auditoria
CREATE TABLE IF NOT EXISTS public.admin_actions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  admin_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  target_user_id UUID,
  details JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT ON public.admin_actions TO authenticated;
GRANT ALL ON public.admin_actions TO service_role;

ALTER TABLE public.admin_actions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins can read audit log" ON public.admin_actions;
CREATE POLICY "Admins can read audit log" ON public.admin_actions
  FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Admins can insert audit log" ON public.admin_actions;
CREATE POLICY "Admins can insert audit log" ON public.admin_actions
  FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- 8) Atualizar tracks dos mini apps conforme tabela aprovada no plano
UPDATE public.mini_apps SET track_academico=true, track_tecnico=true, track_enfermeiro=true
  WHERE slug IN ('sbv','sinais-vitais','sv-gestante','sv-pediatrico','medicamentosecalculos','exame-fisico-escalas','quizzes','postura-etica','seguranca','saude-mental');

UPDATE public.mini_apps SET track_academico=true, track_tecnico=true, track_enfermeiro=false
  WHERE slug IN ('manual-sobrevivencia');

UPDATE public.mini_apps SET track_academico=true, track_tecnico=false, track_enfermeiro=false
  WHERE slug IN ('relatorio-abnt');

UPDATE public.mini_apps SET track_academico=false, track_tecnico=false, track_enfermeiro=true
  WHERE slug IN ('uti','farmacologia-avancada','acls');

UPDATE public.mini_apps SET track_academico=false, track_tecnico=true, track_enfermeiro=true
  WHERE slug IN ('iras','IRAS','procedimentos-enfermagem','simulacoes-reais','curativos');
