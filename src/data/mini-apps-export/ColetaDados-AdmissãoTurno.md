# Coleta de Dados + Ditado + Admissão de Turno + anotações automáticas 

- **Slug:** `ColetaDados-AdmissãoTurno`
- **Descrição:** Operação e segurança no uso de equipamentos.
- **Tipo:** Assitencia
- **Preço (cents):** 0
- **Gratuito:** False
- **Em breve:** False
- **Ativo:** True
- **Acadêmico:** False | **Técnico:** True | **Enfermeiro:** False
- **Vídeo:** nenhum
- **Áudio:** nenhum
- **Badges:** [{"icon": "", "color": "red", "label": "CERTIFICADO OPCIONAL"}, {"icon": "🔄", "color": "blue", "label": "ATUALIZADO"}, {"icon": "", "color": "purple", "label": "2026"}]

---

<div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 1000px; margin: 0 auto; color: #2c3e50; padding: 12px; background-color: #f4f9fc;">

  <!-- BANNER PRINCIPAL DE IDENTIFICAÇÃO DO PACIENTE -->
  <div style="background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%); border: 1px solid #90caf9; padding: 24px; border-radius: 16px; margin-bottom: 24px; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
    <h2 style="margin: 0 0 16px 0; font-size: 20px; font-weight: 700; color: #1565c0; text-transform: uppercase; letter-spacing: 0.5px; border-bottom: 2px solid #90caf9; padding-bottom: 8px;">
      Coleta de Dados Estruturada e Admissão de Turno
    </h2>
    
    <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 16px; margin-bottom: 12px;">
      <div>
        <label style="font-size: 12px; font-weight: 700; color: #455a64; display: block; margin-bottom: 4px;">Primeiro Nome do Paciente</label>
        <input type="text" id="paciente_nome" oninput="processarProntuarioTecnico()" placeholder="Digite o nome completo" style="width: 100%; box-sizing: border-box; padding: 10px; border: 1px solid #b0bec5; border-radius: 8px; font-size: 14px; background-color: #ffffff;">
      </div>
      <div>
        <label style="font-size: 12px; font-weight: 700; color: #455a64; display: block; margin-bottom: 4px;">Leito:</label>
        <input type="text" id="paciente_leito" oninput="processarProntuarioTecnico()" placeholder="Ex: 204-A" style="width: 100%; box-sizing: border-box; padding: 10px; border: 1px solid #b0bec5; border-radius: 8px; font-size: 14px; background-color: #ffffff;">
      </div>
    </div>

    <div style="font-size: 12px; color: #546e7a; font-style: italic; line-height: 1.5;">
      Nota Técnica: Legislação do Exercício Profissional. Este instrumento destina-se à coleta de dados e anotação imediata das condições gerais do paciente sob responsabilidade do Técnico de Enfermagem no ato da admissão do plantão.
    </div>
  </div>

  <!-- CONTAINER DOS ITENS RECOLHIDOS DE EXAME E COLETA -->
  <div style="display: flex; flex-direction: column; gap: 20px; margin-bottom: 24px;">

    <!-- 1. IDENTIFICAÇÃO E PROCEDÊNCIA -->
    <details style="background-color: #ffffff; border: 1px solid #cfd8dc; border-radius: 12px; padding: 0; box-shadow: 0 2px 6px rgba(0,0,0,0.02); overflow: hidden;">
      <summary style="background-color: #e0f2f1; border-bottom: 1px solid #b2dfdb; padding: 12px 16px; display: flex; align-items: center; justify-content: space-between; cursor: pointer; list-style: none; user-select: none;">
        <span style="font-size: 15px; font-weight: 700; color: #004d40; text-transform: uppercase;">1. Procedência do Paciente</span>
        <span style="background-color: #00796b; color: #ffffff; padding: 6px 14px; border-radius: 6px; font-size: 12px; font-weight: 600;">Clique para Abrir</span>
      </summary>
      
      <div style="padding: 16px;">
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 12px;">
          <label style="display: flex; align-items: center; gap: 10px; font-size: 13.5px; cursor: pointer; padding: 8px; border-radius: 6px; background-color: #fafafa;">
            <input type="radio" name="item_procedencia" value="vinda do plantão anterior" onchange="processarProntuarioTecnico()" checked style="width: 16px; height: 16px; accent-color: #00796b;">
            <span>⬜ Vinda do plantão anterior</span>
          </label>
          <label style="display: flex; align-items: center; gap: 10px; font-size: 13.5px; cursor: pointer; padding: 8px; border-radius: 6px; background-color: #fafafa;">
            <input type="radio" name="item_procedencia" value="transferido de outro setor interno" onchange="processarProntuarioTecnico()" style="width: 16px; height: 16px; accent-color: #00796b;">
            <span>⬜ Transferência de outro setor</span>
          </label>
          <label style="display: flex; align-items: center; gap: 10px; font-size: 13.5px; cursor: pointer; padding: 8px; border-radius: 6px; background-color: #fafafa; grid-column: span 2;">
            <input type="radio" name="item_procedencia" value="admitido na unidade de forma direta" onchange="processarProntuarioTecnico()" style="width: 16px; height: 16px; accent-color: #00796b;">
            <span>⬜ Nova admissão hospitalar direta</span>
          </label>
        </div>
        <textarea id="obs_procedencia" oninput="processarProntuarioTecnico()" placeholder="Adicione observações complementares aqui..." style="width: 100%; box-sizing: border-box; padding: 8px; border: 1px solid #cfd8dc; border-radius: 6px; font-size: 13px; font-family: inherit; height: 60px; resize: none; background-color: #fafbfc;"></textarea>
      </div>
    </details>

    <!-- 2. ESTADO NEUROLÓGICO E CONSCIÊNCIA -->
    <details style="background-color: #ffffff; border: 1px solid #cfd8dc; border-radius: 12px; padding: 0; box-shadow: 0 2px 6px rgba(0,0,0,0.02); overflow: hidden;">
      <summary style="background-color: #e8eaf6; border-bottom: 1px solid #c5cae9; padding: 12px 16px; display: flex; align-items: center; justify-content: space-between; cursor: pointer; list-style: none; user-select: none;">
        <span style="font-size: 15px; font-weight: 700; color: #1a237e; text-transform: uppercase;">2. Estado Neurológico e Consciência</span>
        <span style="background-color: #3f51b5; color: #ffffff; padding: 6px 14px; border-radius: 6px; font-size: 12px; font-weight: 600;">Clique para Abrir</span>
      </summary>

      <div style="padding: 16px;">
        <div style="font-size: 12px; font-weight: 700; color: #5c6bc0; margin-bottom: 6px; text-transform: uppercase;">Nível de Consciência:</div>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 16px;">
          <label style="display: flex; align-items: center; gap: 10px; font-size: 13.5px; cursor: pointer; padding: 8px; border-radius: 6px; background-color: #fafafa;">
            <input type="radio" name="item_consciencia" value="consciente e orientado" onchange="processarProntuarioTecnico()" checked style="width: 16px; height: 16px; accent-color: #3f51b5;">
            <span>⬜ Consciente e orientado</span>
          </label>
          <label style="display: flex; align-items: center; gap: 10px; font-size: 13.5px; cursor: pointer; padding: 8px; border-radius: 6px; background-color: #fafafa;">
            <input type="radio" name="item_consciencia" value="confuso" onchange="processarProntuarioTecnico()" style="width: 16px; height: 16px; accent-color: #3f51b5;">
            <span>⬜ Confuso</span>
          </label>
          <label style="display: flex; align-items: center; gap: 10px; font-size: 13.5px; cursor: pointer; padding: 8px; border-radius: 6px; background-color: #fafafa;">
            <input type="radio" name="item_consciencia" value="sonolento" onchange="processarProntuarioTecnico()" style="width: 16px; height: 16px; accent-color: #3f51b5;">
            <span>⬜ Sonolento / Letárgico</span>
          </label>
          <label style="display: flex; align-items: center; gap: 10px; font-size: 13.5px; cursor: pointer; padding: 8px; border-radius: 6px; background-color: #fafafa;">
            <input type="radio" name="item_consciencia" value="comatoso" onchange="processarProntuarioTecnico()" style="width: 16px; height: 16px; accent-color: #3f51b5;">
            <span>⬜ Comatoso</span>
          </label>
        </div>

        <div style="font-size: 12px; font-weight: 700; color: #5c6bc0; margin-bottom: 6px; text-transform: uppercase;">Humor e Comportamento:</div>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 12px;">
          <label style="display: flex; align-items: center; gap: 10px; font-size: 13.5px; cursor: pointer; padding: 8px; border-radius: 6px; background-color: #fafafa;">
            <input type="radio" name="item_comportamento" value="calmo e cooperativo" onchange="processarProntuarioTecnico()" checked style="width: 16px; height: 16px; accent-color: #3f51b5;">
            <span>⬜ Calmo e cooperativo</span>
          </label>
          <label style="display: flex; align-items: center; gap: 10px; font-size: 13.5px; cursor: pointer; padding: 8px; border-radius: 6px; background-color: #fafafa;">
            <input type="radio" name="item_comportamento" value="agitado e inquieto" onchange="processarProntuarioTecnico()" style="width: 16px; height: 16px; accent-color: #3f51b5;">
            <span>⬜ Agitado e inquieto</span>
          </label>
          <label style="display: flex; align-items: center; gap: 10px; font-size: 13.5px; cursor: pointer; padding: 8px; border-radius: 6px; background-color: #fafafa; grid-column: span 2;">
            <input type="radio" name="item_comportamento" value="ansioso" onchange="processarProntuarioTecnico()" style="width: 16px; height: 16px; accent-color: #3f51b5;">
            <span>⬜ Ansioso ou temeroso</span>
          </label>
        </div>
        <textarea id="obs_neurologico" oninput="processarProntuarioTecnico()" placeholder="Adicione observações complementares aqui..." style="width: 100%; box-sizing: border-box; padding: 8px; border: 1px solid #cfd8dc; border-radius: 6px; font-size: 13px; font-family: inherit; height: 60px; resize: none; background-color: #fafbfc;"></textarea>
      </div>
    </details>

   <!-- INÍCIO DA PARTE 1: ITENS 3 E 4 CORRIGIDOS -->
<div style="display: flex; flex-direction: column; gap: 20px; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; width: 100%;">

  <!-- 3. CONDIÇÕES FÍSICAS GERAIS E PELE -->
  <details style="background-color: #ffffff; border: 1px solid #cfd8dc; border-radius: 12px; padding: 0; box-shadow: 0 2px 6px rgba(0,0,0,0.02); overflow: hidden; width: 100%;">
    <summary style="background-color: #f1f8e9; border-bottom: 1px solid #d1e7dd; padding: 14px 16px; display: flex; align-items: center; justify-content: space-between; cursor: pointer; list-style: none; user-select: none; width: 100%; box-sizing: border-box;">
      <span style="font-size: 15px; font-weight: 700; color: #33691e; text-transform: uppercase; letter-spacing: 0.5px;">3. Condições Físicas Gerais e Pele</span>
      <span style="background-color: #558b2f; color: #ffffff; padding: 6px 14px; border-radius: 6px; font-size: 12px; font-weight: 600; white-space: nowrap;">Clique para Abrir</span>
    </summary>

    <div style="padding: 16px; box-sizing: border-box;">
      <div style="font-size: 12px; font-weight: 700; color: #689f38; margin-bottom: 8px; text-transform: uppercase;">Coloração da Pele e Mucosas:</div>
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 16px;">
        <label style="display: flex; align-items: center; gap: 10px; font-size: 13.5px; cursor: pointer; padding: 8px; border-radius: 6px; background-color: #fafafa;">
          <input type="radio" name="item_pele_cor" value="corado e hidratado" onchange="processarProntuarioTecnico()" checked style="width: 16px; height: 16px; accent-color: #558b2f;">
          <span>⬜ Corado / Normocorado</span>
        </label>
        <label style="display: flex; align-items: center; gap: 10px; font-size: 13.5px; cursor: pointer; padding: 8px; border-radius: 6px; background-color: #fafafa;">
          <input type="radio" name="item_pele_cor" value="pálido" onchange="processarProntuarioTecnico()" style="width: 16px; height: 16px; accent-color: #558b2f;">
          <span>⬜ Pálido / Hipocorado</span>
        </label>
        <label style="display: flex; align-items: center; gap: 10px; font-size: 13.5px; cursor: pointer; padding: 8px; border-radius: 6px; background-color: #fafafa;">
          <input type="radio" name="item_pele_cor" value="cianótico" onchange="processarProntuarioTecnico()" style="width: 16px; height: 16px; accent-color: #558b2f;">
          <span>⬜ Cianótico</span>
        </label>
        <label style="display: flex; align-items: center; gap: 10px; font-size: 13.5px; cursor: pointer; padding: 8px; border-radius: 6px; background-color: #fafafa;">
          <input type="radio" name="item_pele_cor" value="ictérico" onchange="processarProntuarioTecnico()" style="width: 16px; height: 16px; accent-color: #558b2f;">
          <span>⬜ Ictérico</span>
        </label>
      </div>

      <div style="font-size: 12px; font-weight: 700; color: #689f38; margin-bottom: 8px; text-transform: uppercase;">Integridade Cutânea e Mapeamento de Risco:</div>
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 12px;">
        <label style="display: flex; align-items: center; gap: 10px; font-size: 13.5px; cursor: pointer; padding: 8px; border-radius: 6px; background-color: #fafafa; grid-column: span 2;">
          <input type="radio" name="item_pele_integ" value="com pele íntegra e sem lesões" onchange="processarProntuarioTecnico()" checked style="width: 16px; height: 16px; accent-color: #558b2f;">
          <span>⬜ Pele Íntegra (Ausência de quebras ou lesões)</span>
        </label>
        
        <div style="grid-column: span 2; background-color: #f1f8e9; padding: 12px; border-radius: 8px; border: 1px dashed #aeec81; margin-top: 4px; box-sizing: border-box;">
          <div style="font-size: 11px; font-weight: 700; color: #33691e; margin-bottom: 8px; text-transform: uppercase;">Zonas de Pressão Acometidas (Se houver):</div>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
            <label style="display: flex; align-items: center; gap: 8px; font-size: 13px; cursor: pointer;"><input type="checkbox" id="lpp_trocanter_d" onchange="processarProntuarioTecnico()" style="width: 16px; height: 16px; accent-color: #558b2f;"> ⬜ Trocanter D</label>
            <label style="display: flex; align-items: center; gap: 8px; font-size: 13px; cursor: pointer;"><input type="checkbox" id="lpp_trocanter_e" onchange="processarProntuarioTecnico()" style="width: 16px; height: 16px; accent-color: #558b2f;"> ⬜ Trocanter E</label>
            <label style="display: flex; align-items: center; gap: 8px; font-size: 13px; cursor: pointer;"><input type="checkbox" id="lpp_cocci" onchange="processarProntuarioTecnico()" style="width: 16px; height: 16px; accent-color: #558b2f;"> ⬜ Cóccix</label>
            <label style="display: flex; align-items: center; gap: 8px; font-size: 13px; cursor: pointer;"><input type="checkbox" id="lpp_calcaneo_d" onchange="processarProntuarioTecnico()" style="width: 16px; height: 16px; accent-color: #558b2f;"> ⬜ Calcâneo D</label>
            <label style="display: flex; align-items: center; gap: 8px; font-size: 13px; cursor: pointer; grid-column: span 2;"><input type="checkbox" id="lpp_calcaneo_e" onchange="processarProntuarioTecnico()" style="width: 16px; height: 16px; accent-color: #558b2f;"> ⬜ Calcâneo E</label>
          </div>
        </div>
            <label style="display: flex; align-items: center; gap: 10px; font-size: 13.5px; cursor: pointer; padding: 8px; border-radius: 6px; background-color: #fafafa; grid-column: span 2;">
          <input type="checkbox" id="item_pele_escoriacao" onchange="processarProntuarioTecnico()" style="width: 16px; height: 16px; accent-color: #558b2f;">
          <span>⬜ Presença de escoriações, hematomas ou equimoses corporais</span>
        </label>
      </div>
     </div>
          <label style="display: flex; align-items: center; gap: 10px; font-size: 13.5px; cursor: pointer; padding: 8px; border-radius: 6px; background-color: #fafafa; grid-column: span 2;">
          <input type="checkbox" id="item_pele_incisão" onchange="processarProntuarioTecnico()" style="width: 16px; height: 16px; accent-color: #558b2f;">
          <span>⬜ Presença de incisão cirurgica, (descreva local e características no espaço a baixo)</span>
        </label>
          <textarea id="obs_pele" oninput="processarProntuarioTecnico()" placeholder="Adicione observações complementares aqui..." style="width: 100%; box-sizing: border-box; padding: 8px; border: 1px solid #cfd8dc; border-radius: 6px; font-size: 13px; font-family: inherit; height: 60px; resize: none; background-color: #fafbfc;"></textarea>
    </div>
  </details>

  <!-- INÍCIO DO COMPONENTE: ITEM 4 CORRIGIDO EM LARGURA TOTAL -->
<div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; width: 100%; box-sizing: border-box; margin-bottom: 20px;">

  <!-- 4. SINAIS VITAIS E ESCALA DE DOR BIFÁSICA -->
  <details style="background-color: #ffffff; border: 1px solid #cfd8dc; border-radius: 12px; padding: 0; box-shadow: 0 2px 6px rgba(0,0,0,0.02); overflow: hidden; width: 100%;">
    <summary style="background-color: #fff3e0; border-bottom: 1px solid #ffe0b2; padding: 14px 16px; display: flex; align-items: center; justify-content: space-between; cursor: pointer; list-style: none; user-select: none; width: 100%; box-sizing: border-box;">
      <span style="font-size: 15px; font-weight: 700; color: #e65100; text-transform: uppercase; letter-spacing: 0.5px;">4. Sinais Vitais e Graus de Dor</span>
      <span style="background-color: #f57c00; color: #ffffff; padding: 6px 14px; border-radius: 6px; font-size: 12px; font-weight: 600; white-space: nowrap;">Clique para Abrir</span>
    </summary>

    <div style="padding: 16px; box-sizing: border-box; width: 100%;">
      <!-- SINAIS VITAIS EM DUAS COLUNAS EQUILIBRADAS -->
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 16px; width: 100%;">
        <div style="background-color: #fff8e1; padding: 10px; border-radius: 8px; border: 1px solid #ffe082;">
          <label style="font-size: 12px; font-weight: 700; color: #ff8f00; display: block; margin-bottom: 4px;">PA (mmHg):</label>
          <input type="text" id="vit_pa" oninput="processarProntuarioTecnico()" placeholder="Ex: 120/80" style="width: 100%; box-sizing: border-box; padding: 8px; border: 1px solid #cbd5e1; border-radius: 6px; font-size: 13px;">
        </div>
        <div style="background-color: #fff8e1; padding: 10px; border-radius: 8px; border: 1px solid #ffe082;">
          <label style="font-size: 12px; font-weight: 700; color: #ff8f00; display: block; margin-bottom: 4px;">FC (bpm):</label>
          <input type="text" id="vit_fc" oninput="processarProntuarioTecnico()" placeholder="Ex: 72" style="width: 100%; box-sizing: border-box; padding: 8px; border: 1px solid #cbd5e1; border-radius: 6px; font-size: 13px;">
        </div>
        <div style="background-color: #fff8e1; padding: 10px; border-radius: 8px; border: 1px solid #ffe082;">
          <label style="font-size: 12px; font-weight: 700; color: #ff8f00; display: block; margin-bottom: 4px;">FR (ipm):</label>
          <input type="text" id="vit_fr" oninput="processarProntuarioTecnico()" placeholder="Ex: 16" style="width: 100%; box-sizing: border-box; padding: 8px; border: 1px solid #cbd5e1; border-radius: 6px; font-size: 13px;">
        </div>
        <div style="background-color: #fff8e1; padding: 10px; border-radius: 8px; border: 1px solid #ffe082;">
          <label style="font-size: 12px; font-weight: 700; color: #ff8f00; display: block; margin-bottom: 4px;">Temp (°C):</label>
          <input type="text" id="vit_temp" oninput="processarProntuarioTecnico()" placeholder="Ex: 36.5" style="width: 100%; box-sizing: border-box; padding: 8px; border: 1px solid #cbd5e1; border-radius: 6px; font-size: 13px;">
        </div>
        <div style="background-color: #fff8e1; padding: 10px; border-radius: 8px; border: 1px solid #ffe082; grid-column: span 2;">
          <label style="font-size: 12px; font-weight: 700; color: #ff8f00; display: block; margin-bottom: 4px;">SpO₂ (%):</label>
          <input type="text" id="vit_spo2" oninput="processarProntuarioTecnico()" placeholder="Ex: 98" style="width: 100%; box-sizing: border-box; padding: 8px; border: 1px solid #cbd5e1; border-radius: 6px; font-size: 13px;">
        </div>
        <div style="background-color: #fff8e1; padding: 10px; border-radius: 8px; border: 1px solid #ffe082;">
          <label style="font-size: 12px; font-weight: 700; color: #ff8f00; display: block; margin-bottom: 4px;">Glicemia capilar (mg/dL):</label>
          <input type="text" id="vit_glicemia" oninput="processarProntuarioTecnico()" placeholder="Ex: 96" style="width: 100%; box-sizing: border-box; padding: 8px; border: 1px solid #cbd5e1; border-radius: 6px; font-size: 13px;">
       </div>
      </div>

      <!-- ESCALA DE DOR EM DUAS COLUNAS ASSEGURADAS (0-5 ESQUERDA, 6-10 DIREITA) -->
      <div style="font-size: 12px; font-weight: 700; color: #e65100; margin-bottom: 8px; text-transform: uppercase;">Graus de Dor (Relato do Paciente):</div>
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; background-color: #fafafa; padding: 12px; border: 1px solid #e0e0e0; border-radius: 8px; margin-bottom: 12px; box-sizing: border-box; width: 100%;">
        <!-- COLUNA DA ESQUERDA: GRAUS 0 A 5 -->
        <div style="display: flex; flex-direction: column; gap: 8px;">
          <label style="display: flex; align-items: center; gap: 8px; font-size: 13px; cursor: pointer;">
            <input type="radio" name="dor_grau" value="com ausência de queixas álgicas (grau 0)" onchange="processarProntuarioTecnico()" checked style="accent-color: #f57c00;"> ⬜ Grau 0 - Sem Dor
          </label>
          <label style="display: flex; align-items: center; gap: 8px; font-size: 13px; cursor: pointer;">
            <input type="radio" name="dor_grau" value="com queixa de dor leve (grau 1)" onchange="processarProntuarioTecnico()" style="accent-color: #f57c00;"> ⬜ Grau 1
          </label>
          <label style="display: flex; align-items: center; gap: 8px; font-size: 13px; cursor: pointer;">
            <input type="radio" name="dor_grau" value="com queixa de dor leve (grau 2)" onchange="processarProntuarioTecnico()" style="accent-color: #f57c00;"> ⬜ Grau 2
          </label>
          <label style="display: flex; align-items: center; gap: 8px; font-size: 13px; cursor: pointer;">
            <input type="radio" name="dor_grau" value="com queixa de dor leve (grau 3)" onchange="processarProntuarioTecnico()" style="accent-color: #f57c00;"> ⬜ Grau 3 - Dor Leve
          </label>
          <label style="display: flex; align-items: center; gap: 8px; font-size: 13px; cursor: pointer;">
            <input type="radio" name="dor_grau" value="com queixa de dor moderada (grau 4)" onchange="processarProntuarioTecnico()" style="accent-color: #f57c00;"> ⬜ Grau 4
          </label>
          <label style="display: flex; align-items: center; gap: 8px; font-size: 13px; cursor: pointer;">
            <input type="radio" name="dor_grau" value="com queixa de dor moderada (grau 5)" onchange="processarProntuarioTecnico()" style="accent-color: #f57c00;"> ⬜ Grau 5
          </label>
        </div>
        <!-- COLUNA DA DIREITA: GRAUS 6 A 10 -->
        <div style="display: flex; flex-direction: column; gap: 8px;">
          <label style="display: flex; align-items: center; gap: 8px; font-size: 13px; cursor: pointer;">
            <input type="radio" name="dor_grau" value="com queixa de dor moderada (grau 6)" onchange="processarProntuarioTecnico()" style="accent-color: #f57c00;"> ⬜ Grau 6 - Dor Moderada
          </label>
          <label style="display: flex; align-items: center; gap: 8px; font-size: 13px; cursor: pointer;">
            <input type="radio" name="dor_grau" value="com queixa de dor intensa (grau 7)" onchange="processarProntuarioTecnico()" style="accent-color: #f57c00;"> ⬜ Grau 7
          </label>
          <label style="display: flex; align-items: center; gap: 8px; font-size: 13px; cursor: pointer;">
            <input type="radio" name="dor_grau" value="com queixa de dor intensa (grau 8)" onchange="processarProntuarioTecnico()" style="accent-color: #f57c00;"> ⬜ Grau 8
          </label>
          <label style="display: flex; align-items: center; gap: 8px; font-size: 13px; cursor: pointer;">
            <input type="radio" name="dor_grau" value="com queixa de dor intensa (grau 9)" onchange="processarProntuarioTecnico()" style="accent-color: #f57c00;"> ⬜ Grau 9 - Dor Forte
          </label>
          <label style="display: flex; align-items: center; gap: 8px; font-size: 13px; cursor: pointer;">
            <input type="radio" name="dor_grau" value="com queixa de dor insuportável (grau 10)" onchange="processarProntuarioTecnico()" style="accent-color: #f57c00;"> ⬜ Grau 10 - Dor Insuportável
          </label>
        </div>
      </div>
      
      <!-- CAMPO PARA O TÉCNICO ADICIONAR TEXTO LIVRE CASO DESEJE -->
      <textarea id="obs_vitais" oninput="processarProntuarioTecnico()" placeholder="Adicione observações complementares aqui..." style="width: 100%; box-sizing: border-box; padding: 8px; border: 1px solid #cfd8dc; border-radius: 6px; font-size: 13px; font-family: inherit; height: 60px; resize: none; background-color: #fafbfc;"></textarea>
    </div>
  </details>

</div>
<!-- FIM DO COMPONENTE: ITEM 4 -->
<!-- INÍCIO DO COMPONENTE: ITENS 5 E 6 CORRIGIDOS EM LARGURA TOTAL -->
<div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; width: 100%; box-sizing: border-box; display: flex; flex-direction: column; gap: 20px; margin-bottom: 20px;">

  <!-- 5. VERIFICAÇÃO DE DISPOSITIVOS E INSERÇÕES INVASIVAS -->
  <details style="background-color: #ffffff; border: 1px solid #cfd8dc; border-radius: 12px; padding: 0; box-shadow: 0 2px 6px rgba(0,0,0,0.02); overflow: hidden; width: 100%;">
    <summary style="background-color: #f3e5f5; border-bottom: 1px solid #e1bee7; padding: 14px 16px; display: flex; align-items: center; justify-content: space-between; cursor: pointer; list-style: none; user-select: none; width: 100%; box-sizing: border-box;">
      <span style="font-size: 15px; font-weight: 700; color: #4a148c; text-transform: uppercase; letter-spacing: 0.5px;">5. Verificação de Dispositivos Invasivos</span>
      <span style="background-color: #7b1fa2; color: #ffffff; padding: 6px 14px; border-radius: 6px; font-size: 12px; font-weight: 600; white-space: nowrap;">Clique para Abrir</span>
    </summary>

    <div style="padding: 16px; box-sizing: border-box; width: 100%;">
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 12px; width: 100%;">
        
        <!-- OPÇÃO AVP COM DATA DE TROCA INTEGRADA -->
        <div style="grid-column: span 2; background-color: #fafafa; padding: 10px; border-radius: 6px; border: 1px solid #f3e5f5; box-sizing: border-box; width: 100%;">
          <label style="display: flex; align-items: center; gap: 10px; font-size: 13.5px; cursor: pointer; margin-bottom: 6px;">
            <input type="checkbox" id="disp_avp" onchange="processarProntuarioTecnico()" style="width: 16px; height: 16px; accent-color: #7b1fa2;">
            <span>⬜ Acesso Venoso Periférico (AVP) pérvio</span>
          </label>
          <div style="margin-left: 26px;">
            <label style="font-size: 11px; font-weight: 700; color: #7b1fa2; display: inline-block; margin-right: 6px;">Data da Punção/Troca:</label>
            <input type="text" id="disp_avp_data" oninput="processarProntuarioTecnico()" placeholder="DD/MM" style="width: 80px; padding: 4px 6px; border: 1px solid #cbd5e1; border-radius: 4px; font-size: 12px; text-align: center;">
          </div>
        </div>

        <!-- OUTROS DISPOSITIVOS DO ITEM 5 -->
        <label style="display: flex; align-items: center; gap: 10px; font-size: 13.5px; cursor: pointer; padding: 8px; border-radius: 6px; background-color: #fafafa; grid-column: span 2;">
          <input type="checkbox" id="disp_svd" onchange="processarProntuarioTecnico()" style="width: 16px; height: 16px; accent-color: #7b1fa2;">
          <span>⬜ Sonda Vesical de Demora (SVD) locada drenando diurese</span>
        </label>
        
        <label style="display: flex; align-items: center; gap: 10px; font-size: 13.5px; cursor: pointer; padding: 8px; border-radius: 6px; background-color: #fafafa; grid-column: span 2;">
          <input type="checkbox" id="disp_bomba" onchange="processarProntuarioTecnico()" style="width: 16px; height: 16px; accent-color: #7b1fa2;">
          <span>⬜ Infusões contínuas/hidratações em andamento via Bomba</span>
        </label>

          <label style="display: flex; align-items: center; gap: 10px; font-size: 13.5px; cursor: pointer; padding: 8px; border-radius: 6px; background-color: #fafafa; grid-column: span 2;">
          <input type="checkbox" id="disp_dreno" onchange="processarProntuarioTecnico()" style="width: 16px; height: 16px; accent-color: #7b1fa2;">
          <span>⬜ Dreno, (descreva: tipo, local e volume)</span>
        </label>
        
        <label style="display: flex; align-items: center; gap: 10px; font-size: 13.5px; cursor: pointer; padding: 8px; border-radius: 6px; background-color: #fafafa; grid-column: span 2;">
          <input type="checkbox" id="disp_nenhum" onchange="processarProntuarioTecnico()" style="width: 16px; height: 16px; accent-color: #7b1fa2;">
          <span>⬜ Nenhum dispositivo invasivo aparente em leito</span>
        </label>

      </div>
      <!-- NOTA DE OBSERVAÇÃO DO ITEM 5 -->
      <textarea id="obs_dispositivos" oninput="processarProntuarioTecnico()" placeholder="Adicione observações complementares aqui..." style="width: 100%; box-sizing: border-box; padding: 8px; border: 1px solid #cfd8dc; border-radius: 6px; font-size: 13px; font-family: inherit; height: 60px; resize: none; background-color: #fafbfc;"></textarea>
    </div>
  </details>

  <!-- 6. QUEIXAS ATUAIS E ELIMINAÇÕES -->
  <details style="background-color: #ffffff; border: 1px solid #cfd8dc; border-radius: 12px; padding: 0; box-shadow: 0 2px 6px rgba(0,0,0,0.02); overflow: hidden; width: 100%;">
    <summary style="background-color: #e0f7fa; border-bottom: 1px solid #b2ebf2; padding: 14px 16px; display: flex; align-items: center; justify-content: space-between; cursor: pointer; list-style: none; user-select: none; width: 100%; box-sizing: border-box;">
      <span style="font-size: 15px; font-weight: 700; color: #006064; text-transform: uppercase; letter-spacing: 0.5px;">6. Queixas Gerais e Eliminações</span>
      <span style="background-color: #00838f; color: #ffffff; padding: 6px 14px; border-radius: 6px; font-size: 12px; font-weight: 600; white-space: nowrap;">Clique para Abrir</span>
    </summary>

    <div style="padding: 16px; box-sizing: border-box; width: 100%;">
      <!-- SINTOMAS CLINICOS -->
      <div style="font-size: 12px; font-weight: 700; color: #00838f; margin-bottom: 8px; text-transform: uppercase;">Sintomas Clínicos Intercorrentes:</div>
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 16px; width: 100%;">
        <label style="display: flex; align-items: center; gap: 10px; font-size: 13.5px; cursor: pointer; padding: 8px; border-radius: 6px; background-color: #fafafa; grid-column: span 2;">
          <input type="radio" name="item_queixas" value="sem queixas clínicas registradas neste momento" onchange="processarProntuarioTecnico()" checked style="width: 16px; height: 16px; accent-color: #00838f;">
          <span>⬜ Negativa de queixas adicionais no momento</span>
        </label>
        <label style="display: flex; align-items: center; gap: 10px; font-size: 13.5px; cursor: pointer; padding: 8px; border-radius: 6px; background-color: #fafafa; grid-column: span 2;">
          <input type="radio" name="item_queixas" value="com queixas associadas de náuseas, vômitos ou tontura" onchange="processarProntuarioTecnico()" style="width: 16px; height: 16px; accent-color: #00838f;">
          <span>⬜ Presença de sintomas (náuseas/tontura/vômitos)</span>
        </label>
      </div>

      <!-- ELIMINAÇÕES FISIOLÓGICAS DIVIDIDAS EM 2 COLUNAS -->
      <div style="font-size: 12px; font-weight: 700; color: #00838f; margin-bottom: 8px; text-transform: uppercase;">Eliminações Fisiológicas:</div>
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 12px; width: 100%;">
        <label style="display: flex; align-items: center; gap: 10px; font-size: 13.5px; cursor: pointer; padding: 8px; border-radius: 6px; background-color: #fafafa;">
          <input type="radio" name="item_eliminacoes" value="diurese e evacuações presentes e normais para o período" onchange="processarProntuarioTecnico()" checked style="width: 16px; height: 16px; accent-color: #00838f;">
          <span>⬜ Eliminações fisiológicas presentes</span>
        </label>
        <label style="display: flex; align-items: center; gap: 10px; font-size: 13.5px; cursor: pointer; padding: 8px; border-radius: 6px; background-color: #fafafa;">
          <input type="radio" name="item_eliminacoes" value="ausência total de eliminações fisiológicas constatadas até o momento" onchange="processarProntuarioTecnico()" style="width: 16px; height: 16px; accent-color: #00838f;">
          <span>⬜ Eliminações ausentes ou retidas</span>
        </label>
      </div>
      <!-- NOTA DE OBSERVAÇÃO DO ITEM 6 -->
      <textarea id="obs_queixas" oninput="processarProntuarioTecnico()" placeholder="Adicione observações complementares sobre queixas ou eliminações aqui..." style="width: 100%; box-sizing: border-box; padding: 8px; border: 1px solid #cfd8dc; border-radius: 6px; font-size: 13px; font-family: inherit; height: 60px; resize: none; background-color: #fafbfc;"></textarea>
    </div>
  </details>

</div>
<!-- FIM DO COMPONENTE: ITENS 5 E 6 -->
  <!-- BOTÃO PROFISSIONAL DE DISPARO (SOLICITADO) -->
  <div style="width: 100%; text-align: center; margin: 24px 0; box-sizing: border-box;">
    <button type="button" onclick="processarProntuarioTecnico()" style="background-color: #1b5e20; color: #ffffff; border: none; padding: 16px 32px; border-radius: 8px; font-size: 16px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; cursor: pointer; box-shadow: 0 4px 12px rgba(27, 94, 32, 0.2); width: 100%; max-width: 400px; transition: background 0.2s;">
      Gerar Anotação
    </button>
  </div>

  <!-- ESPAÇO DE ANOTAÇÃO FINAL TOTALMENTE EDITÁVEL E AJUSTÁVEL PELO TÉCNICO -->
  <div style="background-color: #ffffff; border: 2px solid #b0bec5; border-radius: 14px; padding: 20px; box-shadow: 0 4px 16px rgba(0,0,0,0.04); width: 100%; box-sizing: border-box; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
    <span style="font-size: 13px; font-weight: 700; color: #455a64; text-transform: uppercase; display: block; margin-bottom: 6px; letter-spacing: 0.5px;">
      Anotação de Enfermagem Gerada (Rascunho Oficial)
    </span>
    <p style="margin: 0 0 14px 0; font-size: 12px; color: #78909c; line-height: 1.4;">
      O texto abaixo reunirá todas as marcações e observações feitas nos itens acima assim que o botão "Gerar Anotação" for clicado. Você possui total autonomia técnica para revisar o relatório, apagar trechos ou digitar novas informações diretamente nesta caixa.
    </p>

    <!-- CAIXA GRANDE DE RASCUNHO EDITÁVEL -->
    <textarea id="anotacao_final_painel" placeholder="Preencha o questionário acima e clique no botão verde para gerar o rascunho da sua anotação..." style="width: 100%; box-sizing: border-box; padding: 16px; border: 1px solid #b0bec5; border-radius: 10px; font-size: 14px; font-family: 'Courier New', Courier, monospace; line-height: 1.6; background-color: #fafbfc; color: #1c2833; min-height: 250px; resize: vertical; font-weight: bold;"></textarea>
    
    <div style="background-color: #f1f8e9; border-left: 4px solid #7cb342; padding: 12px; font-size: 12px; color: #33691e; border-radius: 0 8px 8px 0; margin-top: 12px; line-height: 1.5; font-weight: 500;">
      Aviso de Respaldo Técnico: Após validar e ajustar as informações textuais do rascunho acima, transfira o conteúdo para o prontuário institucional. Encerre o registro aplicando sua assinatura eletrônica ou carimbo físico contendo o número do Coren e a sigla profissional TE (Técnico de Enfermagem).
    </div>
  </div>

</div> <!-- FECHAMENTO COMPLETO DO COMPONENTE DO APP -->

<!-- MOTOR DE TRATAMENTO DE ERROS E CAPTURA DE DADOS -->
<script>
  function processarProntuarioTecnico() {
    try {
      // Captura segura de inputs de texto (Se não existirem, assume padrão limpo)
      const elNome = document.getElementById('paciente_nome');
      const elLeito = document.getElementById('paciente_leito');
      const nomePac = elNome ? (elNome.value.trim() || "NOME NÃO INFORMADO") : "NOME NÃO INFORMADO";
      const leitoPac = elLeito ? (elLeito.value.trim() || "S/L") : "S/L";

      // Captura segura de Radio Buttons (Evita que o código quebre caso nada esteja marcado)
      const rProcedencia = document.querySelector('input[name="item_procedencia"]:checked');
      const rConsciencia = document.querySelector('input[name="item_consciencia"]:checked');
      const rComportamento = document.querySelector('input[name="item_comportamento"]:checked');
      const rPeleCor = document.querySelector('input[name="item_pele_cor"]:checked');
      const rPeleInteg = document.querySelector('input[name="item_pele_integ"]:checked');
      const rDorGrau = document.querySelector('input[name="dor_grau"]:checked');
      const rQueixasGerais = document.querySelector('input[name="item_queixas"]:checked');
      const rEliminacoes = document.querySelector('input[name="item_eliminacoes"]:checked');

      const procedencia = rProcedencia ? rProcedencia.value : "vinda do plantão anterior";
      const consciencia = rConsciencia ? rConsciencia.value : "consciente e orientado";
      const comportamento = rComportamento ? rComportamento.value : "calmo e cooperativo";
      const peleCor = rPeleCor ? rPeleCor.value : "corado e hidratado";
      const peleInteg = rPeleInteg ? rPeleInteg.value : "com pele íntegra e sem lesões";
      const dorGrau = rDorGrau ? rDorGrau.value : "com ausência de queixas álgicas (grau 0)";
      const queixasGerais = rQueixasGerais ? rQueixasGerais.value : "sem queixas clínicas registradas";
      const eliminacoes = rEliminacoes ? rEliminacoes.value : "diurese e evacuações presentes e normais";

      // Mapeamento das LPPs específicas (Item 3B)
      let lppsMarcadas = [];
      const zones = ['trocanter_d', 'trocanter_e', 'cocci', 'calcaneo_d', 'calcaneo_e'];
      zones.forEach(function(zone) {
        const el = document.getElementById('lpp_' + zone);
        if (el && el.checked) {
          let label = zone.replace('_', ' ').toUpperCase();
          if(zone === 'cocci') label = 'CÓCCIX';
          lppsMarcadas.push(label);
        }
      });
      
      const chkEscoriacao = document.getElementById('item_pele_escoriacao');
      let textoLpp = "";
      if (lppsMarcadas.length > 0) {
        textoLpp = " apresentando lesão por pressão (LPP) ativa em regiões de: " + lppsMarcadas.join(", ");
      }
      if (chkEscoriacao && chkEscoriacao.checked) {
        textoLpp += (textoLpp ? " e " : " apresentando ") + "escoriações/hematomas cutâneos visíveis no corpo";
      }

      // Captura de Sinais Vitais Numéricos
      const idsVitais = ['pa', 'fc', 'fr', 'temp', 'spo2'];
      let vitaisData = {};
      idsVitais.forEach(function(id) {
        const el = document.getElementById('vit_' + id);
        vitaisData[id] = el ? el.value.trim() : "";
      });

      // Captura de Dispositivos Invasivos
      const chkAvp = document.getElementById('disp_avp');
      const elAvpData = document.getElementById('disp_avp_data');
      const chkSvd = document.getElementById('disp_svd');
      const chkBomba = document.getElementById('disp_bomba');
      const chkNenhumDisp = document.getElementById('disp_nenhum');

      let dispositivosLista = [];
      if (chkAvp && chkAvp.checked) {
        let stringAvp = "acesso venoso periférico (AVP) pérvio";
        const avpData = elAvpData ? elAvpData.value.trim() : "";
        if (avpData) stringAvp += " puncionado em " + avpData;
        dispositivosLista.push(stringAvp);
      }
      if (chkSvd && chkSvd.checked) dispositivosLista.push("sonda vesical de demora (SVD) locada em sistema fechado drenando diurese clara");
      if (chkBomba && chkBomba.checked) dispositivosLista.push("infusões parenterais contínuas mantidas em bomba de infusão");
      if (chkNenhumDisp && chkNenhumDisp.checked) dispositivosLista.push("livre de cateteres ou dispositivos invasivos aparentes");

      // Captura de Textos Livres de Observação
      const idsObs = ['procedencia', 'neurologico', 'pele', 'vitais', 'dispositivos', 'queixas'];
      let obsData = {};
      idsObs.forEach(function(id) {
        const el = document.getElementById('obs_' + id);
        obsData[id] = el ? el.value.trim() : "";
      });

      // Geração Cronológica de Data e Hora
      const dataAtual = new Date();
      const strData = dataAtual.toLocaleDateString('pt-BR');
      const strHora = dataAtual.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

      // MONTAGEM DO RASCUNHO PROFISSIONAL E FLUIDO
      let laudo = strData + " às " + strHora + "h - Assumido cuidados de assistência do paciente " + nomePac + " no leito " + leitoPac + ", por motivo de " + procedencia + ".";
      if (obsData['procedencia']) laudo += " Nota de procedência: " + obsData['procedencia'] + ".";

      laudo += " Paciente encontra-se estado neurológico " + consciencia + ", mantendo-se " + comportamento + ".";
      if (obsData['neurologico']) laudo += " Nota neurológica: " + obsData['neurologico'] + ".";

      laudo += " Ao exame geral apresenta pele e mucosas com padrão " + peleCor + ", estando " + (textoLpp || peleInteg) + ".";
      if (obsData['pele']) laudo += " Nota de integridade cutânea: " + obsData['pele'] + ".";

      laudo += " Sinais vitais aferidos no início do turno apresentando: ";
      laudo += vitaisData['pa'] ? "PA: " + vitaisData['pa'] + " mmHg, " : "PA: não informada, ";
      laudo += vitaisData['fc'] ? "FC: " + vitaisData['fc'] + " bpm, " : "FC: não informada, ";
      laudo += vitaisData['fr'] ? "FR: " + vitaisData['fr'] + " ipm, " : "FR: não informada, ";
      laudo += vitaisData['temp'] ? "T: " + vitaisData['temp'] + " °C, " : "T: não informada, ";
      laudo += vitaisData['spo2'] ? "SpO₂: " + vitaisData['spo2'] + "%. " : "SpO₂: não informada. ";
      
      laudo += " Avaliação do nível de dor indica paciente " + dorGrau + ".";
      if (obsData['vitais']) laudo += " Nota de sinais vitais/dor: " + obsData['vitais'] + ".";

      if (dispositivosLista.length > 0) {
        laudo += " Identificado em uso de dispositivos assistenciais: " + dispositivosLista.join(", ") + ".";
      }
      if (obsData['dispositivos']) laudo += " Nota de dispositivos: " + obsData['dispositivos'] + ".";

      laudo += " Paciente evolui " + queixasGerais + " e aponta " + eliminacoes + ".";
      if (obsData['queixas']) laudo += " Nota de queixas/eliminações: " + obsData['queixas'] + ".";

      laudo += " Segue sob cuidados e monitorização contínua da equipe técnica de enfermagem.";

      // Injeta com segurança no painel do Lovable
      const painelFinal = document.getElementById('anotacao_final_painel');
      if (painelFinal) {
        painelFinal.value = laudo;
      }
    } catch (err) {
      console.error("Erro na compilação dos dados do plantão:", err);
    }
  }
</script>

