# Plano atualizado: Diagnósticos AE/DE + Prescrição em 5 passos

## Visão geral (fluxo completo em 2 minutos)

Tela única, wizard numerado de **5 passos**, cada um em seu próprio bloco (o próximo só destrava quando o anterior é preenchido):

```text
[1] Anamnese  →  [2] Exame Físico  →  [3] Sinais e Sintomas  →  [4] Diagnósticos (CDE / MM / RC)  →  [5] Prescrição
```

## Instruções na tela (texto no topo)

Card em destaque:

> **Como montar diagnósticos e prescrição em 2 minutos**
> 1. **Anamnese** — dados do paciente e queixa principal.
> 2. **Exame Físico** — o que você observou (por sistema).
> 3. **Sinais e Sintomas** — marque os chips que descrevem o quadro.
> 4. **Diagnósticos** — o app mostra os diagnósticos que combinam com Condutas (CDE), Meta (MM) e Raciocínio Clínico (RC). Marque os que se aplicam.
> 5. **Prescrição** — a tabela sai pronta (Nº | Diagnóstico | Horário | Aprazamento). Imprimir ou salvar em PDF.

## Passo 1 — Anamnese
Formulário curto (tudo opcional para não travar o fluxo):
- Nome do paciente, idade, sexo, leito, clínica/setor.
- Queixa principal (texto curto).
- HDA — História da Doença Atual (texto).
- Antecedentes (comorbidades, alergias, medicações em uso — chips + campo livre).

Botão **"Avançar para Exame Físico"**.

## Passo 2 — Exame Físico
Checklist rápido, organizado por sistema (usa os mesmos 13 blocos da sua base):
- **Nível de consciência / Neurológico**: Glasgow, pupilas, orientação.
- **Cardiovascular**: PA, FC, perfusão, edema.
- **Respiratório**: FR, SatO₂, ausculta, padrão respiratório, uso de musculatura acessória.
- **Gastrointestinal**: RHA, distensão, náusea/vômito.
- **Geniturinário**: diurese, características.
- **Pele e mucosas**: cor, hidratação, integridade, lesões.
- **Mobilidade / Segurança**: mobilidade, risco de queda, dispositivos invasivos.

Cada linha é um chip on/off + um campo pequeno para valor (quando aplicável: PA, FC, SatO₂, Glasgow etc.). Os chips ligados aqui **abastecem automaticamente o Passo 3**.

Botão **"Avançar para Sinais e Sintomas"**.

## Passo 3 — Sinais e Sintomas
- Dropdown **Clínica / Sistema** (default = todas ou o setor da Anamnese).
- Grid de chips com todos os sinais/sintomas derivados da sua planilha (dor, dispneia, febre, agitação, sangramento, náusea, edema, taquicardia, pupilas anisocóricas, sonolência, distensão abdominal, disúria…).
- Chips já marcados no Passo 2 vêm pré-selecionados. O aluno confirma / adiciona / remove.
- Campo "Outro sintoma" (texto livre, entra na busca).

Botão **"Ver diagnósticos"**.

## Passo 4 — Diagnósticos (CDE / MM / RC)
- Lista ranqueada de diagnósticos autorais AE/DE que batem com os sintomas selecionados.
- Cada card tem checkbox e mostra:
  - **Título** + badge com ID gatilho (BL01_NEURO_01…).
  - **Sinais/sintomas** — chips (bateram = dourado).
  - **Meta (MM)** — callout verde.
  - **Raciocínio Clínico (RC)** — callout dourado.
  - **Condutas (CDE)** — lista numerada, cada uma com o **Aprazamento** ao lado.
- Rodapé fixo: "**X diagnósticos selecionados**" + botão **"Gerar Prescrição"** (destrava com ≥1).

## Passo 5 — Prescrição
- Cabeçalho puxado da Anamnese: paciente, leito, clínica, data.
- **Tabela final com 4 colunas exatas**:

  | Nº | Diagnóstico | Horário | Aprazamento |
  |----|-------------|---------|-------------|
  | 1 | Rebaixamento do Nível de Consciência com Risco de Aspiração | 06 - 08 - 10 - 12 - 14 - 16 - 18 - 20 - 22 - 24 - 02 - 04 | Avaliar nível de consciência (Escala de Glasgow) — De 2h em 2h |
  | 1 | Rebaixamento do Nível de Consciência com Risco de Aspiração | Contínuo | Manter cabeceira a 30° — Rotina do leito |
  | 2 | Agitação Psicomotora com Risco à Integridade Física | 10 - 22 | Avaliar fatores desencadeantes — 1x por plantão |

  Cada conduta do diagnóstico vira uma linha; o **Nº** repete dentro do mesmo diagnóstico.
- Botões: **Imprimir / Salvar PDF**, **Copiar tabela**, **Voltar aos diagnósticos**.

## Regra automática de horário (determinística, sem IA)
- "De 2h em 2h" → `06-08-10-12-14-16-18-20-22-24-02-04`
- "De 4h em 4h" → `06-10-14-18-22-02`
- "De 6h em 6h" → `06-12-18-24`
- "De 8h em 8h" → `06-14-22`
- "De 12h em 12h" / "1x por plantão" → `10-22`
- "1x ao dia" → `10`
- "Contínuo" / "Rotina do leito" / "À beira do leito" → `Contínuo`
- Texto com horários próprios (ex.: "8/8h = 14h - 22h - 06h") → usa os do próprio texto.

## Banco de dados (Lovable Cloud)

Duas tabelas novas, alimentadas pela sua planilha (38 diagnósticos, 13 sistemas):

- **`diagnosticos_aede`** — `id`, `id_gatilho`, `bloco`, `bloco_label`, `titulo`, `sinais_sintomas text[]`, `meta_mm`, `raciocinio_rc`, `ordem`.
- **`diagnosticos_condutas`** — `diagnostico_id`, `ordem`, `conduta_cde`, `aprazamento`, `horario_padrao`.

RLS: SELECT para `authenticated`; INSERT/UPDATE/DELETE só admin. GRANTs incluídos.

## Admin — nova aba "Diagnósticos AE/DE"
- Lista completa por bloco.
- Editar título, sinais, meta, raciocínio, condutas, aprazamentos.
- Adicionar / apagar / reordenar.
- (Fase futura) reimportar planilha.

## Registro do mini app
- **"Diagnósticos e Prescrição AE/DE"** no catálogo.
- Vinculado às 4 trilhas (Acadêmico, Técnico, Enfermeiro, Estudante).
- Você decide depois se é gratuito ou pago e a posição.

## O que NÃO faço nesta fase
- Sem IA / chat (100% determinístico, custo zero, aprovado para Play Store).
- Sem NANDA/NIC/NOC/CIPE — só sua nomenclatura AE/DE.
- Nada é apagado ou movido do que já existe.

## Detalhes técnicos
- Rota: `src/routes/_authenticated/diagnosticos-aede.tsx`.
- Stepper controlado por state; cada passo salvo em memória (não persiste no banco — o aluno gera e imprime).
- Import via `code--exec` (Python lê o `.xlsx`) → SQL insert.
- Busca: 1 `SELECT *` (38 registros), interseção de arrays em JS, ranquear por nº de sintomas em comum.
- Prescrição: render de `<table>` + `window.print()` (mesma técnica da `/prescricao`).

## Ordem de execução (depois que você aprovar)
1. Migração das 2 tabelas + RLS + grants.
2. Importar os 38 diagnósticos e 4 condutas cada, com `horario_padrao` calculado.
3. Criar a página `/diagnosticos-aede` com o wizard de 5 passos.
4. Aba "Diagnósticos AE/DE" no admin.
5. Registrar o mini app e vincular às 4 trilhas.

Aprove e eu começo pela migração.
