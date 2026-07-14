UPDATE public.mini_apps
SET content_md = replace(
  content_md,
  E'let mapeamentoLinhas = [\n                // CONTINUAÇÃO DA ETAPA 5: MAPEAMENTO E ORDENAÇÃO DE PRIORIDADES\n                let mapeamentoLinhas = [',
  E'// CONTINUAÇÃO DA ETAPA 5: MAPEAMENTO E ORDENAÇÃO DE PRIORIDADES\n                let mapeamentoLinhas = ['
)
WHERE slug = 'SAE AUTOMÁTICA';