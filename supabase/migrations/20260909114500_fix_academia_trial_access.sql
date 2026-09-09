-- Correção definitiva da regra de acesso das Academias.
-- Regra de negócio:
-- 1) A campanha aceita novos cadastros de 10/08/2026 até 10/09/2026.
-- 2) Cada novo cadastro elegível recebe 15 dias INDIVIDUAIS a partir do cadastro.
-- 3) Durante o trial, o aluno tem acesso a todos os Mini Apps colocados na Academia da sua categoria.
-- 4) A partir de 11/09/2026, novos cadastros não recebem trial; Mini Apps gratuitos continuam livres e os premium exigem assinatura.

CREATE OR REPLACE FUNCTION public.has_app_access(_user_id uuid, _mini_app_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    CASE
      WHEN _user_id IS NULL THEN false
      WHEN public.has_role(_user_id, 'admin') THEN true
      WHEN EXISTS (
        SELECT 1
        FROM public.mini_apps m
        WHERE m.id = _mini_app_id
          AND m.gratuito = true
          AND m.is_active = true
      ) THEN true
      WHEN EXISTS (
        SELECT 1
        FROM public.user_app_access a
        WHERE a.user_id = _user_id
          AND a.mini_app_id = _mini_app_id
          AND a.expires_at > now()
      ) THEN true
      ELSE EXISTS (
        SELECT 1
        FROM public.user_subscriptions s
        JOIN public.mini_app_placements p
          ON p.mini_app_id = _mini_app_id
        JOIN public.apps app
          ON app.id = p.app_id
        WHERE s.user_id = _user_id
          AND s.status IN ('active', 'trial')
          AND s.expires_at > now()
          AND (s.plan_slug = app.slug OR s.bonus_app_slug = app.slug)
          AND app.is_active = true
      )
    END
$$;

REVOKE ALL ON FUNCTION public.has_app_access(uuid, uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.has_app_access(uuid, uuid) TO authenticated, service_role;

-- Garante que a criação de usuário continue respeitando exatamente o período da campanha,
-- mas que a duração do acesso seja sempre individual de 15 dias.
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
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
  VALUES (NEW.id, _full_name, NEW.email, _phone, _categoria)
  ON CONFLICT (id) DO UPDATE
    SET full_name = EXCLUDED.full_name,
        email = EXCLUDED.email,
        phone = EXCLUDED.phone,
        categoria = EXCLUDED.categoria;

  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'aluno')
  ON CONFLICT (user_id, role) DO NOTHING;

  FOR _paid IN
    SELECT *
    FROM public.pending_purchases
    WHERE lower(email) = lower(NEW.email)
      AND consumed_at IS NULL
  LOOP
    INSERT INTO public.user_subscriptions (user_id, plan_slug, status, started_at, expires_at, notes)
    VALUES (
      NEW.id,
      _paid.plan_slug,
      'active',
      now(),
      COALESCE(_paid.next_billing_date, now() + interval '30 days'),
      'Compra Mercado Pago ' || COALESCE(_paid.order_id, '')
    );
    UPDATE public.pending_purchases
    SET consumed_at = now()
    WHERE id = _paid.id;
  END LOOP;

  SELECT EXISTS (
    SELECT 1
    FROM public.user_subscriptions
    WHERE user_id = NEW.id
  ) INTO _has_sub;

  _plan := CASE
    WHEN _categoria IN ('academico', 'tecnico', 'tecnico-estudante', 'enfermeiro') THEN _categoria
    ELSE 'academico'
  END;

  IF NOT _has_sub
     AND now() >= timestamptz '2026-08-10 00:00:00-03'
     AND now() <= timestamptz '2026-09-10 23:59:59-03' THEN
    INSERT INTO public.user_subscriptions (
      user_id,
      plan_slug,
      status,
      started_at,
      expires_at,
      notes,
      was_trial
    )
    VALUES (
      NEW.id,
      _plan,
      'trial',
      now(),
      now() + interval '15 days',
      'Trial de 15 dias — campanha de inauguração 10/08/2026 a 10/09/2026',
      true
    );
  END IF;

  RETURN NEW;
END;
$function$;
