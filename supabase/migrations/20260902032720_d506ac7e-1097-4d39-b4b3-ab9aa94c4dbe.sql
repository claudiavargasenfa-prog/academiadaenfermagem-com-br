-- 1) student_comments: adicionar WITH CHECK espelhando o USING
DROP POLICY "Admins can moderate comments" ON public.student_comments;
CREATE POLICY "Admins can moderate comments" ON public.student_comments
  FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::public.app_role))
  WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));

-- 2) user_feedbacks: adicionar WITH CHECK espelhando o USING
DROP POLICY "Admins can update feedback status and response" ON public.user_feedbacks;
CREATE POLICY "Admins can update feedback status and response" ON public.user_feedbacks
  FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::public.app_role))
  WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));

-- 3) orders: garantir que clientes nunca alterem/apaguem pedidos (somente service_role/webhook)
REVOKE UPDATE, DELETE ON public.orders FROM anon, authenticated;

-- 4) remover execução anônima da função de catálogo não utilizada no cliente
REVOKE EXECUTE ON FUNCTION public.list_mini_apps_catalog() FROM anon, authenticated;