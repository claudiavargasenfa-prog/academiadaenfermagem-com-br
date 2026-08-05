UPDATE public.subscription_plans
SET cakto_link_novo = CASE 
    WHEN slug = 'academico' THEN 'https://mpago.la/1qZL2z2'
    WHEN slug = 'tecnico' THEN 'https://mpago.la/2RyCPis'
    WHEN slug = 'enfermeiro' THEN 'https://mpago.la/1Z12LJ4'
    WHEN slug = 'tecnico-estudante' THEN 'https://mpago.la/1WYrvma'
END
WHERE slug IN ('academico', 'tecnico', 'enfermeiro', 'tecnico-estudante');