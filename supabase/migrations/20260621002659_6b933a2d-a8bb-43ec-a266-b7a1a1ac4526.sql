
-- 1) Remove app duplicado IRAS (slug em CAPS)
DELETE FROM public.mini_apps WHERE slug = 'IRAS';

-- 2) Atualizar flags de trilha dos apps EXISTENTES (mapeamento do DOCX)
-- Acadêmico
UPDATE public.mini_apps SET track_academico = true  WHERE slug IN (
  'manual-sobrevivencia','sinais-vitais','sv-pediatrico','sv-gestante','postura-etica',
  'saude-mental','iras','exame-fisico-escalas','medicamentosecalculos','curativos',
  'sbv','seguranca','anatomia','fisiologia','microbiologia','simulacoes-reais',
  'relatorio-abnt','quizzes'
);
-- Enfermeiro
UPDATE public.mini_apps SET track_enfermeiro = true WHERE slug IN (
  'saude-mental','sinais-vitais','sv-pediatrico','sv-gestante','medicamentosecalculos',
  'uti','farmacologia-avancada','obstetricia','pediatria','simulacoes-reais',
  'procedimentos-enfermagem','quizzes','gestao-enfermagem','curativos','acls'
);
-- Técnico
UPDATE public.mini_apps SET track_tecnico = true    WHERE slug IN (
  'manual-sobrevivencia','postura-etica','sinais-vitais','sv-pediatrico','sv-gestante',
  'saude-mental','medicamentosecalculos','iras','simulacoes-reais','quizzes',
  'procedimentos-enfermagem','curativos','sbv','seguranca','exame-fisico-escalas'
);

-- 3) Inserir mini apps NOVOS (placeholders, em breve = false para aparecer)
-- helper: insere com idempotência
INSERT INTO public.mini_apps (slug, name, description, kind, price_cents, gratuito, em_breve, track_academico, track_tecnico, track_enfermeiro, content_md, sort_order)
VALUES
  -- Acadêmico
  ('prescricao-nanda',          'Prescrição NANDA-I / NOC / NIC',                'Diagnósticos, resultados e intervenções de enfermagem.',                                'curso', 0, false, false, true,  false, true,  '*(conteúdo em preparação)*', 100),
  ('clinica-medica',            'Enfermagem em Clínica Médica',                  'Cuidado clínico geral em enfermaria.',                                                   'curso', 0, false, false, true,  false, true,  '*(conteúdo em preparação)*', 101),
  -- Enfermeiro
  ('sae-completo',              'SAE Completo + Processos',                      'Sistematização da Assistência de Enfermagem em todas as etapas.',                       'curso', 0, false, false, false, true,  true,  '*(conteúdo em preparação)*', 102),
  ('clinica-cirurgica',         'Enfermagem em Clínica Cirúrgica',               'Pré, trans e pós-operatório.',                                                          'curso', 0, false, false, false, false, true,  '*(conteúdo em preparação)*', 103),
  ('centro-cirurgico',          'Enfermagem em Centro Cirúrgico',                'Atuação no bloco operatório.',                                                          'curso', 0, false, false, false, false, true,  '*(conteúdo em preparação)*', 104),
  ('cme',                       'Enfermagem em CME',                             'Central de Material e Esterilização.',                                                  'curso', 0, false, false, false, false, true,  '*(conteúdo em preparação)*', 105),
  ('saude-homem',               'Enfermagem em Saúde do Homem',                  'Cuidado integral à saúde masculina.',                                                   'curso', 0, false, false, false, false, true,  '*(conteúdo em preparação)*', 106),
  ('saude-idoso',               'Enfermagem em Saúde do Idoso',                  'Geriatria e Gerontologia.',                                                             'curso', 0, false, false, false, false, true,  '*(conteúdo em preparação)*', 107),
  ('nefrologia',                'Enfermagem em Nefrologia',                      'Cuidados renais, diálise e transplante.',                                               'curso', 0, false, false, false, false, true,  '*(conteúdo em preparação)*', 108),
  ('urologia',                  'Enfermagem em Urologia',                        'Cuidados em afecções urológicas.',                                                      'curso', 0, false, false, false, false, true,  '*(conteúdo em preparação)*', 109),
  ('neurologia',                'Enfermagem em Neurologia',                      'Cuidados neurológicos.',                                                                'curso', 0, false, false, false, false, true,  '*(conteúdo em preparação)*', 110),
  ('hepatologia',               'Enfermagem em Hepatologia',                     'Cuidados hepáticos.',                                                                   'curso', 0, false, false, false, false, true,  '*(conteúdo em preparação)*', 111),
  ('hematologia',               'Enfermagem em Hematologia',                     'Cuidados hematológicos.',                                                               'curso', 0, false, false, false, false, true,  '*(conteúdo em preparação)*', 112),
  ('ginecologia',               'Enfermagem em Ginecologia',                     'Cuidados ginecológicos.',                                                               'curso', 0, false, false, false, false, true,  '*(conteúdo em preparação)*', 113),
  ('curativos-pro',             'Curativos (versão profissional)',               'Avaliação de feridas e coberturas avançadas.',                                          'curso', 0, false, false, false, false, true,  '*(conteúdo em preparação)*', 114),
  ('offshore',                  'Enfermagem Offshore',                           'Atuação em plataformas e ambientes offshore.',                                          'curso', 0, false, false, false, false, true,  '*(conteúdo em preparação)*', 115),
  ('de-bordo',                  'Enfermagem de Bordo',                           'Atuação em aeronaves e transporte.',                                                    'curso', 0, false, false, false, false, true,  '*(conteúdo em preparação)*', 116),
  -- Técnico
  ('saude-digital',             'Saúde Digital: PEP, Prontuário e Registro',     'Prontuário eletrônico e registro técnico.',                                             'curso', 0, false, false, false, true,  false, '*(conteúdo em preparação)*', 117),
  ('tele-enfermagem',           'Tele-enfermagem, LGPD e Segurança de Dados',    'Tele-atendimento e proteção de dados.',                                                 'curso', 0, false, false, false, true,  false, '*(conteúdo em preparação)*', 118),
  ('equipamentos-hospitalares', 'Equipamentos Hospitalares e Novas Tecnologias', 'Operação e segurança no uso de equipamentos.',                                          'curso', 0, false, false, false, true,  false, '*(conteúdo em preparação)*', 119),
  ('sus-programas',             'SUS: Programas e Indicadores de Saúde',         'Programas e indicadores do SUS.',                                                       'curso', 0, false, false, false, true,  false, '*(conteúdo em preparação)*', 120),
  ('vigilancia-epi',            'Vigilância Epidemiológica e Doenças Emergentes','Vigilância e surtos.',                                                                  'curso', 0, false, false, false, true,  false, '*(conteúdo em preparação)*', 121),
  ('vacinacao-imunizacao',      'Cadernetas de Vacinação e Imunização',          'Caderneta e calendário vacinal.',                                                       'curso', 0, false, false, false, true,  false, '*(conteúdo em preparação)*', 122),
  ('has-dm',                    'Hipertensão e Diabetes: Monitoramento na Prática','Cuidado e monitorização de HAS e DM.',                                                'curso', 0, false, false, false, true,  false, '*(conteúdo em preparação)*', 123),
  ('etica-tecnico',             'Código de Ética: Direitos, Deveres e Limites do Técnico','Ética profissional do técnico.',                                               'curso', 0, false, false, false, true,  false, '*(conteúdo em preparação)*', 124),
  ('semana-enfermagem',         'Semana da Enfermagem: Técnica, Ética e Política','Conteúdo histórico, técnico e político.',                                              'curso', 0, false, false, false, true,  false, '*(conteúdo em preparação)*', 125)
ON CONFLICT (slug) DO NOTHING;
