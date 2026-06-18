# Simulações Reais — Mini App de Casos Clínicos

Novo mini app onde o aluno enfrenta cenários clínicos realistas (Sra. Maria Oliveira é o Cenário 01). Ao finalizar um caso, outro entra automaticamente, sorteado aleatoriamente.

## Estrutura da tela (baseada no print)

```text
┌─────────────────────────────────────┐
│ Simulações Reais         ⭐ pontos │
│ Caso 1/X                            │
├─────────────────────────────────────┤
│ 👵 Sra. Maria Oliveira  [atenção]  │
│ 68 anos · Leito 12A                 │
│ Dx: Hipertensão descompensada       │
│ "Cefaleia intensa e tontura há 2h"  │
├─────────────────────────────────────┤
│ MONITOR MULTIPARAMÉTRICO   ●REC    │
│ ╭─ ECG pulsando (animado) ────╮    │
│ │ PA 180/110  FC 96  FR 20    │    │
│ │ TEMP 36.7  SpO₂ 96  22:18   │    │
│ ╰─────────────────────────────╯    │
├─────────────────────────────────────┤
│ DECISÃO CLÍNICA                     │
│ Pergunta do caso...                 │
│ [ Opção A ]                         │
│ [ Opção B ]                         │
│ [ Opção C ]                         │
│ [ Opção D ]                         │
├─────────────────────────────────────┤
│ Após escolher: feedback colorido    │
│ (verde acerto / vermelho erro)      │
│ [ Próximo caso → ]                  │
└─────────────────────────────────────┘
```

Visual fiel ao print: card do paciente com mascote/emoji, monitor preto estilo UTI com números em verde fosforescente e linha de ECG animada pulsando conforme a FC, badge de status (atenção/crítico/estável), seção de Decisão Clínica com 4 opções.

## Conteúdo

- **1 caso inicial** já com o conteúdo completo enviado (Crise Hipertensiva — Sra. Maria Oliveira, Opção A correta, B/C/D erradas com feedbacks específicos, referências).
- Estrutura preparada para você ir adicionando mais casos depois (você disse que criará vários). Sem inventar conteúdo clínico — só entra no app o que você fornecer.
- Cada caso terá: paciente (nome, idade, leito, mascote/avatar), diagnóstico, queixa, sinais vitais (PA, FC, FR, T, SpO₂), pergunta, 4 opções com 1 correta, feedback individual por opção, e referências.

## Fluxo do aluno

1. Abre o app → sorteia 1 caso aleatório dos disponíveis.
2. Lê contexto + monitor → escolhe 1 das 4 opções.
3. Recebe feedback imediato (verde se correto, vermelho se errado) com o texto pedagógico do caso.
4. Botão "Próximo caso" → sorteia outro caso (sem repetir até passar por todos), reinicia ciclo.
5. Contador de pontos no topo (+10 por acerto, por exemplo) e contador "Caso X/total".

## Onde os casos ficam armazenados

Casos como arquivo TypeScript versionado no código (`src/data/simulacoes-reais.ts`) — rápido de adicionar e sem custo de banco. Se mais tarde você quiser editá-los pelo Admin sem mexer no código, migramos para uma tabela `simulacao_casos` no banco.

## Acesso

Mini app **pago** na loja, igual aos outros, com preço placeholder R$ 14,90 (você ajusta no Admin). Slug: `/simulacoes-reais`. Mascote do card na loja: estetoscópio + monitor.

## Detalhes técnicos

- Nova rota `src/routes/simulacoes-reais.tsx` protegida por `useAppAccess('simulacoes-reais')`.
- Novo arquivo `src/data/simulacoes-reais.ts` com array tipado de `Caso` (paciente, vitais, pergunta, opções[4], correctIndex, feedbacks[4], refs[]).
- Componente `MonitorMultiparametrico` reutilizável com SVG de ECG animado por CSS keyframes (velocidade derivada da FC).
- Migration: `INSERT` em `mini_apps` com slug `simulacoes-reais`, nome, preço 1490, ícone, `gratuito=false`, `ativo=true`.
- Sem mudanças em `AppShell` (menu já é só Loja/Minha Conta/Admin).

## O que NÃO entra agora

- Modo "plantão de 5 pacientes com ranking" — fica para depois se quiser.
- Edição de casos pelo Admin — fica para depois.
- Persistência de pontuação no banco — pontuação só na sessão atual.
