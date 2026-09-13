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
      WHEN EXISTS (
        SELECT 1 FROM public.user_subscriptions s
        WHERE s.user_id = _user_id
          AND s.status = 'trial'
          AND s.expires_at > now()
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
$function$;