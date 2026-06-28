-- 1) Novo app: Academia do Estudante de Técnico
INSERT INTO public.apps (slug, name, short_name, emoji, bg_color, fg_color, ordem, is_active, description)
VALUES (
  'tecnico-estudante',
  'Academia do Estudante de Técnico em Enfermagem',
  'Estudante de Técnico',
  '🎓',
  '#FEF3C7',
  '#78350F',
  3,
  true,
  'Conteúdo focado para estudantes do curso técnico em enfermagem.'
)
ON CONFLICT (slug) DO NOTHING;

-- 2) Seções padrão replicadas nos 4 apps
WITH base(title, emoji, ordem) AS (
  VALUES
    ('Manual de Sobrevivência do Estágio',        '🧭',  0),
    ('Postura e Ética Profissional',              '🤝',  1),
    ('Segurança do Paciente',                     '🛡️', 2),
    ('Promoção da Saúde',                         '🌿',  3),
    ('IRAS — Infecção Relacionada à Assistência', '🧫',  4),
    ('Farmacologia e Calculadoras',               '💊',  5),
    ('Clínica Médica',                            '🏥',  6),
    ('Saúde do Idoso',                            '👴',  7),
    ('Saúde do Adulto',                           '🧑',  8),
    ('Saúde Mental',                              '🧠',  9),
    ('Obstétrica',                                '🤰', 10),
    ('Neonatologia e Pediatria',                  '👶', 11),
    ('SAE & Processo de Enfermagem',              '📋', 12),
    ('Curativos e Lesões de Pele',                '🩹', 13),
    ('Quizzes e Simulações',                      '🧪', 14)
),
target_apps AS (
  SELECT id, slug FROM public.apps
  WHERE slug IN ('academico', 'tecnico', 'tecnico-estudante', 'enfermeiro')
)
INSERT INTO public.app_sections (app_id, title, emoji, ordem)
SELECT ta.id, b.title, b.emoji, b.ordem
FROM target_apps ta
CROSS JOIN base b
WHERE NOT EXISTS (
  SELECT 1 FROM public.app_sections s
  WHERE s.app_id = ta.id AND s.title = b.title
);