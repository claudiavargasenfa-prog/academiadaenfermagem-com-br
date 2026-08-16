# Plano: Reestruturação do Mini App Drogas Vasoativas (ICU Master)

O usuário solicitou uma reestruturação visual e funcional específica para o Mini App de Drogas Vasoativas, dentro da academia de Terapia Intensiva. O foco é implementar um layout baseado em sanfonas coloridas (tons bebê) com busca rápida e filtros, além de garantir que Noradrenalina e Dobutamina estejam presentes nessa nova estrutura.

## Alterações Visuais e de Interface (Frontend)
- **Novo componente `AccordionSearchLayout`**: Criar um componente reutilizável para o layout de "Busca rápida + Sanfona Mestra + Sanfonas de Itens + Filtros".
- **Estilização "Cores Bebê"**: Aplicar a paleta de cores pastéis conforme os modelos enviados nas imagens (azul claro, rosa claro, verde claro, amarelo claro, lilás).
- **Integração no `MiniAppContent.tsx`**: Modificar o componente para detectar quando o slug é `drogas-vasoativas` e renderizar este layout especial em vez do fluxo padrão.

## Alterações de Conteúdo e Lógica (Backend/Banco de Dados)
- **Estrutura de Sub-tópicos**:
  - Uma sanfona mestra: "DROGAS MAIS UTILIZADAS NA TERAPIA INTENSIVA".
  - Filtros por categoria: Vasoativos, Sedativos, Analgésicos, Antibióticos, Eletrólitos, Anticoagulantes.
  - Sub-tópicos para as drogas específicas (Noradrenalina, Dobutamina) com ícones e cores temáticas.
- **Migração SQL**: Limpar a estrutura atual e inserir os dados conforme o novo modelo.

## Detalhes Técnicos
- O layout de busca usará filtragem local (client-side) para performance instantânea.
- As sanfonas serão implementadas com componentes Shadcn/Radix UI para acessibilidade e animações suaves.
- O botão "Ler Texto" ou a própria abertura da sanfona exibirá o conteúdo técnico detalhado já definido anteriormente.

## User Interface (UI)
- **Busca**: Input fixo no topo com ícone de lupa.
- **Filtros**: Chips coloridos horizontais com scroll.
- **Sanfonas**: Bordas arredondadas, sombras suaves, ícones representativos.

## Segurança e Performance
- Manter o uso de `RawHtmlHost` para evitar perda de estado em conteúdos complexos.
- RLS e permissões mantidas conforme padrão do sistema.
