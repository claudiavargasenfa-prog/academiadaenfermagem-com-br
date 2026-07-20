INSERT INTO public.app_texts (key, value, description) VALUES
  ('plano.academico.hero_eyebrow', 'Para estudantes de Enfermagem', 'Etiqueta pequena acima do título no banner'),
  ('plano.academico.hero_title', 'Academia do Acadêmico', 'Título grande do banner'),
  ('plano.academico.slogan', 'Do primeiro estágio ao TCC — sem sofrer.', 'Frase de apoio abaixo do título'),
  ('plano.academico.hero_footnote', 'Sem cartão de crédito · Ativa na hora · PIX ou cartão só depois do teste', 'Linha pequena abaixo dos botões'),
  ('plano.tecnico.hero_eyebrow', 'Para Técnicos em Enfermagem', 'Etiqueta pequena acima do título no banner'),
  ('plano.tecnico.hero_title', 'Academia do Técnico', 'Título grande do banner'),
  ('plano.tecnico.slogan', 'Prática segura, plantão tranquilo.', 'Frase de apoio abaixo do título'),
  ('plano.tecnico.hero_footnote', 'Sem cartão de crédito · Ativa na hora · PIX ou cartão só depois do teste', 'Linha pequena abaixo dos botões'),
  ('plano.tecnico-estudante.hero_eyebrow', 'Para Estudantes de Técnico', 'Etiqueta pequena acima do título no banner'),
  ('plano.tecnico-estudante.hero_title', 'Academia do Estudante de Técnico', 'Título grande do banner'),
  ('plano.tecnico-estudante.slogan', 'Passa na prova, encara o campo com confiança.', 'Frase de apoio abaixo do título'),
  ('plano.tecnico-estudante.hero_footnote', 'Sem cartão de crédito · Ativa na hora · PIX ou cartão só depois do teste', 'Linha pequena abaixo dos botões'),
  ('plano.enfermeiro.hero_eyebrow', 'Para Enfermeiros(as)', 'Etiqueta pequena acima do título no banner'),
  ('plano.enfermeiro.hero_title', 'Academia do Enfermeiro', 'Título grande do banner'),
  ('plano.enfermeiro.slogan', 'Menos burocracia, mais paciente.', 'Frase de apoio abaixo do título'),
  ('plano.enfermeiro.hero_footnote', 'Sem cartão de crédito · Ativa na hora · PIX ou cartão só depois do teste', 'Linha pequena abaixo dos botões')
ON CONFLICT (key) DO NOTHING;