# Ajustes no mini app "Suporte à Decisão Clínica e Mecanismos Fisiopatológicos"

## Respondendo sua pergunta primeiro

**Sim, consigo.** Conferi o banco de dados do app: a planilha já está carregada inteira, com **1.344 linhas**, do código **ADEC-0001 até ADEC-1344**. Ou seja, tudo até o ADEC-1100 que você pediu já está lá e pode ser usado nas ligações das colunas 4, 7, 8 e 10.

## O que vou fazer (só isso)

1. **Coluna 4 (sinais e sintomas) ligada ao botão de ditado**
   - O botão passa a comparar o que foi ditado/escrito com a coluna 4 de todas as 1.344 linhas e envia para a área correta apenas o que for realmente sinal/sintoma reconhecido (aceitando variações de escrita, plural e acentuação).
   - O que não for reconhecido continua disponível, mas separado, para você não perder nada do ditado.

2. **Renomear a área**
   - "Sinais e Sintomas" passa a se chamar **"Evidências Clínicas / Sinais e Sintomas"** (título do painel, rótulo do campo dentro do mini app e o texto do botão).

3. **Seção 3 do mini app**
   - Título atual: "3. Diagnósticos com Fundamentos Fisiopatológicos (Sua Fórmula)" → o trecho **"Sua Fórmula" vira "Autoral"**.
   - O subtítulo do item 3 passa a ser: **"MECANISMOS CIENTÍFICOS – HIPÓTESE DIAGNÓSTICA AUTORAL"**.

4. **Área de Achados + colunas 7, 8 e 10**
   - Texto dos achados fica em **verde**.
   - Cada resultado mostra, sempre da **mesma linha da planilha**:
     - **Hipótese Diagnóstica ADEC** (coluna 7)
     - **Intervenções assistenciais** (coluna 8)
     - **Objetivos assistenciais** (coluna 10)

## Detalhes técnicos

- `src/lib/sae-engine.ts`: melhorar `extrairSinaisSintomas` (normalização, casamento por frase e por termo, plural/singular) usando o campo `sinais` (coluna 4) do `src/data/sae-banco.json`; ajustar `renderDiagnosticoCard` para rótulos "Hipótese Diagnóstica ADEC" (`diagnostico`), "Intervenções assistenciais" (`condutas[].conduta`) e "Objetivos assistenciais" (`condutas[].objetivo`), com achados em verde.
- `src/components/MiniAppContent.tsx`: renomear o painel e o botão; manter o envio para o textarea existente.
- Migração de conteúdo do mini app (slug `DE-FUNDAMENTOS`) no banco: trocar "(Sua Fórmula)" por "(Autoral)", trocar o subtítulo do item 3 e o rótulo do campo de sinais e sintomas.

Nada além destes itens será alterado.
