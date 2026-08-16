# Plano de Implementação: Mini App Drogas Vasoativas (Modelo Sanfona Mestra)

Implementar exatamente o layout solicitado: **Busca rápida + Sanfona Mestra ("DROGAS MAIS UTILIZADA NA TERAPIA INTENSIVA") + Sanfonas de Itens + Filtros**, utilizando as cores pastéis (tons bebê) das imagens de referência.

## Frontend
- **Layout de Sanfona Mestra**: Criar `src/components/miniapps/uti/AccordionSearchLayout.tsx` (se ainda não estiver finalizado) para suportar:
    - Campo de busca funcional no topo.
    - Chips de filtro por categoria (Vasoativos, Sedativos, Analgésicos, Antibióticos, Eletrólitos, Anticoagulantes).
    - Sanfona Principal com o título "DROGAS MAIS UTILIZADA NA TERAPIA INTENSIVA".
    - Dentro dela, sanfonas individuais para cada droga com cores pastéis específicas por categoria.
- **Integração**: Configurar `src/components/MiniAppContent.tsx` para carregar este layout quando o slug for `drogas-vasoativas`.

## Banco de Dados
- **Conteúdo Técnico**: Reinserir apenas os dados de **Noradrenalina** e **Dobutamina** no mini app de Drogas Vasoativas (ID `3b689d95-0730-4bb5-a47a-7fd59ddaa624`).
- **Estrutura**: Os sub-tópicos usarão o prefixo da categoria no título (ex: `[Vasoativos] Noradrenalina`) para que o frontend mapeie a cor e o filtro automaticamente, sem criar tópicos de placeholder "vazios".

## Detalhes Visuais
- **Cores Bebê**:
    - Vasoativos: Azul bebê
    - Sedativos: Rosa bebê
    - Analgésicos: Lilás/Roxo bebê
    - Antibióticos: Verde água/bebê
    - Eletrólitos: Amarelo/Âmbar bebê
    - Anticoagulantes: Índigo suave
