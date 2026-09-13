CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _categoria TEXT;
  _phone TEXT;
  _full_name TEXT;
  _paid RECORD;
  _has_sub BOOLEAN;
  _plan TEXT;
BEGIN
  _full_name := COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', '');
  _phone := NEW.raw_user_meta_data->>'phone';
  _categoria := NEW.raw_user_meta_data->>'categoria';

  INSERT INTO public.profiles (id, full_name, email, phone, categoria)
  VALUES (NEW.id, _full_name, NEW.email, _phone, _categoria);

  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'aluno');

  FOR _paid IN
    SELECT * FROM public.pending_purchases
    WHERE lower(email) = lower(NEW.email) AND consumed_at IS NULL
  LOOP
    INSERT INTO public.user_subscriptions (user_id, plan_slug, status, started_at, expires_at, notes)
    VALUES (
      NEW.id, _paid.plan_slug, 'active', now(),
      COALESCE(_paid.next_billing_date, now() + interval '30 days'),
      'Compra Mercado Pago ' || COALESCE(_paid.order_id, '')
    );
    UPDATE public.pending_purchases SET consumed_at = now() WHERE id = _paid.id;
  END LOOP;

  SELECT EXISTS (
    SELECT 1 FROM public.user_subscriptions WHERE user_id = NEW.id
  ) INTO _has_sub;

  _plan := CASE
    WHEN _categoria IN ('academico','tecnico','tecnico-estudante','enfermeiro') THEN _categoria
    ELSE 'academico'
  END;

  IF NOT _has_sub
     AND now() >= timestamptz '2026-08-10 00:00:00-03'
     AND now() <= timestamptz '2026-09-30 23:59:59-03' THEN
    INSERT INTO public.user_subscriptions (user_id, plan_slug, status, started_at, expires_at, notes, was_trial)
    VALUES (NEW.id, _plan, 'trial', now(), now() + interval '15 days', 'Trial de 15 dias (campanha 10/08 a 30/09/2026)', true);
  END IF;

  RETURN NEW;
END;
$$;