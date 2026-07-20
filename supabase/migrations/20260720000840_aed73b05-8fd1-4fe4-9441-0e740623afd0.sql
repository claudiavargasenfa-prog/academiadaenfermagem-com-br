
ALTER TABLE public.apps ADD COLUMN IF NOT EXISTS whatsapp_group_url text;

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
  _trial_days INT;
BEGIN
  _full_name := COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', '');
  _phone := NEW.raw_user_meta_data->>'phone';
  _categoria := NEW.raw_user_meta_data->>'categoria';

  INSERT INTO public.profiles (id, full_name, email, phone, categoria)
  VALUES (NEW.id, _full_name, NEW.email, _phone, _categoria);

  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'aluno');

  -- Promoção de lançamento: 15 dias entre 01/08/2026 e 01/10/2026
  IF now() >= '2026-08-01 00:00:00+00'::timestamptz
     AND now() <  '2026-10-02 00:00:00+00'::timestamptz THEN
    _trial_days := 15;
  ELSE
    _trial_days := 30;
  END IF;

  IF _categoria IN ('academico','tecnico','tecnico-estudante','enfermeiro') THEN
    INSERT INTO public.user_subscriptions (user_id, plan_slug, status, started_at, expires_at, notes)
    VALUES (NEW.id, _categoria, 'trial', now(), now() + (_trial_days || ' days')::interval,
            'Trial inicial de ' || _trial_days || ' dias');
  END IF;

  RETURN NEW;
END;
$function$;
