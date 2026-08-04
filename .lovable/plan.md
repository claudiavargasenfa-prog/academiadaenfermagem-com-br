# Bloco de Ditado por Voz (gratuito) na SAE Descomplicada

Hoje não existe nenhum recurso de voz no app. Este plano cria um **espaço próprio de ditado** dentro do mini app SAE Descomplicada e Automatizada, sem custo de IA.

## Por que um bloco próprio (e não ditar direto no campo)

Durante o procedimento o enfermeiro está paramentado, a tela apaga, ele troca de aba ou de paciente — se o texto fosse direto para um campo, ele se perderia ou cairia no lugar errado. Um bloco único e independente recebe tudo, guarda em rascunho e só depois o profissional decide onde colar.

## Como vai funcionar

1. No topo da SAE aparece um cartão **“Ditado de Plantão (voz)”**, no mesmo padrão visual verde/glass do mini app.
2. Um botão grande **“Iniciar ditado”**. Ao tocar, o cartão fica em modo ouvindo (indicador pulsando) e o microfone permanece aberto.
3. O enfermeiro fala; o texto aparece linha a linha com horário, ex.: `14:32 — paciente refere dor abdominal intensa`.
4. Comandos falados, sem tocar na tela: “nova linha”, “apagar última”, “pausar ditado”, “continuar ditado”, “finalizar ditado”.
5. Ao desparamentar, ele revisa e edita o texto livremente na caixa.
6. Botões de saída:
   - **Copiar tudo** (para colar onde quiser)
   - **Enviar para Sinais e Sintomas** (dispara a busca automática de diagnósticos ADEC já existente)
   - **Enviar para Evolução**
   - **Limpar**
7. Tudo salvo em rascunho local por paciente, junto do autosave atual — apagar a tela ou cair a internet não perde o ditado.

## Custo: zero

Usa o reconhecimento de voz **do próprio celular** (Web Speech API — a mesma engine do teclado com microfone). O áudio não passa pelo nosso servidor e **não consome crédito de IA**, hoje nem no futuro.

- Funciona em Android/Chrome e iPhone/Safari (iOS 14.5+). Em navegadores sem suporte o cartão mostra um aviso curto em vez do botão.
- Precisa de internet; nenhum áudio é gravado ou armazenado.
- Um **dicionário de correção automática** de termos de enfermagem melhora a precisão (“dispineia” → dispneia, “sat 92” → SatO₂ 92%, “fc 110” → FC 110 bpm), e pode ser ampliado depois.
- Aviso de LGPD na primeira vez: não falar nome completo nem dados identificáveis; o texto passa por revisão antes de ir ao prontuário.

## Detalhes técnicos

- `src/lib/voz/speech.ts`: wrapper do `webkitSpeechRecognition`/`SpeechRecognition` com `continuous`, `interimResults`, `lang: "pt-BR"`, reinício automático em `onend`, detecção de suporte e Wake Lock quando disponível.
- `src/lib/voz/dicionario.ts`: normalização e correção dos termos técnicos + interpretação dos comandos de voz sobre o texto já transcrito.
- `src/components/voz/BlocoDitado.tsx`: cartão React com estado de sessão, lista de trechos, textarea editável e botões de saída.
- Integração em `src/components/MiniAppContent.tsx`: o cartão é renderizado **fora** do `RawHtmlHost` (acima do HTML bruto), então não interfere no autosave nem provoca reinjeção do DOM. Os botões “Enviar para…” escrevem no `textarea` alvo dentro do host via `ref` + disparo de evento `input`, exatamente como já é feito hoje pelos chips de sintomas.
- Rascunho no mesmo `localStorage` por paciente usado pelo autosave da SAE.
- Renderizado só no cliente (checagem de suporte em `useEffect`), sem tocar em SSR.
- Nenhuma mudança no conteúdo cadastrado no banco, no design existente ou no motor `sae-engine.ts`.
