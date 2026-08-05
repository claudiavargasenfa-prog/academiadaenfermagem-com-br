-- Renomeia a coluna para refletir a mudança de Cakto para Mercado Pago
ALTER TABLE public.subscription_plans RENAME COLUMN cakto_link_novo TO mp_link;

-- Garante que os links estão corretos na nova coluna
UPDATE public.subscription_plans
SET mp_link = CASE 
    WHEN slug = 'academico' THEN 'https://mpago.la/1qZL2z2'
    WHEN slug = 'tecnico' THEN 'https://mpago.la/2RyCPis'
    WHEN slug = 'enfermeiro' THEN 'https://mpago.la/1Z12LJ4'
    WHEN slug = 'tecnico-estudante' THEN 'https://mpago.la/1WYrvma'
END
WHERE slug IN ('academico', 'tecnico', 'enfermeiro', 'tecnico-estudante');