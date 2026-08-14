
DROP FUNCTION IF EXISTS public.list_mini_apps_catalog();

CREATE OR REPLACE FUNCTION public.list_mini_apps_catalog()
RETURNS TABLE (
    id uuid,
    slug text,
    name text,
    description text,
    kind text,
    price_cents integer,
    price_original_cents integer,
    cakto_product_id text,
    cakto_checkout_url text,
    icon text,
    is_active boolean,
    sort_order integer,
    gratuito boolean,
    em_breve boolean,
    route_path text,
    horas_certificado integer,
    track_academico boolean,
    track_tecnico boolean,
    track_enfermeiro boolean,
    badges jsonb,
    created_at timestamptz,
    updated_at timestamptz
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT 
        id, slug, name, description, kind, price_cents, price_original_cents, 
        cakto_product_id, cakto_checkout_url, icon, is_active, sort_order, 
        gratuito, em_breve, route_path, horas_certificado, 
        track_academico, track_tecnico, track_enfermeiro, 
        badges, created_at, updated_at
    FROM public.mini_apps
    WHERE is_active = true
    ORDER BY sort_order ASC NULLS LAST, name ASC;
$$;

GRANT EXECUTE ON FUNCTION public.list_mini_apps_catalog() TO authenticated;
GRANT EXECUTE ON FUNCTION public.list_mini_apps_catalog() TO service_role;
