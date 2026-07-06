
-- Renomeia o registro existente para o slug do novo mini app e vincula ao Acadêmico
UPDATE public.mini_apps
   SET slug = 'escalas-clinicas',
       name = 'Escalas Clínicas na Prática',
       description = '8 escalas essenciais para avaliação clínica do paciente.',
       icon = '📊',
       route_path = '/escalas-clinicas',
       is_active = true,
       gratuito = false,
       track_academico = true
 WHERE slug = 'ESCALAS CLINICAS';

-- Caso a linha não existisse, cria
INSERT INTO public.mini_apps (slug, name, description, icon, kind, route_path, track_academico, is_active)
SELECT 'escalas-clinicas', 'Escalas Clínicas na Prática',
       '8 escalas essenciais para avaliação clínica do paciente.',
       '📊', 'extra', '/escalas-clinicas', true, true
WHERE NOT EXISTS (SELECT 1 FROM public.mini_apps WHERE slug = 'escalas-clinicas');

-- Placement no app Acadêmico
INSERT INTO public.mini_app_placements (mini_app_id, app_id, ordem)
SELECT m.id, a.id, 100
  FROM public.mini_apps m
  JOIN public.apps a ON a.slug = 'academico'
 WHERE m.slug = 'escalas-clinicas'
ON CONFLICT (mini_app_id, app_id) DO NOTHING;
