-- 1. Restaurar permissões básicas de leitura para o catálogo
GRANT SELECT ON public.mini_apps TO anon, authenticated;
GRANT SELECT ON public.apps TO anon, authenticated;
GRANT SELECT ON public.subscription_plans TO anon, authenticated;

-- 2. Garantir que RLS permita leitura pública do catálogo (necessário para a loja e listagens)
ALTER TABLE public.mini_apps ENABLE ROW LEVEL SECURITY;
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'mini_apps' AND policyname = 'Public can view active mini apps') THEN
        CREATE POLICY "Public can view active mini apps" ON public.mini_apps FOR SELECT USING (is_active = true);
    END IF;
END $$;

ALTER TABLE public.apps ENABLE ROW LEVEL SECURITY;
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'apps' AND policyname = 'Public can view apps') THEN
        CREATE POLICY "Public can view apps" ON public.apps FOR SELECT USING (true);
    END IF;
END $$;

-- 3. Restaurar os conteúdos essenciais (Seed)
INSERT INTO public.mini_apps (slug, name, description, kind, price_cents, gratuito, em_breve, route_path, horas_certificado, is_active, sort_order, track_academico, track_tecnico, track_enfermeiro)
VALUES
  ('manual-sobrevivencia', 'Manual de Sobrevivência do Estágio', 'Primeiros passos e checklist de mochila.', 'basico', 0, true, false, '/manual-sobrevivencia', 2, true, 1, true, true, false),
  ('sinais-vitais', 'Sinais Vitais — Adulto', 'PA, FC, FR, T° e SpO₂.', 'extra', 990, false, false, '/sinais-vitais', 4, true, 2, true, true, true),
  ('iras', 'Time Contra as IRAS', 'Prevenção de infecções hospitalares.', 'extra', 990, false, false, '/iras', 4, true, 3, true, true, false),
  ('seguranca', 'Segurança do Paciente', 'Metas internacionais de segurança.', 'extra', 990, false, false, '/seguranca', 4, true, 4, true, true, false),
  ('exame-fisico-escalas', 'Exame Físico e Escalas Clínicas', 'Cefalocaudal, Glasgow, Braden e mais.', 'extra', 1490, false, false, '/exame-fisico-escalas', 8, true, 5, true, true, false),
  ('medicamentosecalculos', 'Cálculos de Medicamentos', 'Regra de três e gotejamento.', 'extra', 1990, false, false, '/calculadora', 8, true, 6, true, true, true),
  ('curativos', 'Curativos e Lesões de Pele', 'Tipos de feridas e coberturas.', 'extra', 1990, false, false, '/curativos', 8, true, 7, true, true, true),
  ('uti', 'Enfermagem em UTI', 'Monitorização e ventilação mecânica.', 'extra', 2490, false, false, '/uti', 10, true, 8, false, false, true),
  ('farmacologia-avancada', 'Farmacologia Avançada', 'Aminas e diluições críticas.', 'extra', 1990, false, false, '/farmacologia-avancada', 8, true, 9, false, false, true),
  ('saude-mental', 'Saúde Mental', 'Manejo da crise e comunicação.', 'extra', 1490, false, false, '/saude-mental', 6, true, 10, true, true, true),
  ('escalas-clinicas', 'Escalas Clínicas na Prática', 'Avaliação rápida do paciente.', 'extra', 0, false, false, '/escalas-clinicas', 4, true, 11, true, true, true),
  ('puncao-venosa', 'Punção Venosa e Flebite', 'Técnica ilustrada passo a passo.', 'extra', 0, false, false, '/procedimentos-enfermagem', 4, true, 12, true, true, true),
  ('avc-agudo', 'Protocolo AVC Agudo', 'Manejo na sala vermelha.', 'extra', 0, false, false, '/app/avc-agudo', 2, true, 13, true, true, true)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  is_active = true;

-- 4. Garantir que os apps (Portas) existam
INSERT INTO public.apps (slug, name, emoji, bg_color, fg_color, ordem)
VALUES
  ('academico', 'Academia do Acadêmico', '🎓', '#1e3a8a', '#ffffff', 1),
  ('tecnico', 'Academia do Técnico', '🩺', '#166534', '#ffffff', 2),
  ('tecnico-estudante', 'Estudante de Técnico', '📗', '#15803d', '#ffffff', 3),
  ('enfermeiro', 'Academia do Enfermeiro', '👩‍⚕️', '#0f172a', '#ffffff', 4)
ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name;

-- 5. Vincular conteúdos aos apps (Placements)
INSERT INTO public.mini_app_placements (mini_app_id, app_id, ordem)
SELECT m.id, a.id, m.sort_order
FROM public.mini_apps m
CROSS JOIN public.apps a
WHERE (a.slug = 'academico' AND m.track_academico = true)
   OR (a.slug = 'tecnico' AND m.track_tecnico = true)
   OR (a.slug = 'enfermeiro' AND m.track_enfermeiro = true)
ON CONFLICT DO NOTHING;