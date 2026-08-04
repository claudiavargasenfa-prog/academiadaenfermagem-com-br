-- 1) Ofertas por período
CREATE TABLE public.plan_offers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  plan_slug text NOT NULL,
  billing_period text NOT NULL CHECK (billing_period IN ('mensal','semestral','anual')),
  period_days integer NOT NULL,
  price_cents integer NOT NULL,
  cakto_product_id text,
  cakto_checkout_url text,
  perks jsonb NOT NULL DEFAULT '[]'::jsonb,
  certificates_included integer NOT NULL DEFAULT 0,
  report_quota integer NOT NULL DEFAULT 0,
  bonus_app_included boolean NOT NULL DEFAULT false,
  is_active boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (plan_slug, billing_period)
);

GRANT SELECT ON public.plan_offers TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.plan_offers TO authenticated;
GRANT ALL ON public.plan_offers TO service_role;

ALTER TABLE public.plan_offers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "plan_offers_public_read" ON public.plan_offers
  FOR SELECT USING (is_active = true OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "plan_offers_admin_write" ON public.plan_offers
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER plan_offers_updated_at
  BEFORE UPDATE ON public.plan_offers
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 2) Assinaturas do aluno: período e benefícios
ALTER TABLE public.user_subscriptions
  ADD COLUMN IF NOT EXISTS billing_period text NOT NULL DEFAULT 'mensal',
  ADD COLUMN IF NOT EXISTS bonus_app_slug text,
  ADD COLUMN IF NOT EXISTS certificates_allowed integer NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS report_quota integer NOT NULL DEFAULT 0;

-- 3) Certificados emitidos
CREATE TABLE public.user_certificates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  mini_app_id uuid NOT NULL REFERENCES public.mini_apps(id) ON DELETE CASCADE,
  mini_app_name text NOT NULL,
  student_name text NOT NULL,
  hours numeric NOT NULL DEFAULT 10,
  code text NOT NULL UNIQUE,
  issued_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.user_certificates TO anon;
GRANT SELECT ON public.user_certificates TO authenticated;
GRANT ALL ON public.user_certificates TO service_role;

ALTER TABLE public.user_certificates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "certificates_owner_read" ON public.user_certificates
  FOR SELECT TO authenticated
  USING (user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));

-- 4) Emissão controlada por cota
CREATE OR REPLACE FUNCTION public.issue_certificate(_mini_app_id uuid)
RETURNS TABLE(code text, mini_app_name text, student_name text, hours numeric, issued_at timestamptz)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _user uuid := auth.uid();
  _allowed integer;
  _used integer;
  _app_name text;
  _name text;
  _code text;
BEGIN
  IF _user IS NULL THEN
    RAISE EXCEPTION 'not_authenticated';
  END IF;

  SELECT COALESCE(MAX(certificates_allowed), 0) INTO _allowed
  FROM public.user_subscriptions
  WHERE user_id = _user AND status IN ('active','trial') AND expires_at > now();

  SELECT COUNT(*) INTO _used FROM public.user_certificates WHERE user_id = _user;

  IF _used >= _allowed THEN
    RAISE EXCEPTION 'certificate_quota_exceeded';
  END IF;

  IF NOT public.has_app_access(_user, _mini_app_id) THEN
    RAISE EXCEPTION 'no_access_to_mini_app';
  END IF;

  SELECT name INTO _app_name FROM public.mini_apps WHERE id = _mini_app_id;
  SELECT COALESCE(NULLIF(full_name, ''), email) INTO _name FROM public.profiles WHERE id = _user;
  _code := upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 12));

  INSERT INTO public.user_certificates (user_id, mini_app_id, mini_app_name, student_name, hours, code)
  VALUES (_user, _mini_app_id, _app_name, COALESCE(_name, 'Aluno'), 10, _code);

  RETURN QUERY
    SELECT c.code, c.mini_app_name, c.student_name, c.hours, c.issued_at
    FROM public.user_certificates c WHERE c.code = _code;
END;
$$;

REVOKE ALL ON FUNCTION public.issue_certificate(uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.issue_certificate(uuid) TO authenticated;

-- 5) Acesso ao app bônus (plano anual)
CREATE OR REPLACE FUNCTION public.has_app_access(_user_id uuid, _mini_app_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    CASE
      WHEN public.has_role(_user_id, 'admin') THEN true
      WHEN EXISTS (SELECT 1 FROM public.mini_apps WHERE id = _mini_app_id AND gratuito = true) THEN true
      WHEN EXISTS (
        SELECT 1 FROM public.user_app_access a
        WHERE a.user_id = _user_id AND a.mini_app_id = _mini_app_id AND a.expires_at > now()
      ) THEN true
      ELSE EXISTS (
        SELECT 1
        FROM public.user_subscriptions s
        JOIN public.apps app ON app.slug = s.plan_slug OR app.slug = s.bonus_app_slug
        JOIN public.mini_app_placements p ON p.app_id = app.id AND p.mini_app_id = _mini_app_id
        WHERE s.user_id = _user_id
          AND s.status IN ('active','trial')
          AND s.expires_at > now()
      )
    END
$$;

-- 6) Ofertas iniciais (sem desconto: 6x e 12x o mensal)
INSERT INTO public.plan_offers
  (plan_slug, billing_period, period_days, price_cents, cakto_product_id, cakto_checkout_url,
   certificates_included, report_quota, bonus_app_included, sort_order, perks)
SELECT p.slug, 'mensal', 30, p.price_cents, p.cakto_product_id, p.cakto_checkout_url,
       0, 0, false, 1,
       '["Acesso completo ao app por 30 dias","Atualizações contínuas de conteúdo","Ditado por voz e geração automática de anotações"]'::jsonb
FROM public.subscription_plans p WHERE p.is_active = true
ON CONFLICT (plan_slug, billing_period) DO NOTHING;

INSERT INTO public.plan_offers
  (plan_slug, billing_period, period_days, price_cents, cakto_product_id, cakto_checkout_url,
   certificates_included, report_quota, bonus_app_included, sort_order, perks)
SELECT p.slug, 'semestral', 180, p.price_cents * 6, NULL, NULL,
       2, 0, false, 2,
       '["Tudo do plano mensal","6 meses liberados de uma vez, sem risco de bloqueio por atraso","2 certificados digitais de 10h (você escolhe os mini apps)","Biblioteca de PDFs para download (escalas, protocolos e tabelas de aprazamento)","Plantão de dúvidas no Grupo VIP do WhatsApp, 1x por semana"]'::jsonb
FROM public.subscription_plans p WHERE p.is_active = true
ON CONFLICT (plan_slug, billing_period) DO NOTHING;

INSERT INTO public.plan_offers
  (plan_slug, billing_period, period_days, price_cents, cakto_product_id, cakto_checkout_url,
   certificates_included, report_quota, bonus_app_included, sort_order, perks)
SELECT p.slug, 'anual', 365, p.price_cents * 12, NULL, NULL,
       4, 15, true, 3,
       '["Tudo do plano semestral","Acesso a um 2º aplicativo completo da Academia, à sua escolha","4 certificados digitais de 10h no ano","Cota ampliada do Relatório de Estágio ABNT (15 gerações)","Plantão de dúvidas semanal no Grupo VIP durante os 12 meses"]'::jsonb
FROM public.subscription_plans p WHERE p.is_active = true
ON CONFLICT (plan_slug, billing_period) DO NOTHING;