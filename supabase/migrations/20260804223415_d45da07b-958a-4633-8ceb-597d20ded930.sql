CREATE OR REPLACE FUNCTION public.set_bonus_app(_bonus_slug text)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _user uuid := auth.uid();
  _sub RECORD;
BEGIN
  IF _user IS NULL THEN RAISE EXCEPTION 'not_authenticated'; END IF;

  IF NOT EXISTS (SELECT 1 FROM public.apps WHERE slug = _bonus_slug AND is_active = true) THEN
    RAISE EXCEPTION 'app_not_found';
  END IF;

  SELECT * INTO _sub
  FROM public.user_subscriptions
  WHERE user_id = _user
    AND status = 'active'
    AND expires_at > now()
    AND billing_period = 'anual'
  ORDER BY expires_at DESC
  LIMIT 1;

  IF _sub IS NULL THEN RAISE EXCEPTION 'no_annual_subscription'; END IF;
  IF _sub.bonus_app_slug IS NOT NULL THEN RAISE EXCEPTION 'bonus_already_chosen'; END IF;
  IF _sub.plan_slug = _bonus_slug THEN RAISE EXCEPTION 'same_as_current_plan'; END IF;

  UPDATE public.user_subscriptions
    SET bonus_app_slug = _bonus_slug
    WHERE id = _sub.id;

  RETURN _bonus_slug;
END;
$$;

REVOKE ALL ON FUNCTION public.set_bonus_app(text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.set_bonus_app(text) TO authenticated;