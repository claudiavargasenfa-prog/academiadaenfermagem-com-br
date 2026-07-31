UPDATE public.mini_apps
SET
  slug = 'procedimentos-enfermagem',
  name = 'PROCEDIMENTOS DE ENFERMAGEM — PUNÇÃO VENOSA E PREVENÇÃO DE FLEBITE',
  track_academico = true,
  updated_at = now()
WHERE id = '5a3b9f99-b153-4fb7-9789-5c5ee6598dbd';

UPDATE public.mini_app_placements AS placement
SET
  ordem = 215,
  updated_at = now()
FROM public.apps AS academy
WHERE placement.mini_app_id = '5a3b9f99-b153-4fb7-9789-5c5ee6598dbd'
  AND placement.app_id = academy.id
  AND academy.slug = 'academico';