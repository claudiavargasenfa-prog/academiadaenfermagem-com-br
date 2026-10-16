CREATE TABLE public.manual_leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nome text NOT NULL CHECK (char_length(nome) BETWEEN 2 AND 100),
  whatsapp text NOT NULL CHECK (whatsapp ~ '^[0-9]{10,11}$'),
  perfil text NOT NULL CHECK (perfil IN ('estudante_tecnico','academico','profissional')),
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT INSERT ON public.manual_leads TO anon, authenticated;
GRANT SELECT, DELETE ON public.manual_leads TO authenticated;
GRANT ALL ON public.manual_leads TO service_role;
ALTER TABLE public.manual_leads ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Qualquer um envia cadastro" ON public.manual_leads FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Admin vê cadastros" ON public.manual_leads FOR SELECT TO authenticated USING (public.has_role(auth.uid(),'admin'));
CREATE POLICY "Admin apaga cadastros" ON public.manual_leads FOR DELETE TO authenticated USING (public.has_role(auth.uid(),'admin'));