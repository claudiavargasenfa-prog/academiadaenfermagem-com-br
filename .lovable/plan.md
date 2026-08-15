# Plano: Criação do 5º Aplicativo - Terapia Intensiva & Emergência Crítica (ICU Master)

Este plano descreve a criação do novo aplicativo de alta complexidade para a ADEC, incluindo identidade visual Premium Plus e os primeiros conteúdos técnicos.

## Mudanças no Banco de Dados (Supabase)

- Criar o novo aplicativo na tabela `apps` com o slug `uti-emergencia`.
- Definir cores Premium (Navy, Gold, Black) para a identidade visual.

## Interface e Design (Frontend)

- **Banner Premium Plus:** Criar um componente de destaque com animações `framer-motion` e visual tecnológico (monitor multiparamétrico).
- **Trilha de Aprendizagem:** Organizar os temas (Drogas Vasoativas, VM, Monitorização) em seções específicas.
- **Identidade Visual:** Aplicar tons escuros com brilhos neon/dourados para diferenciar dos apps básicos.

## Conteúdo Técnico (Mini Apps)

- **Mini App 1: Farmacologia Intensiva**
  - Calculadora de infusão de Noradrenalina e Dopamina.
  - Protocolo de sedação PADIS.
- **Mini App 2: Ventilação Mecânica (VM)**
  - Simulador de curvas ventilatórias.
  - Guia de proteção alveolar e Posição Prona.
- **Mini App 3: Monitorização Hemodinâmica**
  - Interpretação de PAI e Débito Cardíaco.

## Detalhes Técnicos
- Utilizar `framer-motion` para transições suaves.
- Criar novos componentes em `src/components/uti/` para manter a organização.
- Adicionar os temas no sistema de certificados para emissão automática.
