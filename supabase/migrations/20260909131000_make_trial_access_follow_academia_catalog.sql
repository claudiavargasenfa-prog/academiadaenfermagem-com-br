-- During an active subscription/trial, a Mini App is accessible when it is
-- explicitly marked for the subscribed Academy. This makes the Academy catalog
-- the source of truth and prevents missing placements from hiding content.
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
        SELECT 1 FROM public.mini_apps m
        WHERE m.id = _mini_app_id AND m.gratuito = true AND m.is_active = true
      ) THEN true
      WHEN EXISTS (
        SELECT 1 FROM public.user_app_access a
        WHERE a.user_id = _user_id
          AND a.mini_app_id = _mini_app_id
          AND a.expires_at > now()
      ) THEN true
      WHEN EXISTS (
        SELECT 1
        FROM public.user_subscriptions s
        JOIN public.mini_apps m ON m.id = _mini_app_id
        WHERE s.user_id = _user_id
          AND s.status IN ('active', 'trial')
          AND s.expires_at > now()
          AND m.is_active = true
          AND (
            (s.plan_slug = 'academico' AND m.track_academico = true)
            OR (s.plan_slug = 'tecnico' AND m.track_tecnico = true)
            OR (s.plan_slug = 'tecnico-estudante' AND m.track_tecnico_estudante = true)
            OR (s.plan_slug = 'enfermeiro' AND m.track_enfermeiro = true)
          )
      ) THEN true
      ELSE EXISTS (
        SELECT 1
        FROM public.user_subscriptions s
        JOIN public.mini_app_placements p ON p.mini_app_id = _mini_app_id
        JOIN public.apps app ON app.id = p.app_id
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
