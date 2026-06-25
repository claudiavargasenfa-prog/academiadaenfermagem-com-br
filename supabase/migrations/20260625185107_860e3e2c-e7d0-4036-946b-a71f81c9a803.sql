CREATE OR REPLACE FUNCTION public.has_app_access(_user_id uuid, _mini_app_id uuid)
 RETURNS boolean
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
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
$function$;