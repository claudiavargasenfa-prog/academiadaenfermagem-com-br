DROP POLICY IF EXISTS "plan_offers_public_read" ON public.plan_offers;

CREATE POLICY "plan_offers_active_read" ON public.plan_offers
  FOR SELECT USING (is_active = true);

CREATE POLICY "plan_offers_admin_read" ON public.plan_offers
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));