
CREATE TABLE public.diagnosticos_aede (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  id_gatilho TEXT NOT NULL UNIQUE,
  bloco TEXT NOT NULL,
  bloco_label TEXT NOT NULL,
  titulo TEXT NOT NULL,
  sinais_sintomas TEXT[] NOT NULL DEFAULT '{}',
  meta_mm TEXT,
  raciocinio_rc TEXT,
  ordem INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.diagnosticos_aede TO authenticated;
GRANT ALL ON public.diagnosticos_aede TO service_role;
ALTER TABLE public.diagnosticos_aede ENABLE ROW LEVEL SECURITY;
CREATE POLICY "diag_select_auth" ON public.diagnosticos_aede FOR SELECT TO authenticated USING (true);
CREATE POLICY "diag_admin_all" ON public.diagnosticos_aede FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin'::app_role))
  WITH CHECK (public.has_role(auth.uid(),'admin'::app_role));
CREATE TRIGGER trg_diag_upd BEFORE UPDATE ON public.diagnosticos_aede
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TABLE public.diagnosticos_condutas (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  diagnostico_id UUID NOT NULL REFERENCES public.diagnosticos_aede(id) ON DELETE CASCADE,
  ordem INT NOT NULL DEFAULT 0,
  conduta_cde TEXT NOT NULL,
  aprazamento TEXT,
  horario_padrao TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.diagnosticos_condutas TO authenticated;
GRANT ALL ON public.diagnosticos_condutas TO service_role;
ALTER TABLE public.diagnosticos_condutas ENABLE ROW LEVEL SECURITY;
CREATE POLICY "cond_select_auth" ON public.diagnosticos_condutas FOR SELECT TO authenticated USING (true);
CREATE POLICY "cond_admin_all" ON public.diagnosticos_condutas FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin'::app_role))
  WITH CHECK (public.has_role(auth.uid(),'admin'::app_role));
CREATE TRIGGER trg_cond_upd BEFORE UPDATE ON public.diagnosticos_condutas
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE INDEX idx_cond_diag ON public.diagnosticos_condutas(diagnostico_id, ordem);
CREATE INDEX idx_diag_bloco ON public.diagnosticos_aede(bloco, ordem);
