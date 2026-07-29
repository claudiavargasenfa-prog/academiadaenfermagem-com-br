UPDATE public.mini_apps
SET content_md = replace(
  content_md,
  '<th style="border: 1px solid #bbf7d0; padding: 8px; text-align: left;">#</th>
            <th style="border: 1px solid #bbf7d0; padding: 8px; text-align: left;">Diagn&oacute;stico</th>
            <th style="border: 1px solid #bbf7d0; padding: 8px; text-align: left;">Prescri&ccedil;&atilde;o de Enfermagem</th>
            <th style="border: 1px solid #bbf7d0; padding: 8px; text-align: left;">Resultado Esperado</th>
            <th style="border: 1px solid #bbf7d0; padding: 8px; text-align: left;">Checagem</th>',
  '<th style="border: 1px solid #bbf7d0; padding: 8px; text-align: center; width: 5%;">N&ordm;</th>
            <th style="border: 1px solid #bbf7d0; padding: 8px; text-align: left; width: 47%;">Diagn&oacute;stico de Enfermagem</th>
            <th style="border: 1px solid #bbf7d0; padding: 8px; text-align: left; width: 22%;">Hor&aacute;rio</th>
            <th style="border: 1px solid #bbf7d0; padding: 8px; text-align: left; width: 26%;">Aprazamento</th>'
)
WHERE id = 'c020e2e7-90db-449f-a508-2c173f4cada2';