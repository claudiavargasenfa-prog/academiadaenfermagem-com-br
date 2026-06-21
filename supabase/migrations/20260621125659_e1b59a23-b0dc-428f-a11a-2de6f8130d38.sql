
-- Tabela de textos editáveis pelo admin (autonomia total sobre escritas)
CREATE TABLE public.app_texts (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL DEFAULT '',
  description TEXT,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_by UUID
);

GRANT SELECT ON public.app_texts TO anon, authenticated;
GRANT ALL ON public.app_texts TO service_role;
GRANT INSERT, UPDATE, DELETE ON public.app_texts TO authenticated;

ALTER TABLE public.app_texts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read app_texts"
  ON public.app_texts FOR SELECT
  USING (true);

CREATE POLICY "Admins can write app_texts"
  ON public.app_texts FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Trigger updated_at
CREATE TRIGGER app_texts_set_updated_at
  BEFORE UPDATE ON public.app_texts
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Sementes (textos padrão que a admin pode editar)
INSERT INTO public.app_texts (key, value, description) VALUES
  ('home.title', 'Academia de Enfermagem', 'Título principal da home'),
  ('home.description', 'Três aplicativos, uma só academia. Assine o seu e libere todos os mini apps; ou compre mini apps avulsos com 150 dias de acesso.', 'Descrição abaixo do título'),
  ('home.cta_section', 'Assine um aplicativo · acesso ilimitado', 'Título da seção dos 3 aplicativos'),
  ('aplicativo.academico.slogan', '^^ATUALIZAÇÕES AUTOMÁTICAS^^', 'Destaque no card do Acadêmico'),
  ('aplicativo.tecnico.slogan', '', 'Destaque no card do Técnico'),
  ('aplicativo.enfermeiro.slogan', '', 'Destaque no card do Enfermeiro'),
  ('compra.segura', '🔒 COMPRA SEGURA', 'Selo de compra segura nos cards'),
  ('migracao.banner', '**MIGRE PARA OUTRO APP E GANHE 15% DE DESCONTO POR 3 MESES**', 'Texto do bloco de migração'),
  ('trial.d5', '🎁 Faltam **5 dias** do seu trial grátis. Garanta sua vaga!', 'Banner D-5'),
  ('trial.d3', '⚠️ Só **3 dias** restando! Aproveite as **100 vagas** com desconto.', 'Banner D-3'),
  ('trial.d1', '🚨 **ÚLTIMO DIA** do trial. Não perca o acesso!', 'Banner D-1');

-- Badges/destaques nos mini apps (admin escolhe)
ALTER TABLE public.mini_apps
  ADD COLUMN IF NOT EXISTS badges JSONB NOT NULL DEFAULT '[]'::jsonb;

COMMENT ON COLUMN public.mini_apps.badges IS
  'Lista de destaques visuais: [{"label":"NOVO","color":"green","icon":"🆕"}, ...]';
