UPDATE public.mini_apps
SET content_md = replace(
  replace(
    content_md,
    '<div style="font-family: ''Segoe UI'', Arial, sans-serif; max-width: 850px; margin: 0 auto;">',
    '<div class="manual-survival-content" style="font-family: ''Segoe UI'', Arial, sans-serif; max-width: 850px; margin: 0 auto;">'
  ),
  '<!-- SEÇÃO 1: PREPARAÇÃO -->',
  '<!-- ATUALIZAÇÕES 2026 -->
<section class="manual-2026-update" aria-labelledby="manual-atualizacoes-2026">
  <p class="manual-2026-kicker">ATUALIZADO • 2026</p>
  <h2 id="manual-atualizacoes-2026">📘 Principais atualizações da Enfermagem em 2026</h2>
  <p>As principais atualizações da Enfermagem em 2026 envolvem novas diretrizes do MEC para a graduação, resoluções do Cofen sobre prescrição e procedimentos, além de atualizações no piso salarial. [1, 2, 3, 4]</p>

  <div class="manual-2026-topic">
    <h3>Educação e Formação (MEC)</h3>
    <p><strong>Novas regras para a graduação:</strong> O Ministério da Educação oficializou novas Diretrizes Curriculares Nacionais (Resolução CNE/CES nº 1/2026) que exigem um mínimo de 4 mil horas presenciais e 5 anos de duração para os cursos de Enfermagem. [1, 2]</p>
  </div>

  <div class="manual-2026-topic">
    <h3>Estágios obrigatórios</h3>
    <p>Devem ocupar 30% da carga horária total, divididos entre a atenção básica e hospitais. As instituições têm até junho de 2028 para se adaptar. [1]</p>
  </div>
</section>

<!-- SEÇÃO 1: PREPARAÇÃO -->'
),
updated_at = now()
WHERE lower(slug) = 'manual-sobrevivencia'
  AND content_md NOT LIKE '%id="manual-atualizacoes-2026"%';