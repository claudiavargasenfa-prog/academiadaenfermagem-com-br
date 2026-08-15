-- Primeiro, garantimos que o Mini App existe na tabela mini_apps
INSERT INTO public.mini_apps (name, slug, kind, icon, is_active, gratuito)
VALUES ('Manejo de Drogas Vasoativas', 'manejo-drogas-vasoativas', 'protocolo', 'Activity', true, false)
ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name;

-- Pegamos o ID do Mini App
DO $$
DECLARE
    v_app_id UUID;
    v_track_id UUID;
    v_section_id UUID;
BEGIN
    SELECT id INTO v_app_id FROM public.mini_apps WHERE slug = 'manejo-drogas-vasoativas';
    
    -- Buscamos a Trilha/App de UTI
    SELECT id INTO v_track_id FROM public.apps WHERE slug = 'uti-emergencia';
    
    -- Se a trilha existir, garantimos que o mini app está associado a ela
    IF v_track_id IS NOT NULL THEN
        -- Garantimos uma seção básica se não houver
        INSERT INTO public.app_sections (app_id, title, ordem)
        VALUES (v_track_id, 'Protocolos Avançados', 1)
        ON CONFLICT DO NOTHING;
        
        SELECT id INTO v_section_id FROM public.app_sections WHERE app_id = v_track_id LIMIT 1;
        
        -- Colocamos o mini app na trilha
        INSERT INTO public.mini_app_placements (app_id, mini_app_id, section_id, ordem)
        VALUES (v_track_id, v_app_id, v_section_id, 1)
        ON CONFLICT DO NOTHING;
    END IF;

    -- Sub-tópico 1.1: Noradrenalina
    INSERT INTO public.mini_app_subtopics (mini_app_id, slug, title, content_md, ordem)
    VALUES (
        v_app_id,
        'noradrenalina',
        '1.1 Noradrenalina — a rainha do choque',
        '# Noradrenalina (Levophed)

**A rainha do choque: o pilar do suporte hemodinâmico.**

### 🧬 Mecanismo de Ação
*   **Agonista α1 potente:** Causa vasoconstrição periférica intensa, aumentando a Resistência Vascular Sistêmica (RVS).
*   **Agonista β1 leve:** Inotropismo discreto. 
*   **Resultado:** Eleva a Pressão Arterial Média (PAM) sem grandes aumentos da Frequência Cardíaca (FC), sendo mais eficiente que a dopamina.

### 🎯 Indicação
*   **Primeira linha** em qualquer choque vasodilatador (Choque Séptico, Neurogênico, Anafilático).
*   *Referência:* Surviving Sepsis Campaign 2021 (Recomendação Forte).
*   **Meta:** PAM ≥ 65 mmHg (alvos superiores não demonstraram melhora no desfecho em pacientes gerais).

### 🧪 Apresentação e Diluição
*   **Ampola:** 4 mg / 4 mL (1 mg/mL).
*   **Diluição Padrão ADEC:** 4 ampolas (16 mg) em 250 mL de SG 5% → **Concentração: 64 mcg/mL**.
*   *Nota:* O SG 5% é preferível para evitar a oxidação da catecolamina.

### ⚖️ Dosagem
*   **Início:** 0,05 – 0,1 mcg/kg/min.
*   **Titulação:** Ajustar a cada 5–10 min conforme resposta clínica.
*   **Alerta:** Se a dose exceder > 0,5 mcg/kg/min, considerar choque refratário e adição de **Vasopressina**.

### ⚠️ Cuidados de Enfermagem (Padrão Ouro)
1.  **Acesso Central:** Obrigatoriamente infundir em veia central (risco de necrose por extravasamento em veia periférica).
2.  **Fotossensibilidade:** A noradrenalina oxida na luz. Exige **equipo e capa fotoprotetora (âmbar)**.
3.  **Desmame (Weaning):** Nunca desligar abruptamente. Redução deve ser lenta e gradual para evitar hipotensão rebote severa.
4.  **Monitorização:** Avaliar perfusão periférica, pulsos e sítio de inserção continuamente.',
        1
    ) ON CONFLICT (mini_app_id, slug) DO UPDATE SET content_md = EXCLUDED.content_md, title = EXCLUDED.title;

    -- Sub-tópico 1.2: Dopamina
    INSERT INTO public.mini_app_subtopics (mini_app_id, slug, title, content_md, ordem)
    VALUES (
        v_app_id,
        'dopamina',
        '1.2 Dopamina — por que saiu de moda',
        '# Dopamina

**Entenda por que ela perdeu espaço na terapia intensiva moderna.**

### 🧪 Efeito Dose-Dependente
Antigamente, acreditava-se em faixas rígidas, mas hoje sabemos que os efeitos se sobrepõem:
*   **Dose Baixa (1-5 mcg/kg/min):** Efeito "dopaminérgico" (vasodilatação renal/esplâncnica).
*   **Dose Média (5-10 mcg/kg/min):** Efeito β1 (Inotrópico e Cronotrópico).
*   **Dose Alta (> 10 mcg/kg/min):** Efeito α (Vasoconstrição).

### ❌ O Fim do Mito da "Dose Renal"
*   Metanálises modernas provaram que a dose baixa **não protege o rim** nem reduz necessidade de diálise ou mortalidade.
*   **Estudo SOAP II (NEJM 2010):** Comparou Nora vs Dopamina. Resultado: Mesma mortalidade, mas a Dopamina causou **2x mais arritmias** (24% vs 12%).

### 🎯 Posição Atual (SSC 2021)
*   Alternativa à Noradrenalina apenas em pacientes selecionados com **baixo risco de taquiarritmias** ou **bradicardia importante**.
*   *Recomendação:* Fraca.

### 💉 Apresentação
*   **Ampola:** 50 mg / 10 mL (5 mg/mL).

### ⚠️ Cuidados de Enfermagem
1.  **Monitorização Cardíaca:** Vigilância rigorosa de ritmo (risco elevado de taquicardia sinusal e fibrilação atrial).
2.  **Sinais Vitais:** Avaliar PA e FC continuamente durante a titulação.
3.  **Extravasamento:** Também causa necrose; preferir acesso central sempre que possível.',
        2
    ) ON CONFLICT (mini_app_id, slug) DO UPDATE SET content_md = EXCLUDED.content_md, title = EXCLUDED.title;
END $$;