-- Inserir ou atualizar os planos que estavam faltando

-- Academia do Acadêmico
INSERT INTO public.subscription_plans (slug, name, mp_link, price_cents, is_active, sort_order)
VALUES 
  ('academico-trimestral', 'Academia do Acadêmico (Trimestral)', 'https://mpago.la/2ESRZmE', 0, true, 10),
  ('academico-semestral', 'Academia do Acadêmico (Semestral)', 'https://mpago.la/27qm8hK', 0, true, 11),
  ('academico-anual', 'Academia do Acadêmico (Anual)', 'https://mpago.la/2k9nsxA', 0, true, 12)
ON CONFLICT (slug) DO UPDATE SET mp_link = EXCLUDED.mp_link;

-- Academia do Estudante Técnico (Anual)
INSERT INTO public.subscription_plans (slug, name, mp_link, price_cents, is_active, sort_order)
VALUES 
  ('tecnico-estudante-anual', 'Academia do Estudante Técnico (Anual)', 'https://mpago.la/1rF2XF1', 0, true, 20)
ON CONFLICT (slug) DO UPDATE SET mp_link = EXCLUDED.mp_link;

-- Academia do Técnico
INSERT INTO public.subscription_plans (slug, name, mp_link, price_cents, is_active, sort_order)
VALUES 
  ('tecnico-trimestral-v2', 'Academia do Técnico (Trimestral)', 'https://mpago.la/2SUCb6v', 0, true, 30),
  ('tecnico-semestral-v2', 'Academia do Técnico (Semestral)', 'https://mpago.la/1J7ZTN9', 0, true, 31),
  ('tecnico-anual-v2', 'Academia do Técnico (Anual)', 'https://mpago.la/1vvsCvM', 0, true, 32)
ON CONFLICT (slug) DO UPDATE SET mp_link = EXCLUDED.mp_link;
