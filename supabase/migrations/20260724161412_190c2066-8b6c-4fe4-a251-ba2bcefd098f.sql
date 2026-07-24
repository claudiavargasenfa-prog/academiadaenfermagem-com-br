
INSERT INTO public.app_texts (key, value) VALUES
('aplicativo.academico.slogan', 'Do primeiro ao último estágio, sem sofrer.'),
('aplicativo.enfermeiro.slogan', 'Menos burocracia, mais assistência com tranquilidade.'),
('plano.academico.slogan', 'Do primeiro ao último estágio, sem sofrer.'),
('plano.enfermeiro.slogan', 'Menos burocracia, mais assistência com tranquilidade.')
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;
