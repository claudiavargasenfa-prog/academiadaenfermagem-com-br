CREATE TABLE public.admin_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL,
  body text NOT NULL,
  is_broadcast boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.admin_messages TO authenticated;
GRANT ALL ON public.admin_messages TO service_role;
ALTER TABLE public.admin_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins veem todas as mensagens" ON public.admin_messages FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE TABLE public.admin_message_recipients (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  message_id uuid NOT NULL REFERENCES public.admin_messages(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  read_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (message_id, user_id)
);
GRANT SELECT, UPDATE ON public.admin_message_recipients TO authenticated;
GRANT ALL ON public.admin_message_recipients TO service_role;
ALTER TABLE public.admin_message_recipients ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Destinatario ve sua mensagem" ON public.admin_message_recipients FOR SELECT TO authenticated USING (user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Destinatario marca como lida" ON public.admin_message_recipients FOR UPDATE TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

CREATE POLICY "Destinatario ve o conteudo da mensagem" ON public.admin_messages FOR SELECT TO authenticated USING (EXISTS (SELECT 1 FROM public.admin_message_recipients r WHERE r.message_id = admin_messages.id AND r.user_id = auth.uid()));

CREATE INDEX idx_amr_user ON public.admin_message_recipients(user_id, read_at);