-- 1) mini_apps: conteúdo pago não pode mais vazar para visitantes/não pagantes
DROP POLICY IF EXISTS "Public can view active mini apps" ON public.mini_apps;

CREATE POLICY "Anon can view active mini apps metadata"
ON public.mini_apps
FOR SELECT
TO anon
USING (is_active = true);

REVOKE SELECT ON public.mini_apps FROM anon;
GRANT SELECT (
  id, slug, name, description, kind, price_cents, price_original_cents,
  cakto_product_id, cakto_checkout_url, icon, is_active, sort_order,
  gratuito, em_breve, route_path, horas_certificado,
  track_academico, track_tecnico, track_enfermeiro, badges,
  created_at, updated_at
) ON public.mini_apps TO anon;

GRANT SELECT, INSERT, UPDATE, DELETE ON public.mini_apps TO authenticated;
GRANT ALL ON public.mini_apps TO service_role;

-- metadados públicos (sem conteúdo) por slug
CREATE OR REPLACE FUNCTION public.get_mini_app_meta(_slug text)
RETURNS TABLE(
  id uuid, slug text, name text, description text, gratuito boolean,
  em_breve boolean, route_path text, cakto_checkout_url text,
  price_cents integer, price_original_cents integer
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT m.id, m.slug, m.name, m.description, m.gratuito, m.em_breve,
         m.route_path, m.cakto_checkout_url, m.price_cents, m.price_original_cents
  FROM public.mini_apps m
  WHERE m.slug = _slug AND m.is_active = true
  LIMIT 1;
$$;

REVOKE ALL ON FUNCTION public.get_mini_app_meta(text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_mini_app_meta(text) TO anon, authenticated, service_role;

-- 2) trial_fingerprints: só o servidor pode gravar
DROP POLICY IF EXISTS "Anyone can insert trial fingerprints" ON public.trial_fingerprints;
REVOKE INSERT, UPDATE, DELETE ON public.trial_fingerprints FROM anon, authenticated;
GRANT SELECT ON public.trial_fingerprints TO authenticated;
GRANT ALL ON public.trial_fingerprints TO service_role;

-- 3) funções internas não podem ser chamadas sem login
REVOKE ALL ON FUNCTION public.internal_issue_certificate(uuid, uuid, numeric, text) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.internal_issue_certificate(uuid, uuid, numeric, text) TO service_role;

REVOKE ALL ON FUNCTION public.issue_certificate(uuid, numeric, text) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.issue_certificate(uuid, numeric, text) TO authenticated, service_role;

REVOKE ALL ON FUNCTION public.issue_certificate(uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.issue_certificate(uuid) TO authenticated, service_role;

REVOKE ALL ON FUNCTION public.list_mini_apps_catalog() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.list_mini_apps_catalog() TO anon, authenticated, service_role;