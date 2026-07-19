
## Diagnóstico

Auditei o mini app **SAE Descomplicada e Automatizada** (id `c020e2e7…`) e encontrei **dois problemas** que explicam por que os botões de baixar Prescrição e Evolução não funcionam — principalmente no celular (você está em viewport 411px):

### Problema 1 — Erro de JavaScript em cascata
O HTML salvo no banco tem **25 chamadas inline** para uma função chamada `atualizarEvolucaoAutomatica()` (em `oninput=` e `onchange=` de vários campos: Nome, Idade, Leito, checkboxes de exame físico, etc.). Essa função **não existe mais** — foi substituída pelo motor novo (`sae-engine.ts`), mas as chamadas antigas ficaram no HTML.

Resultado (confirmado no console do preview):
```
Uncaught ReferenceError: atualizarEvolucaoAutomatica is not defined
```
Todo clique/digitação em campo do paciente ou checkbox dispara esse erro, o que **interrompe a propagação de eventos** e, em alguns navegadores mobile, também impede o preenchimento correto da caixa de evolução.

### Problema 2 — Exportação usa popup (bloqueado no celular)
Os botões **📄 Exportar Evolução (PDF ABNT)** e **📄 Exportar Prescrição (PDF ABNT)** hoje chamam `window.open("", "_blank")` para abrir uma nova aba com o conteúdo e disparar `window.print()`. Isso é bloqueado por padrão em:
- Chrome/Safari no celular (bloqueador de popup ativo)
- App instalado como PWA
- WebView do Instagram/Facebook

Quando o popup é bloqueado, o código mostra `alert("Habilite popups para exportar em PDF.")` — mas em muitos navegadores mobile nem esse alerta aparece: o clique simplesmente "não faz nada".

---

## Correção proposta

### 1. Neutralizar o `ReferenceError` (arquivo `src/components/MiniAppContent.tsx`)
Dentro do bloco `if (isSaeApp)`, expor no `window` uma função `atualizarEvolucaoAutomatica` como **no-op** (função vazia). Assim as 25 chamadas inline param de quebrar sem precisar reescrever o HTML gigante do banco. Também remove essa função no cleanup do `useEffect`.

### 2. Trocar popup por **download direto** (mesmo padrão dos botões `.doc` que já funcionam)
Substituir `abrirParaImprimir()` por `baixarHtmlAbnt()`:
- Gera o mesmo HTML formatado em ABNT (Times New Roman 12pt, margens 3/2cm, espaço para assinatura e carimbo).
- Empacota em `Blob` do tipo `text/html`.
- Usa `<a download="Evolucao_ABNT.html">` para baixar direto — **funciona em 100% dos navegadores mobile e desktop, sem popup**.
- O arquivo baixado abre no navegador do celular e o usuário usa "Imprimir / Salvar em PDF" nativo do sistema (mesmo comportamento visual do ABNT que já existe).

Renomear os rótulos para deixar claro:
- **📄 Baixar Evolução (ABNT)**
- **📄 Baixar Prescrição (ABNT)**

### 3. Ajuste de UX
- Se o usuário clicar em "Baixar Evolução" sem ter gerado a evolução consolidada antes, **gerar automaticamente** e depois baixar (hoje mostra um `alert` e não faz nada) — evita o "não funciona" quando o passo intermediário foi pulado.
- Mesma coisa para prescrição: se houver diagnósticos selecionados mas o usuário não clicou em "Gerar Prescrição", chamar `gerarPrescricao()` antes do download.

---

## Escopo

Só **1 arquivo** alterado, sem tocar no HTML do banco nem no visual:
- `src/components/MiniAppContent.tsx` — dentro do bloco `isSaeApp`:
  - Expor `window.atualizarEvolucaoAutomatica = () => {}` (com cleanup).
  - Substituir `abrirParaImprimir` por `baixarHtmlAbnt` (Blob + `<a download>`).
  - Atualizar `exportarEvolucaoAbnt` e `exportarPrescricaoAbnt` para chamar `gerarEvolucao()`/`gerarPrescricao()` automaticamente quando faltar dado.
  - Renomear texto dos botões injetados.

Sem alteração no banco, no `sae-engine.ts`, no design ou no fluxo.
