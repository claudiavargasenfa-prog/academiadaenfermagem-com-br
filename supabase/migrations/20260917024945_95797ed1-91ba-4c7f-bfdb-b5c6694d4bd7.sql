DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM public.mini_apps
    WHERE lower(slug) = 'manual-sobrevivencia'
      AND content_md LIKE '%id="manual-atualizacoes-2026"%'
      AND content_md LIKE '%class="manual-survival-content"%'
  ) THEN
    RAISE EXCEPTION 'Atualização do Manual não encontrada';
  END IF;
END $$;