-- 1) Código do produto Cakto por plano
ALTER TABLE public.subscription_plans ADD COLUMN IF NOT EXISTS cakto_product_id text;

-- 2) Compras da Cakto sem conta ainda criada
CREATE TABLE IF NOT EXISTS public.pending_purchases (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL,
  plan_slug text NOT NULL,
  order_id text,
  subscription_id text,
  next_billing_date timestamptz,
  consumed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT ALL ON public.pending_purchases TO service_role;
ALTER TABLE public.pending_purchases ENABLE ROW LEVEL SECURITY;

CREATE POLICY "pending_purchases_admin_read"
  ON public.pending_purchases FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE UNIQUE INDEX IF NOT EXISTS ux_pending_purchases_email_plan
  ON public.pending_purchases (lower(email), plan_slug);

CREATE INDEX IF NOT EXISTS ix_pending_purchases_email
  ON public.pending_purchases (lower(email));

DROP TRIGGER IF EXISTS trg_pending_purchases_updated ON public.pending_purchases;
CREATE TRIGGER trg_pending_purchases_updated
  BEFORE UPDATE ON public.pending_purchases
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 3) Uma única gratuidade por aluno (em qualquer app, para sempre)
ALTER TABLE public.user_subscriptions ADD COLUMN IF NOT EXISTS was_trial boolean NOT NULL DEFAULT false;
UPDATE public.user_subscriptions SET was_trial = true WHERE status = 'trial';
CREATE UNIQUE INDEX IF NOT EXISTS ux_one_trial_per_user
  ON public.user_subscriptions (user_id) WHERE was_trial;

-- 4) Cadastro: compra da Cakto tem prioridade; gratuidade só uma vez e só até 05/09/2026
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  _categoria TEXT;
  _phone TEXT;
  _full_name TEXT;
  _paid RECORD;
  _has_trial BOOLEAN;
BEGIN
  _full_name := COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', '');
  _phone := NEW.raw_user_meta_data->>'phone';
  _categoria := NEW.raw_user_meta_data->>'categoria';

  INSERT INTO public.profiles (id, full_name, email, phone, categoria)
  VALUES (NEW.id, _full_name, NEW.email, _phone, _categoria);

  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'aluno');

  -- Compras pendentes da Cakto para este e-mail: acesso pago, sem gratuidade
  FOR _paid IN
    SELECT * FROM public.pending_purchases
    WHERE lower(email) = lower(NEW.email) AND consumed_at IS NULL
  LOOP
    INSERT INTO public.user_subscriptions (user_id, plan_slug, status, started_at, expires_at, notes)
    VALUES (
      NEW.id, _paid.plan_slug, 'active', now(),
      COALESCE(_paid.next_billing_date, now() + interval '30 days'),
      'Compra Cakto ' || COALESCE(_paid.order_id, '')
    );
    UPDATE public.pending_purchases SET consumed_at = now() WHERE id = _paid.id;
  END LOOP;

  SELECT EXISTS (
    SELECT 1 FROM public.user_subscriptions WHERE user_id = NEW.id
  ) INTO _has_trial;

  IF NOT _has_trial
     AND now() < timestamptz '2026-09-06 00:00:00-03'
     AND _categoria IN ('academico','tecnico','tecnico-estudante','enfermeiro') THEN
    INSERT INTO public.user_subscriptions (user_id, plan_slug, status, started_at, expires_at, notes, was_trial)
    VALUES (NEW.id, _categoria, 'trial', now(), now() + interval '15 days', 'Trial inicial de 15 dias', true);
  END IF;

  RETURN NEW;
END;
$function$;

-- 5) Encerrar gratuidades vencidas
CREATE OR REPLACE FUNCTION public.expire_finished_trials()
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  _n integer;
BEGIN
  UPDATE public.user_subscriptions
    SET status = 'expired'
    WHERE status = 'trial' AND expires_at <= now();
  GET DIAGNOSTICS _n = ROW_COUNT;
  RETURN _n;
END;
$function$;

REVOKE ALL ON FUNCTION public.expire_finished_trials() FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.expire_finished_trials() TO service_role;