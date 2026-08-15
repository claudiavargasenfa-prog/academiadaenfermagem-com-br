-- 1. Inserir o novo Aplicativo
INSERT INTO public.apps (name, slug, emoji, description, bg_color, fg_color, is_active, sort_mode)
VALUES (
  'Terapia Intensiva & Emergência Crítica',
  'uti-emergencia',
  '🏥',
  'Especialização avançada em cuidados críticos, drogas vasoativas e ventilação mecânica para enfermeiros de alta performance.',
  '#020617',
  '#F8FAFC',
  true,
  'numeric'
);

-- Obter o ID do app recém criado
DO $$
DECLARE
    app_id uuid;
    sec_farmaco_id uuid;
    sec_vm_id uuid;
    sec_monitor_id uuid;
BEGIN
    SELECT id INTO app_id FROM public.apps WHERE slug = 'uti-emergencia';

    -- 2. Inserir Seções (Usando 'ordem' em vez de 'order')
    INSERT INTO public.app_sections (app_id, title, emoji, is_active, ordem)
    VALUES 
      (app_id, 'Farmacologia Crítica', '💉', true, 1)
    RETURNING id INTO sec_farmaco_id;

    INSERT INTO public.app_sections (app_id, title, emoji, is_active, ordem)
    VALUES 
      (app_id, 'Ventilação Mecânica', '🫁', true, 2)
    RETURNING id INTO sec_vm_id;

    INSERT INTO public.app_sections (app_id, title, emoji, is_active, ordem)
    VALUES 
      (app_id, 'Monitorização Hemodinâmica', '📉', true, 3)
    RETURNING id INTO sec_monitor_id;

    -- 3. Inserir Mini Apps e Posicioná-los (Tabela mini_app_placements com 'ordem')
    -- Drogas Vasoativas
    WITH new_mini AS (
      INSERT INTO public.mini_apps (name, slug, kind, description, is_active, gratuito)
      VALUES ('Manejo de Drogas Vasoativas', 'drogas-vasoativas', 'Calculadora', 'Guia completo e calculadora de infusão para Noradrenalina, Vasopressina e Inotrópicos.', true, false)
      RETURNING id
    )
    INSERT INTO public.mini_app_placements (app_id, mini_app_id, section_id, ordem)
    SELECT app_id, id, sec_farmaco_id, 1 FROM new_mini;

    -- PADIS
    WITH new_mini AS (
      INSERT INTO public.mini_apps (name, slug, kind, description, is_active, gratuito)
      VALUES ('Protocolo PADIS & Sedação', 'protocolo-padis', 'Protocolo', 'Manejo de dor, agitação, delirium e imobilidade em pacientes críticos.', true, false)
      RETURNING id
    )
    INSERT INTO public.mini_app_placements (app_id, mini_app_id, section_id, ordem)
    SELECT app_id, id, sec_farmaco_id, 2 FROM new_mini;

    -- VM Fundamentos
    WITH new_mini AS (
      INSERT INTO public.mini_apps (name, slug, kind, description, is_active, gratuito)
      VALUES ('Fundamentos da VM', 'vm-fundamentos', 'Trilha', 'Interpretação de curvas, modos ventilatórios (VCV, PCV, PSV) e alarmes.', true, false)
      RETURNING id
    )
    INSERT INTO public.mini_app_placements (app_id, mini_app_id, section_id, ordem)
    SELECT app_id, id, sec_vm_id, 1 FROM new_mini;

    -- Posição Prona
    WITH new_mini AS (
      INSERT INTO public.mini_apps (name, slug, kind, description, is_active, gratuito)
      VALUES ('Posição Prona na SDRA', 'posicao-prona', 'Procedimento', 'Checklist de segurança e manobra de pronação para pacientes com hipoxemia grave.', true, false)
      RETURNING id
    )
    INSERT INTO public.mini_app_placements (app_id, mini_app_id, section_id, ordem)
    SELECT app_id, id, sec_vm_id, 2 FROM new_mini;

    -- PAI e Débito
    WITH new_mini AS (
      INSERT INTO public.mini_apps (name, slug, kind, description, is_active, gratuito)
      VALUES ('Monitorização de PAI e Débito', 'pai-debito', 'Guia', 'Interpretação da curva dicrótica e monitorização hemodinâmica invasiva.', true, false)
      RETURNING id
    )
    INSERT INTO public.mini_app_placements (app_id, mini_app_id, section_id, ordem)
    SELECT app_id, id, sec_monitor_id, 1 FROM new_mini;

END $$;
