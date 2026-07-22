
## Diagnóstico

O HTML do mini app **Coleta de Dados + Admissão de Turno** (slug `ColetaDados-AdmissãoTurno`) já contém:

- Formulário completo (inputs de texto, radios, checkboxes, textareas de observação por seção).
- Botão verde `<button onclick="processarProntuarioTecnico()">Gerar Anotação</button>`.
- Textarea `#anotacao_final_painel` para o rascunho.
- Uma tag `<script>` com a função `processarProntuarioTecnico()`.

**Problema:** o `MiniAppContent` renderiza o HTML via React (innerHTML). Navegadores **não executam** `<script>` inserido dessa forma, e handlers inline `onclick="..."` também não encontram a função. Por isso o botão não faz nada — mesma causa que já resolvemos para o SAE e os botões salvar prescrição/evolução.

## O que fazer (somente frontend, sem tocar no conteúdo do banco)

Editar **apenas** `src/components/MiniAppContent.tsx` para adicionar um novo bloco de comportamento, no mesmo padrão dos já existentes (SAE, salvar prescrição). Nada no visual muda.

### Passos

1. Detectar o mini app pela presença dos IDs característicos no HTML (`#anotacao_final_painel` e ao menos um `[name="item_procedencia"]`). Não depende de slug — se o admin duplicar/renomear continua funcionando.

2. Adicionar um listener de clique delegado que dispara quando o usuário clicar no botão "Gerar Anotação" (identificado por texto do botão + presença de `onclick*="processarProntuarioTecnico"`). Chamar `e.preventDefault()` e rodar nossa função nativa.

3. Implementar `gerarAnotacaoTecnica(root)` que, para cada seção do formulário, coleta:
   - **Identificação:** valores dos inputs de texto (nome, leito, idade, data/hora se existirem).
   - **Radios marcados:** para cada grupo `name="item_*"`, pega o `value` do radio `:checked`.
   - **Checkboxes marcados:** pega o texto do `<label>` pai (removendo o quadradinho ⬜ decorativo).
   - **Observações livres:** valor de cada `<textarea id="obs_*">` não vazio.

4. Montar o rascunho em texto corrido, em formato de anotação técnica cefalocaudal, agrupando por seção na mesma ordem em que aparecem no formulário (procedência → neurológico → pele → e assim por diante). Exemplo de linha gerada:
   ```
   Paciente João da Silva, leito 204-A, vinda do plantão anterior. 
   Encontra-se consciente e orientado, calmo e cooperativo. 
   Pele corada e hidratada, íntegra e sem lesões. (...)
   Obs.: [texto da caixa de observações da seção, se houver].
   ```

5. Escrever o resultado em `#anotacao_final_painel` (a textarea permanece editável, como já está). Disparar `input` event para o React não sobrescrever.

6. Se nenhum campo estiver preenchido/marcado, mostrar `alert("Preencha ou marque ao menos um item antes de gerar a anotação.")`.

7. Registrar o cleanup do listener no `useEffect` (como os demais).

### Detalhes técnicos

- Local: dentro do mesmo `useEffect` que já trata SAE e botões de download, adicionar bloco `isColetaTecnico` logo após o bloco SAE.
- Sem novas dependências. Sem migration. Sem alteração no `content_md` do banco.
- Não altera cores, layout, textos nem qualquer elemento do HTML já cadastrado.

### Validação

Rodar Playwright em `/app/ColetaDados-AdmissãoTurno`: preencher nome + leito, marcar 2–3 radios/checkboxes, clicar em "Gerar Anotação" e verificar que `#anotacao_final_painel` recebeu o rascunho formatado.
