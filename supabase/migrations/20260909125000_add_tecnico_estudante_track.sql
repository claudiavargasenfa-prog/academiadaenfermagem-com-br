-- Alinha o schema de producao com o catalogo das Academias.
-- O codigo usa esta trilha para identificar os Mini Apps do Estudante de Tecnico.
-- A marcacao e derivada dos placements existentes, sem alterar regras de acesso.

ALTER TABLE public.mini_apps
  ADD COLUMN IF NOT EXISTS track_tecnico_estudante boolean NOT NULL DEFAULT false;

-- Marca os Mini Apps atualmente vinculados a Academia do Estudante de Tecnico.
UPDATE public.mini_apps m
SET track_tecnico_estudante = true
WHERE EXISTS (
  SELECT 1
  FROM public.mini_app_placements p
  JOIN public.apps a ON a.id = p.app_id
  WHERE p.mini_app_id = m.id
    AND a.slug = 'tecnico-estudante'
);

-- Normaliza as demais trilhas com base nos placements existentes.
UPDATE public.mini_apps m
SET track_academico = EXISTS (
      SELECT 1 FROM public.mini_app_placements p
      JOIN public.apps a ON a.id = p.app_id
      WHERE p.mini_app_id = m.id AND a.slug = 'academico'
    ),
    track_tecnico = EXISTS (
      SELECT 1 FROM public.mini_app_placements p
      JOIN public.apps a ON a.id = p.app_id
      WHERE p.mini_app_id = m.id AND a.slug = 'tecnico'
    ),
    track_enfermeiro = EXISTS (
      SELECT 1 FROM public.mini_app_placements p
      JOIN public.apps a ON a.id = p.app_id
      WHERE p.mini_app_id = m.id AND a.slug = 'enfermeiro'
    );
