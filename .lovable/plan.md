## Objetivo

Transformar o mini app **Coleta de Dados + Admissão de Turno** em multi-paciente com histórico por plantão, salvando tudo no aparelho (localStorage). Sem custo, funciona offline, não sincroniza entre aparelhos.

## Como fica pro técnico

```text
┌───────────────────────────────────────────────────────┐
│ [Pac 1] [Pac 2] [Pac 3] ... [+ Adicionar paciente]    │
├───────────────────────────────────────────────────────┤
│ Nome: João Silva     Leito: 204-A                     │
│                                                       │
│ [ formulário original intacto ]                       │
│                                                       │
│ [ Gerar Anotação ]                                    │
│ [ textarea rascunho atual ]                           │
├───────────────────────────────────────────────────────┤
│ 📋 Histórico do plantão (Paciente 1)                  │
│  ▸ 08:15  Admissão          [ver] [copiar] [x]        │
│  ▸ 10:40  Banho no leito    [ver] [copiar] [x]        │
│  ▸ 12:00  Medicação         [ver] [copiar] [x]        │
│                                                       │
│ [ Copiar plantão inteiro ]  [ Limpar plantão ]        │
└───────────────────────────────────────────────────────┘
[ Encerrar plantão / começar novo ]  ← limpa tudo
```

- **+ Adicionar paciente**: sem limite (dezenas ou centenas cabem tranquilo no localStorage ~5 MB).
- **Trocar de aba**: salva o formulário atual, carrega o da outra aba.
- **Gerar Anotação**: mantém o comportamento atual (escreve na textarea) e **empilha** nova entrada no histórico com horário automático — não sobrescreve.
- **Histórico por paciente**: ver / copiar / remover cada entrada, ou copiar tudo do paciente de uma vez.
- **Encerrar plantão**: botão global que limpa todos os pacientes de uma vez (com confirmação), pra começar o próximo plantão zerado.
- **Persistência**: tudo salvo em `localStorage` a cada mudança (debounced). Fechou o navegador, reabriu, continua lá.
- **Aviso discreto no topo**: *"Anotações salvas só neste aparelho/navegador. Copie pro prontuário oficial ao fim do plantão."*

## O que NÃO muda

- HTML do mini app no banco: **intocado** (design, cores, campos, textos).
- Nenhuma migration, nenhuma tabela, nenhum custo de Cloud.
- Continua funcionando se o admin duplicar/renomear o mini app (detecção por IDs, não por slug).

## Escopo técnico

Apenas **`src/components/MiniAppContent.tsx`**, reutilizando o hook `useLocal` já existente em `src/lib/storage.ts`.

1. **Detecção**: presença de `#anotacao_final_painel` + `[name="item_procedencia"]` no HTML renderizado.
2. **Estado**: `useLocal('coleta-turno-v1', { pacientes: [{id, nome, leito, formulario, historico:[{hora,texto}]}], ativoId })`.
3. **Barra de abas** e **painel de histórico** renderizados **fora** do HTML do mini app (acima e abaixo), pra não tocar no conteúdo do banco.
4. **Restaurar formulário ao trocar de aba**: querySelector nos inputs/radios/checkboxes/textareas + set + dispatch `input`/`change`.
5. **Capturar mudanças**: listener delegado no container, salva no state da aba ativa (debounce 300ms).
6. **Ao clicar "Gerar Anotação"**: chama a função `gerarAnotacaoTecnica` que já existe, escreve na textarea (comportamento atual) **e** faz push `{hora: HH:MM, texto}` no histórico da aba ativa.
7. **Cleanup** dos listeners no unmount (padrão já usado no arquivo).

## Validação (Playwright)

1. Adicionar 2 pacientes, nomes diferentes, marcar campos diferentes em cada.
2. Gerar 2 anotações no Paciente 1, 1 no Paciente 2.
3. `page.reload()` → confirmar que abas, campos preenchidos e histórico (2 + 1 anotações) voltam intactos.
4. Testar "Copiar plantão inteiro", "Remover paciente" e "Encerrar plantão".