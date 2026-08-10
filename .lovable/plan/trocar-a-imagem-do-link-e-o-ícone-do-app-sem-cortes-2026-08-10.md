# Trocar a imagem do link e o ícone do app (sem cortes)

## O que está errado hoje

1. **Prévia do link (WhatsApp/Google):** a imagem que aparece é uma antiga hospedada fora do projeto (`LOGO_DO_APP_-_SEM_NOME.webp`), por isso continua a mesma mesmo depois dos pedidos de troca.
2. **Ícone do app instalado:** os ícones atuais (`icon-192.png` e `icon-512.png`) também são usados como "maskable". O Android recorta o maskable em círculo, e como o logo é alto (marca + texto ADEC), sobra só a faixa do meio — exatamente o que aparece na sua imagem.

## O que será feito

1. **Nova arte** — usar a imagem quadrada da ADEC que você enviou (marca + ADEC + subtítulo) como arte oficial.
2. **Prévia do link** — substituir o endereço da imagem antiga por essa nova arte, com a logo inteira e fundo claro, para WhatsApp, Facebook e X mostrarem a marca completa.
3. **Ícone do app** — gerar novos ícones:
   - ícones "normais" (192 e 512) com a arte inteira, sem corte;
   - ícones **maskable separados** com bastante margem em volta (arte ocupando o centro), para que o recorte circular do Android não corte topo nem base;
   - favicon novo a partir da mesma arte.
4. **Conferência** — verificar visualmente os ícones gerados e a prévia do link antes de encerrar.

## Detalhes técnicos

- Subir a arte enviada como asset do projeto e usar a URL absoluta (domínio `academiadaenfermagem.com.br`) em `og:image` e `twitter:image` em `src/routes/__root.tsx`.
- Regerar `public/icon-192.png`, `public/icon-512.png` e `public/favicon.png` com ImageMagick a partir da arte (contain + fundo, sem esticar).
- Criar `public/icon-192-maskable.png` e `public/icon-512-maskable.png` com ~28% de margem e ajustar `public/manifest.webmanifest` para apontar os `purpose: "maskable"` para esses arquivos.

Observação: depois de publicar, o WhatsApp guarda a prévia antiga em cache por algumas horas; a nova aparece após esse tempo ou em um link com algum parâmetro diferente.
