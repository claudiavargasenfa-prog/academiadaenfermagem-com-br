## Mini app: 8 Escalas Clínicas (Acadêmico)

Criar novo mini app didático com 8 escalas clínicas, usando o mesmo padrão visual do "Time Contra as IRAS" (banner com mascotes + cores clarinhas), acordeões (clicar no título abre o conteúdo), cards e tabelas.

### Rota e navegação
- Nova rota: `src/routes/escalas-clinicas.tsx` → URL `/escalas-clinicas`.
- Slug do mini app: `escalas-clinicas`, título "Escalas Clínicas na Prática", ícone 📊.
- Cadastrar no Admin como placement no app **Acadêmico** (e disponível para inclusão manual em Estudante Técnico, Técnico, Enfermeiro conforme desejo da fundadora — sem forçar).
- Registro no `AppShell` (menu lateral / grid de mini apps do Acadêmico).

### Estrutura da página (padrão IRAS)
1. `PageHeader` — eyebrow "Avaliação Clínica", título "Escalas Clínicas na Prática", descrição curta e didática.
2. `MiniAppContent slug="escalas-clinicas"` (permite edição no Admin).
3. **Banner inicial** com mascotes (mesmo layout do IRAS: dois mascotes + faixa dourada central "ESCALAS QUE SALVAM VIDAS").
4. Bloco introdutório curto: "O que é uma escala clínica e por que usar?" em card claro.
5. **8 acordeões (Accordion)** — um por escala. Clicar no título abre:
   - **Finalidade** (parágrafo curto, linguagem de estudante).
   - **Como aplicar** (passo a passo numerado).
   - **Tabela de pontuação/critérios** (usar `Table` do shadcn) com cores clarinhas por faixa de risco (verde/amarelo/laranja/vermelho suave via tokens `success/warning/destructive` com opacidade).
   - **Interpretação do resultado** (cards coloridos por faixa).
   - **Dica da Enfa** (caixinha destacada com emoji 💡).

### As 8 escalas (agrupadas visualmente com sub-headers)

**Risco assistencial**
1. **Braden** — risco de Lesão por Pressão (percepção sensorial, umidade, atividade, mobilidade, nutrição, fricção/cisalhamento). Tabela 1–4 pts por item, total 6–23, faixas de risco.
2. **Morse** — risco de quedas (histórico, dx secundário, auxílio marcha, terapia EV, marcha, estado mental). Faixas: baixo/moderado/alto.

**Neurológicas**
3. **Glasgow (ECG)** — abertura ocular (1–4), verbal (1–5), motora (1–6). Total 3–15. Incluir observação de reatividade pupilar (versão atualizada ECG-P) de forma simples.
4. **RASS** — sedação/agitação em UTI, escala de +4 a −5 com descrição de cada nível.

**Dor**
5. **EVA e Escala de Faces** — juntas em um só acordeão: régua 0–10 + faces (leve/moderada/intensa). Como aplicar em adulto vs criança/idoso.

**Deterioração clínica**
6. **NEWS** — FR, SpO₂, uso de O₂, PAS, FC, nível de consciência, temperatura. Tabela de pontuação por parâmetro + faixas de ação (baixo/médio/alto risco).
7. **PEWS** — versão pediátrica: comportamento, cardiovascular, respiratório. Tabela + condutas.

**Gerencial**
8. **Fugulin** — grau de dependência (cuidados mínimos → intensivos) para dimensionamento de equipe. Tabela com os 9 indicadores + faixas de classificação.

### Regras de conteúdo (pedidos explícitos da usuária)
- **NÃO** incluir "Resumo dos pontos-chave" no final.
- **NÃO** citar NANDA, NIC, NOC nem CIPE em lugar nenhum.
- Toda tabela deve ter obrigatoriamente **Finalidade** e **Como aplicar**.
- Linguagem para estudante: técnica, curta, didática, sem jargão gratuito.

### Estilo visual
- Reaproveitar tokens já existentes (`primary`, `gold`, `success`, `warning`, `destructive`, `muted`) — sem cores hardcoded.
- Cards com `glass` / `bg-card`, bordas suaves `border-gold/30`.
- Acordeões com `Accordion` (shadcn) — clicar no título abre.
- Faixas de risco em badges/cards com fundo suave (opacidade baixa dos tokens semânticos).

### Arquivos a criar/editar
- **Criar** `src/routes/escalas-clinicas.tsx` (página completa com as 8 escalas).
- **Editar** `src/components/AppShell.tsx` — adicionar entrada no menu do app Acadêmico.
- **Migration** — inserir linha em `mini_apps` (slug `escalas-clinicas`) + `mini_app_placements` para o app Acadêmico (para aparecer no Admin e permitir edição de vídeo/áudio/texto).

### Verificação
- Abrir `/escalas-clinicas` no preview e conferir: banner com mascotes, 8 acordeões abrem/fecham, tabelas legíveis, cores claras, ausência de menção a NANDA/NIC/NOC/CIPE, ausência de bloco "resumo".
- Confirmar no Admin (Mini apps) que a escala aparece dentro do app Acadêmico.
