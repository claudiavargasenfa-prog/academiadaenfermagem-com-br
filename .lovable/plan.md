
## Objetivo
Redesenhar `/vendas` no estilo premium (verde escuro + dourado), aplicar o novo logo **ADEC** em todo o site, e aplicar todos os ajustes de texto pedidos.

## 1. Logo ADEC em todo o site
- Fazer upload do ADEC via `lovable-assets` → substituir `src/assets/logo.png.asset.json` (mantém o mesmo caminho, então PWA/topo/favicon herdam automaticamente).
- Regenerar ícones PWA (192, 512, maskable) a partir do ADEC.
- Deixar o hexagonal como asset backup para caso queira voltar (não referenciado).

## 2. Landing `/vendas` — visual verde escuro + dourado
Reescrever `src/routes/vendas.tsx` mantendo estrutura de dados (planos vindos do DB), trocando só o skin visual:

- **Paleta local da página** (definida inline no root da rota, não polui o resto do app):
  - Fundo: `#0d3b2e` (verde profundo) com camadas `#0a2f24` / `#124a3a`
  - Acento: `#d4af37` (dourado) e `#f0d78c` (dourado claro)
  - Texto: `#f5f0e0` (creme) e `#ffffff`
- Efeitos: glows radiais dourados, glassmorphism escuro (`bg-white/5 backdrop-blur border border-white/10`), divisores dourados finos.
- Header com **logo ADEC** grande + subtítulos "AVALIAÇÃO DIAGNÓSTICA EM ENFERMAGEM CLÍNICA" / "SISTEMA BRASILEIRO DE HIPÓTESES DIAGNÓSTICAS DE ENFERMAGEM" como cabeçalho (substituindo o header antigo).

## 3. Ajustes de copy na `/vendas`

**Hero (bloco 1):**
- Título: *"Enfermagem Baseada em Evidências: escolha o App certo para o seu momento na Enfermagem"*
- Subtítulo: *"4 apps completos com SAE automatizada, processos de enfermagem, escalas clínicas, procedimentos, farmacologia e simulações reais. Estágios e plantões fundamentado em evidência científica."*
- **Remover os 2 botões do 1º bloco.**

**Barra de credibilidade:**
- "Aprovado por quem vive o plantão e o consultório"
- Trocar "mini apps" por **"Módulos de Suporte à Decisão Clínica (MSDC)"** em toda a página.
- Trocar bullet base de dados → **"Resoluções, normas, diretrizes e protocolos atualizados"**
- Trocar "atualizações mensais" → **"atualizações contínuas e automáticas"**
- Incluir bullet **"Com certificação opcional"**.

**Bloco "Plantão com a Academia" (Before x After / benefícios):**
Substituir os bullets pelos 5 exatos:
- ✅ Anotação e evolução gerada automaticamente de acordo com suas avaliações
- ✅ Farmacologia e aprazamento baseados nas metas de segurança do paciente
- ✅ SAE + PE personalizados por paciente, com prescrição automatizada
- ✅ 22+ escalas clínicas atualizadas, offline
- ✅ Procedimentos passo a passo antes de encostar no paciente

**Slogans dos cards de app (na /vendas E na /loja):**
- Acadêmico → *"Do primeiro ao último estágio, sem sofrer."*
- Enfermeiro → *"Menos burocracia, mais assistência com tranquilidade."*
- (Técnico e Técnico-Estudante mantêm slogans atuais — ela não pediu troca)

**Todos os apps — descrição de quizzes:**
Adicionar linha padrão: *"Quizzes por tema para fixar antes da prova"*.

## 4. Nova seção "SOBRE A AUTORA" (antes do FAQ)
Adicionar bloco em card escuro com dourado, dividido em 3 subseções:

- **A História** — texto completo enviado
- **O Propósito** — texto completo enviado
- **Minha Promessa** — texto completo enviado
- Título de abertura: *"Conheça um pouco da minha História"*
- Foto opcional da fundadora (já existe `src/assets/foto-fundadora.jpeg.asset.json`).
- CTA discreto no fim: link para `/minha-historia`.

## 5. Também na /loja
- Aplicar os 2 slogans novos (Acadêmico e Enfermeiro) nos cards.
- Trocar "mini apps" por "MSDC" no texto público.

## 6. Publicar
Depois de aplicado + validado no preview, publicar para o domínio atualizar.

---

### Detalhes técnicos
- Textos ficam em `app_texts` (chaves `plano.*` e `vendas.*`), então dá pra editar depois sem código.
- A troca "mini apps" → "MSDC" é só em copy **público** (`/vendas`, `/loja`, `/planos/$slug`, `/minha-historia`); admin e código interno continuam "mini_apps" (é nome de tabela).
- Logo é substituição do asset existente → nada muda em código que referencia `logo.png.asset.json`.
- Nenhuma mudança de schema / backend.
