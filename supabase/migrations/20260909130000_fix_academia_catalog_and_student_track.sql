-- Garante que cada Mini App possa declarar explicitamente a Academia do Estudante de Técnico.
ALTER TABLE public.mini_apps
  ADD COLUMN IF NOT EXISTS track_tecnico_estudante boolean NOT NULL DEFAULT false;

-- Reconstrói essa marca a partir dos placements já existentes, sem alterar conteúdo.
UPDATE public.mini_apps m
SET track_tecnico_estudante = true
WHERE EXISTS (
  SELECT 1
  FROM public.mini_app_placements p
  JOIN public.apps a ON a.id = p.app_id
  WHERE p.mini_app_id = m.id
    AND a.slug = 'tecnico-estudante'
);

-- Mantém as Academias existentes coerentes com seus placements atuais.
UPDATE public.mini_apps m
SET track_academico = true
WHERE EXISTS (
  SELECT 1 FROM public.mini_app_placements p
  JOIN public.apps a ON a.id = p.app_id
  WHERE p.mini_app_id = m.id AND a.slug = 'academico'
);

UPDATE public.mini_apps m
SET track_tecnico = true
WHERE EXISTS (
  SELECT 1 FROM public.mini_app_placements p
  JOIN public.apps a ON a.id = p.app_id
  WHERE p.mini_app_id = m.id AND a.slug = 'tecnico'
);

UPDATE public.mini_apps m
SET track_enfermeiro = true
WHERE EXISTS (
  SELECT 1 FROM public.mini_app_placements p
  JOIN public.apps a ON a.id = p.app_id
  WHERE p.mini_app_id = m.id AND a.slug = 'enfermeiro'
);
