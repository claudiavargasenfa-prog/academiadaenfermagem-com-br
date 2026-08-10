-- 1) mini_apps: visitante anônimo só enxerga colunas de vitrine (sem conteúdo pago)
REVOKE SELECT ON public.mini_apps FROM anon;
GRANT SELECT (id, slug, name, description, kind, price_cents, cakto_product_id,
  cakto_checkout_url, icon, is_active, sort_order, created_at, updated_at,
  gratuito, em_breve, route_path, horas_certificado, price_original_cents,
  track_academico, track_tecnico, track_enfermeiro, badges)
ON public.mini_apps TO anon;

-- 2) has_role (SECURITY DEFINER) não deve ser executável sem login
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM anon, PUBLIC;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated, service_role;