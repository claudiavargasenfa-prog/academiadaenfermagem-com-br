-- Limpa qualquer sub-tópico anterior do mini app de Drogas Vasoativas
DELETE FROM public.mini_app_subtopics 
WHERE mini_app_id = '3b689d95-0730-4bb5-a47a-7fd59ddaa624';

-- Insere Noradrenalina (Vasoativo)
INSERT INTO public.mini_app_subtopics (mini_app_id, slug, title, content_md, ordem, is_draft)
VALUES (
  '3b689d95-0730-4bb5-a47a-7fd59ddaa624',
  'uti-noradrenalina',
  '[Vasoativos] Noradrenalina',
  '### Noradrenalina (Levofed)
  
**Indicação:** Choque distributivo (Séptico) e choque cardiogênico com hipotensão grave.

**Diluição Padrão (ADEC):**
- 4 ampolas (4mg/4mL cada) + 234mL de SG5% = **Total 250mL**.
- Concentração: **64 mcg/mL**.

**Cuidados de Enfermagem:**
1. **Acesso Venoso:** Preferencialmente em Acesso Venoso Central (CVC). Se periférico, deve ser calibroso e por tempo limitado (risco de necrose por extravasamento).
2. **Monitorização:** Exige monitorização contínua de PAM (Pressão Arterial Média).
3. **Fotossensibilidade:** A droga é fotossensível. Usar equipo e capa fotoprotetora (âmbar).
4. **Desmame:** Nunca desligar abruptamente. O desmame deve ser gradual para evitar hipotensão de rebote.',
  1,
  false
);

-- Insere Dobutamina (Vasoativo)
INSERT INTO public.mini_app_subtopics (mini_app_id, slug, title, content_md, ordem, is_draft)
VALUES (
  '3b689d95-0730-4bb5-a47a-7fd59ddaa624',
  'uti-dobutamina',
  '[Vasoativos] Dobutamina',
  '### Dobutamina (Dobutrex)

**Indicação:** Choque cardiogênico e insuficiência cardíaca descompensada (melhora o débito cardíaco).

**Diluição Padrão (ADEC):**
- 1 ampola (250mg/20mL) + 230mL de SG5% = **Total 250mL**.
- Concentração: **1.000 mcg/mL**.

**Informações Importantes:**
- **Não é vasopressor:** Pode causar queda inicial da PA devido ao efeito β2 (vasodilatação periférica). Frequentemente associada à Noradrenalina.
- **Taquifilaxia:** Perda de sensibilidade dos receptores após 72h de uso contínuo.

**Cuidados de Enfermagem:**
1. **Controle de Diurese:** O aumento do volume urinário é um indicador de melhora do débito cardíaco.
2. **Arritmias:** Monitorar ECG para taquicardia ou extrassístoles.',
  2,
  false
);
