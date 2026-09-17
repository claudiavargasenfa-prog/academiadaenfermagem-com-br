UPDATE public.mini_apps
SET updated_at = now()
WHERE lower(slug) = 'manual-sobrevivencia'
  AND content_md LIKE '%id="manual-atualizacoes-2026"%';