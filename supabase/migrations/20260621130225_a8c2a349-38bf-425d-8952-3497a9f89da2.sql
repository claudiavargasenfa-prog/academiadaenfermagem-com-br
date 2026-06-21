
-- user_roles: somente admins podem gravar
CREATE POLICY "Admins manage user_roles insert"
  ON public.user_roles FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins manage user_roles update"
  ON public.user_roles FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins manage user_roles delete"
  ON public.user_roles FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- relatorio_uses: usuário só insere para si mesmo
CREATE POLICY "Users insert own relatorio_uses"
  ON public.relatorio_uses FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- subscriptions: somente admins gravam (service role bypassa RLS)
CREATE POLICY "Admins manage subscriptions insert"
  ON public.subscriptions FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins manage subscriptions update"
  ON public.subscriptions FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins manage subscriptions delete"
  ON public.subscriptions FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- user_app_access: somente admins gravam
CREATE POLICY "Admins manage user_app_access insert"
  ON public.user_app_access FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins manage user_app_access update"
  ON public.user_app_access FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins manage user_app_access delete"
  ON public.user_app_access FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));
