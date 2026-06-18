
-- 1) Novas colunas em mini_apps
ALTER TABLE public.mini_apps
  ADD COLUMN IF NOT EXISTS gratuito boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS em_breve boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS route_path text,
  ADD COLUMN IF NOT EXISTS horas_certificado numeric;

-- Garantir unique no slug para os UPSERTs
CREATE UNIQUE INDEX IF NOT EXISTS mini_apps_slug_key ON public.mini_apps (slug);

-- 2) Nova lógica de has_app_access: gratuito sempre liberado; pagos exigem user_app_access vigente
CREATE OR REPLACE FUNCTION public.has_app_access(_user_id uuid, _mini_app_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    CASE
      WHEN EXISTS (SELECT 1 FROM public.mini_apps WHERE id = _mini_app_id AND gratuito = true) THEN true
      ELSE EXISTS (
        SELECT 1
        FROM public.user_app_access a
        WHERE a.user_id = _user_id
          AND a.mini_app_id = _mini_app_id
          AND a.expires_at > now()
      )
    END
$$;

-- 3) Seed/upsert dos 21 mini apps (1 grátis + 14 com tela + 6 em breve)
-- Manual de Sobrevivência (grátis)
INSERT INTO public.mini_apps (slug, name, description, kind, price_cents, gratuito, em_breve, route_path, horas_certificado, is_active, sort_order)
VALUES
  ('manual-sobrevivencia', 'Manual de Sobrevivência do Estágio',           'Primeiros passos, checklist de mochila, postura no campo, comunicação com preceptor.', 'basico', 0,    true,  false, '/manual-sobrevivencia', 2,  true, 1),
  ('postura-etica',        'Postura e Ética Profissional',                 'Conduta, sigilo, COFEN, comunicação terapêutica.',                                       'extra',  990,  false, false, '/postura-etica',        4,  true, 2),
  ('sinais-vitais',        'Sinais Vitais — Adulto',                       'PA, FC, FR, T°, SpO₂: técnica, valores e raciocínio clínico.',                           'extra',  990,  false, false, '/sinais-vitais',        4,  true, 3),
  ('iras',                 'Time Contra as IRAS',                          'Higienização das mãos e 6 metas internacionais de segurança.',                            'extra',  990,  false, false, '/iras',                 4,  true, 4),
  ('seguranca',            'Segurança do Paciente',                        'Identificação, medicamentos seguros, prevenção de quedas e lesões por pressão.',          'extra',  990,  false, false, '/seguranca',            4,  true, 5),
  ('exame-fisico-escalas', 'Exame Físico e Escalas Clínicas',              'Cefalocaudal, Glasgow, Braden, Morse e mais.',                                            'extra',  1490, false, false, '/exame-fisico-escalas', 8,  true, 6),
  ('medicamentosecalculos','Cálculos de Medicamentos',                     'Regra de três, gotejamento, dose/peso e checagem de segurança.',                          'extra',  1990, false, false, '/calculadora',          8,  true, 7),
  ('sv-pediatrico',        'Sinais Vitais Pediátricos',                    'Valores por faixa etária e particularidades da avaliação infantil.',                      'extra',  990,  false, false, '/sv-pediatrico',        4,  true, 8),
  ('sv-gestante',          'Sinais Vitais da Gestante',                    'Particularidades, sinais de alarme e cuidados no pré-natal.',                             'extra',  1490, false, false, '/sv-gestante',          4,  true, 9),
  ('curativos',            'Curativos e Lesões de Pele',                   'Tipos de feridas, coberturas, técnica asséptica e troca.',                                'extra',  1990, false, false, '/curativos',            8,  true, 10),
  ('acls',                 'ACLS — Suporte Avançado de Vida',              'Algoritmos de PCR adulto, ritmos chocáveis e não chocáveis, drogas.',                     'extra',  2490, false, false, '/acls',                 10, true, 11),
  ('uti',                  'Enfermagem em UTI',                            'Monitorização, ventilação mecânica, sedoanalgesia e prevenção de eventos.',               'extra',  2490, false, false, '/uti',                  10, true, 12),
  ('farmacologia-avancada','Farmacologia Avançada',                        'Aminas vasoativas, antibióticos, sedativos e diluições críticas.',                        'extra',  1990, false, false, '/farmacologia-avancada',8,  true, 13),
  ('saude-mental',         'Saúde Mental e Cuidado Psiquiátrico',          'Manejo da crise, comunicação terapêutica, contenção e medicações.',                       'extra',  1490, false, false, '/saude-mental',         6,  true, 14),
  ('relatorio-abnt',       'Relatório de Estágio (ABNT)',                  'Gera o relatório a partir do Diário de Bordo (5 aberturas por compra).',                  'relatorio', 6000, false, false, '/relatorio-abnt',     0,  true, 15),
  ('obstetricia',          'Enfermagem Obstétrica',                        'Trabalho de parto, puerpério e cuidados ao RN.',                                          'extra',  1990, false, true,  NULL,                    8,  true, 16),
  ('pediatria',            'Enfermagem Pediátrica',                        'Cuidado integral à criança hospitalizada e ambulatorial.',                                'extra',  1990, false, true,  NULL,                    8,  true, 17),
  ('anatomia',             'Anatomia Clínica Aplicada',                    'Anatomia funcional para a prática de enfermagem.',                                        'extra',  1490, false, true,  NULL,                    6,  true, 18),
  ('fisiologia',           'Fisiologia para Enfermagem',                   'Sistemas, regulação e correlação clínica.',                                               'extra',  1490, false, true,  NULL,                    6,  true, 19),
  ('microbiologia',        'Microbiologia para a Prática',                 'Patógenos, isolamentos e prevenção de transmissão.',                                      'extra',  1490, false, true,  NULL,                    6,  true, 20),
  ('gestao-enfermagem',    'Gestão em Enfermagem',                         'Liderança, dimensionamento, escala, indicadores e qualidade.',                            'extra',  1990, false, true,  NULL,                    8,  true, 21)
ON CONFLICT (slug) DO UPDATE SET
  name              = EXCLUDED.name,
  description       = EXCLUDED.description,
  kind              = EXCLUDED.kind,
  price_cents       = EXCLUDED.price_cents,
  gratuito          = EXCLUDED.gratuito,
  em_breve          = EXCLUDED.em_breve,
  route_path        = EXCLUDED.route_path,
  horas_certificado = EXCLUDED.horas_certificado,
  is_active         = EXCLUDED.is_active,
  sort_order        = EXCLUDED.sort_order,
  updated_at        = now();
