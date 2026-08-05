-- Atualiza a lista de planos para incluir todas as variações necessárias
INSERT INTO public.subscription_plans (slug, name, description, price_cents, mp_link, is_active)
VALUES 
    ('enfermeiro-trimestral', 'Academia do Enfermeiro (Trimestral)', 'Acesso por 3 meses com desconto.', 0, 'https://mpago.la/1R3APrf', true),
    ('enfermeiro-semestral', 'Academia do Enfermeiro (Semestral)', 'Acesso por 6 meses com desconto.', 0, 'https://mpago.la/2W1kAvj', true),
    ('enfermeiro-anual', 'Academia do Enfermeiro (Anual)', 'Acesso por 12 meses com maior economia.', 0, 'https://mpago.la/1fahZSm', true),
    ('tecnico-trimestral', 'Academia do Técnico Estudante (Trimestral)', 'Acesso por 3 meses com desconto.', 0, 'https://mpago.la/1WYrvma', true),
    ('tecnico-semestral', 'Academia do Técnico Estudante (Semestral)', 'Acesso por 6 meses com desconto.', 0, 'https://mpago.la/2geV98x', true)
ON CONFLICT (slug) DO UPDATE 
SET mp_link = EXCLUDED.mp_link,
    name = EXCLUDED.name,
    is_active = true;