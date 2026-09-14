# SAE E PE DESCOMPLICADOS E AUTOMATIZADOS

- **Slug:** `sae-descomplicada-automatizada`
- **Descrição:** A Sistematização da Assistência de Enfermagem (SAE) e o Processo de Enfermagem (PE) em uma rotina mais simples, organizada e prática. Com a ADEC, você conta com recursos que ajudam a estruturar o raciocínio clínico, organizar informações e agilizar a elaboração dos registros e cuidados de enfermagem — sem complicação e com mais segurança no dia a dia.  se você quiser, é so ditar que ele escreve, esse formato ajuda o profissional paramentado.
- **Tipo:** extra
- **Preço (cents):** 3999
- **Gratuito:** False
- **Em breve:** False
- **Ativo:** True
- **Acadêmico:** False | **Técnico:** False | **Enfermeiro:** False
- **Vídeo:** nenhum
- **Áudio:** nenhum
- **Badges:** [{"icon": "", "color": "red", "label": "CERTIFICADO OPCIONAL"}, {"icon": "🔄", "color": "blue", "label": "ATUALIZADO"}, {"icon": "", "color": "purple", "label": "2026"}]

---

<!-- APP MASTER: SAE DESCOMPLICADA - VERDE E DOURADO BEBÊ COMPACTO (PARTE 1) -->
<div class="lavoble-sae-descomplicada" style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 900px; margin: 0 auto; padding: 10px; box-sizing: border-box; background-color: #ffffff;">

    <!-- ======= CAPA EM TONS BEBÊ ======= -->
    <div style="background: linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%); border-radius: 14px; padding: 25px 20px; text-align: center; margin-bottom: 20px; box-shadow: 0 4px 15px rgba(22,101,52,0.05); border: 1px solid #fef08a;">
        <div style="font-size: 26px; margin-bottom: 8px; line-height: 1;">📋</div>
        <h1 style="color: #14532d; font-size: 22px; margin: 0 0 6px 0; font-weight: 800;">SAE automatizada</h1>
        <h2 style="color: #166534; font-size: 14px; margin: 0 0 12px 0; font-weight: 400;">Anamnese &rarr; Exame Físico &rarr; Diagnósticos Autônomos &rarr; Prescrição + Evolução</h2>
        <div style="width: 50px; height: 2px; background: #ca8a04; margin: 10px auto; opacity: 0.4; border-radius: 1px;"></div>
        <p style="color: #166534; font-size: 12.5px; margin: 0; font-style: italic;">Selecione os achados, ordene a prioridade e gere a documentação clínica automatizada</p>
    </div>

    
<!-- ======= COMO FUNCIONA (TUTORIAL) ======= -->
<div style="background: linear-gradient(135deg, #ecfeff 0%, #f0fdf4 100%); border-left: 4px solid #14532d; border-radius: 8px; padding: 14px 18px; margin-bottom: 20px; font-size: 13px; color: #14532d; line-height: 1.55;">
  <strong style="display:block; font-size:14px; margin-bottom:6px;">🧭 Como funciona (em 4 passos):</strong>
  1) Preencha a <strong>Anamnese</strong> (clique para abrir).<br>
  2) Marque os achados do <strong>Exame Físico por sistema, todos irão para a busca da hipótese diagnóstica</strong>. Use os campos de <em>observação</em> para escrever com suas palavras.<br>
  3) Confira/edite os <strong>Sinais e Sintomas</strong> e clique em <strong>Gerar Diagnósticos</strong> — a busca é feita <u>somente com base no que você escreveu, alguns tem o mesmo sintoma, e você poderá excluir o que não for adequado</u> nessa caixa.<br>
  4) Numere a prioridade, e marque a caixinha ao lado esquerdo. Agora é só clicar em <strong>Gerar Prescrição, ela será gerada baseada nas hipoteses diagnosticas, ja sairá com varios horários, você exclui o que não precis e clica no que vai usar, na coluna ao lado ja aparecerá o aprazamento, nesse espaço você poderá escrever, se precisar</strong>quando terminar, ao final, em <strong>Gerar Evolução, sairá um resumo da anamnese, exame físico, diagnósticos e prescrição, agora é so você conferir, corrigir e gerar a sua evolução de enfermagem, clicando no botão</strong>.
</div>
<!-- ======= SEÇÃO 0: ANAMNESE (RECOLHIDA) ======= -->
<details style="background:#ffffff; border-radius:12px; margin-bottom:24px; box-shadow:0 4px 16px rgba(0,0,0,0.04); overflow:hidden; border:1px solid #e5e7eb;">
  <summary style="background: linear-gradient(135deg,#14532d 0%,#166534 100%); color:#ffffff; padding:14px 20px; font-size:16px; font-weight:700; cursor:pointer; list-style:none; display:flex; justify-content:space-between; align-items:center;"><span>📋 0. Anamnese de Admissão — Completa</span><span style="font-size:12px; background:#fef08a; color:#854d0e; padding:4px 10px; border-radius:12px;">CLIQUE AQUI</span></summary>
  <div style="padding:20px;">

        
        <!-- Dados de Identificação Básica -->
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 12px; margin-bottom: 14px;">
            <div>
                <label style="font-size: 12.5px; font-weight: 600; color: #14532d; display: block; margin-bottom: 4px;">Nome do Paciente:</label>
                <input type="text" id="nomePaciente" oninput="atualizarEvolucaoAutomatica()" style="width: 100%; padding: 8px 12px; border: 1px solid #d1d5db; border-radius: 6px; font-size: 13.5px; box-sizing: border-box; background: #fafafa;">
            </div>
            <div>
                <label style="font-size: 12.5px; font-weight: 600; color: #14532d; display: block; margin-bottom: 4px;">Idade:</label>
                <input type="text" id="idadePaciente" oninput="atualizarEvolucaoAutomatica()" style="width: 100%; padding: 8px 12px; border: 1px solid #d1d5db; border-radius: 6px; font-size: 13.5px; box-sizing: border-box; background: #fafafa;">
            </div>
            <div>
                <label style="font-size: 12.5px; font-weight: 600; color: #14532d; display: block; margin-bottom: 4px;">Leito:</label>
                <input type="text" id="leitoPaciente" oninput="atualizarEvolucaoAutomatica()" style="width: 100%; padding: 8px 12px; border: 1px solid #d1d5db; border-radius: 6px; font-size: 13.5px; box-sizing: border-box; background: #fafafa;">
            </div>
        </div>

        <!-- Dados Clínicos Iniciais -->
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 12px; margin-bottom: 14px;">
            <div>
                <label style="font-size: 12.5px; font-weight: 600; color: #14532d; display: block; margin-bottom: 4px;">Diagnóstico Médico de Entrada:</label>
                <input type="text" id="diagMedico" oninput="atualizarEvolucaoAutomatica()" style="width: 100%; padding: 8px 12px; border: 1px solid #d1d5db; border-radius: 6px; font-size: 13.5px; box-sizing: border-box; background: #fafafa;">
            </div>
            <div>
                <label style="font-size: 12.5px; font-weight: 600; color: #14532d; display: block; margin-bottom: 4px;">Alergias Substanciais / Medicamentosas:</label>
                <input type="text" id="alergias" oninput="atualizarEvolucaoAutomatica()" style="width: 100%; padding: 8px 12px; border: 1px solid #d1d5db; border-radius: 6px; font-size: 13.5px; box-sizing: border-box; background: #fafafa; color: #b91c1c;">
            </div>
        </div>

        <!-- Queixas e Histórico Narrativo -->
        <div style="margin-bottom: 14px;">
            <label style="font-size: 12.5px; font-weight: 600; color: #14532d; display: block; margin-bottom: 4px;">Queixa Principal:</label>
            <textarea id="queixaPrincipal" oninput="atualizarEvolucaoAutomatica()" rows="2" placeholder="Relato resumido do motivo que trouxe o paciente ao hospital..." style="width: 100%; padding: 8px 12px; border: 1px solid #d1d5db; border-radius: 6px; font-size: 13.5px; box-sizing: border-box; font-family: inherit; resize: vertical; background: #fafafa;"></textarea>
        </div>
        <div style="margin-bottom: 14px;">
            <label style="font-size: 12.5px; font-weight: 600; color: #14532d; display: block; margin-bottom: 4px;">HDA (História da Doença Atual):</label>
            <textarea id="hda" oninput="atualizarEvolucaoAutomatica()" rows="2" placeholder="Detalhamento cronológico dos sinais e sintomas apresentados..." style="width: 100%; padding: 8px 12px; border: 1px solid #d1d5db; border-radius: 6px; font-size: 13.5px; box-sizing: border-box; font-family: inherit; resize: vertical; background: #fafafa;"></textarea>
        </div>

        <div style="margin-bottom: 14px;">
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

        <!-- LISTA EXPANDIDA DE ANTECEDENTES PESSOAIS (21 ITENS) -->
        <div style="margin-bottom: 14px;">
            <label style="font-size: 12.5px; font-weight: 600; color: #14532d; display: block; margin-bottom: 6px;">Antecedentes Pessoais e Fatores de Risco:</label>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(130px, 1fr)); gap: 8px; width: 100%;">
                <!-- Cardiovasculares -->
                <label style="display: flex; align-items: center; gap: 6px; font-size: 12px; padding: 6px 10px; background: #f3f4f6; border-radius: 6px; cursor: pointer; border: 1px solid #e5e7eb;"><input type="checkbox" class="antecedente-chk" value="HAS" onchange="atualizarEvolucaoAutomatica()" style="accent-color: #166534;"> HAS</label>
                <label style="display: flex; align-items: center; gap: 6px; font-size: 12px; padding: 6px 10px; background: #f3f4f6; border-radius: 6px; cursor: pointer; border: 1px solid #e5e7eb;"><input type="checkbox" class="antecedente-chk" value="DM" onchange="atualizarEvolucaoAutomatica()" style="accent-color: #166534;"> DM (Glicemia)</label>
                <label style="display: flex; align-items: center; gap: 6px; font-size: 12px; padding: 6px 10px; background: #f3f4f6; border-radius: 6px; cursor: pointer; border: 1px solid #e5e7eb;"><input type="checkbox" class="antecedente-chk" value="DAC" onchange="atualizarEvolucaoAutomatica()" style="accent-color: #166534;"> DAC (Infarto)</label>
                <label style="display: flex; align-items: center; gap: 6px; font-size: 12px; padding: 6px 10px; background: #f3f4f6; border-radius: 6px; cursor: pointer; border: 1px solid #e5e7eb;"><input type="checkbox" class="antecedente-chk" value="AVC" onchange="atualizarEvolucaoAutomatica()" style="accent-color: #166534;"> AVC Prévio</label>
                <label style="display: flex; align-items: center; gap: 6px; font-size: 12px; padding: 6px 10px; background: #f3f4f6; border-radius: 6px; cursor: pointer; border: 1px solid #e5e7eb;"><input type="checkbox" class="antecedente-chk" value="Arritmia" onchange="atualizarEvolucaoAutomatica()" style="accent-color: #166534;"> Arritmia Cardíaca</label>
                <label style="display: flex; align-items: center; gap: 6px; font-size: 12px; padding: 6px 10px; background: #f3f4f6; border-radius: 6px; cursor: pointer; border: 1px solid #e5e7eb;"><input type="checkbox" class="antecedente-chk" value="Insuficiência Cardíaca" onchange="atualizarEvolucaoAutomatica()" style="accent-color: #166534;"> IC Crônica</label>
                
                <!-- Respiratórios e Renais -->
                <label style="display: flex; align-items: center; gap: 6px; font-size: 12px; padding: 6px 10px; background: #f3f4f6; border-radius: 6px; cursor: pointer; border: 1px solid #e5e7eb;"><input type="checkbox" class="antecedente-chk" value="Asma" onchange="atualizarEvolucaoAutomatica()" style="accent-color: #166534;"> Asma Brônquica</label>
                <label style="display: flex; align-items: center; gap: 6px; font-size: 12px; padding: 6px 10px; background: #f3f4f6; border-radius: 6px; cursor: pointer; border: 1px solid #e5e7eb;"><input type="checkbox" class="antecedente-chk" value="DPOC" onchange="atualizarEvolucaoAutomatica()" style="accent-color: #166534;"> DPOC / Enfisema</label>
                <label style="display: flex; align-items: center; gap: 6px; font-size: 12px; padding: 6px 10px; background: #f3f4f6; border-radius: 6px; cursor: pointer; border: 1px solid #e5e7eb;"><input type="checkbox" class="antecedente-chk" value="IRC" onchange="atualizarEvolucaoAutomatica()" style="accent-color: #166534;"> IRC (Renal)</label>
                <label style="display: flex; align-items: center; gap: 6px; font-size: 12px; padding: 6px 10px; background: #f3f4f6; border-radius: 6px; cursor: pointer; border: 1px solid #e5e7eb;"><input type="checkbox" class="antecedente-chk" value="Litíase" onchange="atualizarEvolucaoAutomatica()" style="accent-color: #166534;"> Cálculo Renal</label>

                <!-- Gastro e Outros -->
                <label style="display: flex; align-items: center; gap: 6px; font-size: 12px; padding: 6px 10px; background: #f3f4f6; border-radius: 6px; cursor: pointer; border: 1px solid #e5e7eb;"><input type="checkbox" class="antecedente-chk" value="Gastrite" onchange="atualizarEvolucaoAutomatica()" style="accent-color: #166534;"> Gastrite / Úlcera</label>
                <label style="display: flex; align-items: center; gap: 6px; font-size: 12px; padding: 6px 10px; background: #f3f4f6; border-radius: 6px; cursor: pointer; border: 1px solid #e5e7eb;"><input type="checkbox" class="antecedente-chk" value="Hepatopatia" onchange="atualizarEvolucaoAutomatica()" style="accent-color: #166534;"> Hepatopatia</label>
                <label style="display: flex; align-items: center; gap: 6px; font-size: 12px; padding: 6px 10px; background: #f3f4f6; border-radius: 6px; cursor: pointer; border: 1px solid #e5e7eb;"><input type="checkbox" class="antecedente-chk" value="Neoplasia" onchange="atualizarEvolucaoAutomatica()" style="accent-color: #166534;"> Neoplasia / Câncer</label>
                <label style="display: flex; align-items: center; gap: 6px; font-size: 12px; padding: 6px 10px; background: #f3f4f6; border-radius: 6px; cursor: pointer; border: 1px solid #e5e7eb;"><input type="checkbox" class="antecedente-chk" value="Distúrbio Tireoide" onchange="atualizarEvolucaoAutomatica()" style="accent-color: #166534;"> Tireoidopatia</label>
 </label>
        </div>
      </div>

</details>

<!-- ======= SEÇÃO 1: EXAME FÍSICO POR SISTEMAS (PARTE A) ======= -->
<div style="background: #ffffff; border-radius: 12px; margin-bottom: 24px; box-shadow: 0 4px 16px rgba(0,0,0,0.04); overflow: hidden; border: 1px solid #e5e7eb;">
  <div style="background: linear-gradient(135deg, #ca8a04 0%, #eab308 100%); color: #ffffff; padding: 14px 20px; font-size: 16px; font-weight: 700;">1. Exame Físico por Sistemas (Foco no Cefalocaudal)</div>
  <div style="padding: 20px;">

    <!-- SISTEMA NEUROLÓGICO (TOM SUAVE) -->
    <details style="border-radius: 8px; overflow: hidden; margin-bottom: 12px; box-shadow: 0 2px 6px rgba(0,0,0,0.02); background: #ffffff; border: 1px solid #cbd5e1;">
      <summary style="background: linear-gradient(135deg, #f3e8ff 0%, #fae8ff 100%); padding: 12px 16px; cursor: pointer; font-weight: 700; font-size: 14px; color: #6b21a8; display: flex; align-items: center; justify-content: space-between; outline: none; user-select: none;">
        <span>🧠 Sistema Neurológico</span>
        <span style="font-size: 11px; background: #ffffff; padding: 2px 8px; border-radius: 12px; border: 1px solid #d8b4fe;">Clique para abrir</span>
      </summary>
      <div style="padding: 14px; background: #fafafa; border-top: 1px solid #cbd5e1;">
<!-- ACHADOS PADRONIZADOS: 🧠 Sistema Neurológico -->
<div style="margin:10px 0 14px;border:1px dashed #cbd5e1;border-radius:10px;padding:12px;background:#fafafa;">
  <div style="font-size:12.5px;font-weight:800;color:#14532d;margin-bottom:6px;">✅ Achados de Normalidade — 🧠 Sistema Neurológico</div>
  <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:6px;margin-bottom:12px;"><label style="display:flex;align-items:center;gap:6px;padding:6px 8px;background:#f0fdf4;border:1px solid #bbf7d0;border-radius:6px;cursor:pointer;color:#14532d;font-size:12.5px;"><input type="checkbox" class="symptom" value="neurologico_n_glasgow_15" data-text="NEUROLÓGICO: Glasgow 15." style="accent-color:#166534;"><span>Glasgow 15</span></label><label style="display:flex;align-items:center;gap:6px;padding:6px 8px;background:#f0fdf4;border:1px solid #bbf7d0;border-radius:6px;cursor:pointer;color:#14532d;font-size:12.5px;"><input type="checkbox" class="symptom" value="neurologico_n_fala_coerente" data-text="NEUROLÓGICO: Fala coerente." style="accent-color:#166534;"><span>Fala coerente</span></label><label style="display:flex;align-items:center;gap:6px;padding:6px 8px;background:#f0fdf4;border:1px solid #bbf7d0;border-radius:6px;cursor:pointer;color:#14532d;font-size:12.5px;"><input type="checkbox" class="symptom" value="neurologico_n_forca_muscular_preservada" data-text="NEUROLÓGICO: Força muscular preservada." style="accent-color:#166534;"><span>Força muscular preservada</span></label><label style="display:flex;align-items:center;gap:6px;padding:6px 8px;background:#f0fdf4;border:1px solid #bbf7d0;border-radius:6px;cursor:pointer;color:#14532d;font-size:12.5px;"><input type="checkbox" class="symptom" value="neurologico_n_sensibilidade_preservada" data-text="NEUROLÓGICO: Sensibilidade preservada." style="accent-color:#166534;"><span>Sensibilidade preservada</span></label><label style="display:flex;align-items:center;gap:6px;padding:6px 8px;background:#f0fdf4;border:1px solid #bbf7d0;border-radius:6px;cursor:pointer;color:#14532d;font-size:12.5px;"><input type="checkbox" class="symptom" value="neurologico_n_reflexos_presentes" data-text="NEUROLÓGICO: Reflexos presentes." style="accent-color:#166534;"><span>Reflexos presentes</span></label></div>
  <div style="font-size:12.5px;font-weight:800;color:#991b1b;margin-bottom:6px;">⚠️ Achados de Anormalidade — 🧠 Sistema Neurológico</div>
  <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:6px;"><label style="display:flex;align-items:center;gap:6px;padding:6px 8px;background:#fff5f5;border:1px solid #fee2e2;border-radius:6px;cursor:pointer;color:#991b1b;font-size:12.5px;"><input type="checkbox" class="symptom anormal" value="neurologico_a_rebaixamento_do_nivel_de_c" data-text="NEUROLÓGICO: Rebaixamento do nível de consciência." style="accent-color:#b91c1c;"><span>Rebaixamento do nível de consciência</span></label><label style="display:flex;align-items:center;gap:6px;padding:6px 8px;background:#fff5f5;border:1px solid #fee2e2;border-radius:6px;cursor:pointer;color:#991b1b;font-size:12.5px;"><input type="checkbox" class="symptom anormal" value="neurologico_a_afasia" data-text="NEUROLÓGICO: Afasia." style="accent-color:#b91c1c;"><span>Afasia</span></label><label style="display:flex;align-items:center;gap:6px;padding:6px 8px;background:#fff5f5;border:1px solid #fee2e2;border-radius:6px;cursor:pointer;color:#991b1b;font-size:12.5px;"><input type="checkbox" class="symptom anormal" value="neurologico_a_disartria" data-text="NEUROLÓGICO: Disartria." style="accent-color:#b91c1c;"><span>Disartria</span></label><label style="display:flex;align-items:center;gap:6px;padding:6px 8px;background:#fff5f5;border:1px solid #fee2e2;border-radius:6px;cursor:pointer;color:#991b1b;font-size:12.5px;"><input type="checkbox" class="symptom anormal" value="neurologico_a_hemiparesia" data-text="NEUROLÓGICO: Hemiparesia." style="accent-color:#b91c1c;"><span>Hemiparesia</span></label><label style="display:flex;align-items:center;gap:6px;padding:6px 8px;background:#fff5f5;border:1px solid #fee2e2;border-radius:6px;cursor:pointer;color:#991b1b;font-size:12.5px;"><input type="checkbox" class="symptom anormal" value="neurologico_a_hemiplegia" data-text="NEUROLÓGICO: Hemiplegia." style="accent-color:#b91c1c;"><span>Hemiplegia</span></label><label style="display:flex;align-items:center;gap:6px;padding:6px 8px;background:#fff5f5;border:1px solid #fee2e2;border-radius:6px;cursor:pointer;color:#991b1b;font-size:12.5px;"><input type="checkbox" class="symptom anormal" value="neurologico_a_convulsoes" data-text="NEUROLÓGICO: Convulsões." style="accent-color:#b91c1c;"><span>Convulsões</span></label><label style="display:flex;align-items:center;gap:6px;padding:6px 8px;background:#fff5f5;border:1px solid #fee2e2;border-radius:6px;cursor:pointer;color:#991b1b;font-size:12.5px;"><input type="checkbox" class="symptom anormal" value="neurologico_a_deficits_sensitivos" data-text="NEUROLÓGICO: Déficits sensitivos." style="accent-color:#b91c1c;"><span>Déficits sensitivos</span></label></div>
</div>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 10px;">
          <!-- Opção Normal -->
          <label style="display: flex; align-items: center; gap: 8px; padding: 8px; background: #ffffff; border-radius: 6px; border: 1px solid #cbd5e1; cursor: pointer;">
            <input type="checkbox" class="symptom" value="neu_normal" data-text="Neurológico: Paciente orientado em tempo e espaço, consciente, pupilas isocóricas e fotorreagentes." style="accent-color: #166534;">
            <span style="font-size: 13px;">Lúcido, orientado e consciente (Normal)</span>
          </label>
          <!-- Opções Anormais -->
          <label style="display: flex; align-items: center; gap: 8px; padding: 8px; background: #fff5f5; border-radius: 6px; border: 1px solid #fee2e2; cursor: pointer; color: #991b1b;">
            <input type="checkbox" class="symptom anormal" value="desorientacao" data-text="ALTERAÇÃO NEUROLÓGICA: Apresenta desorientação têmporo-espacial latente." style="accent-color: #b91c1c;">
            <span style="font-size: 13px; font-weight: 600;">Desorientação</span>
          </label>
          <label style="display: flex; align-items: center; gap: 8px; padding: 8px; background: #fff5f5; border-radius: 6px; border: 1px solid #fee2e2; cursor: pointer; color: #991b1b;">
            <input type="checkbox" class="symptom anormal" value="agitacao" data-text="ALTERAÇÃO NEUROLÓGICA: Apresenta quadro de agitação psicomotora e inquietude no leito." style="accent-color: #b91c1c;">
            <span style="font-size: 13px; font-weight: 600;">Agitação psicomotora</span>
          </label>
          <label style="display: flex; align-items: center; gap: 8px; padding: 8px; background: #fff5f5; border-radius: 6px; border: 1px solid #fee2e2; cursor: pointer; color: #991b1b;">
            <input type="checkbox" class="symptom anormal" value="rebaixamento" data-text="ALTERAÇÃO NEUROLÓGICA: Verificado rebaixamento do nível de consciência / letargia." style="accent-color: #b91c1c;">
            <span style="font-size: 13px; font-weight: 600;">Rebaixamento de consciência</span>
          </label>
          <label style="display: flex; align-items: center; gap: 8px; padding: 8px; background: #fff5f5; border-radius: 6px; border: 1px solid #fee2e2; cursor: pointer; color: #991b1b;">
            <input type="checkbox" class="symptom anormal" value="hemiparesia" data-text="ALTERAÇÃO NEUROLÓGICA: Déficit motor focal instalado com hemiparesia evidente." style="accent-color: #b91c1c;">
            <span style="font-size: 13px; font-weight: 600;">Hemiparesia / Plegia</span>
          </label>
          <label style="display: flex; align-items: center; gap: 8px; padding: 8px; background: #fff5f5; border-radius: 6px; border: 1px solid #fee2e2; cursor: pointer; color: #991b1b;">
            <input type="checkbox" class="symptom anormal" value="disfagia" data-text="ALTERAÇÃO NEUROLÓGICA: Sinais de disfagia motora e episódios frequentes de engasgos." style="accent-color: #b91c1c;">
            <span style="font-size: 13px; font-weight: 600;">Disfagia / Engasgo</span>
          </label>
          <label style="display: flex; align-items: center; gap: 8px; padding: 8px; background: #fff5f5; border-radius: 6px; border: 1px solid #fee2e2; cursor: pointer; color: #991b1b;">
            <input type="checkbox" class="symptom anormal" value="cefaleia" data-text="ALTERAÇÃO NEUROLÓGICA: Queixa crônica ou aguda de cefaleia holocraniana intensa." style="accent-color: #b91c1c;">
            <span style="font-size: 13px; font-weight: 600;">Cefaleia</span>
          </label>
        </div>
      </div>
    </details>

    <!-- SISTEMA RESPIRATÓRIO (TOM SUAVE) -->
    <details style="border-radius: 8px; overflow: hidden; margin-bottom: 12px; box-shadow: 0 2px 6px rgba(0,0,0,0.02); background: #ffffff; border: 1px solid #cbd5e1;">
      <summary style="background: linear-gradient(135deg, #e0f2fe 0%, #e0f2fe 100%); padding: 12px 16px; cursor: pointer; font-weight: 700; font-size: 14px; color: #0369a1; display: flex; align-items: center; justify-content: space-between; outline: none; user-select: none;">
        <span>🫁 Sistema Respiratório</span>
        <span style="font-size: 11px; background: #ffffff; padding: 2px 8px; border-radius: 12px; border: 1px solid #bae6fd;">Clique para abrir</span>
      </summary>
      <div style="padding: 14px; background: #fafafa; border-top: 1px solid #cbd5e1;">
<!-- ACHADOS PADRONIZADOS: 🫁 Sistema Respiratório -->
<div style="margin:10px 0 14px;border:1px dashed #cbd5e1;border-radius:10px;padding:12px;background:#fafafa;">
  <div style="font-size:12.5px;font-weight:800;color:#14532d;margin-bottom:6px;">✅ Achados de Normalidade — 🫁 Sistema Respiratório</div>
  <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:6px;margin-bottom:12px;"><label style="display:flex;align-items:center;gap:6px;padding:6px 8px;background:#f0fdf4;border:1px solid #bbf7d0;border-radius:6px;cursor:pointer;color:#14532d;font-size:12.5px;"><input type="checkbox" class="symptom" value="respiratorio_n_eupneico" data-text="RESPIRATÓRIO: Eupneico." style="accent-color:#166534;"><span>Eupneico</span></label><label style="display:flex;align-items:center;gap:6px;padding:6px 8px;background:#f0fdf4;border:1px solid #bbf7d0;border-radius:6px;cursor:pointer;color:#14532d;font-size:12.5px;"><input type="checkbox" class="symptom" value="respiratorio_n_murmurios_vesiculares_pre" data-text="RESPIRATÓRIO: Murmúrios vesiculares presentes bilateralmente (MV+)." style="accent-color:#166534;"><span>Murmúrios vesiculares presentes bilateralmente (MV+)</span></label><label style="display:flex;align-items:center;gap:6px;padding:6px 8px;background:#f0fdf4;border:1px solid #bbf7d0;border-radius:6px;cursor:pointer;color:#14532d;font-size:12.5px;"><input type="checkbox" class="symptom" value="respiratorio_n_sem_ruidos_adventicios" data-text="RESPIRATÓRIO: Sem ruídos adventícios." style="accent-color:#166534;"><span>Sem ruídos adventícios</span></label></div>
  <div style="font-size:12.5px;font-weight:800;color:#991b1b;margin-bottom:6px;">⚠️ Achados de Anormalidade — 🫁 Sistema Respiratório</div>
  <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:6px;"><label style="display:flex;align-items:center;gap:6px;padding:6px 8px;background:#fff5f5;border:1px solid #fee2e2;border-radius:6px;cursor:pointer;color:#991b1b;font-size:12.5px;"><input type="checkbox" class="symptom anormal" value="respiratorio_a_dispneia" data-text="RESPIRATÓRIO: Dispneia." style="accent-color:#b91c1c;"><span>Dispneia</span></label><label style="display:flex;align-items:center;gap:6px;padding:6px 8px;background:#fff5f5;border:1px solid #fee2e2;border-radius:6px;cursor:pointer;color:#991b1b;font-size:12.5px;"><input type="checkbox" class="symptom anormal" value="respiratorio_a_taquipneia" data-text="RESPIRATÓRIO: Taquipneia." style="accent-color:#b91c1c;"><span>Taquipneia</span></label><label style="display:flex;align-items:center;gap:6px;padding:6px 8px;background:#fff5f5;border:1px solid #fee2e2;border-radius:6px;cursor:pointer;color:#991b1b;font-size:12.5px;"><input type="checkbox" class="symptom anormal" value="respiratorio_a_bradipneia" data-text="RESPIRATÓRIO: Bradipneia." style="accent-color:#b91c1c;"><span>Bradipneia</span></label><label style="display:flex;align-items:center;gap:6px;padding:6px 8px;background:#fff5f5;border:1px solid #fee2e2;border-radius:6px;cursor:pointer;color:#991b1b;font-size:12.5px;"><input type="checkbox" class="symptom anormal" value="respiratorio_a_apneia" data-text="RESPIRATÓRIO: Apneia." style="accent-color:#b91c1c;"><span>Apneia</span></label><label style="display:flex;align-items:center;gap:6px;padding:6px 8px;background:#fff5f5;border:1px solid #fee2e2;border-radius:6px;cursor:pointer;color:#991b1b;font-size:12.5px;"><input type="checkbox" class="symptom anormal" value="respiratorio_a_uso_de_musculatura_acesso" data-text="RESPIRATÓRIO: Uso de musculatura acessória." style="accent-color:#b91c1c;"><span>Uso de musculatura acessória</span></label><label style="display:flex;align-items:center;gap:6px;padding:6px 8px;background:#fff5f5;border:1px solid #fee2e2;border-radius:6px;cursor:pointer;color:#991b1b;font-size:12.5px;"><input type="checkbox" class="symptom anormal" value="respiratorio_a_sibilos" data-text="RESPIRATÓRIO: Sibilos." style="accent-color:#b91c1c;"><span>Sibilos</span></label><label style="display:flex;align-items:center;gap:6px;padding:6px 8px;background:#fff5f5;border:1px solid #fee2e2;border-radius:6px;cursor:pointer;color:#991b1b;font-size:12.5px;"><input type="checkbox" class="symptom anormal" value="respiratorio_a_roncos" data-text="RESPIRATÓRIO: Roncos." style="accent-color:#b91c1c;"><span>Roncos</span></label><label style="display:flex;align-items:center;gap:6px;padding:6px 8px;background:#fff5f5;border:1px solid #fee2e2;border-radius:6px;cursor:pointer;color:#991b1b;font-size:12.5px;"><input type="checkbox" class="symptom anormal" value="respiratorio_a_estertores_finos" data-text="RESPIRATÓRIO: Estertores finos." style="accent-color:#b91c1c;"><span>Estertores finos</span></label><label style="display:flex;align-items:center;gap:6px;padding:6px 8px;background:#fff5f5;border:1px solid #fee2e2;border-radius:6px;cursor:pointer;color:#991b1b;font-size:12.5px;"><input type="checkbox" class="symptom anormal" value="respiratorio_a_estertores_grossos" data-text="RESPIRATÓRIO: Estertores grossos." style="accent-color:#b91c1c;"><span>Estertores grossos</span></label><label style="display:flex;align-items:center;gap:6px;padding:6px 8px;background:#fff5f5;border:1px solid #fee2e2;border-radius:6px;cursor:pointer;color:#991b1b;font-size:12.5px;"><input type="checkbox" class="symptom anormal" value="respiratorio_a_estridor" data-text="RESPIRATÓRIO: Estridor." style="accent-color:#b91c1c;"><span>Estridor</span></label><label style="display:flex;align-items:center;gap:6px;padding:6px 8px;background:#fff5f5;border:1px solid #fee2e2;border-radius:6px;cursor:pointer;color:#991b1b;font-size:12.5px;"><input type="checkbox" class="symptom anormal" value="respiratorio_a_mv_diminuidos_ou_abolidos" data-text="RESPIRATÓRIO: MV diminuídos ou abolidos." style="accent-color:#b91c1c;"><span>MV diminuídos ou abolidos</span></label></div>
</div>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 10px;">
          <!-- Opção Normal -->
          <label style="display: flex; align-items: center; gap: 8px; padding: 8px; background: #ffffff; border-radius: 6px; border: 1px solid #cbd5e1; cursor: pointer;">
            <input type="checkbox" class="symptom" value="resp_normal" data-text="Respiratório: MV universalmente audíveis, sem ruídos adventícios." style="accent-color: #166534;">
            <span style="font-size: 13px;">MV universalmente audíveis, sem murmúrios adventícios (Normal)</span>
          </label>
          <!-- Opções Anormais -->
          <label style="display: flex; align-items: center; gap: 8px; padding: 8px; background: #fff5f5; border-radius: 6px; border: 1px solid #fee2e2; cursor: pointer; color: #991b1b;">
            <input type="checkbox" class="symptom anormal" value="taquipneia" data-text="ALTERAÇÃO RESPIRATÓRIA: Sinais de taquipneia evidente com FR elevada." style="accent-color: #b91c1c;">
            <span style="font-size: 13px; font-weight: 600;">Taquipneia (FR > 22)</span>
          </label>
          <label style="display: flex; align-items: center; gap: 8px; padding: 8px; background: #fff5f5; border-radius: 6px; border: 1px solid #fee2e2; cursor: pointer; color: #991b1b;">
            <input type="checkbox" class="symptom anormal" value="bradipneia" data-text="ALTERAÇÃO RESPIRATÓRIA: Identificado quadro severo de bradipneia." style="accent-color: #b91c1c;">
            <span style="font-size: 13px; font-weight: 600;">Bradipneia (FR &lt; 12)</span>
          </label>
          <label style="display: flex; align-items: center; gap: 8px; padding: 8px; background: #fff5f5; border-radius: 6px; border: 1px solid #fee2e2; cursor: pointer; color: #991b1b;">
            <input type="checkbox" class="symptom anormal" value="alt_ritmo" data-text="ALTERAÇÃO RESPIRATÓRIA: Instabilidade na mecânica com alteração no ritmo respiratório." style="accent-color: #b91c1c;">
            <span style="font-size: 13px; font-weight: 600;">Alteração no ritmo respiratório</span>
          </label>
          <label style="display: flex; align-items: center; gap: 8px; padding: 8px; background: #fff5f5; border-radius: 6px; border: 1px solid #fee2e2; cursor: pointer; color: #991b1b;">
            <input type="checkbox" class="symptom anormal" value="spo2" data-text="ALTERAÇÃO RESPIRATÓRIA: Hipoxemia registrada com SpO₂ abaixo de 92% em ar ambiente." style="accent-color: #b91c1c;">
            <span style="font-size: 13px; font-weight: 600;">SpO₂ &lt; 92%</span>
          </label>
          <label style="display: flex; align-items: center; gap: 8px; padding: 8px; background: #fff5f5; border-radius: 6px; border: 1px solid #fee2e2; cursor: pointer; color: #991b1b;">
            <input type="checkbox" class="symptom anormal" value="mv" data-text="ALTERAÇÃO RESPIRATÓRIA: Murmúrio vesicular diminuído com presença de crepitações e estertores." style="accent-color: #b91c1c;">
            <span style="font-size: 13px; font-weight: 600;">MV diminuído / crepitações</span>
          </label>
          <label style="display: flex; align-items: center; gap: 8px; padding: 8px; background: #fff5f5; border-radius: 6px; border: 1px solid #fee2e2; cursor: pointer; color: #991b1b;">
            <input type="checkbox" class="symptom anormal" value="dispneia" data-text="ALTERAÇÃO RESPIRATÓRIA: Relato ativo de dispneia associada aos mínimos esforços." style="accent-color: #b91c1c;">
            <span style="font-size: 13px; font-weight: 600;">Dispneia aos esforços</span>
          </label>
          <label style="display: flex; align-items: center; gap: 8px; padding: 8px; background: #fff5f5; border-radius: 6px; border: 1px solid #fee2e2; cursor: pointer; color: #991b1b;">
            <input type="checkbox" class="symptom anormal" value="tosse" data-text="ALTERAÇÃO RESPIRATÓRIA: Quadro persistente de tosse produtiva e secreção fluida." style="accent-color: #b91c1c;">
            <span style="font-size: 13px; font-weight: 600;">Tosse produtiva</span>
          </label>
        </div>
        <textarea class="sae-obs-livre" data-secao="Respiratório" rows="2" placeholder="Observações do sistema respiratório (vão para a evolução)..." style="width:100%; margin-top:10px; padding:8px 12px; border:1px solid #d1d5db; border-radius:6px; font-size:13px; box-sizing:border-box; font-family:inherit; background:#fafafa;"></textarea>
      </div>
    </details>

      <!-- SISTEMA CARDIOVASCULAR (CORRIGIDO E EXPANDIDO) -->
    <details style="border-radius: 8px; overflow: hidden; margin-bottom: 12px; box-shadow: 0 2px 6px rgba(0,0,0,0.02); background: #ffffff; border: 1px solid #cbd5e1;">
      <summary style="background: linear-gradient(135deg, #fee2e2 0%, #fee2e2 100%); padding: 12px 16px; cursor: pointer; font-weight: 700; font-size: 14px; color: #991b1b; display: flex; align-items: center; justify-content: space-between; outline: none; user-select: none;">
        <span>❤️ Sistema Cardiovascular</span>
        <span style="font-size: 11px; background: #ffffff; padding: 2px 8px; border-radius: 12px; border: 1px solid #fecaca;">Clique para abrir</span>
      </summary>
      <div style="padding: 14px; background: #fafafa; border-top: 1px solid #cbd5e1;">
<!-- ACHADOS PADRONIZADOS: ❤️ Sistema Cardiovascular -->
<div style="margin:10px 0 14px;border:1px dashed #cbd5e1;border-radius:10px;padding:12px;background:#fafafa;">
  <div style="font-size:12.5px;font-weight:800;color:#14532d;margin-bottom:6px;">✅ Achados de Normalidade — ❤️ Sistema Cardiovascular</div>
  <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:6px;margin-bottom:12px;"><label style="display:flex;align-items:center;gap:6px;padding:6px 8px;background:#f0fdf4;border:1px solid #bbf7d0;border-radius:6px;cursor:pointer;color:#14532d;font-size:12.5px;"><input type="checkbox" class="symptom" value="cardiovascular_n_bulhas_normofoneticas_b" data-text="CARDIOVASCULAR: Bulhas normofonéticas (B1 e B2)." style="accent-color:#166534;"><span>Bulhas normofonéticas (B1 e B2)</span></label><label style="display:flex;align-items:center;gap:6px;padding:6px 8px;background:#f0fdf4;border:1px solid #bbf7d0;border-radius:6px;cursor:pointer;color:#14532d;font-size:12.5px;"><input type="checkbox" class="symptom" value="cardiovascular_n_ritmo_regular_em_dois_t" data-text="CARDIOVASCULAR: Ritmo regular em dois tempos (RR2T)." style="accent-color:#166534;"><span>Ritmo regular em dois tempos (RR2T)</span></label><label style="display:flex;align-items:center;gap:6px;padding:6px 8px;background:#f0fdf4;border:1px solid #bbf7d0;border-radius:6px;cursor:pointer;color:#14532d;font-size:12.5px;"><input type="checkbox" class="symptom" value="cardiovascular_n_pulsos_cheios_e_simetri" data-text="CARDIOVASCULAR: Pulsos cheios e simétricos." style="accent-color:#166534;"><span>Pulsos cheios e simétricos</span></label><label style="display:flex;align-items:center;gap:6px;padding:6px 8px;background:#f0fdf4;border:1px solid #bbf7d0;border-radius:6px;cursor:pointer;color:#14532d;font-size:12.5px;"><input type="checkbox" class="symptom" value="cardiovascular_n_tec_2_segundos" data-text="CARDIOVASCULAR: TEC < 2 segundos." style="accent-color:#166534;"><span>TEC &lt; 2 segundos</span></label></div>
  <div style="font-size:12.5px;font-weight:800;color:#991b1b;margin-bottom:6px;">⚠️ Achados de Anormalidade — ❤️ Sistema Cardiovascular</div>
  <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:6px;"><label style="display:flex;align-items:center;gap:6px;padding:6px 8px;background:#fff5f5;border:1px solid #fee2e2;border-radius:6px;cursor:pointer;color:#991b1b;font-size:12.5px;"><input type="checkbox" class="symptom anormal" value="cardiovascular_a_sopros_cardiacos" data-text="CARDIOVASCULAR: Sopros cardíacos." style="accent-color:#b91c1c;"><span>Sopros cardíacos</span></label><label style="display:flex;align-items:center;gap:6px;padding:6px 8px;background:#fff5f5;border:1px solid #fee2e2;border-radius:6px;cursor:pointer;color:#991b1b;font-size:12.5px;"><input type="checkbox" class="symptom anormal" value="cardiovascular_a_arritmias" data-text="CARDIOVASCULAR: Arritmias." style="accent-color:#b91c1c;"><span>Arritmias</span></label><label style="display:flex;align-items:center;gap:6px;padding:6px 8px;background:#fff5f5;border:1px solid #fee2e2;border-radius:6px;cursor:pointer;color:#991b1b;font-size:12.5px;"><input type="checkbox" class="symptom anormal" value="cardiovascular_a_bulhas_hipofoneticas" data-text="CARDIOVASCULAR: Bulhas hipofonéticas." style="accent-color:#b91c1c;"><span>Bulhas hipofonéticas</span></label><label style="display:flex;align-items:center;gap:6px;padding:6px 8px;background:#fff5f5;border:1px solid #fee2e2;border-radius:6px;cursor:pointer;color:#991b1b;font-size:12.5px;"><input type="checkbox" class="symptom anormal" value="cardiovascular_a_pulsos_filiformes" data-text="CARDIOVASCULAR: Pulsos filiformes." style="accent-color:#b91c1c;"><span>Pulsos filiformes</span></label><label style="display:flex;align-items:center;gap:6px;padding:6px 8px;background:#fff5f5;border:1px solid #fee2e2;border-radius:6px;cursor:pointer;color:#991b1b;font-size:12.5px;"><input type="checkbox" class="symptom anormal" value="cardiovascular_a_edema" data-text="CARDIOVASCULAR: Edema." style="accent-color:#b91c1c;"><span>Edema</span></label><label style="display:flex;align-items:center;gap:6px;padding:6px 8px;background:#fff5f5;border:1px solid #fee2e2;border-radius:6px;cursor:pointer;color:#991b1b;font-size:12.5px;"><input type="checkbox" class="symptom anormal" value="cardiovascular_a_turgencia_jugular" data-text="CARDIOVASCULAR: Turgência jugular." style="accent-color:#b91c1c;"><span>Turgência jugular</span></label><label style="display:flex;align-items:center;gap:6px;padding:6px 8px;background:#fff5f5;border:1px solid #fee2e2;border-radius:6px;cursor:pointer;color:#991b1b;font-size:12.5px;"><input type="checkbox" class="symptom anormal" value="cardiovascular_a_perfusao_periferica_len" data-text="CARDIOVASCULAR: Perfusão periférica lenta." style="accent-color:#b91c1c;"><span>Perfusão periférica lenta</span></label></div>
</div>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 10px;">
          <label style="display: flex; align-items: center; gap: 8px; padding: 8px; background: #ffffff; border-radius: 6px; border: 1px solid #cbd5e1; cursor: pointer;">
            <input type="checkbox" class="symptom" value="cardio_normal" data-text="Cardiovascular: RCR, BNF em 2T, sem sopros. Normocárdico." style="accent-color: #166534;">
            <span style="font-size: 13px;">RCR, BNF em 2T, sem sopros. Normocárdico (Normal)</span>
          </label>
          <label style="display: flex; align-items: center; gap: 8px; padding: 8px; background: #fff5f5; border-radius: 6px; border: 1px solid #fee2e2; cursor: pointer; color: #991b1b;">
            <input type="checkbox" class="symptom anormal" value="taquicardia" data-text="ALTERAÇÃO CARDIOVASCULAR: Registrada taquicardia persistente no leito." style="accent-color: #b91c1c;">
            <span style="font-size: 13px; font-weight: 600;">Taquicardia (FC > 100)</span>
          </label>
          <label style="display: flex; align-items: center; gap: 8px; padding: 8px; background: #fff5f5; border-radius: 6px; border: 1px solid #fee2e2; cursor: pointer; color: #991b1b;">
            <input type="checkbox" class="symptom anormal" value="bradicardia" data-text="ALTERAÇÃO CARDIOVASCULAR: Registrado quadro severo de bradicardia sinusal no leito." style="accent-color: #b91c1c;">
            <span style="font-size: 13px; font-weight: 600;">Bradicardia (FC &lt; 60)</span>
          </label>
          <label style="display: flex; align-items: center; gap: 8px; padding: 8px; background: #fff5f5; border-radius: 6px; border: 1px solid #fee2e2; cursor: pointer; color: #991b1b;">
            <input type="checkbox" class="symptom anormal" value="hipotensao" data-text="ALTERAÇÃO CARDIOVASCULAR: Instabilidade hemodinâmica acompanhada de hipotensão severa." style="accent-color: #b91c1c;">
            <span style="font-size: 13px; font-weight: 600;">Hipotensão (PA &lt; 90x60)</span>
          </label>
          <label style="display: flex; align-items: center; gap: 8px; padding: 8px; background: #fff5f5; border-radius: 6px; border: 1px solid #fee2e2; cursor: pointer; color: #991b1b;">
            <input type="checkbox" class="symptom anormal" value="hipertensao" data-text="ALTERAÇÃO CARDIOVASCULAR: Registrado pico pressórico/crise hipertensiva severa no leito." style="accent-color: #b91c1c;">
            <span style="font-size: 13px; font-weight: 600;">Hipertensão (PA > 140x90)</span>
          </label>
          <label style="display: flex; align-items: center; gap: 8px; padding: 8px; background: #fff5f5; border-radius: 6px; border: 1px solid #fee2e2; cursor: pointer; color: #991b1b;">
            <input type="checkbox" class="symptom anormal" value="pulso_fili" data-text="ALTERAÇÃO CARDIOVASCULAR: Palpação de pulsos periféricos irregulares e de aspecto filiforme." style="accent-color: #b91c1c;">
            <span style="font-size: 13px; font-weight: 600;">Pulso filiforme / irregular</span>
          </label>
          <label style="display: flex; align-items: center; gap: 8px; padding: 8px; background: #fff5f5; border-radius: 6px; border: 1px solid #fee2e2; cursor: pointer; color: #991b1b;">
            <input type="checkbox" class="symptom anormal" value="tjp" data-text="ALTERAÇÃO CARDIOVASCULAR: Turgência de jugular patológica." style="accent-color: #b91c1c;">
            <span style="font-size: 13px; font-weight: 600;">Turgência de jugular patológica</span>
            <label style="display:inline-flex; align-items:center; gap:4px; margin-left:8px; font-size:12px; color:#7f1d1d;"><input type="checkbox" class="symptom anormal" value="tjp_dir" data-text="TJP à direita." style="accent-color:#b91c1c;"> Dir.</label>
            <label style="display:inline-flex; align-items:center; gap:4px; margin-left:4px; font-size:12px; color:#7f1d1d;"><input type="checkbox" class="symptom anormal" value="tjp_esq" data-text="TJP à esquerda." style="accent-color:#b91c1c;"> Esq.</label>
          </label>
          <label style="display: flex; align-items: center; gap: 8px; padding: 8px; background: #fff5f5; border-radius: 6px; border: 1px solid #fee2e2; cursor: pointer; color: #991b1b;">
            <input type="checkbox" class="symptom anormal" value="b3" data-text="ALTERAÇÃO CARDIOVASCULAR: Ausculta cardíaca com presença patológica de terceira bulha (B3) audível." style="accent-color: #b91c1c;">
            <span style="font-size: 13px; font-weight: 600;">B3 audível</span>
          </label>
          <label style="display: flex; align-items: center; gap: 8px; padding: 8px; background: #fff5f5; border-radius: 6px; border: 1px solid #fee2e2; cursor: pointer; color: #991b1b;">
            <input type="checkbox" class="symptom anormal" value="perf_lenta" data-text="ALTERAÇÃO CARDIOVASCULAR: Sinais de má perfusão tecidual com tempo de enchimento capilar lento." style="accent-color: #b91c1c;">
            <span style="font-size: 13px; font-weight: 600;">Tempo de enchimento lento (>3s)</span>
          </label>
        </div>
        <div style="margin:12px 0 4px;border:1px solid #fecaca;border-radius:10px;padding:12px;background:#fff5f5;">
  <div style="font-size:12.5px;font-weight:800;color:#991b1b;margin-bottom:8px;">🩺 Sinais Vitais</div>
  <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:8px;">
    <label style="display:flex;flex-direction:column;gap:4px;font-size:11.5px;font-weight:700;color:#991b1b;">P.A. (mmHg)
      <input type="text" id="sae-sv-pa" class="sae-sv" placeholder="120/80" style="padding:8px 10px;border:1px solid #fecaca;border-radius:6px;font-size:13px;font-weight:600;color:#111827;background:#ffffff;box-sizing:border-box;">
    </label>
    <label style="display:flex;flex-direction:column;gap:4px;font-size:11.5px;font-weight:700;color:#991b1b;">T. (°C)
      <input type="text" id="sae-sv-temp" class="sae-sv" placeholder="36,5" style="padding:8px 10px;border:1px solid #fecaca;border-radius:6px;font-size:13px;font-weight:600;color:#111827;background:#ffffff;box-sizing:border-box;">
    </label>
    <label style="display:flex;flex-direction:column;gap:4px;font-size:11.5px;font-weight:700;color:#991b1b;">R. (irpm)
      <input type="text" id="sae-sv-fr" class="sae-sv" placeholder="18" style="padding:8px 10px;border:1px solid #fecaca;border-radius:6px;font-size:13px;font-weight:600;color:#111827;background:#ffffff;box-sizing:border-box;">
    </label>
    <label style="display:flex;flex-direction:column;gap:4px;font-size:11.5px;font-weight:700;color:#991b1b;">P. (bpm)
      <input type="text" id="sae-sv-fc" class="sae-sv" placeholder="80" style="padding:8px 10px;border:1px solid #fecaca;border-radius:6px;font-size:13px;font-weight:600;color:#111827;background:#ffffff;box-sizing:border-box;">
    </label>
    <label style="display:flex;flex-direction:column;gap:4px;font-size:11.5px;font-weight:700;color:#991b1b;">Dor (0 a 10)
      <input type="number" min="0" max="10" id="sae-sv-dor" class="sae-sv" placeholder="0" style="padding:8px 10px;border:1px solid #fecaca;border-radius:6px;font-size:13px;font-weight:600;color:#111827;background:#ffffff;box-sizing:border-box;">
    </label>
    <label style="display:flex;flex-direction:column;gap:4px;font-size:11.5px;font-weight:700;color:#991b1b;">Glicemia capilar (mg/dL)
      <input type="text" id="sae-sv-glicemia" class="sae-sv" placeholder="99" style="padding:8px 10px;border:1px solid #fecaca;border-radius:6px;font-size:13px;font-weight:600;color:#111827;background:#ffffff;box-sizing:border-box;">
    </label>
  </div>
</div>
<textarea class="sae-obs-livre" data-secao="Cardiovascular" rows="2" placeholder="Observações do sistema cardiovascular (vão para a evolução)..." style="width:100%; margin-top:10px; padding:8px 12px; border:1px solid #d1d5db; border-radius:6px; font-size:13px; box-sizing:border-box; font-family:inherit; background:#fafafa;"></textarea>
      </div>
    </details>

    <!-- SISTEMA DIGESTÓRIO (EXPANDIDO) -->
    <details style="border-radius: 8px; overflow: hidden; margin-bottom: 12px; box-shadow: 0 2px 6px rgba(0,0,0,0.02); background: #ffffff; border: 1px solid #cbd5e1;">
      <summary style="background: linear-gradient(135deg, #ffedd5 0%, #ffedd5 100%); padding: 12px 16px; cursor: pointer; font-weight: 700; font-size: 14px; color: #c2410c; display: flex; align-items: center; justify-content: space-between; outline: none; user-select: none;">
        <span>🟡 Sistema Digestório</span>
        <span style="font-size: 11px; background: #ffffff; padding: 2px 8px; border-radius: 12px; border: 1px solid #fed7aa;">Clique para abrir</span>
      </summary>
      <div style="padding: 14px; background: #fafafa; border-top: 1px solid #cbd5e1;">
<!-- ACHADOS PADRONIZADOS: 🟡 Sistema Digestório -->
<div style="margin:10px 0 14px;border:1px dashed #cbd5e1;border-radius:10px;padding:12px;background:#fafafa;">
  <div style="font-size:12.5px;font-weight:800;color:#14532d;margin-bottom:6px;">✅ Achados de Normalidade — 🟡 Sistema Digestório</div>
  <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:6px;margin-bottom:12px;"><label style="display:flex;align-items:center;gap:6px;padding:6px 8px;background:#f0fdf4;border:1px solid #bbf7d0;border-radius:6px;cursor:pointer;color:#14532d;font-size:12.5px;"><input type="checkbox" class="symptom" value="digestorio_n_aceita_dieta_oral" data-text="DIGESTÓRIO: Aceita dieta oral." style="accent-color:#166534;"><span>Aceita dieta oral</span></label><label style="display:flex;align-items:center;gap:6px;padding:6px 8px;background:#f0fdf4;border:1px solid #bbf7d0;border-radius:6px;cursor:pointer;color:#14532d;font-size:12.5px;"><input type="checkbox" class="symptom" value="digestorio_n_evacuacao_fisiologica" data-text="DIGESTÓRIO: Evacuação fisiológica." style="accent-color:#166534;"><span>Evacuação fisiológica</span></label><label style="display:flex;align-items:center;gap:6px;padding:6px 8px;background:#f0fdf4;border:1px solid #bbf7d0;border-radius:6px;cursor:pointer;color:#14532d;font-size:12.5px;"><input type="checkbox" class="symptom" value="digestorio_n_abdome_plano_globoso_flacid" data-text="DIGESTÓRIO: Abdome plano/globoso, flácido e indolor." style="accent-color:#166534;"><span>Abdome plano/globoso, flácido e indolor</span></label><label style="display:flex;align-items:center;gap:6px;padding:6px 8px;background:#f0fdf4;border:1px solid #bbf7d0;border-radius:6px;cursor:pointer;color:#14532d;font-size:12.5px;"><input type="checkbox" class="symptom" value="digestorio_n_ruidos_hidroaereos_presente" data-text="DIGESTÓRIO: Ruídos hidroaéreos presentes (RHA+)." style="accent-color:#166534;"><span>Ruídos hidroaéreos presentes (RHA+)</span></label><label style="display:flex;align-items:center;gap:6px;padding:6px 8px;background:#f0fdf4;border:1px solid #bbf7d0;border-radius:6px;cursor:pointer;color:#14532d;font-size:12.5px;"><input type="checkbox" class="symptom" value="digestorio_n_sem_massas_palpaveis" data-text="DIGESTÓRIO: Sem massas palpáveis." style="accent-color:#166534;"><span>Sem massas palpáveis</span></label></div>
  <div style="font-size:12.5px;font-weight:800;color:#991b1b;margin-bottom:6px;">⚠️ Achados de Anormalidade — 🟡 Sistema Digestório</div>
  <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:6px;"><label style="display:flex;align-items:center;gap:6px;padding:6px 8px;background:#fff5f5;border:1px solid #fee2e2;border-radius:6px;cursor:pointer;color:#991b1b;font-size:12.5px;"><input type="checkbox" class="symptom anormal" value="digestorio_a_nauseas" data-text="DIGESTÓRIO: Náuseas." style="accent-color:#b91c1c;"><span>Náuseas</span></label><label style="display:flex;align-items:center;gap:6px;padding:6px 8px;background:#fff5f5;border:1px solid #fee2e2;border-radius:6px;cursor:pointer;color:#991b1b;font-size:12.5px;"><input type="checkbox" class="symptom anormal" value="digestorio_a_vomitos" data-text="DIGESTÓRIO: Vômitos." style="accent-color:#b91c1c;"><span>Vômitos</span></label><label style="display:flex;align-items:center;gap:6px;padding:6px 8px;background:#fff5f5;border:1px solid #fee2e2;border-radius:6px;cursor:pointer;color:#991b1b;font-size:12.5px;"><input type="checkbox" class="symptom anormal" value="digestorio_a_diarreia" data-text="DIGESTÓRIO: Diarreia." style="accent-color:#b91c1c;"><span>Diarreia</span></label><label style="display:flex;align-items:center;gap:6px;padding:6px 8px;background:#fff5f5;border:1px solid #fee2e2;border-radius:6px;cursor:pointer;color:#991b1b;font-size:12.5px;"><input type="checkbox" class="symptom anormal" value="digestorio_a_constipacao" data-text="DIGESTÓRIO: Constipação." style="accent-color:#b91c1c;"><span>Constipação</span></label><label style="display:flex;align-items:center;gap:6px;padding:6px 8px;background:#fff5f5;border:1px solid #fee2e2;border-radius:6px;cursor:pointer;color:#991b1b;font-size:12.5px;"><input type="checkbox" class="symptom anormal" value="digestorio_a_melena" data-text="DIGESTÓRIO: Melena." style="accent-color:#b91c1c;"><span>Melena</span></label><label style="display:flex;align-items:center;gap:6px;padding:6px 8px;background:#fff5f5;border:1px solid #fee2e2;border-radius:6px;cursor:pointer;color:#991b1b;font-size:12.5px;"><input type="checkbox" class="symptom anormal" value="digestorio_a_enterorragia" data-text="DIGESTÓRIO: Enterorragia." style="accent-color:#b91c1c;"><span>Enterorragia</span></label><label style="display:flex;align-items:center;gap:6px;padding:6px 8px;background:#fff5f5;border:1px solid #fee2e2;border-radius:6px;cursor:pointer;color:#991b1b;font-size:12.5px;"><input type="checkbox" class="symptom anormal" value="digestorio_a_hematemese" data-text="DIGESTÓRIO: Hematêmese." style="accent-color:#b91c1c;"><span>Hematêmese</span></label><label style="display:flex;align-items:center;gap:6px;padding:6px 8px;background:#fff5f5;border:1px solid #fee2e2;border-radius:6px;cursor:pointer;color:#991b1b;font-size:12.5px;"><input type="checkbox" class="symptom anormal" value="digestorio_a_abdome_distendido" data-text="DIGESTÓRIO: Abdome distendido." style="accent-color:#b91c1c;"><span>Abdome distendido</span></label><label style="display:flex;align-items:center;gap:6px;padding:6px 8px;background:#fff5f5;border:1px solid #fee2e2;border-radius:6px;cursor:pointer;color:#991b1b;font-size:12.5px;"><input type="checkbox" class="symptom anormal" value="digestorio_a_abdome_tenso" data-text="DIGESTÓRIO: Abdome tenso." style="accent-color:#b91c1c;"><span>Abdome tenso</span></label><label style="display:flex;align-items:center;gap:6px;padding:6px 8px;background:#fff5f5;border:1px solid #fee2e2;border-radius:6px;cursor:pointer;color:#991b1b;font-size:12.5px;"><input type="checkbox" class="symptom anormal" value="digestorio_a_abdome_doloroso" data-text="DIGESTÓRIO: Abdome doloroso." style="accent-color:#b91c1c;"><span>Abdome doloroso</span></label><label style="display:flex;align-items:center;gap:6px;padding:6px 8px;background:#fff5f5;border:1px solid #fee2e2;border-radius:6px;cursor:pointer;color:#991b1b;font-size:12.5px;"><input type="checkbox" class="symptom anormal" value="digestorio_a_defesa_abdominal" data-text="DIGESTÓRIO: Defesa abdominal." style="accent-color:#b91c1c;"><span>Defesa abdominal</span></label><label style="display:flex;align-items:center;gap:6px;padding:6px 8px;background:#fff5f5;border:1px solid #fee2e2;border-radius:6px;cursor:pointer;color:#991b1b;font-size:12.5px;"><input type="checkbox" class="symptom anormal" value="digestorio_a_rigidez_abdominal" data-text="DIGESTÓRIO: Rigidez abdominal." style="accent-color:#b91c1c;"><span>Rigidez abdominal</span></label><label style="display:flex;align-items:center;gap:6px;padding:6px 8px;background:#fff5f5;border:1px solid #fee2e2;border-radius:6px;cursor:pointer;color:#991b1b;font-size:12.5px;"><input type="checkbox" class="symptom anormal" value="digestorio_a_ascite" data-text="DIGESTÓRIO: Ascite." style="accent-color:#b91c1c;"><span>Ascite</span></label><label style="display:flex;align-items:center;gap:6px;padding:6px 8px;background:#fff5f5;border:1px solid #fee2e2;border-radius:6px;cursor:pointer;color:#991b1b;font-size:12.5px;"><input type="checkbox" class="symptom anormal" value="digestorio_a_massas_palpaveis" data-text="DIGESTÓRIO: Massas palpáveis." style="accent-color:#b91c1c;"><span>Massas palpáveis</span></label><label style="display:flex;align-items:center;gap:6px;padding:6px 8px;background:#fff5f5;border:1px solid #fee2e2;border-radius:6px;cursor:pointer;color:#991b1b;font-size:12.5px;"><input type="checkbox" class="symptom anormal" value="digestorio_a_rha_diminuidos" data-text="DIGESTÓRIO: RHA diminuídos." style="accent-color:#b91c1c;"><span>RHA diminuídos</span></label><label style="display:flex;align-items:center;gap:6px;padding:6px 8px;background:#fff5f5;border:1px solid #fee2e2;border-radius:6px;cursor:pointer;color:#991b1b;font-size:12.5px;"><input type="checkbox" class="symptom anormal" value="digestorio_a_rha_aumentados" data-text="DIGESTÓRIO: RHA aumentados." style="accent-color:#b91c1c;"><span>RHA aumentados</span></label><label style="display:flex;align-items:center;gap:6px;padding:6px 8px;background:#fff5f5;border:1px solid #fee2e2;border-radius:6px;cursor:pointer;color:#991b1b;font-size:12.5px;"><input type="checkbox" class="symptom anormal" value="digestorio_a_rha_ausentes" data-text="DIGESTÓRIO: RHA ausentes." style="accent-color:#b91c1c;"><span>RHA ausentes</span></label></div>
</div>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 10px;">
          <label style="display: flex; align-items: center; gap: 8px; padding: 8px; background: #ffffff; border-radius: 6px; border: 1px solid #cbd5e1; cursor: pointer;">
            <input type="checkbox" class="symptom" value="dig_normal" data-text="Digestório: Ruídos Hidroaéreos Normoativos - RHA. Indolor à palpação superficial e profunda." style="accent-color: #166534;">
            <span style="font-size: 13px;">RHA Normoativos, indolor à palpação superficial e profunda (Normal)</span>
          </label>
          <label style="display: flex; align-items: center; gap: 8px; padding: 8px; background: #fff5f5; border-radius: 6px; border: 1px solid #fee2e2; cursor: pointer; color: #991b1b;">
            <input type="checkbox" class="symptom anormal" value="mucosa" data-text="ALTERAÇÃO DIGESTÓRIA: Sinais de desidratação com mucosa oral e labial secas." style="accent-color: #b91c1c;">
            <span style="font-size: 13px; font-weight: 600;">Mucosa oral seca</span>
          </label>
          <label style="display: flex; align-items: center; gap: 8px; padding: 8px; background: #fff5f5; border-radius: 6px; border: 1px solid #fee2e2; cursor: pointer; color: #991b1b;">
            <input type="checkbox" class="symptom anormal" value="nauseas" data-text="ALTERAÇÃO DIGESTÓRIA: Crise ativa de náuseas persistentes e episódios de vômitos." style="accent-color: #b91c1c;">
            <span style="font-size: 13px; font-weight: 600;">Náuseas / Vômitos</span>
          </label>
          <label style="display: flex; align-items: center; gap: 8px; padding: 8px; background: #fff5f5; border-radius: 6px; border: 1px solid #fee2e2; cursor: pointer; color: #991b1b;">
            <input type="checkbox" class="symptom anormal" value="diarreia" data-text="ALTERAÇÃO DIGESTÓRIA: Evacuações diarreicas recorrentes de aspecto líquido." style="accent-color: #b91c1c;">
            <span style="font-size: 13px; font-weight: 600;">Diarreia</span>
          </label>
          <label style="display: flex; align-items: center; gap: 8px; padding: 8px; background: #fff5f5; border-radius: 6px; border: 1px solid #fee2e2; cursor: pointer; color: #991b1b;">
            <input type="checkbox" class="symptom anormal" value="constipacao" data-text="ALTERAÇÃO DIGESTÓRIA: Constipação intestinal prolongada com ausência de eliminações gaso-fecais." style="accent-color: #b91c1c;">
            <span style="font-size: 13px; font-weight: 600;">Constipação</span>
          </label>
          <label style="display: flex; align-items: center; gap: 8px; padding: 8px; background: #fff5f5; border-radius: 6px; border: 1px solid #fee2e2; cursor: pointer; color: #991b1b;">
            <input type="checkbox" class="symptom anormal" value="dorabdominal" data-text="ALTERAÇÃO DIGESTÓRIA: Relato de dor abdominal aguda à palpação superficial e profunda." style="accent-color: #b91c1c;">
            <span style="font-size: 13px; font-weight: 600;">Dor abdominal</span>
          </label>
          <label style="display: flex; align-items: center; gap: 8px; padding: 8px; background: #fff5f5; border-radius: 6px; border: 1px solid #fee2e2; cursor: pointer; color: #991b1b;">
            <input type="checkbox" class="symptom anormal" value="distensao" data-text="ALTERAÇÃO DIGESTÓRIA: Exame físico com abdômen visivelmente distendido, timpânico ao exame." style="accent-color: #b91c1c;">
            <span style="font-size: 13px; font-weight: 600;">Abdômen distendido / timpânico</span>
          </label>
        </div>
        <textarea class="sae-obs-livre" data-secao="Digestório" rows="2" placeholder="Observações do sistema digestório (vão para a evolução)..." style="width:100%; margin-top:10px; padding:8px 12px; border:1px solid #d1d5db; border-radius:6px; font-size:13px; box-sizing:border-box; font-family:inherit; background:#fafafa;"></textarea>
      </div>
    </details>

  <!-- SISTEMA RENAL / HIDRATAÇÃO (CORRIGIDO E EXPANDIDO) -->
    <details style="border-radius: 8px; overflow: hidden; margin-bottom: 12px; box-shadow: 0 2px 6px rgba(0,0,0,0.02); background: #ffffff; border: 1px solid #cbd5e1;">
      <summary style="background: linear-gradient(135deg, #e0f2fe 0%, #e0f2fe 100%); padding: 12px 16px; cursor: pointer; font-weight: 700; font-size: 14px; color: #0369a1; display: flex; align-items: center; justify-content: space-between; outline: none; user-select: none;">
        <span>🔵 Sistema Renal e Hidratação</span>
        <span style="font-size: 11px; background: #ffffff; padding: 2px 8px; border-radius: 12px; border: 1px solid #bae6fd;">Clique para abrir</span>
      </summary>
      <div style="padding: 14px; background: #fafafa; border-top: 1px solid #cbd5e1;">
<!-- ACHADOS PADRONIZADOS: 🔵 Sistema Renal e Hidratação -->
<div style="margin:10px 0 14px;border:1px dashed #cbd5e1;border-radius:10px;padding:12px;background:#fafafa;">
  <div style="font-size:12.5px;font-weight:800;color:#14532d;margin-bottom:6px;">✅ Achados de Normalidade — 🔵 Sistema Renal e Hidratação</div>
  <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:6px;margin-bottom:12px;"><label style="display:flex;align-items:center;gap:6px;padding:6px 8px;background:#f0fdf4;border:1px solid #bbf7d0;border-radius:6px;cursor:pointer;color:#14532d;font-size:12.5px;"><input type="checkbox" class="symptom" value="renal_geniturinario_n_diurese_espontanea" data-text="RENAL/GENITURINÁRIO: Diurese espontânea." style="accent-color:#166534;"><span>Diurese espontânea</span></label><label style="display:flex;align-items:center;gap:6px;padding:6px 8px;background:#f0fdf4;border:1px solid #bbf7d0;border-radius:6px;cursor:pointer;color:#14532d;font-size:12.5px;"><input type="checkbox" class="symptom" value="renal_geniturinario_n_urina_clara" data-text="RENAL/GENITURINÁRIO: Urina clara." style="accent-color:#166534;"><span>Urina clara</span></label><label style="display:flex;align-items:center;gap:6px;padding:6px 8px;background:#f0fdf4;border:1px solid #bbf7d0;border-radius:6px;cursor:pointer;color:#14532d;font-size:12.5px;"><input type="checkbox" class="symptom" value="renal_geniturinario_n_sem_disuria" data-text="RENAL/GENITURINÁRIO: Sem disúria." style="accent-color:#166534;"><span>Sem disúria</span></label></div>
  <div style="font-size:12.5px;font-weight:800;color:#991b1b;margin-bottom:6px;">⚠️ Achados de Anormalidade — 🔵 Sistema Renal e Hidratação</div>
  <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:6px;"><label style="display:flex;align-items:center;gap:6px;padding:6px 8px;background:#fff5f5;border:1px solid #fee2e2;border-radius:6px;cursor:pointer;color:#991b1b;font-size:12.5px;"><input type="checkbox" class="symptom anormal" value="renal_geniturinario_a_oliguria" data-text="RENAL/GENITURINÁRIO: Oligúria." style="accent-color:#b91c1c;"><span>Oligúria</span></label><label style="display:flex;align-items:center;gap:6px;padding:6px 8px;background:#fff5f5;border:1px solid #fee2e2;border-radius:6px;cursor:pointer;color:#991b1b;font-size:12.5px;"><input type="checkbox" class="symptom anormal" value="renal_geniturinario_a_anuria" data-text="RENAL/GENITURINÁRIO: Anúria." style="accent-color:#b91c1c;"><span>Anúria</span></label><label style="display:flex;align-items:center;gap:6px;padding:6px 8px;background:#fff5f5;border:1px solid #fee2e2;border-radius:6px;cursor:pointer;color:#991b1b;font-size:12.5px;"><input type="checkbox" class="symptom anormal" value="renal_geniturinario_a_poliuria" data-text="RENAL/GENITURINÁRIO: Poliúria." style="accent-color:#b91c1c;"><span>Poliúria</span></label><label style="display:flex;align-items:center;gap:6px;padding:6px 8px;background:#fff5f5;border:1px solid #fee2e2;border-radius:6px;cursor:pointer;color:#991b1b;font-size:12.5px;"><input type="checkbox" class="symptom anormal" value="renal_geniturinario_a_hematuria" data-text="RENAL/GENITURINÁRIO: Hematúria." style="accent-color:#b91c1c;"><span>Hematúria</span></label><label style="display:flex;align-items:center;gap:6px;padding:6px 8px;background:#fff5f5;border:1px solid #fee2e2;border-radius:6px;cursor:pointer;color:#991b1b;font-size:12.5px;"><input type="checkbox" class="symptom anormal" value="renal_geniturinario_a_disuria" data-text="RENAL/GENITURINÁRIO: Disúria." style="accent-color:#b91c1c;"><span>Disúria</span></label><label style="display:flex;align-items:center;gap:6px;padding:6px 8px;background:#fff5f5;border:1px solid #fee2e2;border-radius:6px;cursor:pointer;color:#991b1b;font-size:12.5px;"><input type="checkbox" class="symptom anormal" value="renal_geniturinario_a_retencao_urinaria" data-text="RENAL/GENITURINÁRIO: Retenção urinária." style="accent-color:#b91c1c;"><span>Retenção urinária</span></label><label style="display:flex;align-items:center;gap:6px;padding:6px 8px;background:#fff5f5;border:1px solid #fee2e2;border-radius:6px;cursor:pointer;color:#991b1b;font-size:12.5px;"><input type="checkbox" class="symptom anormal" value="renal_geniturinario_a_incontinencia_urin" data-text="RENAL/GENITURINÁRIO: Incontinência urinária." style="accent-color:#b91c1c;"><span>Incontinência urinária</span></label></div>
</div>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 10px;">
          <!-- Opção Normal -->
          <label style="display: flex; align-items: center; gap: 8px; padding: 8px; background: #ffffff; border-radius: 6px; border: 1px solid #cbd5e1; cursor: pointer;">
            <input type="checkbox" class="symptom" value="renal_normal" data-text="Renal: Diurese presente, espontânea, de aspecto e coloração habituais, nega queixas." style="accent-color: #166534;">
            <span style="font-size: 13px;">Diurese clara e espontânea (Normal)</span>
          </label>
          <!-- Opções Anormais -->
          <label style="display: flex; align-items: center; gap: 8px; padding: 8px; background: #fff5f5; border-radius: 6px; border: 1px solid #fee2e2; cursor: pointer; color: #991b1b;">
            <input type="checkbox" class="symptom anormal" value="balanco" data-text="ALTERAÇÃO RENAL: Verificado balanço hídrico acumulado marcadamente negativo nas últimas 24h." style="accent-color: #b91c1c;">
            <span style="font-size: 13px; font-weight: 600;">Balanço hídrico negativo</span>
          </label>
          <label style="display: flex; align-items: center; gap: 8px; padding: 8px; background: #fff5f5; border-radius: 6px; border: 1px solid #fee2e2; cursor: pointer; color: #991b1b;">
            <input type="checkbox" class="symptom anormal" value="oliguria" data-text="ALTERAÇÃO RENAL: Paciente apresenta quadro clínico estável de oligúria severa." style="accent-color: #b91c1c;">
            <span style="font-size: 13px; font-weight: 600;">Oligúria</span>
          </label>
          <label style="display: flex; align-items: center; gap: 8px; padding: 8px; background: #fff5f5; border-radius: 6px; border: 1px solid #fee2e2; cursor: pointer; color: #991b1b;">
            <input type="checkbox" class="symptom anormal" value="poliuria" data-text="ALTERAÇÃO RENAL: Apresenta poliúria volumosa com aumento expressivo do débito urinário." style="accent-color: #b91c1c;">
            <span style="font-size: 13px; font-weight: 600;">Poliúria</span>
          </label>
          <label style="display: flex; align-items: center; gap: 8px; padding: 8px; background: #fff5f5; border-radius: 6px; border: 1px solid #fee2e2; cursor: pointer; color: #991b1b;">
            <input type="checkbox" class="symptom anormal" value="nicturia" data-text="ALTERAÇÃO RENAL: Relato de nictúria recorrente com múltiplas interrupções do repouso noturno." style="accent-color: #b91c1c;">
            <span style="font-size: 13px; font-weight: 600;">Nictúria</span>
          </label>
          <label style="display: flex; align-items: center; gap: 8px; padding: 8px; background: #fff5f5; border-radius: 6px; border: 1px solid #fee2e2; cursor: pointer; color: #991b1b;">
            <input type="checkbox" class="symptom anormal" value="disuria" data-text="ALTERAÇÃO RENAL: Paciente refere disúria/ardor miccional ativo ao urinar." style="accent-color: #b91c1c;">
            <span style="font-size: 13px; font-weight: 600;">Disúria / Ardor miccional</span>
          </label>
          <label style="display: flex; align-items: center; gap: 8px; padding: 8px; background: #fff5f5; border-radius: 6px; border: 1px solid #fee2e2; cursor: pointer; color: #991b1b;">
            <input type="checkbox" class="symptom anormal" value="turgor" data-text="ALTERAÇÃO RENAL: Sinais corporais visíveis de desidratação com turgor cutâneo diminuído." style="accent-color: #b91c1c;">
            <span style="font-size: 13px; font-weight: 600;">Turgor cutâneo diminuído</span>
          </label>
        </div>
        <textarea class="sae-obs-livre" data-secao="Renal" rows="2" placeholder="Observações do sistema renal / hidratação (vão para a evolução)..." style="width:100%; margin-top:10px; padding:8px 12px; border:1px solid #d1d5db; border-radius:6px; font-size:13px; box-sizing:border-box; font-family:inherit; background:#fafafa;"></textarea>
      </div>
    </details>
  <!-- SISTEMA DE PELE E MUCOSAS / TEGUMENTAR (TOM SUAVE) -->
    <details style="border-radius: 8px; overflow: hidden; margin-bottom: 12px; box-shadow: 0 2px 6px rgba(0,0,0,0.02); background: #ffffff; border: 1px solid #cbd5e1;">
      <summary style="background: linear-gradient(135deg, #fce7f3 0%, #fce7f3 100%); padding: 12px 16px; cursor: pointer; font-weight: 700; font-size: 14px; color: #9d174d; display: flex; align-items: center; justify-content: space-between; outline: none; user-select: none;">
        <span>🩹 Sistema Tegumentar, Mucosas e Acessos</span>
        <span style="font-size: 11px; background: #ffffff; padding: 2px 8px; border-radius: 12px; border: 1px solid #fbcfe8;">Clique para abrir</span>
      </summary>
      <div style="padding: 14px; background: #fafafa; border-top: 1px solid #cbd5e1;">
<!-- ACHADOS PADRONIZADOS: 🩹 Sistema Tegumentar, Mucosas e Acessos -->
<div style="margin:10px 0 14px;border:1px dashed #cbd5e1;border-radius:10px;padding:12px;background:#fafafa;">
  <div style="font-size:12.5px;font-weight:800;color:#14532d;margin-bottom:6px;">✅ Achados de Normalidade — 🩹 Sistema Tegumentar, Mucosas e Acessos</div>
  <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:6px;margin-bottom:12px;"><label style="display:flex;align-items:center;gap:6px;padding:6px 8px;background:#f0fdf4;border:1px solid #bbf7d0;border-radius:6px;cursor:pointer;color:#14532d;font-size:12.5px;"><input type="checkbox" class="symptom" value="tegumentar_n_pele_integra" data-text="TEGUMENTAR: Pele íntegra." style="accent-color:#166534;"><span>Pele íntegra</span></label><label style="display:flex;align-items:center;gap:6px;padding:6px 8px;background:#f0fdf4;border:1px solid #bbf7d0;border-radius:6px;cursor:pointer;color:#14532d;font-size:12.5px;"><input type="checkbox" class="symptom" value="tegumentar_n_normocorada" data-text="TEGUMENTAR: Normocorada." style="accent-color:#166534;"><span>Normocorada</span></label><label style="display:flex;align-items:center;gap:6px;padding:6px 8px;background:#f0fdf4;border:1px solid #bbf7d0;border-radius:6px;cursor:pointer;color:#14532d;font-size:12.5px;"><input type="checkbox" class="symptom" value="tegumentar_n_hidratada" data-text="TEGUMENTAR: Hidratada." style="accent-color:#166534;"><span>Hidratada</span></label><label style="display:flex;align-items:center;gap:6px;padding:6px 8px;background:#f0fdf4;border:1px solid #bbf7d0;border-radius:6px;cursor:pointer;color:#14532d;font-size:12.5px;"><input type="checkbox" class="symptom" value="tegumentar_n_normotermica" data-text="TEGUMENTAR: Normotérmica." style="accent-color:#166534;"><span>Normotérmica</span></label><label style="display:flex;align-items:center;gap:6px;padding:6px 8px;background:#f0fdf4;border:1px solid #bbf7d0;border-radius:6px;cursor:pointer;color:#14532d;font-size:12.5px;"><input type="checkbox" class="symptom" value="tegumentar_n_turgor_preservado" data-text="TEGUMENTAR: Turgor preservado." style="accent-color:#166534;"><span>Turgor preservado</span></label><label style="display:flex;align-items:center;gap:6px;padding:6px 8px;background:#f0fdf4;border:1px solid #bbf7d0;border-radius:6px;cursor:pointer;color:#14532d;font-size:12.5px;"><input type="checkbox" class="symptom" value="tegumentar_n_elasticidade_preservada" data-text="TEGUMENTAR: Elasticidade preservada." style="accent-color:#166534;"><span>Elasticidade preservada</span></label></div>
  <div style="font-size:12.5px;font-weight:800;color:#991b1b;margin-bottom:6px;">⚠️ Achados de Anormalidade — 🩹 Sistema Tegumentar, Mucosas e Acessos</div>
  <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:6px;"><label style="display:flex;align-items:center;gap:6px;padding:6px 8px;background:#fff5f5;border:1px solid #fee2e2;border-radius:6px;cursor:pointer;color:#991b1b;font-size:12.5px;"><input type="checkbox" class="symptom anormal" value="tegumentar_a_lesoes_cutaneas" data-text="TEGUMENTAR: Lesões cutâneas." style="accent-color:#b91c1c;"><span>Lesões cutâneas</span></label><label style="display:flex;align-items:center;gap:6px;padding:6px 8px;background:#fff5f5;border:1px solid #fee2e2;border-radius:6px;cursor:pointer;color:#991b1b;font-size:12.5px;"><input type="checkbox" class="symptom anormal" value="tegumentar_a_ulceras" data-text="TEGUMENTAR: Úlceras." style="accent-color:#b91c1c;"><span>Úlceras</span></label><label style="display:flex;align-items:center;gap:6px;padding:6px 8px;background:#fff5f5;border:1px solid #fee2e2;border-radius:6px;cursor:pointer;color:#991b1b;font-size:12.5px;"><input type="checkbox" class="symptom anormal" value="tegumentar_a_escoriacoes" data-text="TEGUMENTAR: Escoriações." style="accent-color:#b91c1c;"><span>Escoriações</span></label><label style="display:flex;align-items:center;gap:6px;padding:6px 8px;background:#fff5f5;border:1px solid #fee2e2;border-radius:6px;cursor:pointer;color:#991b1b;font-size:12.5px;"><input type="checkbox" class="symptom anormal" value="tegumentar_a_hematomas" data-text="TEGUMENTAR: Hematomas." style="accent-color:#b91c1c;"><span>Hematomas</span></label><label style="display:flex;align-items:center;gap:6px;padding:6px 8px;background:#fff5f5;border:1px solid #fee2e2;border-radius:6px;cursor:pointer;color:#991b1b;font-size:12.5px;"><input type="checkbox" class="symptom anormal" value="tegumentar_a_petequias" data-text="TEGUMENTAR: Petéquias." style="accent-color:#b91c1c;"><span>Petéquias</span></label><label style="display:flex;align-items:center;gap:6px;padding:6px 8px;background:#fff5f5;border:1px solid #fee2e2;border-radius:6px;cursor:pointer;color:#991b1b;font-size:12.5px;"><input type="checkbox" class="symptom anormal" value="tegumentar_a_equimoses" data-text="TEGUMENTAR: Equimoses." style="accent-color:#b91c1c;"><span>Equimoses</span></label><label style="display:flex;align-items:center;gap:6px;padding:6px 8px;background:#fff5f5;border:1px solid #fee2e2;border-radius:6px;cursor:pointer;color:#991b1b;font-size:12.5px;"><input type="checkbox" class="symptom anormal" value="tegumentar_a_eritema" data-text="TEGUMENTAR: Eritema." style="accent-color:#b91c1c;"><span>Eritema</span></label><label style="display:flex;align-items:center;gap:6px;padding:6px 8px;background:#fff5f5;border:1px solid #fee2e2;border-radius:6px;cursor:pointer;color:#991b1b;font-size:12.5px;"><input type="checkbox" class="symptom anormal" value="tegumentar_a_edema" data-text="TEGUMENTAR: Edema." style="accent-color:#b91c1c;"><span>Edema</span></label><label style="display:flex;align-items:center;gap:6px;padding:6px 8px;background:#fff5f5;border:1px solid #fee2e2;border-radius:6px;cursor:pointer;color:#991b1b;font-size:12.5px;"><input type="checkbox" class="symptom anormal" value="tegumentar_a_descamacao" data-text="TEGUMENTAR: Descamação." style="accent-color:#b91c1c;"><span>Descamação</span></label><label style="display:flex;align-items:center;gap:6px;padding:6px 8px;background:#fff5f5;border:1px solid #fee2e2;border-radius:6px;cursor:pointer;color:#991b1b;font-size:12.5px;"><input type="checkbox" class="symptom anormal" value="tegumentar_a_palidez" data-text="TEGUMENTAR: Palidez." style="accent-color:#b91c1c;"><span>Palidez</span></label><label style="display:flex;align-items:center;gap:6px;padding:6px 8px;background:#fff5f5;border:1px solid #fee2e2;border-radius:6px;cursor:pointer;color:#991b1b;font-size:12.5px;"><input type="checkbox" class="symptom anormal" value="tegumentar_a_cianose" data-text="TEGUMENTAR: Cianose." style="accent-color:#b91c1c;"><span>Cianose</span></label><label style="display:flex;align-items:center;gap:6px;padding:6px 8px;background:#fff5f5;border:1px solid #fee2e2;border-radius:6px;cursor:pointer;color:#991b1b;font-size:12.5px;"><input type="checkbox" class="symptom anormal" value="tegumentar_a_ictericia" data-text="TEGUMENTAR: Icterícia." style="accent-color:#b91c1c;"><span>Icterícia</span></label><label style="display:flex;align-items:center;gap:6px;padding:6px 8px;background:#fff5f5;border:1px solid #fee2e2;border-radius:6px;cursor:pointer;color:#991b1b;font-size:12.5px;"><input type="checkbox" class="symptom anormal" value="tegumentar_a_pele_seca" data-text="TEGUMENTAR: Pele seca." style="accent-color:#b91c1c;"><span>Pele seca</span></label><label style="display:flex;align-items:center;gap:6px;padding:6px 8px;background:#fff5f5;border:1px solid #fee2e2;border-radius:6px;cursor:pointer;color:#991b1b;font-size:12.5px;"><input type="checkbox" class="symptom anormal" value="tegumentar_a_hiperemia" data-text="TEGUMENTAR: Hiperemia." style="accent-color:#b91c1c;"><span>Hiperemia</span></label></div>
</div>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 10px;">
          <!-- Opção Normal -->
          <label style="display: flex; align-items: center; gap: 8px; padding: 8px; background: #ffffff; border-radius: 6px; border: 1px solid #cbd5e1; cursor: pointer;">
            <input type="checkbox" class="symptom" value="pele_normal" data-text="Pele: Íntegra, corada, hidratada, aquecida, sem lesões por pressão evidentes ou sinais flogísticos." style="accent-color: #166534;">
            <span style="font-size: 13px;">Pele íntegra e aquecida (Normal)</span>
          </label>
          <!-- Opções Anormais -->
          <label style="display: flex; align-items: center; gap: 8px; padding: 8px; background: #fff5f5; border-radius: 6px; border: 1px solid #fee2e2; cursor: pointer; color: #991b1b;">
            <input type="checkbox" class="symptom anormal" value="ferida" data-text="ALTERAÇÃO CUTÂNEA: Presença de ferida operatória / LPP ativa em região de apoio." style="accent-color: #b91c1c;">
            <span style="font-size: 13px; font-weight: 600;">Ferida / LPP presente</span>
          </label>
                    <label style="display: flex; align-items: center; gap: 8px; padding: 8px; background: #fff5f5; border-radius: 6px; border: 1px solid #fee2e2; cursor: pointer; color: #991b1b;">
            <input type="checkbox" class="symptom anormal" value="imobilidade" data-text="ALTERAÇÃO CUTÂNEA: Paciente mantido em imobilidade prolongada restrito ao leito." style="accent-color: #b91c1c;">
            <span style="font-size: 13px; font-weight: 600;">Imobilidade no leito</span>
          </label>
          <label style="display: flex; align-items: center; gap: 8px; padding: 8px; background: #fff5f5; border-radius: 6px; border: 1px solid #fee2e2; cursor: pointer; color: #991b1b;">
            <input type="checkbox" class="symptom anormal" value="flogistico_acesso" data-text="ALTERAÇÃO CUTÂNEA: Dispositivo invasivo venoso periférico apresentando sinais flogísticos locais." style="accent-color: #b91c1c;">
            <span style="font-size: 13px; font-weight: 600;">Sinais flogísticos em acesso venoso</span>
          </label>
        </div>

        <!-- Subgrupo: Acesso Venoso -->
        <div style="margin-top:14px; padding:12px; background:#ffffff; border:1px dashed #cbd5e1; border-radius:8px;">
          <strong style="display:block; font-size:13px; color:#9d174d; margin-bottom:8px;">🩸 Acesso Venoso</strong>

          <div style="margin-bottom:8px;">
            <label style="display:inline-flex; align-items:center; gap:6px; font-size:13px; font-weight:600; color:#334155;">
              <input type="checkbox" class="symptom" value="avp" data-text="Acesso Venoso Periférico (AVP) instalado." style="accent-color:#166534;"> AVP
            </label>
            <label style="display:inline-flex; align-items:center; gap:4px; margin-left:10px; font-size:12px;"><input type="checkbox" class="symptom" value="avp_msd" data-text="AVP em MSD." style="accent-color:#166534;"> MSD</label>
            <label style="display:inline-flex; align-items:center; gap:4px; margin-left:6px; font-size:12px;"><input type="checkbox" class="symptom" value="avp_mse" data-text="AVP em MSE." style="accent-color:#166534;"> MSE</label>
          </div>

          <div style="margin-bottom:8px;">
            <label style="display:inline-flex; align-items:center; gap:6px; font-size:13px; font-weight:600; color:#334155;">
              <input type="checkbox" class="symptom" value="vje" data-text="Cateter em Veia Jugular Externa." style="accent-color:#166534;"> Veia Jugular Externa
            </label>
            <label style="display:inline-flex; align-items:center; gap:4px; margin-left:10px; font-size:12px;"><input type="checkbox" class="symptom" value="vje_dir" data-text="VJE à direita." style="accent-color:#166534;"> Dir.</label>
            <label style="display:inline-flex; align-items:center; gap:4px; margin-left:6px; font-size:12px;"><input type="checkbox" class="symptom" value="vje_esq" data-text="VJE à esquerda." style="accent-color:#166534;"> Esq.</label>
          </div>

          <div>
            <label style="display:inline-block; font-size:13px; font-weight:600; color:#334155; margin-bottom:4px;">Acesso Venoso Profundo:</label><br>
            <label style="display:inline-flex; align-items:center; gap:4px; margin-right:8px; font-size:12px;"><input type="checkbox" class="symptom" value="vscd" data-text="AVP - Veia Subclávia Direita (VSCD)." style="accent-color:#166534;"> VSCD</label>
            <label style="display:inline-flex; align-items:center; gap:4px; margin-right:8px; font-size:12px;"><input type="checkbox" class="symptom" value="vsce" data-text="AVP - Veia Subclávia Esquerda (VSCE)." style="accent-color:#166534;"> VSCE</label>
            <label style="display:inline-flex; align-items:center; gap:4px; margin-right:8px; font-size:12px;"><input type="checkbox" class="symptom" value="vjid" data-text="AVP - Veia Jugular Interna Direita (VJID)." style="accent-color:#166534;"> VJID</label>
            <label style="display:inline-flex; align-items:center; gap:4px; margin-right:8px; font-size:12px;"><input type="checkbox" class="symptom" value="vjie" data-text="AVP - Veia Jugular Interna Esquerda (VJIE)." style="accent-color:#166534;"> VJIE</label>
          </div>
        </div>

        <textarea class="sae-obs-livre" data-secao="Tegumentar/Acessos" rows="2" placeholder="Observações do sistema tegumentar e acessos (vão para a evolução)..." style="width:100%; margin-top:10px; padding:8px 12px; border:1px solid #d1d5db; border-radius:6px; font-size:13px; box-sizing:border-box; font-family:inherit; background:#fafafa;"></textarea>
      </div>
    </details>

    <!-- PAINEL DE SINAIS GERAIS (TOM SUAVE) -->
    <details style="border-radius: 8px; overflow: hidden; margin-bottom: 12px; box-shadow: 0 2px 6px rgba(0,0,0,0.02); background: #ffffff; border: 1px solid #cbd5e1;">
      <summary style="background: linear-gradient(135deg, #f1f5f9 0%, #f1f5f9 100%); padding: 12px 16px; cursor: pointer; font-weight: 700; font-size: 14px; color: #334155; display: flex; align-items: center; justify-content: space-between; outline: none; user-select: none;">
        <span>⚪ Sinais Gerais</span>
        <span style="font-size: 11px; background: #ffffff; padding: 2px 8px; border-radius: 12px; border: 1px solid #cbd5e1;">Clique para abrir</span>
      </summary>
      <div style="padding: 14px; background: #fafafa; border-top: 1px solid #cbd5e1;">
<!-- ACHADOS PADRONIZADOS: ⚪ Sinais Gerais -->
<div style="margin:10px 0 14px;border:1px dashed #cbd5e1;border-radius:10px;padding:12px;background:#fafafa;">
  <div style="font-size:12.5px;font-weight:800;color:#14532d;margin-bottom:6px;">✅ Achados de Normalidade — ⚪ Sinais Gerais</div>
  <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:6px;margin-bottom:12px;"><label style="display:flex;align-items:center;gap:6px;padding:6px 8px;background:#f0fdf4;border:1px solid #bbf7d0;border-radius:6px;cursor:pointer;color:#14532d;font-size:12.5px;"><input type="checkbox" class="symptom" value="estado_geral_n_beg_bom_estado_geral" data-text="ESTADO GERAL: BEG (Bom Estado Geral)." style="accent-color:#166534;"><span>BEG (Bom Estado Geral)</span></label><label style="display:flex;align-items:center;gap:6px;padding:6px 8px;background:#f0fdf4;border:1px solid #bbf7d0;border-radius:6px;cursor:pointer;color:#14532d;font-size:12.5px;"><input type="checkbox" class="symptom" value="estado_geral_n_consciente" data-text="ESTADO GERAL: Consciente." style="accent-color:#166534;"><span>Consciente</span></label><label style="display:flex;align-items:center;gap:6px;padding:6px 8px;background:#f0fdf4;border:1px solid #bbf7d0;border-radius:6px;cursor:pointer;color:#14532d;font-size:12.5px;"><input type="checkbox" class="symptom" value="estado_geral_n_orientado_no_tempo_espaco" data-text="ESTADO GERAL: Orientado no tempo, espaço e pessoa." style="accent-color:#166534;"><span>Orientado no tempo, espaço e pessoa</span></label><label style="display:flex;align-items:center;gap:6px;padding:6px 8px;background:#f0fdf4;border:1px solid #bbf7d0;border-radius:6px;cursor:pointer;color:#14532d;font-size:12.5px;"><input type="checkbox" class="symptom" value="estado_geral_n_colaborativo" data-text="ESTADO GERAL: Colaborativo." style="accent-color:#166534;"><span>Colaborativo</span></label><label style="display:flex;align-items:center;gap:6px;padding:6px 8px;background:#f0fdf4;border:1px solid #bbf7d0;border-radius:6px;cursor:pointer;color:#14532d;font-size:12.5px;"><input type="checkbox" class="symptom" value="estado_geral_n_hidratado" data-text="ESTADO GERAL: Hidratado." style="accent-color:#166534;"><span>Hidratado</span></label><label style="display:flex;align-items:center;gap:6px;padding:6px 8px;background:#f0fdf4;border:1px solid #bbf7d0;border-radius:6px;cursor:pointer;color:#14532d;font-size:12.5px;"><input type="checkbox" class="symptom" value="estado_geral_n_corado" data-text="ESTADO GERAL: Corado." style="accent-color:#166534;"><span>Corado</span></label><label style="display:flex;align-items:center;gap:6px;padding:6px 8px;background:#f0fdf4;border:1px solid #bbf7d0;border-radius:6px;cursor:pointer;color:#14532d;font-size:12.5px;"><input type="checkbox" class="symptom" value="estado_geral_n_acianotico" data-text="ESTADO GERAL: Acianótico." style="accent-color:#166534;"><span>Acianótico</span></label><label style="display:flex;align-items:center;gap:6px;padding:6px 8px;background:#f0fdf4;border:1px solid #bbf7d0;border-radius:6px;cursor:pointer;color:#14532d;font-size:12.5px;"><input type="checkbox" class="symptom" value="estado_geral_n_anicterico" data-text="ESTADO GERAL: Anictérico." style="accent-color:#166534;"><span>Anictérico</span></label><label style="display:flex;align-items:center;gap:6px;padding:6px 8px;background:#f0fdf4;border:1px solid #bbf7d0;border-radius:6px;cursor:pointer;color:#14532d;font-size:12.5px;"><input type="checkbox" class="symptom" value="estado_geral_n_afebril" data-text="ESTADO GERAL: Afebril." style="accent-color:#166534;"><span>Afebril</span></label></div>
  <div style="font-size:12.5px;font-weight:800;color:#991b1b;margin-bottom:6px;">⚠️ Achados de Anormalidade — ⚪ Sinais Gerais</div>
  <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:6px;"><label style="display:flex;align-items:center;gap:6px;padding:6px 8px;background:#fff5f5;border:1px solid #fee2e2;border-radius:6px;cursor:pointer;color:#991b1b;font-size:12.5px;"><input type="checkbox" class="symptom anormal" value="estado_geral_a_reg_meg" data-text="ESTADO GERAL: REG/MEG." style="accent-color:#b91c1c;"><span>REG/MEG</span></label><label style="display:flex;align-items:center;gap:6px;padding:6px 8px;background:#fff5f5;border:1px solid #fee2e2;border-radius:6px;cursor:pointer;color:#991b1b;font-size:12.5px;"><input type="checkbox" class="symptom anormal" value="estado_geral_a_torporoso" data-text="ESTADO GERAL: Torporoso." style="accent-color:#b91c1c;"><span>Torporoso</span></label><label style="display:flex;align-items:center;gap:6px;padding:6px 8px;background:#fff5f5;border:1px solid #fee2e2;border-radius:6px;cursor:pointer;color:#991b1b;font-size:12.5px;"><input type="checkbox" class="symptom anormal" value="estado_geral_a_sonolento" data-text="ESTADO GERAL: Sonolento." style="accent-color:#b91c1c;"><span>Sonolento</span></label><label style="display:flex;align-items:center;gap:6px;padding:6px 8px;background:#fff5f5;border:1px solid #fee2e2;border-radius:6px;cursor:pointer;color:#991b1b;font-size:12.5px;"><input type="checkbox" class="symptom anormal" value="estado_geral_a_obnubilado" data-text="ESTADO GERAL: Obnubilado." style="accent-color:#b91c1c;"><span>Obnubilado</span></label><label style="display:flex;align-items:center;gap:6px;padding:6px 8px;background:#fff5f5;border:1px solid #fee2e2;border-radius:6px;cursor:pointer;color:#991b1b;font-size:12.5px;"><input type="checkbox" class="symptom anormal" value="estado_geral_a_confuso" data-text="ESTADO GERAL: Confuso." style="accent-color:#b91c1c;"><span>Confuso</span></label><label style="display:flex;align-items:center;gap:6px;padding:6px 8px;background:#fff5f5;border:1px solid #fee2e2;border-radius:6px;cursor:pointer;color:#991b1b;font-size:12.5px;"><input type="checkbox" class="symptom anormal" value="estado_geral_a_desorientado" data-text="ESTADO GERAL: Desorientado." style="accent-color:#b91c1c;"><span>Desorientado</span></label><label style="display:flex;align-items:center;gap:6px;padding:6px 8px;background:#fff5f5;border:1px solid #fee2e2;border-radius:6px;cursor:pointer;color:#991b1b;font-size:12.5px;"><input type="checkbox" class="symptom anormal" value="estado_geral_a_letargico" data-text="ESTADO GERAL: Letárgico." style="accent-color:#b91c1c;"><span>Letárgico</span></label><label style="display:flex;align-items:center;gap:6px;padding:6px 8px;background:#fff5f5;border:1px solid #fee2e2;border-radius:6px;cursor:pointer;color:#991b1b;font-size:12.5px;"><input type="checkbox" class="symptom anormal" value="estado_geral_a_coma" data-text="ESTADO GERAL: Coma." style="accent-color:#b91c1c;"><span>Coma</span></label><label style="display:flex;align-items:center;gap:6px;padding:6px 8px;background:#fff5f5;border:1px solid #fee2e2;border-radius:6px;cursor:pointer;color:#991b1b;font-size:12.5px;"><input type="checkbox" class="symptom anormal" value="estado_geral_a_desidratado" data-text="ESTADO GERAL: Desidratado." style="accent-color:#b91c1c;"><span>Desidratado</span></label><label style="display:flex;align-items:center;gap:6px;padding:6px 8px;background:#fff5f5;border:1px solid #fee2e2;border-radius:6px;cursor:pointer;color:#991b1b;font-size:12.5px;"><input type="checkbox" class="symptom anormal" value="estado_geral_a_hipocorado" data-text="ESTADO GERAL: Hipocorado." style="accent-color:#b91c1c;"><span>Hipocorado</span></label><label style="display:flex;align-items:center;gap:6px;padding:6px 8px;background:#fff5f5;border:1px solid #fee2e2;border-radius:6px;cursor:pointer;color:#991b1b;font-size:12.5px;"><input type="checkbox" class="symptom anormal" value="estado_geral_a_cianotico" data-text="ESTADO GERAL: Cianótico." style="accent-color:#b91c1c;"><span>Cianótico</span></label><label style="display:flex;align-items:center;gap:6px;padding:6px 8px;background:#fff5f5;border:1px solid #fee2e2;border-radius:6px;cursor:pointer;color:#991b1b;font-size:12.5px;"><input type="checkbox" class="symptom anormal" value="estado_geral_a_icterico" data-text="ESTADO GERAL: Ictérico." style="accent-color:#b91c1c;"><span>Ictérico</span></label><label style="display:flex;align-items:center;gap:6px;padding:6px 8px;background:#fff5f5;border:1px solid #fee2e2;border-radius:6px;cursor:pointer;color:#991b1b;font-size:12.5px;"><input type="checkbox" class="symptom anormal" value="estado_geral_a_febril" data-text="ESTADO GERAL: Febril." style="accent-color:#b91c1c;"><span>Febril</span></label></div>
</div>

        <div style="background:#fffbeb; border-left:4px solid #ca8a04; border-radius:6px; padding:10px 14px; margin-bottom:12px; font-size:12.5px; color:#854d0e; line-height:1.55;">
          <strong style="display:block; margin-bottom:6px;">🌡️ Referência de Temperatura Axilar — marque a faixa observada:</strong>
          <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(220px, 1fr)); gap:6px; margin-top:4px;">
            <label style="display:flex; align-items:center; gap:6px; padding:6px 8px; background:#ffffff; border:1px solid #fde68a; border-radius:6px; cursor:pointer;"><input type="checkbox" class="symptom" value="afebril" data-text="SINAIS GERAIS: Afebril — temperatura axilar entre 36°C e 37,2°C." style="accent-color:#166534;"><span><strong>Afebril:</strong> 36°C a 37,2°C</span></label>
            <label style="display:flex; align-items:center; gap:6px; padding:6px 8px; background:#ffffff; border:1px solid #fde68a; border-radius:6px; cursor:pointer;"><input type="checkbox" class="symptom" value="subfebril" data-text="SINAIS GERAIS: Subfebril — temperatura axilar entre 37,3°C e 37,7°C (ainda não considerada febre)." style="accent-color:#166534;"><span><strong>Subfebril:</strong> 37,3°C a 37,7°C</span></label>
            <label style="display:flex; align-items:center; gap:6px; padding:6px 8px; background:#fff5f5; border:1px solid #fecaca; cursor:pointer; color:#991b1b; border-radius:6px;"><input type="checkbox" class="symptom anormal" value="pirexia" data-text="SINAIS GERAIS: Pirexia — temperatura axilar entre 37,8°C e 38,9°C." style="accent-color:#b91c1c;"><span><strong>Pirexia:</strong> 37,8°C a 38,9°C</span></label>
            <label style="display:flex; align-items:center; gap:6px; padding:6px 8px; background:#fff5f5; border:1px solid #fecaca; cursor:pointer; color:#991b1b; border-radius:6px;"><input type="checkbox" class="symptom anormal" value="hiperpirexia" data-text="SINAIS GERAIS: Hiperpirexia — temperatura axilar acima de 39°C." style="accent-color:#b91c1c;"><span><strong>Hiperpirexia:</strong> acima de 39°C</span></label>
          </div>
        </div>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 10px;">
          <!-- Opções Anormais -->
          <label style="display: flex; align-items: center; gap: 8px; padding: 8px; background: #fff5f5; border-radius: 6px; border: 1px solid #fee2e2; cursor: pointer; color: #991b1b;">
            <input type="checkbox" class="symptom anormal" value="febre" data-text="SINAIS GERAIS: Registrado quadro agudo de hipertermia/febre no leito." style="accent-color: #b91c1c;">
            <span style="font-size: 13px; font-weight: 600;">Febre</span>
          </label>
          <label style="display: flex; align-items: center; gap: 8px; padding: 8px; background: #fff5f5; border-radius: 6px; border: 1px solid #fee2e2; cursor: pointer; color: #991b1b;">
            <input type="checkbox" class="symptom anormal" value="febril" data-text="SINAIS GERAIS: Estado febril / subfebril persistente observado no turno." style="accent-color: #b91c1c;">
            <span style="font-size: 13px; font-weight: 600;">Febril</span>
          </label>
          <label style="display: flex; align-items: center; gap: 8px; padding: 8px; background: #fff5f5; border-radius: 6px; border: 1px solid #fee2e2; cursor: pointer; color: #991b1b;">
            <input type="checkbox" class="symptom anormal" value="fadiga" data-text="SINAIS GERAIS: Relato de fadiga extrema e astenia incapacitante." style="accent-color: #b91c1c;">
            <span style="font-size: 13px; font-weight: 600;">Fadiga</span>
          </label>
          <label style="display: flex; align-items: center; gap: 8px; padding: 8px; background: #fff5f5; border-radius: 6px; border: 1px solid #fee2e2; cursor: pointer; color: #991b1b;">
            <input type="checkbox" class="symptom anormal" value="dor" data-text="SINAIS GERAIS: Queixa ativa de dor corporal referida em barra." style="accent-color: #b91c1c;">
            <span style="font-size: 13px; font-weight: 600;">Dor</span>
          </label>
          <label style="display: flex; align-items: center; gap: 8px; padding: 8px; background: #fff5f5; border-radius: 6px; border: 1px solid #fee2e2; cursor: pointer; color: #991b1b;">
            <input type="checkbox" class="symptom anormal" value="ansiedade" data-text="SINAIS GERAIS: Crise aguda de ansiedade acompanhada de angústia referida." style="accent-color: #b91c1c;">
            <span style="font-size: 13px; font-weight: 600;">Ansiedade</span>
          </label>
          <label style="display: flex; align-items: center; gap: 8px; padding: 8px; background: #fff5f5; border-radius: 6px; border: 1px solid #fee2e2; cursor: pointer; color: #991b1b;">
            <input type="checkbox" class="symptom anormal" value="dm" data-text="SINAIS GERAIS: Descompensação metabólica relacionada à DM crônica." style="accent-color: #b91c1c;">
            <span style="font-size: 13px; font-weight: 600;">DM Descompensada</span>
          </label>
          <label style="display: flex; align-items: center; gap: 8px; padding: 8px; background: #fff5f5; border-radius: 6px; border: 1px solid #fee2e2; cursor: pointer; color: #991b1b;">
            <input type="checkbox" class="symptom anormal" value="queda" data-text="SINAIS GERAIS: Alto risco de quedas detectado devido à fragilidade geral." style="accent-color: #b91c1c;">
            <span style="font-size: 13px; font-weight: 600;">Risco de queda</span>
          </label>
        </div>
        <div style="margin-top:14px;background:linear-gradient(135deg,#f0f9ff 0%,#e0f2fe 100%);border:1px solid #bae6fd;border-radius:10px;padding:12px 14px;">
          <div style="font-size:12.5px;font-weight:700;color:#075985;margin-bottom:10px;">&#128207; Avalia&ccedil;&atilde;o Antropom&eacute;trica e Condi&ccedil;&otilde;es F&iacute;sicas Vis&iacute;veis</div>
          <div style="margin-bottom:10px;">
            <label style="font-size:12px;font-weight:600;color:#075985;display:block;margin-bottom:4px;">Avalia&ccedil;&atilde;o Antropom&eacute;trica:</label>
            <textarea id="avaliacaoAntropometrica" rows="2" placeholder="Peso, altura, IMC, circunfer&ecirc;ncia abdominal, panturrilha, perda ponderal..." style="width:100%;padding:8px 12px;border:1px solid #bae6fd;border-radius:6px;font-size:13.5px;box-sizing:border-box;font-family:inherit;resize:vertical;background:#ffffff;"></textarea>
          </div>
          <div>
            <label style="font-size:12px;font-weight:600;color:#075985;display:block;margin-bottom:4px;">Condi&ccedil;&otilde;es F&iacute;sicas Vis&iacute;veis:</label>
            <textarea id="condicoesFisicasVisiveis" rows="2" placeholder="Higiene, mobilidade, feridas, dispositivos, palidez, edema, f&aacute;cies..." style="width:100%;padding:8px 12px;border:1px solid #bae6fd;border-radius:6px;font-size:13.5px;box-sizing:border-box;font-family:inherit;resize:vertical;background:#ffffff;"></textarea>
          </div>
        </div>

      </div>
    </details>

  </div>
</div>

<details style="background:linear-gradient(135deg,#f0f9ff 0%,#ecfeff 100%);border:1px solid #bae6fd;border-radius:12px;margin-bottom:24px;overflow:hidden;box-shadow:0 4px 16px rgba(2,132,199,0.06);">
  <summary style="cursor:pointer;list-style:none;padding:14px 20px;font-size:15px;font-weight:700;color:#075985;background:linear-gradient(135deg,#e0f2fe 0%,#cffafe 100%);">&#128300; Exames Complementares</summary>
  <div style="padding:20px;">
    <p style="margin:0 0 14px 0;font-size:12.5px;color:#0369a1;">Informa&ccedil;&otilde;es que validam, complementam ou quantificam as suspeitas cl&iacute;nicas levantadas na anamnese e no exame f&iacute;sico. Tudo que for escrito aqui tamb&eacute;m alimenta a pesquisa de diagn&oacute;sticos.</p>
    <div style="margin-bottom:14px;">
      <label style="font-size:12.5px;font-weight:600;color:#075985;display:block;margin-bottom:4px;">Exames Laboratoriais:</label>
      <textarea id="examesLaboratoriais" rows="2" placeholder="Hemograma, eletr&oacute;litos, fun&ccedil;&atilde;o renal, glicemia, PCR, gasometria..." style="width:100%;padding:8px 12px;border:1px solid #bae6fd;border-radius:6px;font-size:13.5px;box-sizing:border-box;font-family:inherit;resize:vertical;background:#ffffff;"></textarea>
    </div>
    <div style="margin-bottom:14px;">
      <label style="font-size:12.5px;font-weight:600;color:#075985;display:block;margin-bottom:4px;">Exames de Imagem (laudos):</label>
      <textarea id="examesImagem" rows="2" placeholder="Raio-X, tomografia, ultrassonografia, ecocardiograma &mdash; resumo dos laudos..." style="width:100%;padding:8px 12px;border:1px solid #bae6fd;border-radius:6px;font-size:13.5px;box-sizing:border-box;font-family:inherit;resize:vertical;background:#ffffff;"></textarea>
    </div>
    <div>
      <label style="font-size:12.5px;font-weight:600;color:#075985;display:block;margin-bottom:4px;">Hist&oacute;rico de Prontu&aacute;rio:</label>
      <textarea id="historicoProntuario" rows="2" placeholder="Evolu&ccedil;&otilde;es anteriores, intercorr&ecirc;ncias do plant&atilde;o, condutas m&eacute;dicas em curso..." style="width:100%;padding:8px 12px;border:1px solid #bae6fd;border-radius:6px;font-size:13.5px;box-sizing:border-box;font-family:inherit;resize:vertical;background:#ffffff;"></textarea>
    </div>
  </div>
</details>

<div style="background: #ffffff; border-radius: 12px; margin-bottom: 24px; box-shadow: 0 4px 16px rgba(0,0,0,0.04); overflow: hidden; border: 1px solid #e5e7eb;">
  <div style="background: linear-gradient(135deg, #14532d 0%, #166534 100%); color: #ffffff; padding: 14px 20px; font-size: 16px; font-weight: 700;"><span>&#129504; 2. An&aacute;lise de Sinais, Sintomas e Sugest&otilde;es</span></div>
  <div style="padding: 20px;">
    <div style="margin-bottom:14px;background:linear-gradient(135deg,#fefce8 0%,#fef9c3 100%);border:1px solid #fde68a;border-radius:10px;padding:12px 14px;">
      <div style="font-size:12.5px;font-weight:700;color:#14532d;margin-bottom:8px;">&#9889; Sinais Cl&iacute;nicos Cadastrados (clique para adicionar):</div>
      <div id="sae-sinais-chips" style="display:flex;flex-wrap:wrap;gap:6px;">
        <button type="button" class="sae-sinal-chip" data-sinal="Hipertermia / Pirexia" style="background:#f0fdf4;border:1px solid #bbf7d0;color:#14532d;padding:5px 10px;border-radius:14px;font-size:11.5px;cursor:pointer;font-weight:600;">Hipertermia / Pirexia</button>
        <button type="button" class="sae-sinal-chip" data-sinal="Taquicardia" style="background:#f0fdf4;border:1px solid #bbf7d0;color:#14532d;padding:5px 10px;border-radius:14px;font-size:11.5px;cursor:pointer;font-weight:600;">Taquicardia</button>
        <button type="button" class="sae-sinal-chip" data-sinal="Bradicardia" style="background:#f0fdf4;border:1px solid #bbf7d0;color:#14532d;padding:5px 10px;border-radius:14px;font-size:11.5px;cursor:pointer;font-weight:600;">Bradicardia</button>
        <button type="button" class="sae-sinal-chip" data-sinal="Taquipneia" style="background:#f0fdf4;border:1px solid #bbf7d0;color:#14532d;padding:5px 10px;border-radius:14px;font-size:11.5px;cursor:pointer;font-weight:600;">Taquipneia</button>
        <button type="button" class="sae-sinal-chip" data-sinal="Bradipneia" style="background:#f0fdf4;border:1px solid #bbf7d0;color:#14532d;padding:5px 10px;border-radius:14px;font-size:11.5px;cursor:pointer;font-weight:600;">Bradipneia</button>
        <button type="button" class="sae-sinal-chip" data-sinal="Hipertens&atilde;o" style="background:#f0fdf4;border:1px solid #bbf7d0;color:#14532d;padding:5px 10px;border-radius:14px;font-size:11.5px;cursor:pointer;font-weight:600;">Hipertens&atilde;o</button>
        <button type="button" class="sae-sinal-chip" data-sinal="Hipotens&atilde;o" style="background:#f0fdf4;border:1px solid #bbf7d0;color:#14532d;padding:5px 10px;border-radius:14px;font-size:11.5px;cursor:pointer;font-weight:600;">Hipotens&atilde;o</button>
        <button type="button" class="sae-sinal-chip" data-sinal="Dispneia" style="background:#f0fdf4;border:1px solid #bbf7d0;color:#14532d;padding:5px 10px;border-radius:14px;font-size:11.5px;cursor:pointer;font-weight:600;">Dispneia</button>
        <button type="button" class="sae-sinal-chip" data-sinal="Dessatura&ccedil;&atilde;o de oxig&ecirc;nio" style="background:#f0fdf4;border:1px solid #bbf7d0;color:#14532d;padding:5px 10px;border-radius:14px;font-size:11.5px;cursor:pointer;font-weight:600;">Dessatura&ccedil;&atilde;o</button>
        <button type="button" class="sae-sinal-chip" data-sinal="Tosse produtiva" style="background:#f0fdf4;border:1px solid #bbf7d0;color:#14532d;padding:5px 10px;border-radius:14px;font-size:11.5px;cursor:pointer;font-weight:600;">Tosse produtiva</button>
        <button type="button" class="sae-sinal-chip" data-sinal="Cianose" style="background:#f0fdf4;border:1px solid #bbf7d0;color:#14532d;padding:5px 10px;border-radius:14px;font-size:11.5px;cursor:pointer;font-weight:600;">Cianose</button>
        <button type="button" class="sae-sinal-chip" data-sinal="Palidez cut&acirc;nea" style="background:#f0fdf4;border:1px solid #bbf7d0;color:#14532d;padding:5px 10px;border-radius:14px;font-size:11.5px;cursor:pointer;font-weight:600;">Palidez cut&acirc;nea</button>
        <button type="button" class="sae-sinal-chip" data-sinal="Edema" style="background:#f0fdf4;border:1px solid #bbf7d0;color:#14532d;padding:5px 10px;border-radius:14px;font-size:11.5px;cursor:pointer;font-weight:600;">Edema</button>
        <button type="button" class="sae-sinal-chip" data-sinal="Dor aguda" style="background:#f0fdf4;border:1px solid #bbf7d0;color:#14532d;padding:5px 10px;border-radius:14px;font-size:11.5px;cursor:pointer;font-weight:600;">Dor aguda</button>
        <button type="button" class="sae-sinal-chip" data-sinal="Dor cr&ocirc;nica" style="background:#f0fdf4;border:1px solid #bbf7d0;color:#14532d;padding:5px 10px;border-radius:14px;font-size:11.5px;cursor:pointer;font-weight:600;">Dor cr&ocirc;nica</button>
        <button type="button" class="sae-sinal-chip" data-sinal="N&aacute;usea e v&ocirc;mito" style="background:#f0fdf4;border:1px solid #bbf7d0;color:#14532d;padding:5px 10px;border-radius:14px;font-size:11.5px;cursor:pointer;font-weight:600;">N&aacute;usea / v&ocirc;mito</button>
        <button type="button" class="sae-sinal-chip" data-sinal="Diarreia" style="background:#f0fdf4;border:1px solid #bbf7d0;color:#14532d;padding:5px 10px;border-radius:14px;font-size:11.5px;cursor:pointer;font-weight:600;">Diarreia</button>
        <button type="button" class="sae-sinal-chip" data-sinal="Constipa&ccedil;&atilde;o intestinal" style="background:#f0fdf4;border:1px solid #bbf7d0;color:#14532d;padding:5px 10px;border-radius:14px;font-size:11.5px;cursor:pointer;font-weight:600;">Constipa&ccedil;&atilde;o</button>
        <button type="button" class="sae-sinal-chip" data-sinal="Distens&atilde;o abdominal" style="background:#f0fdf4;border:1px solid #bbf7d0;color:#14532d;padding:5px 10px;border-radius:14px;font-size:11.5px;cursor:pointer;font-weight:600;">Distens&atilde;o abdominal</button>
        <button type="button" class="sae-sinal-chip" data-sinal="Olig&uacute;ria" style="background:#f0fdf4;border:1px solid #bbf7d0;color:#14532d;padding:5px 10px;border-radius:14px;font-size:11.5px;cursor:pointer;font-weight:600;">Olig&uacute;ria</button>
        <button type="button" class="sae-sinal-chip" data-sinal="Incontin&ecirc;ncia urin&aacute;ria" style="background:#f0fdf4;border:1px solid #bbf7d0;color:#14532d;padding:5px 10px;border-radius:14px;font-size:11.5px;cursor:pointer;font-weight:600;">Incontin&ecirc;ncia urin&aacute;ria</button>
        <button type="button" class="sae-sinal-chip" data-sinal="Les&atilde;o por press&atilde;o" style="background:#f0fdf4;border:1px solid #bbf7d0;color:#14532d;padding:5px 10px;border-radius:14px;font-size:11.5px;cursor:pointer;font-weight:600;">Les&atilde;o por press&atilde;o</button>
        <button type="button" class="sae-sinal-chip" data-sinal="Ferida operat&oacute;ria" style="background:#f0fdf4;border:1px solid #bbf7d0;color:#14532d;padding:5px 10px;border-radius:14px;font-size:11.5px;cursor:pointer;font-weight:600;">Ferida operat&oacute;ria</button>
        <button type="button" class="sae-sinal-chip" data-sinal="Pele ressecada e prurido" style="background:#f0fdf4;border:1px solid #bbf7d0;color:#14532d;padding:5px 10px;border-radius:14px;font-size:11.5px;cursor:pointer;font-weight:600;">Pele ressecada / prurido</button>
        <button type="button" class="sae-sinal-chip" data-sinal="Confus&atilde;o mental" style="background:#f0fdf4;border:1px solid #bbf7d0;color:#14532d;padding:5px 10px;border-radius:14px;font-size:11.5px;cursor:pointer;font-weight:600;">Confus&atilde;o mental</button>
        <button type="button" class="sae-sinal-chip" data-sinal="Agita&ccedil;&atilde;o psicomotora" style="background:#f0fdf4;border:1px solid #bbf7d0;color:#14532d;padding:5px 10px;border-radius:14px;font-size:11.5px;cursor:pointer;font-weight:600;">Agita&ccedil;&atilde;o psicomotora</button>
        <button type="button" class="sae-sinal-chip" data-sinal="Sonol&ecirc;ncia" style="background:#f0fdf4;border:1px solid #bbf7d0;color:#14532d;padding:5px 10px;border-radius:14px;font-size:11.5px;cursor:pointer;font-weight:600;">Sonol&ecirc;ncia</button>
        <button type="button" class="sae-sinal-chip" data-sinal="Ansiedade" style="background:#f0fdf4;border:1px solid #bbf7d0;color:#14532d;padding:5px 10px;border-radius:14px;font-size:11.5px;cursor:pointer;font-weight:600;">Ansiedade</button>
        <button type="button" class="sae-sinal-chip" data-sinal="Risco de queda" style="background:#f0fdf4;border:1px solid #bbf7d0;color:#14532d;padding:5px 10px;border-radius:14px;font-size:11.5px;cursor:pointer;font-weight:600;">Risco de queda</button>
        <button type="button" class="sae-sinal-chip" data-sinal="Mobilidade prejudicada" style="background:#f0fdf4;border:1px solid #bbf7d0;color:#14532d;padding:5px 10px;border-radius:14px;font-size:11.5px;cursor:pointer;font-weight:600;">Mobilidade prejudicada</button>
        <button type="button" class="sae-sinal-chip" data-sinal="Desidrata&ccedil;&atilde;o" style="background:#f0fdf4;border:1px solid #bbf7d0;color:#14532d;padding:5px 10px;border-radius:14px;font-size:11.5px;cursor:pointer;font-weight:600;">Desidrata&ccedil;&atilde;o</button>
        <button type="button" class="sae-sinal-chip" data-sinal="Hipoglicemia" style="background:#f0fdf4;border:1px solid #bbf7d0;color:#14532d;padding:5px 10px;border-radius:14px;font-size:11.5px;cursor:pointer;font-weight:600;">Hipoglicemia</button>
        <button type="button" class="sae-sinal-chip" data-sinal="Hiperglicemia" style="background:#f0fdf4;border:1px solid #bbf7d0;color:#14532d;padding:5px 10px;border-radius:14px;font-size:11.5px;cursor:pointer;font-weight:600;">Hiperglicemia</button>
        <button type="button" class="sae-sinal-chip" data-sinal="Inapet&ecirc;ncia" style="background:#f0fdf4;border:1px solid #bbf7d0;color:#14532d;padding:5px 10px;border-radius:14px;font-size:11.5px;cursor:pointer;font-weight:600;">Inapet&ecirc;ncia</button>
        <button type="button" class="sae-sinal-chip" data-sinal="Ins&ocirc;nia" style="background:#f0fdf4;border:1px solid #bbf7d0;color:#14532d;padding:5px 10px;border-radius:14px;font-size:11.5px;cursor:pointer;font-weight:600;">Ins&ocirc;nia</button>
      </div>
    </div>
    <label style="font-size: 12.5px; font-weight: 600; color: #14532d; display: block; margin-bottom: 4px;">Sinais e Sintomas Consolidados:</label>
    <textarea id="txt-sinais-sintomas-consolidados" rows="5" placeholder="Tudo que voc&ecirc; marcar ou escrever na anamnese e no exame f&iacute;sico aparece aqui automaticamente. Complemente com outros sinais e clique em gerar." style="width: 100%; padding: 10px 12px; border: 1px solid #d1d5db; border-radius: 8px; font-size: 13.5px; box-sizing: border-box; font-family: inherit; resize: vertical; background: #fafafa;"></textarea>
    <button type="button" id="btn-gerar-diagnosticos" style="margin-top: 12px; width: 100%; background: linear-gradient(135deg, #14532d 0%, #166534 100%); color: #ffffff; border: none; border-radius: 10px; padding: 12px 18px; font-size: 14px; font-weight: 700; cursor: pointer;">&#128270; Gerar Diagn&oacute;sticos de Enfermagem</button>
    <div id="step3" style="margin-top: 12px; font-size: 12px; color: #4b5563;"><div></div></div>
    <div id="diagnosisCounter" style="margin-top: 8px; font-size: 12.5px; font-weight: 700; color: #14532d;"></div>
    <div id="painel-vazio-diagnosticos" style="margin-top: 12px; background: #f9fafb; border: 1px dashed #cbd5e1; border-radius: 8px; padding: 14px; font-size: 12.5px; color: #6b7280; text-align: center;">Nenhum diagn&oacute;stico gerado ainda. Preencha a anamnese e clique no bot&atilde;o acima.</div>
    <div id="grade-diagnosticos-prioridade" style="margin-top: 12px;"></div>
  </div>
</div>

<div style="background: #ffffff; border-radius: 12px; margin-bottom: 24px; box-shadow: 0 4px 16px rgba(0,0,0,0.04); overflow: hidden; border: 1px solid #e5e7eb;">
  <div style="background: linear-gradient(135deg, #14532d 0%, #166534 100%); color: #ffffff; padding: 14px 20px; font-size: 16px; font-weight: 700;"><span>&#128203; 3. Plano de Prescri&ccedil;&atilde;o de Enfermagem</span></div>
  <div style="padding: 20px;">
    <p style="margin: 0 0 12px 0; font-size: 12.5px; color: #4b5563;">Marque os diagn&oacute;sticos priorit&aacute;rios acima e gere o plano de cuidados com resultados esperados e intervalos de checagem.</p>
    <button type="button" id="btn-disparar-prescricao" style="width: 100%; background: linear-gradient(135deg, #14532d 0%, #166534 100%); color: #ffffff; border: none; border-radius: 10px; padding: 12px 18px; font-size: 14px; font-weight: 700; cursor: pointer;">&#128221; Gerar Plano de Prescri&ccedil;&atilde;o</button>
    <div id="step4" style="margin-top: 12px; font-size: 12px; color: #4b5563;"><div></div></div>
    <div id="painel-vazio-prescricao" style="margin-top: 12px; background: #f9fafb; border: 1px dashed #cbd5e1; border-radius: 8px; padding: 14px; font-size: 12.5px; color: #6b7280; text-align: center;">Nenhuma prescri&ccedil;&atilde;o gerada ainda.</div>
    <div id="wrapper-tabela-prescricao" style="display: none; margin-top: 12px; overflow-x: auto;">
      <table style="width: 100%; border-collapse: collapse; font-size: 12.5px;">
        <thead>
          <tr style="background: #f0fdf4; color: #14532d;">
            <th style="border: 1px solid #bbf7d0; padding: 8px; text-align: center; width: 5%;">N&ordm;</th>
            <th style="border: 1px solid #bbf7d0; padding: 8px; text-align: left; width: 40%;">Diagn&oacute;stico de Enfermagem</th>
            <th style="border: 1px solid #bbf7d0; padding: 8px; text-align: left; width: 19%;">Hor&aacute;rio</th>
            <th style="border: 1px solid #bbf7d0; padding: 8px; text-align: left; width: 23%;">Aprazamento</th>
            <th style="border: 1px solid #bbf7d0; padding: 8px; text-align: center; width: 13%;">Prioridade Cl&iacute;nica</th>
          </tr>
        </thead>
        <tbody id="corpo-tabela-prescricao"></tbody>
      </table>
    </div>
  </div>
</div>

<div style="background: #ffffff; border-radius: 12px; margin-bottom: 24px; box-shadow: 0 4px 16px rgba(0,0,0,0.04); overflow: hidden; border: 1px solid #e5e7eb;">
  <div style="background: linear-gradient(135deg, #14532d 0%, #166534 100%); color: #ffffff; padding: 14px 20px; font-size: 16px; font-weight: 700;"><span>&#128220; 4. Consolida&ccedil;&atilde;o da Evolu&ccedil;&atilde;o de Enfermagem</span></div>
  <div style="padding: 20px;">
    <button type="button" id="btn-disparar-evolucao-final" style="width: 100%; background: linear-gradient(135deg, #14532d 0%, #166534 100%); color: #ffffff; border: none; border-radius: 10px; padding: 12px 18px; font-size: 14px; font-weight: 700; cursor: pointer; margin-bottom: 12px;">&#9997;&#65039; Gerar Evolu&ccedil;&atilde;o Consolidada</button>
    <div id="painel-sucesso-evolucao" style="display: none; margin-bottom: 10px; background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 10px 14px; font-size: 12.5px; color: #14532d; font-weight: 600;">Evolu&ccedil;&atilde;o gerada com sucesso.</div>
    <textarea id="txt-evolucao-clinica-mestre" rows="14" placeholder="A evolu&ccedil;&atilde;o consolidada aparece aqui, pronta para revis&atilde;o e exporta&ccedil;&atilde;o." style="width: 100%; padding: 12px; border: 1px solid #d1d5db; border-radius: 8px; font-size: 13px; box-sizing: border-box; font-family: inherit; resize: vertical; background: #fafafa; line-height: 1.6;"></textarea>
  </div>
</div>

<div style="background-color: #f9fafb; border: 1px solid #cbd5e1; border-radius: 8px; padding: 15px; font-size: 12.5px; color: #475569; line-height: 1.5; text-align: justify; display: block; width: 100%; box-sizing: border-box; margin-bottom: 20px;">
    <strong style="display: block; margin-bottom: 4px; font-size: 13px; color: #166534;">⚖️ Amparo Técnico, Ético e Legal do Enfermeiro:</strong>
    • <strong>Resolução COFEN nº 736/2024:</strong> Determina a obrigatoriedade da implementação do Processo de Enfermagem de forma sistemática e registrada em prontuário em todas as instituições de saúde.<br>
    • <strong>Resolução COFEN nº 564/2017:</strong> Estabelece o Código de Ética, garantindo a autonomia privativa do enfermeiro na emissão de diagnósticos e cuidados.
</div>

</div> <!-- FECHAMENTO GERAL DO CONTAINER APP -->
<!-- ======= CÉREBRO DE AUTOMAÇÃO CLINICA (SISTEMA INTEGRADO) ======= -->
<script>
(function() {
    // Variável global para armazenar os textos de achados anormais
    let achadosAnormaisGlobais = [];

    // 1. MONITORAMENTO E CAPTURA EM TEMPO REAL: ANAMNESE -> EVOLUÇÃO
    window.atualizarEvolucaoAutomatica = function() {
        const nome = document.getElementById("nomePaciente").value.trim() || "[Nome Omitido]";
        const idade = document.getElementById("idadePaciente").value.trim() || "[Idade Omitida]";
        const leito = document.getElementById("leitoPaciente").value.trim() || "[Leito]";
        const diagMed = document.getElementById("diagMedico").value.trim() || "[Não Informado]";
        const alergias = document.getElementById("alergias").value.trim() || "Nega alergias";
        const queixa = document.getElementById("queixaPrincipal").value.trim() || "[Não Declarada]";
        const hda = document.getElementById("hda").value.trim() || "[Não Declarada]";
        const medicamentos = document.getElementById("medicamentos").value.trim() || "Nenhum de uso contínuo.";

        // Captura checkboxes de antecedentes
        let antecedentesSelecionados = [];
        document.querySelectorAll(".antecedente-chk:checked").forEach(cb => {
            antecedentesSelecionados.push(cb.value);
        });
        const textoAntecedentes = antecedentesSelecionados.length > 0 ? antecedentesSelecionados.join(", ") : "Nega antecedentes relevantes";

        // Montagem estruturada inicial da caixa de evolução
        let textoEvolucao = "====== RELATÓRIO ADMISSIONAL E EXAME GERAL ======\n";
        textoEvolucao += "Paciente " + nome + ", " + idade + " anos, alocado no leito " + leito + ".\n";
        textoEvolucao += "Diagnóstico Médico Admissional: " + diagMed + ".\n";
        textoEvolucao += "Alergias registradas: " + alergias + ".\n";
        textoEvolucao += "Queixa Principal: " + queixa + ".\n";
        textoEvolucao += "HDA: " + hda + ".\n";
        textoEvolucao += "Antecedentes Patológicos: " + textoAntecedentes + ".\n";
        textoEvolucao += "Medicamentos em uso domiciliar: " + medicamentos + ".\n\n";

        // Adiciona as alterações do Exame Físico coletadas se houver
        if (achadosAnormaisGlobais.length > 0) {
            textoEvolucao += "⚠️ ACHADOS ANORMAIS IDENTIFICADOS NO EXAME FÍSICO:\n";
            achadosAnormaisGlobais.forEach(item => {
                textoEvolucao += "- " + item + "\n";
            });
            textoEvolucao += "\n";
        }

        // Adiciona os diagnósticos priorizados se houver
        let diagnosticosEvolucao = [];
        const prioNeu = document.getElementById("prio_neu").value.trim();
        const prioResp = document.getElementById("prio_resp").value.trim();
        const prioRenal = document.getElementById("prio_renal").value.trim();
        const prioPele = document.getElementById("prio_pele").value.trim();

        if (prioNeu) diagnosticosEvolucao.push({ p: parseInt(prioNeu), t: "Instabilidade Cognitiva e Desorientação" });
        if (prioResp) diagnosticosEvolucao.push({ p: parseInt(prioResp), t: "Instabilidade na Mecânica Ventilatória" });
        if (prioRenal) diagnosticosEvolucao.push({ p: parseInt(prioRenal), t: "Disfunção na Eliminação Urinária/Retenção" });
        if (prioPele) diagnosticosEvolucao.push({ p: parseInt(prioPele), t: "Solução de Continuidade Cutânea" });

        // Ordena os diagnósticos numéricos para exibir na evolução
        diagnosticosEvolucao.sort((a, b) => a.p - b.p);
        if (diagnosticosEvolucao.length > 0) {
            textoEvolucao += "🧠 DIAGNÓSTICOS DE ENFERMAGEM ESTABELECIDOS POR ORDEM:\n";
            diagnosticosEvolucao.forEach(d => {
                textoEvolucao += "Prioridade (" + d.p + "): " + d.t + "\n";
            });
        }

        document.getElementById("txt-evolucao-clinica-mestre").value = textoEvolucao;
    };

    // 2. FUNÇÃO AUXILIAR DE ESCUTA DO EXAME FÍSICO: CONSOLIDAÇÃO DE ANORMALIDADES
    function processarExameFisicoSintomas() {
        achadosAnormaisGlobais = [];
        let chksAnormais = document.querySelectorAll(".symptom.anormal:checked");
        
        chksAnormais.forEach(cb => {
            let textoRelato = cb.getAttribute("data-text");
            if (textoRelato) {
                achadosAnormaisGlobais.push(textoRelato);
            }
        });

        // Alimenta a Textarea do Ponto 3 com as alterações cruas
        const caixaConsolidada = document.getElementById("txt-sinais-sintomas-consolidados");
        if (caixaConsolidada) {
            if (achadosAnormaisGlobais.length > 0) {
                caixaConsolidada.value = achadosAnormaisGlobais.join("\n");
            } else {
                caixaConsolidada.value = "Nenhuma alteração patológica documentada nos sistemas examinados (Paciente estável).";
            }
        }
        
        // Atualiza a grande caixa de evolução em cadeia
        atualizarEvolucaoAutomatica();
    }

    // 3. EVENT LISTENERS DOS CHECKBOXES DO EXAME FÍSICO
    document.addEventListener("DOMContentLoaded", function() {
        // Monitora as caixas do exame para alimentar as automações
        document.querySelectorAll(".symptom").forEach(cb => {
            cb.addEventListener("change", function() {
                processarExameFisicoSintomas();
                
                // Atualização visual do painel de passos (Ativa Passo 2 se tiver cliques)
                const totalChecked = document.querySelectorAll(".symptom:checked").length;
                const step2Div = document.querySelector("#step2 div:first-child");
                if (step2Div) {
                    if (totalChecked > 0) {
                        step2Div.style.background = "#166534";
                        step2Div.style.color = "#ffffff";
                    } else {
                        step2Div.style.background = "#f3f4f6";
                        step2Div.style.color = "#6b7280";
                    }
                }
            });
        });

        // 4. BOTÃO MOTOR: GERAR DIAGNÓSTICOS (SINAIS -> EXIBIÇÃO DE CARD COM CAIXA PRIORIDADE)
        const btnGerarDiag = document.getElementById("btn-gerar-diagnosticos");
        if (btnGerarDiag) {
            btnGerarDiag.addEventListener("click", function(e) {
                e.preventDefault();
                
                // Oculta painel vazio e exibe a grade principal
                document.getElementById("painel-vazio-diagnosticos").style.display = "none";
                document.getElementById("grade-diagnosticos-prioridade").style.display = "flex";

                // Varredura para exibir apenas as matrizes cujos sintomas foram ticados
                document.getElementById("card_diag_neu").style.display = (document.getElementById("c_neuco") || document.querySelector('input[value="desorientacao"]:checked') || document.querySelector('input[value="agitacao"]:checked')) ? "flex" : "none";
                document.getElementById("card_diag_resp").style.display = (document.querySelector('input[value="taquipneia"]:checked') || document.querySelector('input[value="bradipneia"]:checked') || document.querySelector('input[value="alt_ritmo"]:checked') || document.querySelector('input[value="spo2"]:checked')) ? "flex" : "none";
                document.getElementById("card_diag_renal").style.display = (document.querySelector('input[value="oliguria"]:checked') || document.querySelector('input[value="poliuria"]:checked') || document.querySelector('input[value="nicturia"]:checked') || document.querySelector('input[value="edema_mmii"]:checked') || document.querySelector('input[value="edema_mmss"]:checked')) ? "flex" : "none";
                document.getElementById("card_diag_pele").style.display = (document.querySelector('input[value="ferida"]:checked') || document.querySelector('input[value="imobilidade"]:checked') || document.querySelector('input[value="flogistico_acesso"]:checked')) ? "flex" : "none";

                // Atualiza o contador de diagnósticos visíveis
                let cardsVisiveis = 0;
                document.querySelectorAll("#grade-diagnosticos-prioridade > div").forEach(card => {
                    if (window.getComputedStyle(card).display === "flex") cardsVisiveis++;
                });
                document.getElementById("diagnosisCounter").textContent = cardsVisiveis + (cardsVisiveis === 1 ? " diagnóstico" : " diagnósticos");

                // Atualização visual do Passo 3
                const step3Div = document.querySelector("#step3 div:first-child");
                if (step3Div && cardsVisiveis > 0) {
                    step3Div.style.background = "#166534";
                    step3Div.style.color = "#ffffff";
                }

                // Dispara amarração dos inputs de prioridade com a evolução
                document.querySelectorAll(".txt-prioridade-item").forEach(input => {
                    input.addEventListener("input", atualizarEvolucaoAutomatica);
                });

                atualizarEvolucaoAutomatica();
            });
        }

        // 5. BOTÃO CHARMOSO DOURADO: GERAR PRESCRIÇÃO ORDENADA POR PRIORIDADE NUMÉRICA
        const btnGerarPresc = document.getElementById("btn-disparar-prescricao");
        if (btnGerarPresc) {
            btnGerarPresc.addEventListener("click", function(e) {
                e.preventDefault();

                // Captura valores numéricos das caixas de prioridade
                const pNeu = parseInt(document.getElementById("prio_neu").value) || 99;
                const pResp = parseInt(document.getElementById("prio_resp").value) || 99;
                const pRenal = parseInt(document.getElementById("prio_renal").value) || 99;
                const pPele = parseInt(document.getElementById("prio_pele").value) || 99;

                // Mapeia os elementos das linhas correspondentes da tabela
                // CONTINUAÇÃO DA ETAPA 5: MAPEAMENTO E ORDENAÇÃO DE PRIORIDADES
                let mapeamentoLinhas = [
                    { id: "row_prio_neu", peso: pNeu },
                    { id: "row_prio_resp", peso: pResp },
                    { id: "row_prio_renal", peso: pRenal },
                    { id: "row_prio_pele", peso: pPele }
                ];

                // Remove a mensagem de tabela vazia e exibe o painel principal
                document.getElementById("painel-vazio-prescricao").style.display = "none";
                document.getElementById("wrapper-tabela-prescricao").style.display = "block";

                // Filtra apenas os itens que receberam numeração de prioridade pelo enfermeiro
                let ativos = mapeamentoLinhas.filter(item => item.peso !== 99);
                
                if (ativos.length === 0) {
                    alert("Por favor, preencha o número de prioridade (1, 2, 3...) nas caixas dos diagnósticos antes de gerar a tabela!");
                    return;
                }

                // EXECUTA A ORDENAÇÃO MATEMÁTICA NA TELA EM TEMPO REAL (FÓRMULA EXCLUSIVA)
                ativos.sort((a, b) => a.p - b.p);

                const corpoTabela = document.getElementById("corpo-tabela-prescricao");
                
                // Desconecta as linhas do DOM e as reinsere respeitando rigorosamente a ordem numérica
                ativos.forEach((item, index) => {
                    let linhaElemento = document.getElementById(item.id);
                    if (linhaElemento) {
                        linhaElemento.style.display = "table-row";
                        // Altera o número da coluna 'ITEM' acompanhando a prioridade de gravidade
                        linhaElemento.querySelector(".celula-index").textContent = (index + 1);
                        corpoTabela.appendChild(linhaElemento);
                    }
                });

                // Oculta da tabela final as linhas que não foram priorizadas pelo profissional
                mapeamentoLinhas.forEach(item => {
                    if (item.peso === 99) {
                        let linhaOculta = document.getElementById(item.id);
                        if (linhaOculta) linhaOculta.style.display = "none";
                    }
                });

                // Atualização visual do Passo 4 no painel de progresso superior
                const step4Div = document.querySelector("#step4 div:first-child");
                if (step4Div) {
                    step4Div.style.background = "#166534";
                    step4Div.style.color = "#ffffff";
                }
            });
        }

        // =======================================================
        // 6. BOTÃO CHARMOSO DOURADO: COMPILAÇÃO DA EVOLUÇÃO FINAL
        // =======================================================
        const btnGerarEvol = document.getElementById("btn-disparar-evolucao-final");
        if (btnGerarEvol) {
            btnGerarEvol.addEventListener("click", function(e) {
                e.preventDefault();
                
                const painelSucesso = document.getElementById("painel-sucesso-evolucao");
                if (painelSucesso) {
                    painelSucesso.style.display = "block";
                    setTimeout(() => { painelSucesso.style.display = "none"; }, 5000);
                }
                
                alert("✓ Evolução organizada! O texto estruturado no bloco está pronto para a validação oficial no prontuário.");
            });
        }
    });
})();
</script>
