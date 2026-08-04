# Ditado por voz para o enfermeiro paramentado

Hoje não existe nada de voz no app (nenhum microfone, gravação ou transcrição no código). Este é o plano para criar o recurso.

## Como vai funcionar na prática

1. Antes de paramentar (ou com o celular no suporte/bolso), o enfermeiro abre o mini app e toca uma vez em **“Ditar”**.
2. O app entra em **Modo Plantão Mãos-Livres**: tela grande, escura, com um indicador de que está ouvindo. O microfone fica aberto de forma contínua.
3. O enfermeiro fala normalmente durante o procedimento. Cada pausa de silêncio fecha um trecho, que é transcrito e vai aparecendo na tela como uma lista de falas com horário (ex.: `14:32 — paciente refere dor abdominal intensa`).
4. Nada precisa ser tocado durante o procedimento. Comandos ditos em voz alta controlam o app:
   - “nova linha” / “parágrafo”
   - “apagar última” (remove o último trecho)
   - “pausar ditado” e “continuar ditado”
   - “finalizar ditado” (encerra a sessão)
5. Ao desparamentar, o enfermeiro revisa o texto: pode editar, apagar trechos e então **inserir no campo** de destino (Sinais e Sintomas, Anamnese, Exame Físico, Evolução ou Anotação de Enfermagem).
6. O texto ditado alimenta os motores já existentes: ao inserir em “Sinais e Sintomas”, os diagnósticos ADEC são pesquisados automaticamente como já acontece hoje com o texto digitado.
7. Tudo fica salvo em rascunho local por paciente (mesmo mecanismo de autosave já usado), então uma queda de conexão ou tela apagada não perde o ditado.

## Segurança e limites (importante deixar claro ao aluno)

- A gravação de áudio **não é armazenada** — o áudio é enviado, transcrito e descartado; só o texto fica.
- Aviso de LGPD na primeira vez: não citar nomes completos nem dados identificáveis do paciente em voz alta; o texto passa por revisão do enfermeiro antes de entrar no prontuário.
- Recurso disponível apenas para quem tem acesso ativo (trial ou pago), pelas mesmas regras dos demais módulos.

## Detalhes técnicos

- **Captura:** `MediaRecorder` no navegador (webm/opus), com detector de silêncio via `AnalyserNode` para cortar os trechos automaticamente (VAD simples, ~1,2 s de silêncio).
- **Transcrição:** server function `createServerFn` chamando o Lovable AI Gateway em `/v1/audio/transcriptions` com `openai/gpt-4o-mini-transcribe`, forçando português. Chave nunca vai ao navegador.
- **Comandos de voz:** interpretados no texto já transcrito (comparação normalizada), não exigem modelo extra.
- **Componentes novos:** `src/components/voz/DitadoProvider.tsx` (sessão, VAD, fila de envio), `src/components/voz/BotaoDitar.tsx` (botão + modal mãos-livres), `src/lib/voz/transcribe.functions.ts` (server function).
- **Integração:** botão “Ditar” ao lado dos campos de texto livre da SAE Descomplicada e do mini app de Coleta de Dados/Anotações, inserindo no `RawHtmlHost` sem quebrar o autosave atual.
- **PWA:** o app pede permissão de microfone uma única vez; funciona em Android/Chrome e iOS/Safari com a tela ligada (mantida acesa via Wake Lock quando suportado).

## Onde entra primeiro

Começar pela **SAE Descomplicada e Automatizada** (campo Sinais e Sintomas + Evolução). Depois replicar no mini app de **Coleta de Dados + Admissão de Turno**.
