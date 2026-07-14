## Causa raiz

Todo o "cérebro" JS do mini app SAE está dentro de:

```js
document.addEventListener("DOMContentLoaded", function() { ... });
```

Esse evento já disparou muito antes do React injetar o HTML do mini app. Quando o script é re-executado, o callback nunca roda → **nenhum event listener é registrado** → o botão "Gerar Diagnósticos", os checkboxes do exame e a numeração de prioridade ficam inertes. Explica exatamente o sintoma: você preenche tudo, clica e nada acontece.

## Correção (mínima e cirúrgica)

Editar apenas `src/components/MiniAppContent.tsx` no bloco que já re-injeta os `<script>` do SAE:

1. Após re-executar os scripts, disparar um `DOMContentLoaded` sintético no `document` para que o callback do próprio HTML rode e registre todos os listeners internos (botão gerar diagnósticos, checkboxes do exame, prioridade, etc.).
2. Manter tudo o que já existe: listener do textarea manual, cleanup, marcador `lavoble-sae-descomplicada`.

## O que NÃO muda

- Nenhuma alteração de design, cores, banner, ordem das seções.
- Nenhuma alteração no `content_md` do banco (nenhuma migration).
- Nenhuma mudança no comportamento dos outros mini apps.
- A lógica clínica (matriz de diagnósticos, prescrição, evolução) continua exatamente como está no seu HTML — só passa a **funcionar** porque agora os listeners são anexados.

## Verificação

Playwright abrindo a rota do mini app → marca 2 checkboxes do exame + digita "dor no peito" na caixa de sintomas → clica em "Gerar Diagnósticos" → confere que `#grade-diagnosticos-prioridade` fica visível e ao menos 1 `#card_diag_*` aparece. Sem isso, não fecho.

## Arquivos tocados

- `src/components/MiniAppContent.tsx` — adicionar `document.dispatchEvent(new Event("DOMContentLoaded"))` logo após o loop que recria os `<script>`.

Zero migração, zero mudança visual, ~1 linha efetiva de código.