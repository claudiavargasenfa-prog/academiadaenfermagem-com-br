UPDATE public.mini_apps
SET content_md = $md$
# Escalas Clínicas na Prática

## Objetivo do mini app
Este conteúdo reúne escalas usadas na rotina de enfermagem para transformar observações clínicas em decisões mais seguras. Use como apoio para estudo, passagem de plantão, evolução e acompanhamento do paciente.

> 📌 Escalas não substituem avaliação clínica completa. Elas organizam dados e ajudam a reconhecer riscos precocemente.

## 1. Escala de Braden — risco de lesão por pressão

**Para que serve:** avaliar risco de Lesão por Pressão (LPP).

**Itens avaliados:**
- Percepção sensorial
- Umidade
- Atividade
- Mobilidade
- Nutrição
- Fricção e cisalhamento

**Interpretação geral:** quanto menor a pontuação, maior o risco.

**Condutas de enfermagem:**
- Reposicionamento conforme protocolo
- Proteção de proeminências ósseas
- Manutenção da pele limpa e seca
- Avaliação nutricional
- Registro e comunicação do risco à equipe

## 2. Escala de Morse — risco de queda

**Para que serve:** identificar pacientes com risco aumentado de queda.

**Pontos observados:**
- Histórico de quedas
- Diagnóstico secundário
- Auxílio para deambular
- Terapia intravenosa
- Marcha
- Estado mental

**Condutas de enfermagem:**
- Manter campainha ao alcance
- Orientar paciente e acompanhante
- Elevar grades conforme protocolo institucional
- Sinalizar risco de queda
- Acompanhar transferências e deambulação

## 3. Escala de Glasgow — nível de consciência

**Para que serve:** avaliar resposta neurológica por abertura ocular, resposta verbal e resposta motora.

**Atenção:** queda na pontuação pode indicar piora neurológica e precisa ser comunicada rapidamente.

**Na prática, observe:**
- O paciente abre os olhos espontaneamente?
- Responde de forma orientada?
- Obedece comandos?
- Há assimetria, confusão ou rebaixamento?

## 4. RASS — agitação e sedação

**Para que serve:** avaliar nível de sedação ou agitação, especialmente em pacientes críticos.

**Extremos importantes:**
- Paciente muito agitado pode arrancar dispositivos e se lesionar.
- Paciente profundamente sedado pode ter maior risco de complicações e precisa de monitorização.

**Condutas:**
- Registrar escore junto aos sinais vitais
- Reavaliar após medicações sedativas
- Comunicar alterações importantes à equipe

## 5. EVA e Faces — avaliação da dor

**Para que serve:** mensurar intensidade da dor.

**EVA:** paciente atribui nota de 0 a 10.

**Faces:** útil para crianças, idosos, pacientes com dificuldade de comunicação ou baixa alfabetização em saúde.

**Condutas:**
- Perguntar localização, intensidade e característica da dor
- Reavaliar após analgesia
- Registrar resposta ao tratamento
- Comunicar dor persistente ou intensa

## 6. NEWS — alerta precoce no adulto

**Para que serve:** reconhecer deterioração clínica a partir de parâmetros fisiológicos.

**Parâmetros comuns:**
- Frequência respiratória
- Saturação de oxigênio
- Uso de oxigênio
- Temperatura
- Pressão arterial sistólica
- Frequência cardíaca
- Nível de consciência

**Ponto-chave:** alterações respiratórias e queda do nível de consciência merecem atenção imediata.

## 7. PEWS — alerta precoce pediátrico

**Para que serve:** identificar piora clínica em crianças.

**Observe:**
- Comportamento
- Esforço respiratório
- Perfusão
- Sinais vitais conforme faixa etária

**Na pediatria:** pequenas alterações podem ser significativas. Compare sempre com o padrão esperado para a idade.

## 8. Fugulin — classificação de pacientes

**Para que serve:** classificar grau de dependência do paciente em relação à equipe de enfermagem.

**Ajuda em:**
- Planejamento da assistência
- Dimensionamento da equipe
- Organização da carga de trabalho
- Priorização de cuidados

## Como usar no estágio e na prática

1. Avalie o paciente com calma.
2. Some os pontos conforme a escala utilizada.
3. Registre o escore e o horário.
4. Interprete o risco.
5. Aplique as condutas de enfermagem.
6. Reavalie conforme protocolo ou mudança clínica.

> ✅ Um bom registro deve responder: qual escala foi aplicada, qual pontuação encontrada, qual risco identificado e quais condutas foram realizadas.
$md$,
updated_at = now()
WHERE slug = 'escalas-clinicas'
  AND (content_md IS NULL OR btrim(content_md) = '');