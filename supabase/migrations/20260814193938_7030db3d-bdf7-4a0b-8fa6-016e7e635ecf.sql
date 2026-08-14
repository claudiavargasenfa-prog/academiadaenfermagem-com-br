-- Conceder acesso a um mini app específico para o admin para que ele apareça na lista
INSERT INTO public.user_app_access (user_id, mini_app_id, expires_at)
SELECT '8531e896-ccb0-4093-89f3-042a1be5b14b', id, now() + interval '1 year'
FROM public.mini_apps
WHERE is_active = true
LIMIT 1
ON CONFLICT DO NOTHING;
