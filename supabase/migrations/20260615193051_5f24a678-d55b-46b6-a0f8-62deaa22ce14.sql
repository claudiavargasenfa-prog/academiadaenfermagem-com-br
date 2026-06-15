-- Seed mini_apps catalog so the Loja paywall has products to gate access to.
-- The home page shortcuts are matched to these slugs to decide locked/unlocked.

INSERT INTO public.mini_apps (slug, name, description, kind, price_cents, icon, is_active, sort_order)
VALUES
  ('basico',              'App Básico (Acadêmico de Bolso)', 'Acesso mensal aos módulos essenciais: Postura e Ética, Diário de Bordo e Sinais Vitais.', 'basico', 1990, '★', true, 0),
  ('iras',                'Time Contra as IRAS',              '5 Momentos da OMS para higiene de mãos e prevenção de infecções.', 'extra', 1990, '🧼', true, 10),
  ('seguranca',           'Segurança do Paciente',            '6 Metas Internacionais de Segurança do Paciente.', 'extra', 1990, '🛡️', true, 20),
  ('exame-fisico-escalas','Exame Físico e Escalas',           'Cefalocaudal + Glasgow, Braden, Morse e demais escalas de avaliação.', 'extra', 2990, '🩺', true, 30),
  ('calculadora',         'Cálculos de Medicamentos',         'Regra de três, gotejamento e dose por peso.', 'extra', 2490, '🧮', true, 40),
  ('sv-pediatrico',       'Sinais Vitais Pediátricos',        'Parâmetros por faixa etária, PALS e avaliação da dor.', 'extra', 1990, '👶', true, 50),
  ('sv-gestante',         'Sinais Vitais da Gestante',        'Pré-eclâmpsia, hemorragia e parâmetros obstétricos.', 'extra', 1990, '🤰', true, 60),
  ('relatorio-abnt',      'Relatório de Estágio (ABNT)',      'Gera o relatório automático em ABNT a partir do Diário de Bordo. Uso único com direito a 2 correções.', 'extra', 6000, '📄', true, 70)
ON CONFLICT (slug) DO NOTHING;