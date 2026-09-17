CREATE OR REPLACE FUNCTION public.get_mini_app_meta(_slug text)
RETURNS TABLE(id uuid, slug text, name text, description text, gratuito boolean, em_breve boolean, route_path text, cakto_checkout_url text, price_cents integer, price_original_cents integer)
LANGUAGE sql
STABLE
SECURITY INVOKER
SET search_path = public
AS $$
  SELECT m.id, m.slug, m.name, m.description, m.gratuito, m.em_breve,
         m.route_path, m.cakto_checkout_url, m.price_cents, m.price_original_cents
  FROM public.mini_apps m
  WHERE m.slug = _slug AND m.is_active = true
  LIMIT 1
$$;

REVOKE ALL ON FUNCTION public.get_mini_app_meta(text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_mini_app_meta(text) TO anon, authenticated, service_role;