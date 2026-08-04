# Bloco de Ditado por Voz no mini app do Técnico (Coleta de Dados + Admissão de Turno)

Sim, o local que você escolheu é o melhor: logo depois da sanfona 6 e **antes** do botão “Gerar Anotação”. O profissional termina de marcar tudo, dita o complemento em texto livre e só então gera a anotação — o que foi ditado já entra no texto final.

## O que será feito

O mesmo bloco gratuito já entregue na SAE, reaproveitado aqui (sem duplicar código e sem custo de IA — usa o microfone do próprio aparelho).

1. Um cartão **“Ditado de Plantão (voz)”** aparece exatamente acima do botão **Gerar Anotação**.
2. Botão grande **“Iniciar ditado”**, indicador pulsando enquanto ouve, texto em linhas com horário.
3. Comandos por voz: “nova linha”, “apagar última”, “pausar ditado”, “continuar ditado”, “finalizar ditado”.
4. Correção automática dos termos técnicos (PA, FC, SatO₂, MMII, dispneia etc.), a mesma da SAE.
5. Botões de saída adaptados a este mini app:
   - **Copiar tudo**
   - **Enviar para Observações do turno** — insere no campo de notas de queixas/eliminações, então o texto ditado passa a compor a anotação gerada
   - **Enviar direto para a Anotação Final** — acrescenta ao painel de anotação já gerado, sem apagá-lo
   - **Limpar**
6. Rascunho salvo por paciente (cada aba de paciente tem o seu ditado), junto do autosave atual.
7. Aviso de LGPD na primeira vez: não falar nome completo nem dados identificáveis; o áudio não é gravado.

## Detalhes técnicos

- Reutiliza `src/components/voz/BlocoDitado.tsx`, `src/lib/voz/speech.ts` e `src/lib/voz/dicionario.ts` já existentes; o componente ganha uma prop opcional de rótulos/alvos para atender os dois mini apps.
- Posicionamento: em `src/components/MiniAppContent.tsx`, no bloco `isColeta`, um `<div>` âncora é inserido no DOM imediatamente antes do botão cujo texto casa com `/gerar\s+anota/` (mesma detecção já usada pelo listener de clique). O cartão é renderizado nele com `createPortal`, então o React não reinjeta o HTML do mini app e nada do formulário se perde. Se a âncora não for encontrada, o cartão cai para o topo do conteúdo.
- Alvos de inserção: `#obs_queixas` (Observações do turno) e `#anotacao_final_painel` (Anotação Final), sempre acrescentando ao conteúdo existente e disparando `input`/`change` para o autosave registrar.
- Rascunho no `localStorage` com chave por paciente ativo do estado `coleta-turno-v1`.
- Nenhuma alteração no design, no conteúdo do banco ou na lógica de geração da anotação.
