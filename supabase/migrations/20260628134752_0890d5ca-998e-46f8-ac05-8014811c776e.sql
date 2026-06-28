INSERT INTO public.app_texts (key, value, description) VALUES
('header.title', 'Academia da Enfermagem', 'Título grande no topo do app'),
('header.subtitle', 'Informação Atualizada em suas Mãos', 'Subtítulo do topo'),
('header.title.size', '16', 'Tamanho do título do topo em pixels (ex: 16)'),
('header.subtitle.size', '11', 'Tamanho do subtítulo do topo em pixels (ex: 11)')
ON CONFLICT (key) DO NOTHING;