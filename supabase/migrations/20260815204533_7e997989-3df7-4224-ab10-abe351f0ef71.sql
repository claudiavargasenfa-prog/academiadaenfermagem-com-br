DO $$
DECLARE
    v_app_id UUID;
BEGIN
    SELECT id INTO v_app_id FROM public.mini_apps WHERE slug = 'manejo-drogas-vasoativas';

    IF v_app_id IS NOT NULL THEN
        -- Sub-tópico 1.3: Dobutamina
        INSERT INTO public.mini_app_subtopics (mini_app_id, slug, title, content_md, ordem)
        VALUES (
            v_app_id,
            'dobutamina',
            '1.3 Dobutamina — o inotrópico, não o vasopressor',
            '# Dobutamina

**O inotrópico de escolha para suporte de débito cardíaco.**

### 🧬 Mecanismo de Ação
*   **Agonista β1 predominante:** Aumenta a força de contração (Inotropismo) e a frequência cardíaca (Cronotropismo).
*   **Agonista β2 leve:** Causa vasodilatação periférica. 
*   **⚠️ ALERTA:** Pode **DIMINUIR a PAM**. Não é uma droga para elevar pressão arterial em estados de choque vasoplégico puro.

### 🎯 Indicações
*   **Baixo Débito Cardíaco:** Com pressões de enchimento adequadas.
*   **Choque Cardiogênico:** Falência de bomba.
*   **Sepse com disfunção miocárdica:** Hipoperfusão persistente apesar de volemia e PAM adequadas (SSC 2021).

### 🏆 Regra de Ouro
*   **Associação:** Se a PAM estiver baixa, a dobutamina deve ser associada a um vasopressor (ex: Noradrenalina). **Nunca use dobutamina isolada em pacientes hipotensos severos.**

### 🧪 Apresentação e Diluição
*   **Ampola:** 250 mg / 20 mL (12,5 mg/mL).
*   **Diluição Padrão ADEC:** 250 mg em 250 mL (SG5% ou SF0,9%) → **Concentração: 1000 mcg/mL**.

### ⚖️ Dosagem
*   **Faixa Usual:** 2,5 – 20 mcg/kg/min.
*   **Titulação:** Ajustar pela resposta clínica (Melhora do lactato, ScvO₂ e débito urinário).

### ⚠️ Cuidados de Enfermagem
1.  **Avaliação de Resposta:** Monitorar aumento do débito urinário como sinal positivo de melhora do débito cardíaco.
2.  **Arritmias:** A taquicardia severa e arritmias ventriculares são os principais limitadores de dose.
3.  **Taquifilaxia:** Perda de efeito após ~72 horas de uso contínuo (dessensibilização de receptores).
4.  **Extravasamento:** Causa lesão tecidual severa; monitorar o sítio de punção.',
            3
        ) ON CONFLICT (mini_app_id, slug) DO UPDATE SET content_md = EXCLUDED.content_md, title = EXCLUDED.title;
    END IF;
END $$;