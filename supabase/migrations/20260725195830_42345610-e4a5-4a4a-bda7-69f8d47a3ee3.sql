-- 1. Desativa duplicatas reais
UPDATE public.mini_apps SET is_active = false
WHERE slug IN ('sv_adulto', 'semana-enfermagem');

-- 2. Normaliza route_path invalido (sem barra inicial) -> fallback /app/<slug>
UPDATE public.mini_apps
SET route_path = NULL
WHERE route_path IS NOT NULL
  AND btrim(route_path) <> ''
  AND left(btrim(route_path), 1) <> '/';

-- 3. Reconstroi placements dos 4 apps de forma deterministica
DELETE FROM public.mini_app_placements p
USING public.apps a
WHERE a.id = p.app_id
  AND a.slug IN ('academico','enfermeiro','tecnico','tecnico-estudante');

WITH catalog(mini_slug, section_title, ordem, apps) AS (
  VALUES
    ('manual-sobrevivencia','Manual de Sobrevivência do Estágio',0, ARRAY['academico','enfermeiro','tecnico','tecnico-estudante']),
    ('etica-tecnico','Postura e Ética Profissional',0, ARRAY['academico','enfermeiro','tecnico','tecnico-estudante']),
    ('seguranca','Segurança do Paciente',0, ARRAY['academico','enfermeiro','tecnico','tecnico-estudante']),
    ('medadm','Segurança do Paciente',1, ARRAY['academico','enfermeiro','tecnico','tecnico-estudante']),
    ('has-dm','Promoção da Saúde',0, ARRAY['academico','enfermeiro','tecnico']),
    ('IRAS','IRAS — Infecção Relacionada à Assistência',0, ARRAY['academico','enfermeiro','tecnico','tecnico-estudante']),
    ('farmacologia-avancada','Farmacologia e Calculadoras',0, ARRAY['academico','enfermeiro']),
    ('Sepse','Clínica Médica',0, ARRAY['academico','enfermeiro','tecnico']),
    ('escalas-clinicas','Saúde do Adulto',0, ARRAY['academico','enfermeiro','tecnico','tecnico-estudante']),
    ('sinais-vitais','Saúde do Adulto',1, ARRAY['academico','enfermeiro','tecnico','tecnico-estudante']),
    ('sv-idoso','Saúde do Idoso',0, ARRAY['academico','enfermeiro','tecnico']),
    ('saude-mental','Saúde Mental',0, ARRAY['academico','enfermeiro','tecnico']),
    ('obstetricia','Obstetrícia',0, ARRAY['academico','enfermeiro','tecnico']),
    ('sv-gestante','Obstetrícia',1, ARRAY['academico','enfermeiro','tecnico']),
    ('sv-neo_ped','Neonatologia e Pediatria',0, ARRAY['academico','enfermeiro','tecnico']),
    ('diagnosticos-aede','SAE & Processo de Enfermagem',0, ARRAY['academico','enfermeiro']),
    ('DE-FUNDAMENTOS','SAE & Processo de Enfermagem',1, ARRAY['academico','enfermeiro']),
    ('SAE AUTOMÁTICA','SAE & Processo de Enfermagem',2, ARRAY['academico','enfermeiro']),
    ('ORIENTAÇÕES PARA ANAMNESEexame-fisico-ORIENTAÇÕES','SAE & Processo de Enfermagem',3, ARRAY['academico','enfermeiro']),
    ('ColetaDados-AdmissãoTurno','SAE & Processo de Enfermagem',4, ARRAY['enfermeiro','tecnico']),
    ('quizzes','Quizzes e Simulações',0, ARRAY['academico','enfermeiro','tecnico','tecnico-estudante']),
    ('CCR E QUIZZ','Quizzes e Simulações',1, ARRAY['academico','enfermeiro','tecnico']),
    ('treinamento_simulação','Quizzes e Simulações',2, ARRAY['academico','enfermeiro','tecnico'])
)
INSERT INTO public.mini_app_placements (app_id, mini_app_id, section_id, ordem)
SELECT a.id, m.id, s.id, c.ordem
FROM catalog c
CROSS JOIN LATERAL unnest(c.apps) AS app_slug
JOIN public.apps a ON a.slug = app_slug
JOIN public.mini_apps m ON m.slug = c.mini_slug AND m.is_active = true
JOIN public.app_sections s ON s.app_id = a.id AND s.title = c.section_title;

-- 4. Desativa secao vazia em todos os apps
UPDATE public.app_sections SET is_active = false
WHERE title = 'Curativos e Lesões de Pele';