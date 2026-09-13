# Análise real da página inicial/Loja — sem alterações

## Resultado da leitura integral

A Loja real está em `src/routes/index.tsx` e usa o componente principal `StoreHomeContent`.

A “dupla com o cartaz” **não é um componente separado**. Ela é exibida diretamente dentro de `StoreHomeContent`, nas linhas 82–88, por este bloco:

```tsx
<div className="mb-8 flex justify-center">
  <img
    src={mascotesAsset.url}
    alt="Mascotes Academia da Enfermagem — Time contra as IRAS"
    className="h-40 w-auto object-contain sm:h-52 md:h-60 [animation:pulse_3s_ease-in-out_infinite]"
  />
</div>
```

A imagem vem desta importação, na linha 5:

```tsx
import mascotesAsset from "@/assets/mascotes-iras.png.asset.json";
```

Portanto, a futura substituição deve retirar somente essa importação e esse bloco de imagem, colocando o carrossel exatamente no mesmo ponto: depois do título/descrição da Loja e antes dos cartões dos aplicativos.

## Estrutura confirmada da Loja

- `StoreHome` chama `StoreHomeContent`.
- `StoreHomeContent` carrega aplicativos, planos, assinaturas e textos editáveis.
- O cabeçalho da Loja ocupa as linhas 76–80.
- A dupla com o cartaz ocupa as linhas 82–88.
- Os cartões dos aplicativos começam na linha 90.
- O formulário de opinião aparece no final.
- `TestimonialsSection` está importado, mas não é exibido pelo arquivo atual.

## Preparação da futura troca

Quando a alteração for autorizada:

1. Preservar integralmente título, descrição, cartões, acessos, planos e formulário de opinião.
2. Substituir somente o bloco da dupla/cartaz por um carrossel com os 10 banners do Setembro Amarelo.
3. Manter o carrossel adequado para celular e computador, com passagem automática, setas, indicadores e pausa durante a interação.
4. Respeitar a configuração de redução de movimento do aparelho.
5. Usar textos alternativos próprios em todos os banners.
6. Conferir visualmente a Loja em celular e computador.

## Limite desta etapa

Nenhum arquivo do aplicativo será alterado, nenhum README será criado e nenhum commit será feito. Esta etapa entrega somente a análise. Os arquivos ou textos dos 10 banners não aparecem no histórico disponível desta conversa; eles precisarão estar anexados ou listados antes da futura implementação para evitar inventar conteúdo.
