UPDATE public.mini_apps
SET content_md = replace(
  replace(
    content_md,
    '<!-- LISTA EXPANDIDA DE ANTECEDENTES PESSOAIS (21 ITENS) -->',
    '<div style="margin-bottom: 14px;">
            <label style="font-size: 12.5px; font-weight: 600; color: #14532d; display: block; margin-bottom: 4px;">Histórico Médico e Familiar:</label>
            <textarea id="historicoMedicoFamiliar" rows="2" placeholder="Doenças prévias, cirurgias, internações, doenças familiares relevantes..." style="width: 100%; padding: 8px 12px; border: 1px solid #d1d5db; border-radius: 6px; font-size: 13.5px; box-sizing: border-box; font-family: inherit; resize: vertical; background: #fafafa;"></textarea>
        </div>
        <div style="margin-bottom: 14px;">
            <label style="font-size: 12.5px; font-weight: 600; color: #14532d; display: block; margin-bottom: 4px;">Perfil Psicossocial:</label>
            <textarea id="perfilPsicossocial" rows="2" placeholder="Suporte familiar, moradia, trabalho, hábitos, religiosidade, autonomia..." style="width: 100%; padding: 8px 12px; border: 1px solid #d1d5db; border-radius: 6px; font-size: 13.5px; box-sizing: border-box; font-family: inherit; resize: vertical; background: #fafafa;"></textarea>
        </div>
        <div style="margin-bottom: 14px;">
            <label style="font-size: 12.5px; font-weight: 600; color: #14532d; display: block; margin-bottom: 4px;">Percepção de Dor e Sentimentos:</label>
            <textarea id="percepcaoDorSentimentos" rows="2" placeholder="Localização e caráter da dor, ansiedade, medo, tristeza, expectativas..." style="width: 100%; padding: 8px 12px; border: 1px solid #d1d5db; border-radius: 6px; font-size: 13.5px; box-sizing: border-box; font-family: inherit; resize: vertical; background: #fafafa;"></textarea>
        </div>

        <!-- LISTA EXPANDIDA DE ANTECEDENTES PESSOAIS (21 ITENS) -->'
  ),
  '<!-- ======= SEÇÃO 2: DIAGNÓSTICOS SUGERIDOS POR PRIORIDADE (PARTE 5 REVISADA) ======= -->',
  '<div style="background: #ffffff; border-radius: 12px; margin-bottom: 24px; box-shadow: 0 4px 16px rgba(0,0,0,0.04); overflow: hidden; border: 1px solid #e5e7eb;">
  <div style="background: linear-gradient(135deg, #14532d 0%, #166534 100%); color: #ffffff; padding: 14px 20px; font-size: 16px; font-weight: 700;">
    <span>🔎 Dados Complementares que Validam as Suspeitas Clínicas</span>
  </div>
  <div style="padding: 20px;">
    <p style="margin: 0 0 14px 0; font-size: 12.5px; color: #4b5563;">Informações adicionais que validam, complementam ou quantificam as suspeitas clínicas levantadas durante a anamnese e o exame físico. Tudo que for escrito aqui também alimenta a pesquisa de diagnósticos.</p>
    <div style="margin-bottom: 14px;">
      <label style="font-size: 12.5px; font-weight: 600; color: #14532d; display: block; margin-bottom: 4px;">Avaliação Antropométrica:</label>
      <textarea id="avaliacaoAntropometrica" rows="2" placeholder="Peso, altura, IMC, circunferência abdominal, panturrilha, perda ponderal..." style="width: 100%; padding: 8px 12px; border: 1px solid #d1d5db; border-radius: 6px; font-size: 13.5px; box-sizing: border-box; font-family: inherit; resize: vertical; background: #fafafa;"></textarea>
    </div>
    <div style="margin-bottom: 14px;">
      <label style="font-size: 12.5px; font-weight: 600; color: #14532d; display: block; margin-bottom: 4px;">Condições Físicas Visíveis:</label>
      <textarea id="condicoesFisicasVisiveis" rows="2" placeholder="Higiene, mobilidade, feridas, dispositivos, palidez, edema, fácies..." style="width: 100%; padding: 8px 12px; border: 1px solid #d1d5db; border-radius: 6px; font-size: 13.5px; box-sizing: border-box; font-family: inherit; resize: vertical; background: #fafafa;"></textarea>
    </div>
    <div style="margin-bottom: 14px;">
      <label style="font-size: 12.5px; font-weight: 600; color: #14532d; display: block; margin-bottom: 4px;">Exames Laboratoriais:</label>
      <textarea id="examesLaboratoriais" rows="2" placeholder="Hemograma, eletrólitos, função renal, glicemia, PCR, gasometria..." style="width: 100%; padding: 8px 12px; border: 1px solid #d1d5db; border-radius: 6px; font-size: 13.5px; box-sizing: border-box; font-family: inherit; resize: vertical; background: #fafafa;"></textarea>
    </div>
    <div style="margin-bottom: 14px;">
      <label style="font-size: 12.5px; font-weight: 600; color: #14532d; display: block; margin-bottom: 4px;">Exames de Imagem (laudos):</label>
      <textarea id="examesImagem" rows="2" placeholder="Raio-X, tomografia, ultrassonografia, ecocardiograma — resumo dos laudos..." style="width: 100%; padding: 8px 12px; border: 1px solid #d1d5db; border-radius: 6px; font-size: 13.5px; box-sizing: border-box; font-family: inherit; resize: vertical; background: #fafafa;"></textarea>
    </div>
    <div style="margin-bottom: 4px;">
      <label style="font-size: 12.5px; font-weight: 600; color: #14532d; display: block; margin-bottom: 4px;">Histórico de Prontuário:</label>
      <textarea id="historicoProntuario" rows="2" placeholder="Evoluções anteriores, intercorrências do plantão, condutas médicas em curso..." style="width: 100%; padding: 8px 12px; border: 1px solid #d1d5db; border-radius: 6px; font-size: 13.5px; box-sizing: border-box; font-family: inherit; resize: vertical; background: #fafafa;"></textarea>
    </div>
  </div>
</div>

<!-- ======= SEÇÃO 2: DIAGNÓSTICOS SUGERIDOS POR PRIORIDADE (PARTE 5 REVISADA) ======= -->'
)
WHERE id = 'c020e2e7-90db-449f-a508-2c173f4cada2';