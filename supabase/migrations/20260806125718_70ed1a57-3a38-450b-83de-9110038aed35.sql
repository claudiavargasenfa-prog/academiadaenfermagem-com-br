-- 1) payment_webhooks: enable RLS, admin-only
ALTER TABLE public.payment_webhooks ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.payment_webhooks FROM anon, authenticated;
GRANT SELECT ON public.payment_webhooks TO authenticated;
GRANT ALL ON public.payment_webhooks TO service_role;
DROP POLICY IF EXISTS "payment_webhooks_admin_read" ON public.payment_webhooks;
CREATE POLICY "payment_webhooks_admin_read" ON public.payment_webhooks
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- 2) plan_offers: drop redundant admin read policy
DROP POLICY IF EXISTS "plan_offers_admin_read" ON public.plan_offers;

-- 3) simulado_attempts: owner-only read (ranking uses SECURITY DEFINER fn)
DROP POLICY IF EXISTS "simulado_read" ON public.simulado_attempts;
CREATE POLICY "simulado_read_own" ON public.simulado_attempts
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));

-- 4) VIP content restricted to paying/trial students and admins
CREATE OR REPLACE FUNCTION public.has_active_membership(_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT _user_id IS NOT NULL AND (
    public.has_role(_user_id, 'admin')
    OR EXISTS (
      SELECT 1 FROM public.user_subscriptions s
      WHERE s.user_id = _user_id
        AND s.status IN ('active','trial')
        AND s.expires_at > now()
    )
  )
$$;
REVOKE ALL ON FUNCTION public.has_active_membership(uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.has_active_membership(uuid) TO authenticated, service_role;

DROP POLICY IF EXISTS "vip_posts_read" ON public.vip_posts;
CREATE POLICY "vip_posts_read" ON public.vip_posts
  FOR SELECT TO authenticated USING (public.has_active_membership(auth.uid()));

DROP POLICY IF EXISTS "vip_comments_read" ON public.vip_comments;
CREATE POLICY "vip_comments_read" ON public.vip_comments
  FOR SELECT TO authenticated USING (public.has_active_membership(auth.uid()));

DROP POLICY IF EXISTS "vip_likes_read" ON public.vip_post_likes;
CREATE POLICY "vip_likes_read" ON public.vip_post_likes
  FOR SELECT TO authenticated USING (public.has_active_membership(auth.uid()));

-- 5) Fix mutable search_path on trigger function
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;

-- 6) Revoke public/anon execute on SECURITY DEFINER + trigger functions
REVOKE ALL ON FUNCTION public.issue_certificate(uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.issue_certificate(uuid) TO authenticated;

REVOKE ALL ON FUNCTION public.set_bonus_app(text) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.set_bonus_app(text) TO authenticated;

REVOKE ALL ON FUNCTION public.simulado_ranking(integer) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.simulado_ranking(integer) TO authenticated;

REVOKE ALL ON FUNCTION public.vip_sync_counts() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.handle_updated_at() FROM PUBLIC, anon, authenticated;