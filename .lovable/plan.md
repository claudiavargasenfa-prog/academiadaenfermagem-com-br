# Landing /adec — reconstrução no padrão "HostGator AllPass"

## Análise rigorosa do que está no ar hoje

Abri a `/adec` renderizada e li o código (`src/routes/adec.tsx`, 800 linhas). Problemas reais encontrados:

1. **Sem nenhum efeito.** A página é 100% estática: nada de animação de entrada, revelação por scroll, parallax, contadores ou hover com profundidade. Só existe `hover:-translate-y-1` em cards. Por isso "continua a mesma coisa" — o que mudou antes foi texto, não a experiência.
2. **Classes de tipografia quebradas.** Há dezenas de cadeias inválidas do tipo `text-xs lg:text-sm lg:text-base lg:text-lg lg:text-xl lg:text-2xl lg:text-3xl` no mesmo elemento. Só a última vence, então textos secundários ficam gigantes no desktop e a hierarquia visual some.
3. **Ícones quebrados.** Vários emojis aparecem como quadradinho vazio (barra de urgência, chips "15 dias grátis", "Funciona offline", cards Estudante/Técnico/Enfermeiro).
4. **Zero prova visual do produto.** A referência vende com telas do produto; a nossa não mostra uma única tela dos apps. O usuário lê promessas sem ver nada.
5. **Fundo plano e sem profundidade.** Não é questão de cor, e sim de camadas: falta gradiente em movimento, luz e relevo.
6. **Sem CTA fixo.** Em página longa, o botão some e não volta.

## O que será feito

Reescrita completa da `/adec` mantendo textos/preços/rotas atuais, com estética e efeitos no padrão da referência:

- **Base escura premium**: fundo verde-floresta profundo com gradiente em malha animado (blobs em movimento lento), grão sutil e luz dourada — ouro só como acento, laranja só para urgência.
- **Hero cinematográfico**: headline com revelação palavra a palavra, selo de inauguração pulsante, CTA com brilho deslizante, badge de confiança e "mockup" de celular flutuante mostrando um MSDC real do app.
- **Faixa de logos/selos** em marquee infinito (COFEN, CORENs, ANVISA, MS, OMS).
- **Números animados** (35 anos, 60+ MSDC, 22+ escalas) contando ao entrar na tela.
- **Blocos alternados imagem/texto** com revelação por scroll (fade + subida + leve escala), como as seções "Mais tecnologia. Menos custo." da referência.
- **Comparativo "Sem ADEC × Com ADEC"** em duas colunas, com destaque no lado ADEC.
- **Seleção de plano** com cards das 4 academias, card recomendado em destaque e preço em contraste.
- **FAQ em acordeão animado** e fechamento com CTA.
- **Barra de CTA fixa** que aparece após o hero (mobile e desktop).
- **Correções técnicas**: remoção de todas as cadeias de classe inválidas, escala tipográfica única e coerente, troca dos emojis quebrados por ícones `lucide-react`.

## Detalhes técnicos

- Animações com `framer-motion` (revelação por scroll via `whileInView`, `useInView` para contadores) + keyframes CSS em `src/styles.css` para gradiente/marquee/brilho. Respeita `prefers-reduced-motion`.
- Tokens novos (`--adec-*`) declarados em `src/styles.css`; nada de cor hardcoded solta nos componentes.
- Página quebrada em componentes em `src/components/adec/` (Hero, TrustMarquee, Stats, FeatureRow, Comparison, Plans, FAQ, StickyCTA) para manter o arquivo legível.
- Textos continuam vindo das chaves `vendas.*` já editáveis no admin; `head()`/JSON-LD e SEO preservados.
- Imagens de produto: capturas reais das telas dos mini apps renderizadas em mockup, sem inventar prova social.
