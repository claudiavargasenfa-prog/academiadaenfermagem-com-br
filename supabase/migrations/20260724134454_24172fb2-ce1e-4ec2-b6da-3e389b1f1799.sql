-- 1) diagnosticos_aede: restrict SELECT to users with active subscription/app access or admins
DROP POLICY IF EXISTS diag_select_auth ON public.diagnosticos_aede;
CREATE POLICY diag_select_auth ON public.diagnosticos_aede
  FOR SELECT TO authenticated
  USING (
    public.has_role(auth.uid(), 'admin'::app_role)
    OR EXISTS (
      SELECT 1 FROM public.user_subscriptions s
      WHERE s.user_id = auth.uid()
        AND s.status IN ('active','trial')
        AND s.expires_at > now()
    )
    OR EXISTS (
      SELECT 1 FROM public.user_app_access a
      WHERE a.user_id = auth.uid() AND a.expires_at > now()
    )
  );

-- 2) diagnosticos_condutas: same gating
DROP POLICY IF EXISTS cond_select_auth ON public.diagnosticos_condutas;
CREATE POLICY cond_select_auth ON public.diagnosticos_condutas
  FOR SELECT TO authenticated
  USING (
    public.has_role(auth.uid(), 'admin'::app_role)
    OR EXISTS (
      SELECT 1 FROM public.user_subscriptions s
      WHERE s.user_id = auth.uid()
        AND s.status IN ('active','trial')
        AND s.expires_at > now()
    )
    OR EXISTS (
      SELECT 1 FROM public.user_app_access a
      WHERE a.user_id = auth.uid() AND a.expires_at > now()
    )
  );

-- 3) mini_app_subtopics: restrict to authenticated users with access to parent mini_app
DROP POLICY IF EXISTS "Public can view published subtopics" ON public.mini_app_subtopics;
CREATE POLICY "Users with access view published subtopics"
  ON public.mini_app_subtopics
  FOR SELECT TO authenticated
  USING (
    is_draft = false
    AND (
      public.has_role(auth.uid(), 'admin'::app_role)
      OR public.has_app_access(auth.uid(), mini_app_id)
    )
  );

-- 4) mini_apps: only show a row when the user has access (or it is free, or admin)
DROP POLICY IF EXISTS "Authenticated read active mini_apps" ON public.mini_apps;
CREATE POLICY "Authenticated read accessible mini_apps"
  ON public.mini_apps
  FOR SELECT TO authenticated
  USING (
    is_active = true
    AND (
      public.has_role(auth.uid(), 'admin'::app_role)
      OR gratuito = true
      OR public.has_app_access(auth.uid(), id)
    )
  );

-- Public catalog RPC: exposes non-sensitive columns only (no content_md/video_url/audio_url),
-- so browsing pages (store/vendas/planos) keep working without leaking paid content.
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
  horas_certificado numeric,
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
  SELECT id, slug, name, description, kind, price_cents, price_original_cents,
    cakto_product_id, cakto_checkout_url, icon, is_active, sort_order, gratuito,
    em_breve, route_path, horas_certificado, track_academico, track_tecnico,
    track_enfermeiro, badges, created_at, updated_at
  FROM public.mini_apps
  WHERE is_active = true
  ORDER BY sort_order ASC NULLS LAST, name ASC;
$$;

GRANT EXECUTE ON FUNCTION public.list_mini_apps_catalog() TO anon, authenticated;