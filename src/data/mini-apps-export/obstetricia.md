# ENFERMAGEM EM OBSTETRÍCIA

- **Slug:** `obstetricia`
- **Descrição:** Anamnese, exame físico no trabalho de parto sem distócia e na internaçlão clinica com agravos. Atendimento hospitalar
- **Tipo:** mensal
- **Preço (cents):** 1990
- **Gratuito:** False
- **Em breve:** False
- **Ativo:** True
- **Acadêmico:** True | **Técnico:** False | **Enfermeiro:** True
- **Vídeo:** nenhum
- **Áudio:** nenhum
- **Badges:** [{"icon": "", "color": "red", "label": "CERTIFICADO OPCIONAL"}, {"icon": "🔄", "color": "blue", "label": "ATUALIZADO"}, {"icon": "", "color": "purple", "label": "2026"}]

---

<div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 900px; margin: 0 auto;">

<!-- CAPA (banner preservado) -->
<div style="background: linear-gradient(135deg, #4a0030 0%, #880e4f 50%, #c2185b 100%); border-radius: 24px; padding: 50px 35px; text-align: center; margin-bottom: 30px; box-shadow: 0 10px 40px rgba(136,14,79,0.35);">
  <div style="font-size: 80px; margin-bottom: 15px; line-height: 1;">🤰</div>
  <h1 style="color:#fff; font-size:32px; margin:0 0 10px 0; letter-spacing:1px;">ENFERMAGEM EM OBSTETRÍCIA</h1>
  <p style="color:#fce4ec; font-size:15px; margin:0; font-style:italic; line-height:1.5;">Anamnese, exame físico, diagnosticos, evolução e prescrição de enfermagem.</p>
</div>

<div style="background: linear-gradient(135deg,#fff9c4 0%, #fff59d 100%); border-left:5px solid #f9a825; border-radius:16px; padding:22px 24px; margin:22px 0 18px 0;">
  <h2 style="color:#795548; margin:0 0 10px 0; font-size:20px;">💛 Papel humanizado e educativo</h2>
  <ul style="margin:0; padding-left:20px; color:#5d4037; line-height:1.8; font-size:15px;">
    <li><b>Vínculo:</b> criar confiança para diminuir medos e ansiedades.</li>
    <li><b>Educação em saúde:</b> explicar aleitamento materno e as fases do trabalho de parto.</li>
    <li><b>Escuta ativa:</b> validar sentimentos, responder dúvidas com clareza.</li>
    <li><b>Autonomia:</b> apresentar o Plano de Parto e respeitar escolhas informadas.</li>
  </ul>
</div>

   
<!-- APP MASTER CORRIGIDO: SAE MATERNIDADE HOSPITALAR SEPARADA (OPÇÃO 1) -->
<div class="lavoble-sae-obstetrica" style="font-family: system-ui, -apple-system, sans-serif; max-width: 850px; margin: 0 auto; padding: 10px; box-sizing: border-box; background-color: #ffffff;">

    <!-- BANNER DE IDENTIFICAÇÃO -->
    <div style="margin-bottom: 20px; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(157, 23, 77, 0.08); border: 1px solid #fbcfe8;">
        <div style="padding: 22px; background: linear-gradient(135deg, #881337 0%, #9d174d 50%, #be185d 100%); color: #ffffff;">
            <div style="font-size: 11px; text-transform: uppercase; letter-spacing: 1.5px; background: rgba(255,255,255,0.15); padding: 4px 12px; border-radius: 20px; display: inline-block; margin-bottom: 10px; font-weight: 600; border: 1px solid rgba(255,255,255,0.2);">Diretriz Rede Alyne / MS 2026</div>
            <h3 style="margin: 0; font-size: 22px; font-weight: 800; letter-spacing: -0.5px; display: flex; align-items: center; gap: 8px;">🤰 Admissão e Raciocínio Clínico Obstétrico</h3>
            <p style="margin: 6px 0 0 0; font-size: 13.5px; color: #fbcfe8; line-height: 1.4;">Diretriz baseada nas resoluções COFEN e Ministério da Saúde. Selecione o perfil para carregar a matriz correspondente.</p>
        </div>
    </div>

     <!-- SELETOR DINÂMICO INTERATIVO -->
    <div style="margin-bottom: 25px; padding: 15px; border: 1px solid #e2e8f0; border-radius: 8px; background-color: #f8fafc; text-align: center;">
        <p style="font-weight: bold; font-size: 14.5px; color: #475569; margin-top: 0; margin-bottom: 15px;">Motivo principal da Admissão Hospitalar da Gestante</p>
        <form style="display: flex; flex-wrap: wrap; gap: 12px; justify-content: center;">
            <style>
                .admissao-pill-btn { display: inline-block; padding: 12px 20px; border-radius: 25px; border: 2px solid #cbd5e1; background: #ffffff; cursor: pointer; font-size: 14px; font-weight: bold; color: #475569; transition: all 0.2s ease; }
                .admissao-pill-btn input { display: none; }
                .pill-tp:has(input:checked) { background-color: #9d174d !important; border-color: #700c31 !important; color: #ffffff !important; box-shadow: 0 4px 6px rgba(157,23,77,0.15); }
                .pill-comp:has(input:checked) { background-color: #0369a1 !important; border-color: #075985 !important; color: #ffffff !important; box-shadow: 0 4px 6px rgba(3,105,161,0.15); }
                
                /* Lógica de Isolamento das Telas Master */
               .tela-fluxo-complicacao { display: none; }
              body:has(input[id="id_comp"]:checked) .tela-fluxo-complicacao { display: block !important; }
            </style>
            </label>
            <label class="admissao-pill-btn pill-comp"><input type="radio" name="filtro_obs_master" id="id_comp"> Internação da gestante por complicação clínica - clique aqui</label>
               </div>
    </div>
</div>
</details>

    <!-- ============================================================= -->
    <!-- TELA AZUL: FLUXO DE COMPLICAÇÃO CLÍNICA / ENFERMARIA DE ALTO RISCO -->
    <!-- ============================================================= -->
    <div class="tela-fluxo-complicacao" style="width: 100%;">
        <div style="margin-bottom: 15px; font-weight: bold; color: #0369a1; font-size: 14.5px; border-left: 4px solid #0369a1; padding-left: 8px; margin-top: 10px;">| Matriz Assistencial: Internação por Agravos Clínicos (Fora de Parto)</div>
        
        <div style="display: flex; flex-direction: column; gap: 10px; width: 100%;">
            
              <!-- TELA AZUL - ABA 1: ANAMNESE CLÍNICA DE INTERNAÇÃO COMPLETA (DIRETRIZ REVISADA MS 2026) -->
            <details open style="border: 1px solid #cbd5e1; border-radius: 8px; overflow: hidden; background: #ffffff; box-shadow: 0 2px 4px rgba(0,0,0,0.01);">
                <summary style="display: flex; justify-content: space-between; align-items: center; padding: 14px 18px; background: linear-gradient(135deg, #fdf2f8 0%, #fbcfe8 100%); color: #9d174d; font-weight: bold; font-size: 14px; cursor: pointer; outline: none; user-select: none;">
                    <span>📋 1. Anamnese, Antecedentes e Rastreio de Agravos Clínicos</span>
                    <span style="font-size: 11px; background: #ffffff; padding: 4px 10px; border-radius: 20px; border: 1px solid #f9a8d4; color: #9d174d; white-space: nowrap;">Clique para fechar</span>
                </summary>
                <div style="padding: 15px; background: #ffffff; border-top: 1px solid #cbd5e1; font-size: 13px; color: #334155; line-height: 1.5;">
                    
                    <!-- 1. IDENTIFICAÇÃO E VULNERABILIDADE SOCIAL (PÁG 6 E 7 DA CADERNETA 2026) -->
                    <p style="margin-top: 0; font-weight: bold; color: #0369a1; margin-bottom: 8px; font-size: 12.5px;">👤 1. Identificação, Vínculo de Rede e Vulnerabilidade:</p>
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 10px; margin-bottom: 12px;">
                        <div><label style="display:block; font-size:11px; font-weight:bold; margin-bottom:2px; color:#475569;">Beneficiária CadÚnico / Bolsa Família:</label>
                            <select style="width:100%; padding:6px; border:1px solid #cbd5e1; border-radius:6px; background:#f8fafc;"><option selected>Não cadastrada</option><option>Sim - Beneficiária Ativa</option></select>
                        </div>
                        <div><label style="display:block; font-size:11px; font-weight:bold; margin-bottom:2px; color:#475569;">Povo ou Comunidade Tradicional (Rede Alyne):</label>
                            <select style="width:100%; padding:6px; border:1px solid #cbd5e1; border-radius:6px; background:#f8fafc;"><option selected>Não se aplica</option><option>Quilombola</option><option>Indígena</option><option>Ribeirinha</option><option>Cigana</option></select>
                        </div>
                        <div><label style="display:block; font-size:11px; font-weight:bold; margin-bottom:2px; color:#475569;">Unidade Básica (UBS) de Origem:</label>
                            <input type="text" placeholder="Ex: Clínica da Família de Origem" style="width:100%; padding:6px; border:1px solid #cbd5e1; border-radius:6px; background:#f8fafc;">
                        </div>
                    </div>

                    <!-- 2. MARCADORES DE TEMPO E CRONOLOGIA GESTACIONAL (PÁG 7 E 8 DA CADERNETA) -->
                    <p style="font-weight: bold; color: #0369a1; margin-bottom: 8px; font-size: 12.5px;">⏱️ 2. Marcadores Temporais e Tempo de Gestação:</p>
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 10px; margin-bottom: 12px;">
                        <div><label style="display:block; font-size:11px; font-weight:bold; margin-bottom:2px; color:#475569;">DUM (Última Menstruação):</label><input type="date" style="width:100%; padding:6px; border:1px solid #cbd5e1; border-radius:6px; background:#f8fafc;"></div>
                        <div><label style="display:block; font-size:11px; font-weight:bold; margin-bottom:2px; color:#475569;">DPP (Data Provável do Parto):</label><input type="date" style="width:100%; padding:6px; border:1px solid #cbd5e1; border-radius:6px; background:#f8fafc;"></div>
                        <div><label style="display:block; font-size:11px; font-weight:bold; margin-bottom:2px; color:#475569;">Histórico de Paridade (G P A C):</label><input type="text" placeholder="Ex: G3 P1 A1 C0" style="width:100%; padding:6px; border:1px solid #cbd5e1; border-radius:6px; background:#f8fafc;"></div>
                        <div><label style="display:block; font-size:11px; font-weight:bold; margin-bottom:2px; color:#475569;">Nº de Consultas Pré-Natal:</label><input type="number" placeholder="Ex: 7" style="width:100%; padding:6px; border:1px solid #cbd5e1; border-radius:6px; background:#f8fafc;"></div>
                    </div>

                    <!-- 3. COMORBIDADES CRÔNICAS E ANTECEDENTES DE RISCO (DIRETRIZ DO MS) -->
                    <p style="font-weight: bold; color: #0369a1; margin-bottom: 6px; font-size: 12.5px;">🏥 3. Comorbidades Crônicas e Condições de Risco Prévias:</p>
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 8px; margin-bottom: 12px;">
                        <label style="display: flex; align-items: center; gap: 6px; cursor:pointer;"><input type="checkbox"> Hipertensão Arterial Sistêmica (HAS) Crônica ou Cardiopatia</label>
                        <label style="display: flex; align-items: center; gap: 6px; cursor:pointer;"><input type="checkbox"> Diabetes Mellitus Pré-gestacional ou Gestacional (DMG)</label>
                        <label style="display: flex; align-items: center; gap: 6px; cursor:pointer;"><input type="checkbox"> Nefropatia crônica ou infecções urinárias (ITU) altas recorrentes</label>
                        <label style="display: flex; align-items: center; gap: 6px; cursor:pointer;"><input type="checkbox"> Pneumopatia crônica (Ex: Asma Brônquica descompensada na gestação)</label>
                        <label style="display: flex; align-items: center; gap: 6px; cursor:pointer;"><input type="checkbox"> Cirurgia uterina prévia ou incompetência istmocervical</label>
                    </div>

                    <!-- 4. HEMOGLOBINOPATIAS, MEDICAÇÕES E ALERGIAS (CRITÉRIO AUDITORIA E MS) -->
                    <p style="font-weight: bold; color: #0369a1; margin-bottom: 6px; font-size: 12.5px;">💊 4. Hemoglobinopatias, Fármacos e Alergias de Admissão:</p>
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 10px; margin-bottom: 12px;">
                        <div><label style="display:block; font-size:11px; font-weight:bold; margin-bottom:2px; color:#475569;">Triagem de Anemia Falciforme:</label>
                            <select style="width:100%; padding:6px; border:1px solid #cbd5e1; border-radius:6px; background:#f8fafc;"><option selected>Ausente / Sem relato</option><option>Possui Doença Falciforme</option><option>Possui Traço Falciforme</option></select>
                        </div>
                        <div><label style="display:block; font-size:11px; font-weight:bold; margin-bottom:2px; color:#475569;">Medicamentos Prévios em Uso:</label>
                            <input type="text" placeholder="Ex: Metildopa 250mg 8/8h, AAS" style="width:100%; padding:6px; border:1px solid #cbd5e1; border-radius:6px; background:#f8fafc;">
                        </div>
                        <div><label style="display:block; font-size:11px; font-weight:bold; margin-bottom:2px; color:#475569;">Alergias Relatadas:</label>
                            <input type="text" placeholder="Ex: Nega alergias ou refere alergia a dipirona, diclofenaco" style="width:100%; padding:6px; border:1px solid #cbd5e1; border-radius:6px; background:#f8fafc; color:#b91c1c;">
                        </div>
                    </div>

                    <!-- 5. TRIAGEM DE SOROLOGIAS DO CARTÃO DA GESTANTE (PÁG 37 DA CADERNETA) -->
                    <p style="font-weight: bold; color: #475569; margin-bottom: 6px; font-size: 12.5px;">🔬 5. Triagem de Sorologias Obrigatórias do Cartão (Marcar se Reagente):</p>
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 8px; margin-bottom: 15px;">
                        <label style="display: flex; align-items: center; gap: 6px; color:#b91c1c; font-weight:500; cursor:pointer;"><input type="checkbox"> VDRL / Sífilis Reagente</label>
                        <label style="display: flex; align-items: center; gap: 6px; color:#b91c1c; font-weight:500; cursor:pointer;"><input type="checkbox"> HIV Positivo / Reagente</label>
                        <label style="display: flex; align-items: center; gap: 6px; cursor:pointer;"><input type="checkbox"> Hepatite B (HBsAg) Reagente</label>
                        <label style="display: flex; align-items: center; gap: 6px; cursor:pointer;"><input type="checkbox"> Estreptococo Grupo B (GBS) +</label>
                    </div>

                    <!-- 6. RASTREIO DE SAÚDE MENTAL E RISCOS FAMILIARES (CRITÉRIO REDE ALYNE) -->
                    <p style="font-weight: bold; color: #0369a1; margin-bottom: 6px; font-size: 12.5px;">🧠 6. Rastreio de Saúde Mental e Riscos Psicossociais:</p>
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 8px; margin-bottom: 15px;">
                        <label style="display: flex; align-items: center; gap: 6px; cursor:pointer;"><input type="checkbox"> Histórico de Depressão Gestacional, Ansiedade grave ou ideação</label>
                        <label style="display: flex; align-items: center; gap: 6px; cursor:pointer;"><input type="checkbox"> Gestação não planejada / Relato de forte rejeição ao ciclo gravídico</label>
                        <label style="display: flex; align-items: center; gap: 6px; color:#b91c1c; font-weight:500; cursor:pointer;"><input type="checkbox"> Suspeita ou relato ativo de violência doméstica ou vulnerabilidade civil</label>
                    </div>

                    <!-- 7. RASTREIO DE AGRAVOS AGUDOS QUE MOTIVARAM A ADMISSÃO -->

            <!-- 2. EXAME FÍSICO DA INTERNAÇÃO (CEFALOCAUDAL COMPLETO) -->
           <!-- TELA AZUL - ABA 2: EXAME FÍSICO DA INTERNAÇÃO (PARTE 1 DE 3) -->
        <details style="border: 1px solid #cbd5e1; border-radius: 8px; overflow: hidden; background: #ffffff; box-shadow: 0 2px 4px rgba(0,0,0,0.01); margin-top: 4px;">
            <summary style="display: flex; justify-content: space-between; align-items: center; padding: 14px 18px; background: linear-gradient(135deg, #fdf2f8 0%, #fbcfe8 100%); color: #0369a1; font-weight: bold; font-size: 15px; cursor: pointer; outline: none; user-select: none;">
                <span>⛑️ 2. Exame Físico Geral e Obstétrico de Internação (Cefalocaudal)</span>
                <span style="font-size: 11px; background: #ffffff; padding: 4px 10px; border-radius: 20px; border: 1px solid #91d5ff; color: #0369a1; white-space: nowrap;">Clique para abrir</span>
            </summary>
            
            <div style="padding: 20px; background: #ffffff; border-top: 1px solid #cbd5e1; font-size: 13.5px; color: #334155; line-height: 1.5; display: block; width: 100%; box-sizing: border-box;">
                
                <!-- Bloco de Sinais Vitais Maternos e Parâmetros Hemodinâmicos -->
                <p style="margin-top: 0; font-weight: bold; color: #0369a1; margin-bottom: 12px; font-size: 14px;">📊 Parâmetros Vitais Maternos e Antropometria Crítica:</p>
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 12px; margin-bottom: 18px;">
                    <div>
                        <label style="font-size:12px; display:block; margin-bottom:4px; font-weight: 500; color: #475569;">Pressão Arterial - PA Materna (mmHg):</label>
                        <input type="text" placeholder="Ex: 150/90" style="width:100%; padding:8px; border:1px solid #cbd5e1; border-radius:6px; background:#f8fafc; box-sizing: border-box;">
                    </div>
                    <div>
                        <label style="font-size:12px; display:block; margin-bottom:4px; font-weight: 500; color: #475569;">Frequência Cardíaca Materna (bpm):</label>
                        <input type="number" placeholder="Ex: 92" style="width:100%; padding:8px; border:1px solid #cbd5e1; border-radius:6px; background:#f8fafc; box-sizing: border-box;">
                    </div>
                    <div>
                        <label style="font-size:12px; display:block; margin-bottom:4px; font-weight: 500; color: #475569;">Frequência Respiratória Materna (irpm):</label>
                        <input type="number" placeholder="Ex: 19" style="width:100%; padding:8px; border:1px solid #cbd5e1; border-radius:6px; background:#f8fafc; box-sizing: border-box;">
                    </div>
                    <div>
                        <label style="font-size:12px; display:block; margin-bottom:4px; font-weight: 500; color: #475569;">Temperatura Axilar Atual (°C):</label>
                        <input type="text" placeholder="Ex: 36.6" style="width:100%; padding:8px; border:1px solid #cbd5e1; border-radius:6px; background:#f8fafc; box-sizing: border-box;">
                    </div>
                </div>

                <!-- Parâmetros de Avaliação de Ganho de Peso Gestacional -->
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 12px; margin-bottom: 20px; padding: 12px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px;">
                    <div>
                        <label style="font-size:12px; display:block; margin-bottom:4px; font-weight: 500; color: #475569;">IMC Pré-Gestacional (Classificação):</label>
                        <select style="width:100%; padding:8px; border:1px solid #cbd5e1; border-radius:6px; background:#ffffff; box-sizing: border-box;">
                            <option>Baixo Peso (IMC &lt; 18.5)</option>
                            <option selected>Peso Adequado (IMC 18.5 - 24.9)</option>
                            <option>Sobrepeso (IMC 25.0 - 29.9)</option>
                            <option>Obesidade (IMC &ge; 30.0)</option>
                        </select>
                    </div>
                    <div>
                        <label style="font-size:12px; display:block; margin-bottom:4px; font-weight: 500; color: #475569;">Ganho de Peso Total na Gestação (kg):</label>
                        <input type="text" placeholder="Ex: +10 kg (Avaliar curva MS)" style="width:100%; padding:8px; border:1px solid #cbd5e1; border-radius:6px; background:#ffffff; box-sizing: border-box;">
                    </div>
                </div>

                 <!-- TELA AZUL - ABA 2: EXAME FÍSICO DA INTERNAÇÃO (CÓDIGO 1 DA PARTE 2 REVISADO) -->
                <p style="font-weight: bold; color: #0369a1; margin-bottom: 12px; font-size: 13.5px;">🔵 Roteiro Clínico Cefalocaudal (Investigação de Complicações):</p>
                <div style="display: flex; flex-direction: column; gap: 12px; width: 100%; box-sizing: border-box;">
                    
                    <!-- ITEM 1 -->
                    <div style="margin-bottom: 6px;">
                        <label style="display: flex; align-items: flex-start; gap: 10px; cursor: pointer; width: 100%;">
                            <input type="checkbox" style="width:16px; height:16px; margin-top:2px;"> 
                            <span><strong>Reflexos Neurológicos:</strong> Pesquisa de Clonus e Hiperreflexia Patelar (+3/+4 vivos). Indicativo de irritabilidade do SNC e risco iminente de Eclâmpsia.</span>
                        </label>
                        <input type="text" placeholder="Digite aqui o achado neurológico encontrado..." style="width: 100%; padding: 6px 10px; border: 1px solid #cbd5e1; border-radius: 6px; font-size: 12.5px; background: #ffffff; box-sizing: border-box; margin-top: 6px; margin-left: 26px; max-width: calc(100% - 26px);">
                    </div>

                    <!-- ITEM 2 -->
                    <div style="margin-bottom: 6px;">
                        <label style="display: flex; align-items: flex-start; gap: 10px; cursor: pointer; width: 100%;">
                            <input type="checkbox" style="width:16px; height:16px; margin-top:2px;"> 
                            <span><strong>Avaliação de Edema Patológico:</strong> Edema depressível visível em face, mãos ou parede abdominal. Graduação na escala do Sinal de Godet de + a ++++/4+.</span>
                        </label>
                        <input type="text" placeholder="Digite aqui a localização e graduação do edema..." style="width: 100%; padding: 6px 10px; border: 1px solid #cbd5e1; border-radius: 6px; font-size: 12.5px; background: #ffffff; box-sizing: border-box; margin-top: 6px; margin-left: 26px; max-width: calc(100% - 26px);">
                    </div>

                    <!-- ITEM 3 -->
                    <div style="margin-bottom: 6px;">
                        <label style="display: flex; align-items: flex-start; gap: 10px; cursor: pointer; width: 100%;">
                            <input type="checkbox" style="width:16px; height:16px; margin-top:2px;"> 
                            <span><strong>Avaliação Cutâneo-Mucosa:</strong> Pesquisa de icterícia escleral/cutânea ou palidez acentuada. Sinais associados à hemólise microangiopática (Síndrome HELLP) ou Anemia Severa.</span>
                        </label>
                        <input type="text" placeholder="Digite aqui a coloração das mucosas examinadas..." style="width: 100%; padding: 6px 10px; border: 1px solid #cbd5e1; border-radius: 6px; font-size: 12.5px; background: #ffffff; box-sizing: border-box; margin-top: 6px; margin-left: 26px; max-width: calc(100% - 26px);">
                    </div>

                    <!-- ITEM 4 -->
                    <div style="margin-bottom: 6px;">
                        <label style="display: flex; align-items: flex-start; gap: 10px; cursor: pointer; width: 100%;">
                            <input type="checkbox" style="width:16px; height:16px; margin-top:2px;"> 
                            <span><strong>Sinal de Giordano (Dorso):</strong> Punho-percussão lombar positiva com relato de dor aguda em flancos. Marcador clínico de Pielonefrite / Infecção Urinária Alta.</span>
                        </label>
                        <input type="text" placeholder="Digite aqui a resposta e lado da manobra de Giordano..." style="width: 100%; padding: 6px 10px; border: 1px solid #cbd5e1; border-radius: 6px; font-size: 12.5px; background: #ffffff; box-sizing: border-box; margin-top: 6px; margin-left: 26px; max-width: calc(100% - 26px);">
                    </div>

                    <!-- ITEM 5 -->
                    <div style="margin-bottom: 6px;">
                        <label style="display: flex; align-items: flex-start; gap: 10px; cursor: pointer; width: 100%;">
                            <input type="checkbox" style="width:16px; height:16px; margin-top:2px;"> 
                            <span><strong>Sinais Flogísticos Vasculares (MMII):</strong> Assimetria de panturrilhas, presença de calor, rubor ou empastamento muscular localizado (Pesquisa ativa de TVP Gestacional).</span>
                        </label>
                        <input type="text" placeholder="Digite aqui as alterações vasculares ou assimetrias..." style="width: 100%; padding: 6px 10px; border: 1px solid #cbd5e1; border-radius: 6px; font-size: 12.5px; background: #ffffff; box-sizing: border-box; margin-top: 6px; margin-left: 26px; max-width: calc(100% - 26px);">
                    </div>

                    <!-- ITEM 6 -->
                    <div style="margin-bottom: 6px;">
                        <label style="display: flex; align-items: flex-start; gap: 10px; cursor: pointer; width: 100%;">
                            <input type="checkbox" style="width:16px; height:16px; margin-top:2px;"> 
                            <span><strong>Inspeção do Sistema Mamário:</strong> Mamas simétricas, mamilos íntegros ou planos/invertidos, presença de ingurgitamento doloroso ou sinais de mastite.</span>
                        </label>
                        <input type="text" placeholder="Digite aqui as características das mamas e mamilos..." style="width: 100%; padding: 6px 10px; border: 1px solid #cbd5e1; border-radius: 6px; font-size: 12.5px; background: #ffffff; box-sizing: border-box; margin-top: 6px; margin-left: 26px; max-width: calc(100% - 26px);">
                    </div>
                </div>
  <!-- TELA AZUL - ABA 2: EXAME FÍSICO DA INTERNAÇÃO (CÓDIGO 2 DA PARTE 2 REVISADO) -->
                <!-- As 4 Manobras de Leopold-Green com Linhas de Anotação -->
                <p style="font-weight: bold; color: #475569; margin-bottom: 12px; margin-top: 20px; font-size: 13px;">🖐️ Estática Fetal por Manobras de Palpação de Leopold:</p>
                <div style="display: flex; flex-direction: column; gap: 12px; width: 100%; box-sizing: border-box;">
                    
                    <!-- MANOBRA 1 -->
                    <div style="margin-bottom: 6px;">
                        <label style="display: flex; align-items: flex-start; gap: 10px; cursor: pointer; width: 100%;">
                            <input type="checkbox" style="width:16px; height:16px; margin-top:2px;"> 
                            <span><strong>1ª Manobra (Fundo Uterino):</strong> Palpação com ambas as mãos no fundo do útero para identificar qual polo fetal o ocupa, definindo a **Situação** (Longitudinal ou Transversa).</span>
                        </label>
                        <input type="text" placeholder="Digite o achado da situação e polo fetal (Ex: Polo pélvico no fundo)..." style="width: 100%; padding: 6px 10px; border: 1px solid #cbd5e1; border-radius: 6px; font-size: 12.5px; background: #ffffff; box-sizing: border-box; margin-top: 6px; margin-left: 26px; max-width: calc(100% - 26px);">
                    </div>

                    <!-- MANOBRA 2 -->
                    <div style="margin-bottom: 6px;">
                        <label style="display: flex; align-items: flex-start; gap: 10px; cursor: pointer; width: 100%;">
                            <input type="checkbox" style="width:16px; height:16px; margin-top:2px;"> 
                            <span><strong>2ª Manobra (Flancos):</strong> Palpação das faces laterais do útero para localizar a superfície lisa e resistente (dorso) e as pequenas partes (membros), definindo a **Posição** (Direita ou Esquerda).</span>
                        </label>
                        <input type="text" placeholder="Digite a localização do dorso fetal e pequenas partes..." style="width: 100%; padding: 6px 10px; border: 1px solid #cbd5e1; border-radius: 6px; font-size: 12.5px; background: #ffffff; box-sizing: border-box; margin-top: 6px; margin-left: 26px; max-width: calc(100% - 26px);">
                    </div>

                    <!-- MANOBRA 3 -->
                    <div style="margin-bottom: 6px;">
                        <label style="display: flex; align-items: flex-start; gap: 10px; cursor: pointer; width: 100%;">
                            <input type="checkbox" style="width:16px; height:16px; margin-top:2px;"> 
                            <span><strong>3ª Manobra (Mobilidade):</strong> Apreensão do polo fetal inferior entre o polegar e o indicador da mão dominante acima da sínfise púbica para testar a mobilidade e a **Apresentação** (Cefálica ou Pélvica).</span>
                        </label>
                        <input type="text" placeholder="Digite o tipo de apresentação e grau de mobilidade..." style="width: 100%; padding: 6px 10px; border: 1px solid #cbd5e1; border-radius: 6px; font-size: 12.5px; background: #ffffff; box-sizing: border-box; margin-top: 6px; margin-left: 26px; max-width: calc(100% - 26px);">
                    </div>

                    <!-- MANOBRA 4 -->
                    <div style="margin-bottom: 6px;">
                        <label style="display: flex; align-items: flex-start; gap: 10px; cursor: pointer; width: 100%;">
                            <input type="checkbox" style="width:16px; height:16px; margin-top:2px;"> 
                            <span><strong>4ª Manobra (Insinuação):</strong> Palpação com as pontas dos dedos voltadas para a pelve da gestante, avaliando o grau de penetração e encaixe da apresentação, medindo o **Grau de Insinuação**.</span>
                        </label>
                        <input type="text" placeholder="Digite o grau de insinuação ou encaixe na pelve..." style="width: 100%; padding: 6px 10px; border: 1px solid #cbd5e1; border-radius: 6px; font-size: 12.5px; background: #ffffff; box-sizing: border-box; margin-top: 6px; margin-left: 26px; max-width: calc(100% - 26px);">
                    </div>

                </div>

                <!-- Campo de Nota Dissertativa Geral do Fechamento do Exame -->
                <div style="margin-top: 20px; display: block; width: 100%;">
                    <label style="display: block; font-weight: bold; margin-bottom: 6px; color:#475569; font-size: 13px;">Anotações Dissertativas Complementares do Exame:</label>
                    <textarea rows="2" placeholder="Descreva aqui o aspecto de perdas vaginais crônicas observadas, turgor cutâneo materno ou ruídos cardiopulmonares adicionais..." style="width: 100%; padding: 10px; border: 1px solid #cbd5e1; border-radius: 6px; resize: vertical; box-sizing: border-box; font-size: 13px; font-family: inherit;"></textarea>
                </div>
            </div>
        </details>
        <!-- FIM DA ABA 2 TOTALMENTE CORRIGIDA -->

   <!-- TELA AZUL - ABA 2: EXAME FÍSICO DA INTERNAÇÃO (PARTE 3 DE 3) -->
                <!-- Monitoramento Obstétrico e Vitalidade Fetal -->
                <p style="font-weight: bold; color: #9d174d; margin-bottom: 12px; font-size: 14px;">👶 Exame Obstétrico Avançado e Vitalidade Fetal:</p>
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 12px; margin-bottom: 18px;">
                    <div>
                        <label style="display:block; font-size:12px; font-weight:500; margin-bottom:4px; color:#475569;">Altura Uterina - AU (cm):</label>
                        <input type="number" placeholder="Ex: 32" style="width:100%; padding:8px; border:1px solid #cbd5e1; border-radius:6px; background:#f8fafc; box-sizing: border-box;">
                    </div>
                    <div>
                        <label style="display:block; font-size:12px; font-weight:500; margin-bottom:4px; color:#475569;">Batimentos Cardiofetais - BCF (bpm):</label>
                        <input type="number" placeholder="Ex: 144" style="width:100%; padding:8px; border:1px solid #cbd5e1; border-radius:6px; background:#f8fafc; box-sizing: border-box;">
                    </div>
                    <div>
                        <label style="display:block; font-size:12px; font-weight:500; margin-bottom:4px; color:#475569;">Tonicidade Uterina (Fora do Parto):</label>
                        <select style="width:100%; padding:8px; border:1px solid #cbd5e1; border-radius:6px; background:#f8fafc; box-sizing: border-box;">
                            <option selected>Útero amolecido / Ausência de DU</option>
                            <option>Hipertonia Uterina (Alerta DPP)</option>
                            <option>Contrações isoladas de Braxton-Hicks</option>
                        </select>
                    </div>
                </div>

                <!-- Estática Fetal por Palpação (Leopold-Green) -->
                <p style="font-weight: bold; color: #475569; margin-bottom: 8px; font-size: 12.5px;">🖐️ Estática Fetal por Manobras de Palpação de Leopold:</p>
                <div style="display: flex; flex-direction: column; gap: 8px; margin-bottom: 18px; width: 100%; box-sizing: border-box;">
                    <label style="display: flex; align-items: flex-start; gap: 10px; cursor: pointer; width: 100%;">
                        <input type="checkbox" style="width:16px; height:16px; margin-top:2px;"> 
                        <span><strong>1ª Manobra (Fundo Uterino):</strong> Palpação com ambas as mãos no fundo do útero para identificar qual polo fetal o ocupa, definindo a **Situação** (Longitudinal ou Transversa).</span>
                    </label>
                    <label style="display: flex; align-items: flex-start; gap: 10px; cursor: pointer; width: 100%;">
                        <input type="checkbox" style="width:16px; height:16px; margin-top:2px;"> 
                        <span><strong>2ª Manobra (Flancos):</strong> Palpação das faces laterais do útero para localizar a superfície lisa e resistente (dorso) e as pequenas partes (membros), definindo a **Posição** (Direita ou Esquerda).</span>
                    </label>
                    <label style="display: flex; align-items: flex-start; gap: 10px; cursor: pointer; width: 100%;">
                        <input type="checkbox" style="width:16px; height:16px; margin-top:2px;"> 
                        <span><strong>3ª Manobra (Mobilidade):</strong> Apreensão do polo fetal inferior entre o polegar e o indicador da mão dominante acima da sínfise púbica para testar a mobilidade e a **Apresentação** (Cefálica ou Pélvica).</span>
                    </label>
                    <label style="display: flex; align-items: flex-start; gap: 10px; cursor: pointer; width: 100%;">
                        <input type="checkbox" style="width:16px; height:16px; margin-top:2px;"> 
                        <span><strong>4ª Manobra (Insinuação):</strong> Palpação com as pontas dos dedos voltadas para a pelve da gestante, avaliando o grau de penetração e encaixe da apresentação, medindo o **Grau de Insinuação**.</span>
                    </label>
                </div>

                <!-- Campo de Texto para Anotações Técnicas -->
                <div style="margin-top: 15px; display: block; width: 100%; box-sizing: border-box;">
                    <label style="display: block; font-weight: bold; margin-bottom: 6px; color:#475569; font-size: 13px;">Anotações Complementares do Exame Físico:</label>
                    <textarea rows="2" placeholder="Descreva aqui o aspecto de perdas vaginais crônicas observadas, turgor cutâneo materno ou ruídos cardiopulmonares adicionais..." style="width: 100%; padding: 10px; border: 1px solid #cbd5e1; border-radius: 6px; resize: vertical; box-sizing: border-box; font-size: 13px; font-family: inherit;"></textarea>
                </div>

            </div>
        </details>

        <!-- FIM DA ABA 2 CORRIGIDA -->

<!-- CAPA (banner preservado) -->
<div style="background: linear-gradient(135deg, #4a0030 0%, #880e4f 50%, #c2185b 100%); border-radius: 24px; padding: 50px 35px; text-align: center; margin-bottom: 30px; box-shadow: 0 10px 40px rgba(136,14,79,0.35);">
  <div style="font-size: 80px; margin-bottom: 15px; line-height: 1;">🤰</div>
  <h1 style="color:#fff; font-size:32px; margin:0 0 10px 0; letter-spacing:1px;">TRABALHO DE PARTO</h1>
  <p style="color:#fce4ec; font-size:15px; margin:0; font-style:italic; line-height:1.5;">Avaliação da gestante, sinais de trabalho de parto, alertas de emergência e escuta ativa.</p>
</div>

<div style="background: linear-gradient(135deg,#fff5f9 0%, #fce4ec 100%); border-left:5px solid #c2185b; border-radius:16px; padding:22px 24px; margin-bottom:18px;">
  <h2 style="color:#880e4f; margin:0 0 10px 0; font-size:20px;">👩‍⚕️ Avaliação específica da gestante</h2>
  <p style="margin:0; color:#4a0030; line-height:1.6; font-size:15px;">Em cada consulta o acadêmico ou Enfermeiro, avalia: <b>PA, peso, edema, altura uterina, BCF, movimentos fetais</b> e escuta as queixas da mãe. A <b>escuta ativa</b> é a ferramenta mais poderosa: reduz medo, cria vínculo e permite orientar sobre o desenvolvimento do bebê e a hora certa de ir para a maternidade.</p>
</div>

      <!-- SELETOR DINÂMICO INTERATIVO -->
    <div style="margin-bottom: 25px; padding: 15px; border: 1px solid #e2e8f0; border-radius: 8px; background-color: #f8fafc; text-align: center;">
        <p style="font-weight: bold; font-size: 14.5px; color: #475569; margin-top: 0; margin-bottom: 15px;">Qual o motivo principal da Admissão Hospitalar da Gestante?</p>
        <form style="display: flex; flex-wrap: wrap; gap: 12px; justify-content: center;">
            <style>
                .admissao-pill-btn { display: inline-block; padding: 12px 20px; border-radius: 25px; border: 2px solid #cbd5e1; background: #ffffff; cursor: pointer; font-size: 14px; font-weight: bold; color: #475569; transition: all 0.2s ease; }
                .admissao-pill-btn input { display: none; }
                .pill-tp:has(input:checked) { background-color: #9d174d !important; border-color: #700c31 !important; color: #ffffff !important; box-shadow: 0 4px 6px rgba(157,23,77,0.15); }
                .pill-comp:has(input:checked) { background-color: #0369a1 !important; border-color: #075985 !important; color: #ffffff !important; box-shadow: 0 4px 6px rgba(3,105,161,0.15); }
       
                /* Lógica de Isolamento das Telas Master */
                .tela-fluxo-parto { display: none; }
                body:has(input[id="id_tp"]:checked) .tela-fluxo-parto { display: block !important; }
                            </style>
            <label class="admissao-pill-btn pill-tp"><input type="radio" name="filtro_obs_master" id="id_tp" checked> Internação da gestante em Trabalho de Parto Ativo</label>
            
        </form>
    </div>

    <!-- ======================================================= -->
    <!-- TELA VERDE (CONTEÚDO EXCLUSIVO DO TRABALHO DE PARTO) -->
    <!-- ======================================================= -->
    <div class="tela-fluxo-parto" style="width: 100%;">
        <div style="margin-bottom: 15px; font-weight: bold; color: #9d174d; font-size: 14.5px; border-left: 4px solid #9d174d; padding-left: 8px; margin-top: 10px;">| Matriz Assistencial: Admissão em Trabalho de Parto</div>
        
        <div style="display: flex; flex-direction: column; gap: 10px; width: 100%;">
            <!-- 1. Anamnese do Parto -->
            <details style="border: 1px solid #cbd5e1; border-radius: 8px; overflow: hidden; background: #ffffff;">
                <summary style="display: flex; justify-content: space-between; align-items: center; padding: 14px 18px; background: linear-gradient(135deg, #fdf2f8 0%, #fbcfe8 100%); color: #9d174d; font-weight: bold; font-size: 14px; cursor: pointer; outline: none; user-select: none;">
                    <span>📋 1. Anamnese direcionada - gestante em trabalho de parto</span>
                    <span style="font-size: 11px; background: #ffffff; padding: 4px 10px; border-radius: 20px; border: 1px solid #f9a8d4; color: #9d174d; white-space: nowrap;">Clique para abrir</span>
                </summary>
                <div style="padding: 15px; background: #ffffff; border-top: 1px solid #cbd5e1; font-size: 13px; color: #334155; line-height: 1.5;">
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 10px; margin-bottom: 12px;">
                        <div><label style="display:block; font-size:11px; font-weight:bold; margin-bottom:2px;">DUM:</label><input type="date" style="width:100%; padding:6px; border:1px solid #cbd5e1; border-radius:6px; background:#f8fafc;"></div>
                        <div><label style="display:block; font-size:11px; font-weight:bold; margin-bottom:2px;">DPP:</label><input type="date" style="width:100%; padding:6px; border:1px solid #cbd5e1; border-radius:6px; background:#f8fafc;"></div>
                        <div><label style="display:block; font-size:11px; font-weight:bold; margin-bottom:2px;">Paridade (G P A C):</label><input type="text" placeholder="G2 P1 A0 C0" style="width:100%; padding:6px; border:1px solid #cbd5e1; border-radius:6px; background:#f8fafc;"></div>
                    </div>
                    <p style="font-weight: bold; color: #9d174d; margin-bottom: 6px; font-size: 12.5px;">🟢 Rastreio de Parto Ativo:</p>
                    <label style="display: block; margin-bottom: 4px; cursor:pointer;"><input type="checkbox"> Contrações uterinas rítmicas e dolorosas</label>
                    <label style="display: block; margin-bottom: 4px; cursor:pointer;"><input type="checkbox"> Perda de líquido amniótico via vaginal</label>
                    <label style="display: block; cursor:pointer;"><input type="checkbox"> Perda do tampão mucoso com estrias de sangue</label>
                </div>
            </details>

            <!-- 2. Exame Físico do Parto -->
            <details style="border: 1px solid #cbd5e1; border-radius: 8px; overflow: hidden; background: #ffffff;">
                <summary style="display: flex; justify-content: space-between; align-items: center; padding: 14px 18px; background: linear-gradient(135deg, #fdf2f8 0%, #fbcfe8 100%); color: #9d174d; font-weight: bold; font-size: 14px; cursor: pointer; outline: none; user-select: none;">
                    <span>🩺 2. Exame Obstétrico Direcionado ao trabalho de parto</span>
                    <span style="font-size: 11px; background: #ffffff; padding: 4px 10px; border-radius: 20px; border: 1px solid #f9a8d4; color: #9d174d; white-space: nowrap;">Clique para abrir</span>
                </summary>
                <div style="padding: 15px; background: #ffffff; border-top: 1px solid #cbd5e1; font-size: 13px; color: #334155; line-height: 1.5;">
                    <div style="display: flex; flex-direction: column; gap: 8px; width: 100%;">
                        <div><label style="font-size:12px; font-weight:bold; display:block; margin-bottom:2px;">BCF (Batimentos Fetais):</label><input type="number" placeholder="Ex: 140 bpm" style="width:100%; padding:6px; border:1px solid #cbd5e1; border-radius:6px;"></div>
                        <div><label style="font-size:12px; font-weight:bold; display:block; margin-bottom:2px;">Dinâmica Uterina (DU / 10 min):</label><input type="text" placeholder="Ex: 3 contrações em 40 segundos" style="width:100%; padding:6px; border:1px solid #cbd5e1; border-radius:6px;"></div>
                        <div><label style="font-size:12px; font-weight:bold; display:block; margin-bottom:2px;">Toque Vaginal (Dilatação/Apagamento):</label><input type="text" placeholder="Ex: 5 cm de dilatação / 80% apagado" style="width:100%; padding:6px; border:1px solid #cbd5e1; border-radius:6px;"></div>
                    </div>
                </div>
            </details>
        </div>
    </div>
 </details>

<div style="background: linear-gradient(135deg,#e8f5e9 0%, #c8e6c9 100%); border-left:5px solid #2e7d32; border-radius:16px; padding:22px 24px; margin-bottom:18px;">
  <h2 style="color:#1b5e20; margin:0 0 12px 0; font-size:20px;">🤱 Sinais de trabalho de parto</h2>
  <ul style="margin:0; padding-left:20px; color:#1b5e20; line-height:1.8; font-size:15px;">
    <li><b>Contrações rítmicas</b> e progressivas (a cada 5 min, durando 45–60s, por 1 h).</li>
    <li><b>Perda do tampão mucoso</b> (secreção gelatinosa, às vezes com raias de sangue).</li>
    <li><b>Rompimento da bolsa</b> (líquido claro; se esverdeado/sanguinolento → emergência).</li>
    <li><b>Dilatação e apagamento</b> progressivos do colo (avaliação pelo profissional).</li>
    <li><b>Sensação de peso pélvico</b> e vontade de evacuar (descida fetal).</li>
  </ul></div>
  </div>
</div> 
</details>

<div style="background: linear-gradient(135deg,#fff3e0 0%, #ffe0b2 100%); border-left:5px solid #c62828; border-radius:16px; padding:22px 24px; margin-bottom:18px;">
  <h2 style="color:#b71c1c; margin:0 0 12px 0; font-size:20px;">🚨 Sinais de alerta e emergência</h2>
  <p style="margin:0 0 10px 0; color:#4a0030; font-size:14px;"><b>Pré-eclâmpsia</b> e outras urgências obstétricas — comunicar equipe imediatamente:</p>
  <ul style="margin:0; padding-left:20px; color:#b71c1c; line-height:1.8; font-size:15px;">
    <li><b>Cefaleia intensa</b> que não passa com analgésico</li>
    <li><b>Visão turva</b>, escotomas ou fotofobia</li>
    <li><b>Edema súbito</b> de face e mãos</li>
    <li><b>Epigastralgia</b> em barra (dor "boca do estômago")</li>
    <li><b>PA ≥ 140 × 90 mmHg</b> após 20 semanas</li>
    <li><b>Sangramento vaginal</b> em qualquer volume</li>
    <li><b>Redução dos movimentos fetais</b> (&lt; 6 mov/2 h)</li>
    <li><b>Perda de líquido amniótico</b> esverdeado ou fétido</li>
    <li><b>Febre</b> ≥ 37,8 °C</li>
  </ul></div>
      </div>
    </div>
 </details>

<h2 style="color:#880e4f; margin:28px 0 14px 0; font-size:22px; text-align:center;">🌊 Métodos não farmacológicos para alívio da dor</h2>
<div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(200px, 1fr)); gap:12px; margin-bottom:22px;">
  <div style="background:#e0f7fa; border-radius:12px; padding:16px; text-align:center;"><div style="font-size:32px;">🚿</div><p style="margin:6px 0 0 0; color:#006064; font-size:14px;"><b>Banhos quentes</b><br>Relaxam a musculatura lombar e perineal.</p></div>
  <div style="background:#f3e5f5; border-radius:12px; padding:16px; text-align:center;"><div style="font-size:32px;">💆</div><p style="margin:6px 0 0 0; color:#4a148c; font-size:14px;"><b>Massagem sacral</b><br>Pressão firme reduz a dor das contrações.</p></div>
  <div style="background:#fff3e0; border-radius:12px; padding:16px; text-align:center;"><div style="font-size:32px;">⚪</div><p style="margin:6px 0 0 0; color:#e65100; font-size:14px;"><b>Bola de pilates</b><br>Movimentos circulares ajudam na descida fetal.</p></div>
  <div style="background:#e8f5e9; border-radius:12px; padding:16px; text-align:center;"><div style="font-size:32px;">🚶‍♀️</div><p style="margin:6px 0 0 0; color:#1b5e20; font-size:14px;"><b>Deambulação</b><br>Caminhar verticaliza e acelera o parto.</p></div>
  <div style="background:#e3f2fd; border-radius:12px; padding:16px; text-align:center;"><div style="font-size:32px;">🌬️</div><p style="margin:6px 0 0 0; color:#0d47a1; font-size:14px;"><b>Respiração</b><br>Lenta e profunda mantém a oxigenação.</p></div>
  <div style="background:#fce4ec; border-radius:12px; padding:16px; text-align:center;"><div style="font-size:32px;">🕯️</div><p style="margin:6px 0 0 0; color:#880e4f; font-size:14px;"><b>Ambiente acolhedor</b><br>Pouca luz e silêncio reduzem a adrenalina.</p></div>
</div>

<h2 style="color:#880e4f; margin:28px 0 14px 0; font-size:22px; text-align:center;">✋ Manobras de Leopold <span style="font-size:13px; color:#c2185b; font-weight:normal;">(clique em cada manobra)</span></h2>

<details style="background: linear-gradient(135deg,#e8f5e9 0%, #c8e6c9 100%); border-radius:14px; padding:16px 20px; margin-bottom:10px;">
  <summary style="font-weight:700; color:#1b5e20; font-size:16px; list-style:none;">1ª Manobra — Situação</summary>
  <p style="margin:10px 0 0 0; color:#1b5e20; line-height:1.6; font-size:14px;">Delimitar o <b>fundo uterino</b> com as duas mãos para identificar qual polo fetal está ali (geralmente o <b>polo pélvico</b>).</p>
</details>

<details style="background: linear-gradient(135deg,#e3f2fd 0%, #bbdefb 100%); border-radius:14px; padding:16px 20px; margin-bottom:10px;">
  <summary style="font-weight:700; color:#0d47a1; font-size:16px; list-style:none;">2ª Manobra — Posição</summary>
  <p style="margin:10px 0 0 0; color:#0d47a1; line-height:1.6; font-size:14px;">Deslizar as mãos pelas laterais do abdômen para identificar de que lado está o <b>dorso</b> (superfície firme) e as <b>pequenas partes</b> (membros).</p>
</details>

<details style="background: linear-gradient(135deg,#fff3e0 0%, #ffe0b2 100%); border-radius:14px; padding:16px 20px; margin-bottom:10px;">
  <summary style="font-weight:700; color:#e65100; font-size:16px; list-style:none;">3ª Manobra — Apresentação</summary>
  <p style="margin:10px 0 0 0; color:#e65100; line-height:1.6; font-size:14px;">Apreender o <b>polo inferior</b> (acima da sínfise púbica) entre o polegar e o indicador para checar mobilidade — cefálica, pélvica ou córmica.</p>
</details>

<details style="background: linear-gradient(135deg,#fce4ec 0%, #f8bbd0 100%); border-radius:14px; padding:16px 20px; margin-bottom:22px;">
  <summary style="font-weight:700; color:#880e4f; font-size:16px; list-style:none;">4ª Manobra — Insinuação</summary>
  <p style="margin:10px 0 0 0; color:#880e4f; line-height:1.6; font-size:14px;">De costas para a paciente, palpar com as duas mãos a <b>entrada da pelve</b> para avaliar o grau de descida da cabeça fetal (insinuada, alta e móvel, fixa).</p>
</details>

<div style="background: linear-gradient(135deg,#f1f8e9 0%, #dcedc8 100%); border-left:5px solid #558b2f; border-radius:16px; padding:22px 24px; margin-bottom:18px;">
  <h2 style="color:#33691e; margin:0 0 12px 0; font-size:20px;">❤️ Ausculta dos Batimentos Cardíacos Fetais (BCF)</h2>
  <ul style="margin:0; padding-left:20px; color:#33691e; line-height:1.8; font-size:15px;">
    <li><b>Momento:</b> antes, durante e após uma contração uterina.</li>
    <li><b>Localização:</b> use a <b>2ª manobra de Leopold</b> para achar o dorso — o BCF é melhor ouvido ali.</li>
    <li><b>Instrumento:</b> <b>sonar Doppler</b> (com gel) ou <b>estetoscópio de Pinard</b>.</li>
    <li><b>Contagem:</b> por <b>1 minuto inteiro</b>. Valor normal: <b>110 a 160 bpm</b>.</li>
    <li><b>Alerta:</b> BCF &lt; 110 ou &gt; 160 bpm sustentado → comunicar equipe.</li>
  </ul>
</div>

<p style="text-align:center; color:#880e4f; font-size:12px; margin-top:24px; font-style:italic;">Conteúdo educacional — não substitui o julgamento clínico do profissional Enfermeiro.</p>

</div>
