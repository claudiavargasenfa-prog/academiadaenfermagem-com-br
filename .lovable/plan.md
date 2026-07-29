# Correção do mini app SAE Descomplicada e Automatizada

## O que está acontecendo (diagnóstico confirmado em teste real)

Abri o mini app no navegador, digitei no campo "Nome do Paciente" e observei o comportamento:

- Depois de ~1,5s digitando, o conteúdo inteiro do mini app é **recriado do zero** na tela.
- Resultado medido: sanfona que estava aberta volta a fechar, o valor digitado no campo volta vazio, e qualquer marca colocada nos elementos desaparece (prova de que o HTML foi reinjetado, não apenas alterado).
- Clicar num chip de sinal/sintoma escreve o texto na caixa de "Sinais e Sintomas", mas na sequência esse mesmo ciclo apaga tudo — foi exatamente o que reproduzi (caixa voltou vazia).

## Causa

O mini app tem um **salvamento automático** que dispara 400 ms depois de cada tecla/clique. Esse salvamento atualiza o estado do React (lista de pacientes). Toda atualização de estado nesse componente faz o React **reinjetar o HTML bruto do mini app**, destruindo o DOM vivo: campos preenchidos, sanfonas abertas, diagnósticos gerados e a tabela de prescrição.

Ou seja: quanto mais o usuário digita, mais o app se apaga sozinho. Não é problema do conteúdo cadastrado no admin — é da forma como o componente injeta e re-injeta o HTML.

Um segundo agravante: ao trocar de paciente (ou quando o estado é revalidado), uma rotina restaura os campos a partir do último "retrato" salvo e limpa os painéis de diagnóstico e prescrição — se rodar fora de hora, ela também apaga o que a pessoa acabou de digitar.

## Correção proposta

1. **Isolar o HTML do mini app do ciclo de render do React.** Criar um componente dedicado (memoizado) que injeta o HTML uma única vez, de forma imperativa, quando o conteúdo muda de fato. Atualizações de estado (autosave, troca de aba, histórico) passam a não tocar mais no DOM do mini app.
2. **Autosave sem efeito colateral visual.** Manter o salvamento a cada 400 ms em localStorage, mas gravando por referência (sem provocar re-render do bloco de conteúdo). A lista de abas de pacientes continua reagindo apenas a nome/leito.
3. **Restauração apenas quando faz sentido.** A restauração de campos e a limpeza de diagnósticos/prescrição passam a rodar somente na troca explícita de paciente ou na primeira montagem — nunca durante a digitação.
4. **Revalidar ponta a ponta no navegador** depois do ajuste: digitar em vários campos, abrir/fechar sanfonas, clicar em chips, gerar diagnósticos, marcar prioridade, gerar prescrição, gerar evolução, trocar de paciente e voltar, e conferir que nada se apaga.

## Detalhes técnicos

- Arquivo principal: `src/components/MiniAppContent.tsx`.
- O bloco `isSae ? <div className="mini-app-html" dangerouslySetInnerHTML={{ __html: html }} /> : renderContent(html)` sai do corpo do componente com estado e vai para um subcomponente `RawHtmlHost` com `React.memo`, que escreve `el.innerHTML` num `useEffect` dependente apenas de `html`.
- Autosave (`root.addEventListener("input"/"change")`) passa a usar uma ref de rascunho + gravação direta no localStorage, sincronizando o estado React só quando nome/leito mudarem (o que precisa aparecer nas abas).
- Efeito de restauração (`restoreFormSnap` + limpeza de `#sae-diag-dinamicos`, `#corpo-tabela-prescricao`) passa a depender de um contador de troca de paciente, não de `sae.ativoId` derivado de estado que muda a cada salvamento.
- Os listeners do motor SAE (chips, gerar diagnóstico/prescrição/evolução, exportação PDF) continuam registrados no `ref` externo, que não é recriado.
- Sem alteração no conteúdo cadastrado no banco e sem mudança de design.
