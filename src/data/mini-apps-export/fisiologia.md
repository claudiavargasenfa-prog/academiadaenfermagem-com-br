# Fisiologia para Enfermagem

- **Slug:** `fisiologia`
- **Descrição:** Sistemas, regulação e correlação clínica.
- **Tipo:** extra
- **Preço (cents):** 1490
- **Gratuito:** False
- **Em breve:** True
- **Ativo:** False
- **Acadêmico:** False | **Técnico:** False | **Enfermeiro:** False
- **Vídeo:** nenhum
- **Áudio:** nenhum
- **Badges:** [{"icon": "", "color": "red", "label": "CERTIFICADO OPCIONAL"}]

---

<section class="page-enter bg-background text-foreground font-sans space-y-6">

  <!-- CAPA / HERO -->
  <header class="bg-primary text-primary-foreground rounded-3xl shadow-glow p-6 sm:p-10 flex flex-col items-center text-center space-y-5">

    <div class="flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-primary-foreground/10 text-5xl sm:text-6xl shadow-soft">
      📋
    </div>

    <div class="space-y-2">
      <h1 class="font-display text-2xl sm:text-4xl leading-tight">Anamnese e exame físico</h1>
      <h2 class="font-display text-base sm:text-lg text-primary-foreground/80">Anamnese + Exame Físico</h2>
    </div>

    <div class="flex flex-col items-center gap-2">
      <span class="block w-16 h-0.5 rounded-full bg-primary-foreground/50"></span>
      <span class="block w-10 h-0.5 rounded-full bg-primary-foreground/30"></span>
    </div>

    <p class="italic text-sm sm:text-base text-primary-foreground/85 max-w-md">preencha os espaços guiado e com sugestões — exame físico guiado</p>

    <div class="flex flex-wrap items-center justify-center gap-2 pt-1">
      <span class="inline-flex items-center rounded-full bg-primary-foreground/15 text-primary-foreground px-3 py-1 text-xs font-semibold tracking-wide">Acadêmico</span>
      <span class="inline-flex items-center rounded-full bg-primary-foreground/15 text-primary-foreground px-3 py-1 text-xs font-semibold tracking-wide">Fluxo guiado</span>
      <span class="inline-flex items-center rounded-full bg-primary-foreground/15 text-primary-foreground px-3 py-1 text-xs font-semibold tracking-wide">Preenchimento real</span>
    </div>
  </header>

  <!-- AJUSTES PROPOSTOS NESTA VERSÃO -->
  <section class="glass-subtle rounded-2xl p-4 border border-border shadow-soft space-y-2">
    <h2 class="font-display text-sm text-foreground flex items-center gap-2">✨ Ajustes propostos nesta versão</h2>
    <ul class="text-xs text-muted-foreground space-y-1.5">
      <li class="flex gap-2"><span class="text-gold">•</span> Capa centralizada, verde floresta, premium.</li>
      <li class="flex gap-2"><span class="text-gold">•</span> Fluxo clicável em cascata — uma etapa por vez.</li>
      <li class="flex gap-2"><span class="text-gold">•</span> Anamnese completa e exame físico por sistemas.</li>
      <li class="flex gap-2"><span class="text-gold">•</span> “Não avaliado” nunca é tratado como “normal”.</li>
      <li class="flex gap-2"><span class="text-gold">•</span> Seção final substituída por evolução de enfermagem.</li>
      <li class="flex gap-2"><span class="text-gold">•</span> Exemplo de evolução pronta logo abaixo dos campos.</li>
    </ul>
  </section>

  <!-- ETAPA 1: IDENTIFICAÇÃO -->
  <section class="space-y-3">
    <div class="flex items-center gap-3">
      <span class="inline-flex items-center justify-center rounded-full bg-primary text-primary-foreground w-8 h-8 text-sm font-bold">1</span>
      <h2 class="font-display text-lg sm:text-xl text-foreground">Identificação &amp; contexto</h2>
    </div>

    <details class="glass rounded-2xl p-4 border border-border shadow-soft" open>
      <summary class="cursor-pointer list-none flex items-center justify-between font-display text-sm text-foreground">
        <span class="flex items-center gap-2">🪪 Identificação do paciente</span>
        <span class="text-muted-foreground text-xs">abrir</span>
      </summary>
      <div class="mt-4 space-y-3">
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div class="space-y-1">
            <label class="text-xs text-muted-foreground font-medium">Nome</label>
            <input type="text" placeholder="Nome completo" class="w-full bg-card border border-border rounded-xl px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/40 outline-none" />
          </div>
          <div class="grid grid-cols-2 gap-3">
            <div class="space-y-1">
              <label class="text-xs text-muted-foreground font-medium">Idade</label>
              <input type="text" placeholder="ex.: 68 anos" class="w-full bg-card border border-border rounded-xl px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/40 outline-none" />
            </div>
            <div class="space-y-1">
              <label class="text-xs text-muted-foreground font-medium">Sexo</label>
              <select class="w-full bg-card border border-border rounded-xl px-3 py-2 text-sm text-foreground focus:ring-2 focus:ring-primary/40 outline-none">
                <option value="">Selecionar</option>
                <option>Feminino</option>
                <option>Masculino</option>
                <option>Outro</option>
              </select>
            </div>
          </div>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div class="space-y-1">
            <label class="text-xs text-muted-foreground font-medium">Como prefere ser chamado</label>
            <input type="text" placeholder="ex.: Dona Maria" class="w-full bg-card border border-border rounded-xl px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/40 outline-none" />
          </div>
          <div class="space-y-1">
            <label class="text-xs text-muted-foreground font-medium">Data da avaliação</label>
            <input type="date" class="w-full bg-card border border-border rounded-xl px-3 py-2 text-sm text-foreground focus:ring-2 focus:ring-primary/40 outline-none" />
          </div>
          <div class="space-y-1">
            <label class="text-xs text-muted-foreground font-medium">Horário</label>
            <input type="time" class="w-full bg-card border border-border rounded-xl px-3 py-2 text-sm text-foreground focus:ring-2 focus:ring-primary/40 outline-none" />
          </div>
        </div>
      </div>
    </details>

    <details class="glass rounded-2xl p-4 border border-border shadow-soft">
      <summary class="cursor-pointer list-none flex items-center justify-between font-display text-sm text-foreground">
        <span class="flex items-center gap-2">📍 Contexto do atendimento</span>
        <span class="text-muted-foreground text-xs">abrir</span>
      </summary>
      <div class="mt-4 space-y-3">
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div class="space-y-1">
            <label class="text-xs text-muted-foreground font-medium">Local</label>
            <select class="w-full bg-card border border-border rounded-xl px-3 py-2 text-sm text-foreground focus:ring-2 focus:ring-primary/40 outline-none">
              <option value="">Selecionar</option>
              <option>Enfermaria</option>
              <option>Pronto-socorro</option>
              <option>Ambulatório</option>
              <option>UPA</option>
              <option>Domicílio</option>
              <option>Outro</option>
            </select>
          </div>
          <div class="space-y-1">
            <label class="text-xs text-muted-foreground font-medium">Setor / unidade</label>
            <input type="text" placeholder="ex.: Clínica médica" class="w-full bg-card border border-border rounded-xl px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/40 outline-none" />
          </div>
        </div>
        <div class="space-y-1">
          <label class="text-xs text-muted-foreground font-medium">Motivo da avaliação</label>
          <input type="text" placeholder="ex.: admissão, piora clínica, rotina" class="w-full bg-card border border-border rounded-xl px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/40 outline-none" />
        </div>
        <div class="space-y-1">
          <label class="text-xs text-muted-foreground font-medium">Condições do ambiente</label>
          <input type="text" placeholder="ex.: boa iluminação, leito preservado" class="w-full bg-card border border-border rounded-xl px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/40 outline-none" />
        </div>
      </div>
    </details>

    <details class="glass rounded-2xl p-4 border border-border shadow-soft">
      <summary class="cursor-pointer list-none flex items-center justify-between font-display text-sm text-foreground">
        <span class="flex items-center gap-2">👤 Fonte das informações</span>
        <span class="text-muted-foreground text-xs">abrir</span>
      </summary>
      <div class="mt-4 space-y-3">
        <fieldset class="space-y-2">
          <legend class="text-xs text-muted-foreground font-medium mb-1">Principal fonte</legend>
          <label class="flex items-center gap-2 text-sm text-foreground"><input type="radio" name="fonte_info" class="accent-primary" /> Próprio paciente</label>
          <label class="flex items-center gap-2 text-sm text-foreground"><input type="radio" name="fonte_info" class="accent-primary" /> Acompanhante / familiar</label>
          <label class="flex items-center gap-2 text-sm text-foreground"><input type="radio" name="fonte_info" class="accent-primary" /> Prontuário / equipe</label>
          <label class="flex items-center gap-2 text-sm text-foreground"><input type="radio" name="fonte_info" class="accent-primary" /> Outra</label>
        </fieldset>
        <div class="space-y-1">
          <label class="text-xs text-muted-foreground font-medium">Confiabilidade das informações</label>
          <select class="w-full bg-card border border-border rounded-xl px-3 py-2 text-sm text-foreground focus:ring-2 focus:ring-primary/40 outline-none">
            <option value="">Selecionar</option>
            <option>Boa</option>
            <option>Regular</option>
            <option>Limitada</option>
          </select>
        </div>
        <div class="space-y-1">
          <label class="text-xs text-muted-foreground font-medium">Observações sobre a fonte</label>
          <textarea rows="2" placeholder="ex.: acompanhada da filha, que complementa dados" class="w-full bg-card border border-border rounded-xl px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/40 outline-none resize-none"></textarea>
        </div>
      </div>
    </details>
  </section>

  <!-- ETAPA 2: ANAMNESE PRINCIPAL -->
  <section class="space-y-3">
    <div class="flex items-center gap-3">
      <span class="inline-flex items-center justify-center rounded-full bg-primary text-primary-foreground w-8 h-8 text-sm font-bold">2</span>
      <h2 class="font-display text-lg sm:text-xl text-foreground">Anamnese principal</h2>
    </div>

    <details class="glass rounded-2xl p-4 border border-border shadow-soft" open>
      <summary class="cursor-pointer list-none flex items-center justify-between font-display text-sm text-foreground">
        <span class="flex items-center gap-2">🗣️ Queixa principal</span>
        <span class="text-muted-foreground text-xs">abrir</span>
      </summary>
      <div class="mt-4 space-y-3">
        <div class="space-y-1">
          <label class="text-xs text-muted-foreground font-medium">Queixa principal (palavras do paciente)</label>
          <textarea rows="2" placeholder="ex.: falta de ar há três dias" class="w-full bg-card border border-border rounded-xl px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/40 outline-none resize-none"></textarea>
        </div>
        <p class="text-xs text-muted-foreground">Use as palavras do paciente. Uma queixa principal por vez.</p>
      </div>
    </details>

    <details class="glass rounded-2xl p-4 border border-border shadow-soft">
      <summary class="cursor-pointer list-none flex items-center justify-between font-display text-sm text-foreground">
        <span class="flex items-center gap-2">📈 História da doença atual</span>
        <span class="text-muted-foreground text-xs">abrir</span>
      </summary>
      <div class="mt-4 space-y-3">
        <div class="space-y-1">
          <label class="text-xs text-muted-foreground font-medium">Início do quadro</label>
          <input type="text" placeholder="quando começou? súbito ou gradual?" class="w-full bg-card border border-border rounded-xl px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/40 outline-none" />
        </div>
        <div class="space-y-1">
          <label class="text-xs text-muted-foreground font-medium">Cronologia / evolução</label>
          <textarea rows="3" placeholder="linha do tempo da evolução até agora" class="w-full bg-card border border-border rounded-xl px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/40 outline-none resize-none"></textarea>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div class="space-y-1">
            <label class="text-xs text-muted-foreground font-medium">Características</label>
            <input type="text" placeholder="contínuo, intermitente, progressivo..." class="w-full bg-card border border-border rounded-xl px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/40 outline-none" />
          </div>
          <div class="space-y-1">
            <label class="text-xs text-muted-foreground font-medium">Intensidade</label>
            <input type="text" placeholder="leve, moderada, intensa" class="w-full bg-card border border-border rounded-xl px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/40 outline-none" />
          </div>
        </div>
      </div>
    </details>

    <details class="glass rounded-2xl p-4 border border-border shadow-soft">
      <summary class="cursor-pointer list-none flex items-center justify-between font-display text-sm text-foreground">
        <span class="flex items-center gap-2">🔗 Sintomas associados</span>
        <span class="text-muted-foreground text-xs">abrir</span>
      </summary>
      <div class="mt-4 space-y-3">
        <div class="space-y-1">
          <label class="text-xs text-muted-foreground font-medium">Sintomas associados</label>
          <textarea rows="3" placeholder="ex.: tosse, febre, edema, sudorese" class="w-full bg-card border border-border rounded-xl px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/40 outline-none resize-none"></textarea>
        </div>
      </div>
    </details>

    <details class="glass rounded-2xl p-4 border border-border shadow-soft">
      <summary class="cursor-pointer list-none flex items-center justify-between font-display text-sm text-foreground">
        <span class="flex items-center gap-2">⬆️⬇️ Fatores de melhora e piora</span>
        <span class="text-muted-foreground text-xs">abrir</span>
      </summary>
      <div class="mt-4 space-y-3">
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div class="space-y-1">
            <label class="text-xs text-muted-foreground font-medium">O que melhora</label>
            <input type="text" placeholder="repouso, medicação, posição..." class="w-full bg-card border border-border rounded-xl px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/40 outline-none" />
          </div>
          <div class="space-y-1">
            <label class="text-xs text-muted-foreground font-medium">O que piora</label>
            <input type="text" placeholder="esforço, decúbito, alimentação..." class="w-full bg-card border border-border rounded-xl px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/40 outline-none" />
          </div>
        </div>
      </div>
    </details>

    <details class="glass rounded-2xl p-4 border border-border shadow-soft">
      <summary class="cursor-pointer list-none flex items-center justify-between font-display text-sm text-foreground">
        <span class="flex items-center gap-2">💊 Medidas já realizadas</span>
        <span class="text-muted-foreground text-xs">abrir</span>
      </summary>
      <div class="mt-4 space-y-3">
        <div class="space-y-1">
          <label class="text-xs text-muted-foreground font-medium">Medidas já tentadas</label>
          <textarea rows="2" placeholder="medicação caseira, atendimento anterior, automedicação" class="w-full bg-card border border-border rounded-xl px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/40 outline-none resize-none"></textarea>
        </div>
        <div class="space-y-1">
          <label class="text-xs text-muted-foreground font-medium">Resultado das medidas</label>
          <input type="text" placeholder="melhora parcial, sem resposta, piora" class="w-full bg-card border border-border rounded-xl px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/40 outline-none" />
        </div>
      </div>
    </details>
  </section>

  <!-- ETAPA 3: REVISÃO POR SISTEMAS -->
  <section class="space-y-3">
    <div class="flex items-center gap-3">
      <span class="inline-flex items-center justify-center rounded-full bg-primary text-primary-foreground w-8 h-8 text-sm font-bold">3</span>
      <h2 class="font-display text-lg sm:text-xl text-foreground">Revisão por sistemas</h2>
    </div>
    <p class="text-xs text-muted-foreground">Abra apenas os sistemas relacionados à queixa ou com queixas adicionais.</p>

    <details class="glass rounded-2xl p-4 border border-border shadow-soft">
      <summary class="cursor-pointer list-none flex items-center justify-between font-display text-sm text-foreground">
        <span class="flex items-center gap-2">🫁 Respiratório</span>
        <span class="text-muted-foreground text-xs">abrir</span>
      </summary>
      <div class="mt-4 space-y-2">
        <textarea rows="2" placeholder="tosse, dispneia, sibilos, expectoração..." class="w-full bg-card border border-border rounded-xl px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/40 outline-none resize-none"></textarea>
      </div>
    </details>

    <details class="glass rounded-2xl p-4 border border-border shadow-soft">
      <summary class="cursor-pointer list-none flex items-center justify-between font-display text-sm text-foreground">
        <span class="flex items-center gap-2">❤️ Cardiovascular</span>
        <span class="text-muted-foreground text-xs">abrir</span>
      </summary>
      <div class="mt-4 space-y-2">
        <textarea rows="2" placeholder="dor torácica, palpitações, edema, ortopneia..." class="w-full bg-card border border-border rounded-xl px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/40 outline-none resize-none"></textarea>
      </div>
    </details>

    <details class="glass rounded-2xl p-4 border border-border shadow-soft">
      <summary class="cursor-pointer list-none flex items-center justify-between font-display text-sm text-foreground">
        <span class="flex items-center gap-2">🩻 Gastrointestinal</span>
        <span class="text-muted-foreground text-xs">abrir</span>
      </summary>
      <div class="mt-4 space-y-2">
        <textarea rows="2" placeholder="náusea, vômito, dor abdominal, evacuação..." class="w-full bg-card border border-border rounded-xl px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/40 outline-none resize-none"></textarea>
      </div>
    </details>

    <details class="glass rounded-2xl p-4 border border-border shadow-soft">
      <summary class="cursor-pointer list-none flex items-center justify-between font-display text-sm text-foreground">
        <span class="flex items-center gap-2">🧠 Neurológico</span>
        <span class="text-muted-foreground text-xs">abrir</span>
      </summary>
      <div class="mt-4 space-y-2">
        <textarea rows="2" placeholder="cefaleia, tontura, confusão, déficit..." class="w-full bg-card border border-border rounded-xl px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/40 outline-none resize-none"></textarea>
      </div>
    </details>

    <details class="glass rounded-2xl p-4 border border-border shadow-soft">
      <summary class="cursor-pointer list-none flex items-center justify-between font-display text-sm text-foreground">
        <span class="flex items-center gap-2">🚽 Geniturinário</span>
        <span class="text-muted-foreground text-xs">abrir</span>
      </summary>
      <div class="mt-4 space-y-2">
        <textarea rows="2" placeholder="diurese, disúria, ardência, alteração de cor..." class="w-full bg-card border border-border rounded-xl px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/40 outline-none resize-none"></textarea>
      </div>
    </details>

    <details class="glass rounded-2xl p-4 border border-border shadow-soft">
      <summary class="cursor-pointer list-none flex items-center justify-between font-display text-sm text-foreground">
        <span class="flex items-center gap-2">🦴 Musculoesquelético</span>
        <span class="text-muted-foreground text-xs">abrir</span>
      </summary>
      <div class="mt-4 space-y-2">
        <textarea rows="2" placeholder="dor articular, limitação, edema, marcha..." class="w-full bg-card border border-border rounded-xl px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/40 outline-none resize-none"></textarea>
      </div>
    </details>

    <details class="glass rounded-2xl p-4 border border-border shadow-soft">
      <summary class="cursor-pointer list-none flex items-center justify-between font-display text-sm text-foreground">
        <span class="flex items-center gap-2">🧴 Pele e tegumentar</span>
        <span class="text-muted-foreground text-xs">abrir</span>
      </summary>
      <div class="mt-4 space-y-2">
        <textarea rows="2" placeholder="lesões, prurido, feridas, alterações de cor..." class="w-full bg-card border border-border rounded-xl px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/40 outline-none resize-none"></textarea>
      </div>
    </details>
  </section>

  <!-- ETAPA 4: ANTECEDENTES -->
  <section class="space-y-3">
    <div class="flex items-center gap-3">
      <span class="inline-flex items-center justify-center rounded-full bg-primary text-primary-foreground w-8 h-8 text-sm font-bold">4</span>
      <h2 class="font-display text-lg sm:text-xl text-foreground">Antecedentes &amp; histórico</h2>
    </div>

    <details class="glass rounded-2xl p-4 border border-border shadow-soft" open>
      <summary class="cursor-pointer list-none flex items-center justify-between font-display text-sm text-foreground">
        <span class="flex items-center gap-2">📋 Antecedentes pessoais</span>
        <span class="text-muted-foreground text-xs">abrir</span>
      </summary>
      <div class="mt-4 space-y-3">
        <div class="space-y-1">
          <label class="text-xs text-muted-foreground font-medium">Comorbidades / doenças prévias</label>
          <textarea rows="2" placeholder="ex.: HAS, diabetes, IC, DPOC" class="w-full bg-card border border-border rounded-xl px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/40 outline-none resize-none"></textarea>
        </div>
        <div class="space-y-1">
          <label class="text-xs text-muted-foreground font-medium">Tempo de diagnóstico / controle</label>
          <input type="text" placeholder="ex.: HAS há 10 anos, controlada" class="w-full bg-card border border-border rounded-xl px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/40 outline-none" />
        </div>
      </div>
    </details>

    <details class="glass rounded-2xl p-4 border border-border shadow-soft">
      <summary class="cursor-pointer list-none flex items-center justify-between font-display text-sm text-foreground">
        <span class="flex items-center gap-2">🏥 Cirurgias &amp; internações</span>
        <span class="text-muted-foreground text-xs">abrir</span>
      </summary>
      <div class="mt-4 space-y-3">
        <div class="space-y-1">
          <label class="text-xs text-muted-foreground font-medium">Cirurgias anteriores</label>
          <textarea rows="2" placeholder="procedimento e ano, se lembrar" class="w-full bg-card border border-border rounded-xl px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/40 outline-none resize-none"></textarea>
        </div>
        <div class="space-y-1">
          <label class="text-xs text-muted-foreground font-medium">Internações anteriores</label>
          <textarea rows="2" placeholder="motivo e período aproximado" class="w-full bg-card border border-border rounded-xl px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/40 outline-none resize-none"></textarea>
        </div>
      </div>
    </details>

    <details class="glass rounded-2xl p-4 border border-border shadow-soft">
      <summary class="cursor-pointer list-none flex items-center justify-between font-display text-sm text-foreground">
        <span class="flex items-center gap-2">💊 Medicamentos em uso</span>
        <span class="text-muted-foreground text-xs">abrir</span>
      </summary>
      <div class="mt-4 space-y-3">
        <div class="space-y-1">
          <label class="text-xs text-muted-foreground font-medium">Medicamentos de uso contínuo</label>
          <textarea rows="3" placeholder="nome, dose, frequência" class="w-full bg-card border border-border rounded-xl px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/40 outline-none resize-none"></textarea>
        </div>
        <div class="space-y-1">
          <label class="text-xs text-muted-foreground font-medium">Medicamentos eventuais</label>
          <input type="text" placeholder="analgésicos, antibióticos, outros" class="w-full bg-card border border-border rounded-xl px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/40 outline-none" />
        </div>
        <div class="space-y-1">
          <label class="text-xs text-muted-foreground font-medium">Adesão ao tratamento</label>
          <select class="w-full bg-card border border-border rounded-xl px-3 py-2 text-sm text-foreground focus:ring-2 focus:ring-primary/40 outline-none">
            <option value="">Selecionar</option>
            <option>Boa</option>
            <option>Regular</option>
            <option>Ruim</option>
            <option>Não sabe informar</option>
          </select>
        </div>
      </div>
    </details>

    <details class="glass rounded-2xl p-4 border border-border shadow-soft">
      <summary class="cursor-pointer list-none flex items-center justify-between font-display text-sm text-foreground">
        <span class="flex items-center gap-2">⚠️ Alergias</span>
        <span class="text-muted-foreground text-xs">abrir</span>
      </summary>
      <div class="mt-4 space-y-3">
        <fieldset class="space-y-2">
          <legend class="text-xs text-muted-foreground font-medium mb-1">Possui alergias?</legend>
          <label class="flex items-center gap-2 text-sm text-foreground"><input type="radio" name="alergias" class="accent-primary" /> Sim</label>
          <label class="flex items-center gap-2 text-sm text-foreground"><input type="radio" name="alergias" class="accent-primary" /> Não</label>
          <label class="flex items-center gap-2 text-sm text-foreground"><input type="radio" name="alergias" class="accent-primary" /> Não sabe</label>
        </fieldset>
        <div class="space-y-1">
          <label class="text-xs text-muted-foreground font-medium">Quais / reação apresentada</label>
          <textarea rows="2" placeholder="substância e tipo de reação" class="w-full bg-card border border-border rounded-xl px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/40 outline-none resize-none"></textarea>
        </div>
      </div>
    </details>

    <details class="glass rounded-2xl p-4 border border-border shadow-soft">
      <summary class="cursor-pointer list-none flex items-center justify-between font-display text-sm text-foreground">
        <span class="flex items-center gap-2">🌿 Hábitos de vida</span>
        <span class="text-muted-foreground text-xs">abrir</span>
      </summary>
      <div class="mt-4 space-y-3">
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div class="space-y-1">
            <label class="text-xs text-muted-foreground font-medium">Tabagismo</label>
            <input type="text" placeholder="ex.: 20 cigarros/dia há 30 anos" class="w-full bg-card border border-border rounded-xl px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/40 outline-none" />
          </div>
          <div class="space-y-1">
            <label class="text-xs text-muted-foreground font-medium">Etilismo</label>
            <input type="text" placeholder="frequência e quantidade" class="w-full bg-card border border-border rounded-xl px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/40 outline-none" />
          </div>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div class="space-y-1">
            <label class="text-xs text-muted-foreground font-medium">Atividade física</label>
            <input type="text" placeholder="sedentário, caminhada 3x/semana..." class="w-full bg-card border border-border rounded-xl px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/40 outline-none" />
          </div>
          <div class="space-y-1">
            <label class="text-xs text-muted-foreground font-medium">Alimentação</label>
            <input type="text" placeholder="padrão alimentar, restrições" class="w-full bg-card border border-border rounded-xl px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/40 outline-none" />
          </div>
        </div>
        <div class="space-y-1">
          <label class="text-xs text-muted-foreground font-medium">Vacinação / prevenções</label>
          <input type="text" placeholder="ex.: influenza, COVID, tétano" class="w-full bg-card border border-border rounded-xl px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/40 outline-none" />
        </div>
      </div>
    </details>

    <details class="glass rounded-2xl p-4 border border-border shadow-soft">
      <summary class="cursor-pointer list-none flex items-center justify-between font-display text-sm text-foreground">
        <span class="flex items-center gap-2">👨‍👩‍👧 Histórico familiar relevante</span>
        <span class="text-muted-foreground text-xs">abrir</span>
      </summary>
      <div class="mt-4 space-y-3">
        <div class="space-y-1">
          <label class="text-xs text-muted-foreground font-medium">Doenças na família</label>
          <textarea rows="2" placeholder="ex.: pai com HAS, mãe com diabetes" class="w-full bg-card border border-border rounded-xl px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/40 outline-none resize-none"></textarea>
        </div>
        <div class="space-y-1">
          <label class="text-xs text-muted-foreground font-medium">Óbitos e causas</label>
          <input type="text" placeholder="parente, causa, idade" class="w-full bg-card border border-border rounded-xl px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/40 outline-none" />
        </div>
      </div>
    </details>
  </section>

  <!-- ETAPA 5: RED FLAGS -->
  <section class="space-y-3">
    <div class="flex items-center gap-3">
      <span class="inline-flex items-center justify-center rounded-full bg-destructive text-primary-foreground w-8 h-8 text-sm font-bold">5</span>
      <h2 class="font-display text-lg sm:text-xl text-foreground">Red flags</h2>
    </div>

    <div class="bg-warning/20 border border-border rounded-2xl p-4 text-sm text-foreground">
      ⚠️ Marque os sinais presentes. Red flag aciona priorização e comunicação imediata com o preceptor.
    </div>

    <details class="glass rounded-2xl p-4 border border-border shadow-soft" open>
      <summary class="cursor-pointer list-none flex items-center justify-between font-display text-sm text-foreground">
        <span class="flex items-center gap-2">🚩 Sinais de risco</span>
        <span class="text-muted-foreground text-xs">abrir</span>
      </summary>
      <div class="mt-4 space-y-2">
        <fieldset class="space-y-2">
          <label class="flex items-center gap-2 text-sm text-foreground"><input type="checkbox" class="accent-primary" /> SpO₂ baixa, cianose, tiragem, dispneia importante</label>
          <label class="flex items-center gap-2 text-sm text-foreground"><input type="checkbox" class="accent-primary" /> Dor torácica, sudorese, palidez, hipotensão</label>
          <label class="flex items-center gap-2 text-sm text-foreground"><input type="checkbox" class="accent-primary" /> Alteração de consciência, confusão súbita</label>
          <label class="flex items-center gap-2 text-sm text-foreground"><input type="checkbox" class="accent-primary" /> Sangramento ativo, sinais de choque</label>
          <label class="flex items-center gap-2 text-sm text-foreground"><input type="checkbox" class="accent-primary" /> Febre alta, rigidez de nuca, sinais meníngeos</label>
          <label class="flex items-center gap-2 text-sm text-foreground"><input type="checkbox" class="accent-primary" /> Dor abdominal intensa, abdome rígido</label>
          <label class="flex items-center gap-2 text-sm text-foreground"><input type="checkbox" class="accent-primary" /> Outro sinal de risco</label>
        </fieldset>
        <div class="space-y-1">
          <label class="text-xs text-muted-foreground font-medium">Descrever outros sinais</label>
          <textarea rows="2" placeholder="descreva o sinal de risco identificado" class="w-full bg-card border border-border rounded-xl px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/40 outline-none resize-none"></textarea>
        </div>
      </div>
    </details>
  </section>

  <!-- ETAPA 6: EXAME FÍSICO POR SISTEMAS -->
  <section class="space-y-3">
    <div class="flex items-center gap-3">
      <span class="inline-flex items-center justify-center rounded-full bg-primary text-primary-foreground w-8 h-8 text-sm font-bold">6</span>
      <h2 class="font-display text-lg sm:text-xl text-foreground">Exame físico por sistemas</h2>
    </div>

    <div class="bg-destructive/15 border border-border rounded-2xl p-4 text-sm text-foreground space-y-1">
      <p class="font-semibold">⚠️ Regra fundamental</p>
      <p>“Não avaliado” <strong>nunca</strong> é “normal” ou “sem alterações”. Sempre registre o motivo.</p>
    </div>

    <details class="glass rounded-2xl p-4 border border-border shadow-soft" open>
      <summary class="cursor-pointer list-none flex items-center justify-between font-display text-sm text-foreground">
        <span class="flex items-center gap-2">👤 Estado geral</span>
        <span class="text-muted-foreground text-xs">abrir</span>
      </summary>
      <div class="mt-4 space-y-3">
        <fieldset class="space-y-2">
          <legend class="text-xs text-muted-foreground font-medium mb-1">Status da avaliação</legend>
          <label class="flex items-center gap-2 text-sm text-foreground"><input type="radio" name="eg_status" class="accent-primary" /> Sem alterações identificadas</label>
          <label class="flex items-center gap-2 text-sm text-foreground"><input type="radio" name="eg_status" class="accent-primary" /> Com alterações</label>
          <label class="flex items-center gap-2 text-sm text-foreground"><input type="radio" name="eg_status" class="accent-primary" /> Não avaliado</label>
        </fieldset>
        <div class="space-y-1">
          <label class="text-xs text-muted-foreground font-medium">Motivo do não avaliado <span class="text-destructive">(obrigatório se aplicável)</span></label>
          <input type="text" placeholder="ex.: paciente não colaborativo" class="w-full bg-card border border-border rounded-xl px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/40 outline-none" />
        </div>
        <div class="space-y-1">
          <label class="text-xs text-muted-foreground font-medium">Descrição objetiva</label>
          <textarea rows="2" placeholder="lúcido, corado, hidratado, em bom estado geral..." class="w-full bg-card border border-border rounded-xl px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/40 outline-none resize-none"></textarea>
        </div>
      </div>
    </details>

    <details class="glass rounded-2xl p-4 border border-border shadow-soft">
      <summary class="cursor-pointer list-none flex items-center justify-between font-display text-sm text-foreground">
        <span class="flex items-center gap-2">🧠 Nível de consciência</span>
        <span class="text-muted-foreground text-xs">abrir</span>
      </summary>
      <div class="mt-4 space-y-3">
        <fieldset class="space-y-2">
          <legend class="text-xs text-muted-foreground font-medium mb-1">Status da avaliação</legend>
          <label class="flex items-center gap-2 text-sm text-foreground"><input type="radio" name="nc_status" class="accent-primary" /> Sem alterações identificadas</label>
          <label class="flex items-center gap-2 text-sm text-foreground"><input type="radio" name="nc_status" class="accent-primary" /> Com alterações</label>
          <label class="flex items-center gap-2 text-sm text-foreground"><input type="radio" name="nc_status" class="accent-primary" /> Não avaliado</label>
        </fieldset>
        <div class="space-y-1">
          <label class="text-xs text-muted-foreground font-medium">Motivo do não avaliado</label>
          <input type="text" placeholder="ex.: sedação, dificuldade de comunicação" class="w-full bg-card border border-border rounded-xl px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/40 outline-none" />
        </div>
        <div class="space-y-1">
          <label class="text-xs text-muted-foreground font-medium">Descrição objetiva</label>
          <textarea rows="2" placeholder="orientado em tempo, espaço e pessoa; fala preservada..." class="w-full bg-card border border-border rounded-xl px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/40 outline-none resize-none"></textarea>
        </div>
      </div>
    </details>

    <details class="glass rounded-2xl p-4 border border-border shadow-soft">
      <summary class="cursor-pointer list-none flex items-center justify-between font-display text-sm text-foreground">
        <span class="flex items-center gap-2">💓 Sinais vitais</span>
        <span class="text-muted-foreground text-xs">abrir</span>
      </summary>
      <div class="mt-4 space-y-3">
        <div class="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <div class="space-y-1">
            <label class="text-xs text-muted-foreground font-medium">PA (mmHg)</label>
            <input type="text" placeholder="ex.: 120x80" class="w-full bg-card border border-border rounded-xl px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/40 outline-none" />
          </div>
          <div class="space-y-1">
            <label class="text-xs text-muted-foreground font-medium">FC (bpm)</label>
            <input type="text" placeholder="ex.: 88" class="w-full bg-card border border-border rounded-xl px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/40 outline-none" />
          </div>
          <div class="space-y-1">
            <label class="text-xs text-muted-foreground font-medium">FR (irpm)</label>
            <input type="text" placeholder="ex.: 20" class="w-full bg-card border border-border rounded-xl px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/40 outline-none" />
          </div>
          <div class="space-y-1">
            <label class="text-xs text-muted-foreground font-medium">Temp (°C)</label>
            <input type="text" placeholder="ex.: 36.8" class="w-full bg-card border border-border rounded-xl px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/40 outline-none" />
          </div>
          <div class="space-y-1">
            <label class="text-xs text-muted-foreground font-medium">SpO₂ (%)</label>
            <input type="text" placeholder="ex.: 96" class="w-full bg-card border border-border rounded-xl px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/40 outline-none" />
          </div>
          <div class="space-y-1">
            <label class="text-xs text-muted-foreground font-medium">Glicemia</label>
            <input type="text" placeholder="ex.: 110 mg/dL" class="w-full bg-card border border-border rounded-xl px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/40 outline-none" />
          </div>
        </div>
        <fieldset class="space-y-2">
          <legend class="text-xs text-muted-foreground font-medium mb-1">Status da avaliação</legend>
          <label class="flex items-center gap-2 text-sm text-foreground"><input type="radio" name="sv_status" class="accent-primary" /> Sem alterações identificadas</label>
          <label class="flex items-center gap-2 text-sm text-foreground"><input type="radio" name="sv_status" class="accent-primary" /> Com alterações</label>
          <label class="flex items-center gap-2 text-sm text-foreground"><input type="radio" name="sv_status" class="accent-primary" /> Não avaliado</label>
        </fieldset>
        <div class="space-y-1">
          <label class="text-xs text-muted-foreground font-medium">Motivo do não avaliado</label>
          <input type="text" placeholder="ex.: equipamento indisponível" class="w-full bg-card border border-border rounded-xl px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/40 outline-none" />
        </div>
        <div class="space-y-1">
          <label class="text-xs text-muted-foreground font-medium">Descrição objetiva</label>
          <textarea rows="2" placeholder="achados relevantes dos sinais vitais" class="w-full bg-card border border-border rounded-xl px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/40 outline-none resize-none"></textarea>
        </div>
      </div>
    </details>

    <details class="glass rounded-2xl p-4 border border-border shadow-soft">
      <summary class="cursor-pointer list-none flex items-center justify-between font-display text-sm text-foreground">
        <span class="flex items-center gap-2">🧴 Pele e mucosas</span>
        <span class="text-muted-foreground text-xs">abrir</span>
      </summary>
      <div class="mt-4 space-y-3">
        <fieldset class="space-y-2">
          <legend class="text-xs text-muted-foreground font-medium mb-1">Status da avaliação</legend>
          <label class="flex items-center gap-2 text-sm text-foreground"><input type="radio" name="pm_status" class="accent-primary" /> Sem alterações identificadas</label>
          <label class="flex items-center gap-2 text-sm text-foreground"><input type="radio" name="pm_status" class="accent-primary" /> Com alterações</label>
          <label class="flex items-center gap-2 text-sm text-foreground"><input type="radio" name="pm_status" class="accent-primary" /> Não avaliado</label>
        </fieldset>
        <div class="space-y-1">
          <label class="text-xs text-muted-foreground font-medium">Motivo do não avaliado</label>
          <input type="text" placeholder="ex.: vestimenta impediu inspeção" class="w-full bg-card border border-border rounded-xl px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/40 outline-none" />
        </div>
        <div class="space-y-1">
          <label class="text-xs text-muted-foreground font-medium">Descrição objetiva</label>
          <textarea rows="2" placeholder="pele íntegra, hidratada, mucosas úmidas..." class="w-full bg-card border border-border rounded-xl px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/40 outline-none resize-none"></textarea>
        </div>
      </div>
    </details>

    <details class="glass rounded-2xl p-4 border border-border shadow-soft">
      <summary class="cursor-pointer list-none flex items-center justify-between font-display text-sm text-foreground">
        <span class="flex items-center gap-2">🫁 Respiratório</span>
        <span class="text-muted-foreground text-xs">abrir</span>
      </summary>
      <div class="mt-4 space-y-3">
        <fieldset class="space-y-2">
          <legend class="text-xs text-muted-foreground font-medium mb-1">Status da avaliação</legend>
          <label class="flex items-center gap-2 text-sm text-foreground"><input type="radio" name="resp_status" class="accent-primary" /> Sem alterações identificadas</label>
          <label class="flex items-center gap-2 text-sm text-foreground"><input type="radio" name="resp_status" class="accent-primary" /> Com alterações</label>
          <label class="flex items-center gap-2 text-sm text-foreground"><input type="radio" name="resp_status" class="accent-primary" /> Não avaliado</label>
        </fieldset>
        <div class="space-y-1">
          <label class="text-xs text-muted-foreground font-medium">Motivo do não avaliado</label>
          <input type="text" placeholder="ex.: ambiente ruidoso" class="w-full bg-card border border-border rounded-xl px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/40 outline-none" />
        </div>
        <div class="space-y-1">
          <label class="text-xs text-muted-foreground font-medium">Descrição objetiva</label>
          <textarea rows="2" placeholder="murmúrio vesicular, ruídos adventícios, tiragem..." class="w-full bg-card border border-border rounded-xl px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/40 outline-none resize-none"></textarea>
        </div>
      </div>
    </details>

    <details class="glass rounded-2xl p-4 border border-border shadow-soft">
      <summary class="cursor-pointer list-none flex items-center justify-between font-display text-sm text-foreground">
        <span class="flex items-center gap-2">❤️ Cardiovascular</span>
        <span class="text-muted-foreground text-xs">abrir</span>
      </summary>
      <div class="mt-4 space-y-3">
        <fieldset class="space-y-2">
          <legend class="text-xs text-muted-foreground font-medium mb-1">Status da avaliação</legend>
          <label class="flex items-center gap-2 text-sm text-foreground"><input type="radio" name="card_status" class="accent-primary" /> Sem alterações identificadas</label>
          <label class="flex items-center gap-2 text-sm text-foreground"><input type="radio" name="card_status" class="accent-primary" /> Com alterações</label>
          <label class="flex items-center gap-2 text-sm text-foreground"><input type="radio" name="card_status" class="accent-primary" /> Não avaliado</label>
        </fieldset>
        <div class="space-y-1">
          <label class="text-xs text-muted-foreground font-medium">Motivo do não avaliado</label>
          <input type="text" placeholder="ex.: obesidade dificultando ausculta" class="w-full bg-card border border-border rounded-xl px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/40 outline-none" />
        </div>
        <div class="space-y-1">
          <label class="text-xs text-muted-foreground font-medium">Descrição objetiva</label>
          <textarea rows="2" placeholder="bulhas, sopros, pulsos, edema, jugular..." class="w-full bg-card border border-border rounded-xl px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/40 outline-none resize-none"></textarea>
        </div>
      </div>
    </details>

    <details class="glass rounded-2xl p-4 border border-border shadow-soft">
      <summary class="cursor-pointer list-none flex items-center justify-between font-display text-sm text-foreground">
        <span class="flex items-center gap-2">🩻 Abdominal</span>
        <span class="text-muted-foreground text-xs">abrir</span>
      </summary>
      <div class="mt-4 space-y-3">
        <fieldset class="space-y-2">
          <legend class="text-xs text-muted-foreground font-medium mb-1">Status da avaliação</legend>
          <label class="flex items-center gap-2 text-sm text-foreground"><input type="radio" name="abd_status" class="accent-primary" /> Sem alterações identificadas</label>
          <label class="flex items-center gap-2 text-sm text-foreground"><input type="radio" name="abd_status" class="accent-primary" /> Com alterações</label>
          <label class="flex items-center gap-2 text-sm text-foreground"><input type="radio" name="abd_status" class="accent-primary" /> Não avaliado</label>
        </fieldset>
        <div class="space-y-1">
          <label class="text-xs text-muted-foreground font-medium">Motivo do não avaliado</label>
          <input type="text" placeholder="ex.: paciente não tolerou decúbito" class="w-full bg-card border border-border rounded-xl px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/40 outline-none" />
        </div>
        <div class="space-y-1">
          <label class="text-xs text-muted-foreground font-medium">Descrição objetiva</label>
          <textarea rows="2" placeholder="macio, indolor, RHA, distensão, massas..." class="w-full bg-card border border-border rounded-xl px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/40 outline-none resize-none"></textarea>
        </div>
      </div>
    </details>

    <details class="glass rounded-2xl p-4 border border-border shadow-soft">
      <summary class="cursor-pointer list-none flex items-center justify-between font-display text-sm text-foreground">
        <span class="flex items-center gap-2">🧠 Neurológico</span>
        <span class="text-muted-foreground text-xs">abrir</span>
      </summary>
      <div class="mt-4 space-y-3">
        <fieldset class="space-y-2">
          <legend class="text-xs text-muted-foreground font-medium mb-1">Status da avaliação</legend>
          <label class="flex items-center gap-2 text-sm text-foreground"><input type="radio" name="neuro_status" class="accent-primary" /> Sem alterações identificadas</label>
          <label class="flex items-center gap-2 text-sm text-foreground"><input type="radio" name="neuro_status" class="accent-primary" /> Com alterações</label>
          <label class="flex items-center gap-2 text-sm text-foreground"><input type="radio" name="neuro_status" class="accent-primary" /> Não avaliado</label>
        </fieldset>
        <div class="space-y-1">
          <label class="text-xs text-muted-foreground font-medium">Motivo do não avaliado</label>
          <input type="text" placeholder="ex.: paciente não colaborativo" class="w-full bg-card border border-border rounded-xl px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/40 outline-none" />
        </div>
        <div class="space-y-1">
          <label class="text-xs text-muted-foreground font-medium">Descrição objetiva</label>
          <textarea rows="2" placeholder="orientação, fala, força, sensibilidade, paresias..." class="w-full bg-card border border-border rounded-xl px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/40 outline-none resize-none"></textarea>
        </div>
      </div>
    </details>

    <details class="glass rounded-2xl p-4 border border-border shadow-soft">
      <summary class="cursor-pointer list-none flex items-center justify-between font-display text-sm text-foreground">
        <span class="flex items-center gap-2">🦴 Musculoesquelético</span>
        <span class="text-muted-foreground text-xs">abrir</span>
      </summary>
      <div class="mt-4 space-y-3">
        <fieldset class="space-y-2">
          <legend class="text-xs text-muted-foreground font-medium mb-1">Status da avaliação</legend>
          <label class="flex items-center gap-2 text-sm text-foreground"><input type="radio" name="musc_status" class="accent-primary" /> Sem alterações identificadas</label>
          <label class="flex items-center gap-2 text-sm text-foreground"><input type="radio" name="musc_status" class="accent-primary" /> Com alterações</label>
          <label class="flex items-center gap-2 text-sm text-foreground"><input type="radio" name="musc_status" class="accent-primary" /> Não avaliado</label>
        </fieldset>
        <div class="space-y-1">
          <label class="text-xs text-muted-foreground font-medium">Motivo do não avaliado</label>
          <input type="text" placeholder="ex.: imobilização por fratura suspeita" class="w-full bg-card border border-border rounded-xl px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/40 outline-none" />
        </div>
        <div class="space-y-1">
          <label class="text-xs text-muted-foreground font-medium">Descrição objetiva</label>
          <textarea rows="2" placeholder="mobilidade, amplitude, edema, deformidade, marcha..." class="w-full bg-card border border-border rounded-xl px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/40 outline-none resize-none"></textarea>
        </div>
      </div>
    </details>

    <details class="glass rounded-2xl p-4 border border-border shadow-soft">
      <summary class="cursor-pointer list-none flex items-center justify-between font-display text-sm text-foreground">
        <span class="flex items-center gap-2">🚽 Eliminações</span>
        <span class="text-muted-foreground text-xs">abrir</span>
      </summary>
      <div class="mt-4 space-y-3">
        <fieldset class="space-y-2">
          <legend class="text-xs text-muted-foreground font-medium mb-1">Status da avaliação</legend>
          <label class="flex items-center gap-2 text-sm text-foreground"><input type="radio" name="elim_status" class="accent-primary" /> Sem alterações identificadas</label>
          <label class="flex items-center gap-2 text-sm text-foreground"><input type="radio" name="elim_status" class="accent-primary" /> Com alterações</label>
          <label class="flex items-center gap-2 text-sm text-foreground"><input type="radio" name="elim_status" class="accent-primary" /> Não avaliado</label>
        </fieldset>
        <div class="space-y-1">
          <label class="text-xs text-muted-foreground font-medium">Motivo do não avaliado</label>
          <input type="text" placeholder="ex.: paciente sem relato confiável" class="w-full bg-card border border-border rounded-xl px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/40 outline-none" />
        </div>
        <div class="space-y-1">
          <label class="text-xs text-muted-foreground font-medium">Descrição objetiva</label>
          <textarea rows="2" placeholder="diurese, evacuação, características, incontinência..." class="w-full bg-card border border-border rounded-xl px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/40 outline-none resize-none"></textarea>
        </div>
      </div>
    </details>

    <details class="glass rounded-2xl p-4 border border-border shadow-soft">
      <summary class="cursor-pointer list-none flex items-center justify-between font-display text-sm text-foreground">
        <span class="flex items-center gap-2">🩹 Dor</span>
        <span class="text-muted-foreground text-xs">abrir</span>
      </summary>
      <div class="mt-4 space-y-3">
        <fieldset class="space-y-2">
          <legend class="text-xs text-muted-foreground font-medium mb-1">Status da avaliação</legend>
          <label class="flex items-center gap-2 text-sm text-foreground"><input type="radio" name="dor_status" class="accent-primary" /> Sem alterações identificadas</label>
          <label class="flex items-center gap-2 text-sm text-foreground"><input type="radio" name="dor_status" class="accent-primary" /> Com alterações</label>
          <label class="flex items-center gap-2 text-sm text-foreground"><input type="radio" name="dor_status" class="accent-primary" /> Não avaliado</label>
        </fieldset>
        <div class="space-y-1">
          <label class="text-xs text-muted-foreground font-medium">Motivo do não avaliado</label>
          <input type="text" placeholder="ex.: dificuldade de comunicação" class="w-full bg-card border border-border rounded-xl px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/40 outline-none" />
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div class="space-y-1">
            <label class="text-xs text-muted-foreground font-medium">Escala (0–10)</label>
            <input type="text" placeholder="ex.: 6/10" class="w-full bg-card border border-border rounded-xl px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/40 outline-none" />
          </div>
          <div class="space-y-1">
            <label class="text-xs text-muted-foreground font-medium">Localização / irradiação</label>
            <input type="text" placeholder="ex.: torácica, irradia para MS esquerdo" class="w-full bg-card border border-border rounded-xl px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/40 outline-none" />
          </div>
        </div>
        <div class="space-y-1">
          <label class="text-xs text-muted-foreground font-medium">Descrição objetiva</label>
          <textarea rows="2" placeholder="característica, fatores de melhora/piora, impacto" class="w-full bg-card border border-border rounded-xl px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/40 outline-none resize-none"></textarea>
        </div>
      </div>
    </details>

    <details class="glass rounded-2xl p-4 border border-border shadow-soft">
      <summary class="cursor-pointer list-none flex items-center justify-between font-display text-sm text-foreground">
        <span class="flex items-center gap-2">🧷 Dispositivos e lesões</span>
        <span class="text-muted-foreground text-xs">abrir</span>
      </summary>
      <div class="mt-4 space-y-3">
        <fieldset class="space-y-2">
          <legend class="text-xs text-muted-foreground font-medium mb-1">Status da avaliação</legend>
          <label class="flex items-center gap-2 text-sm text-foreground"><input type="radio" name="disp_status" class="accent-primary" /> Sem alterações identificadas</label>
          <label class="flex items-center gap-2 text-sm text-foreground"><input type="radio" name="disp_status" class="accent-primary" /> Com alterações</label>
          <label class="flex items-center gap-2 text-sm text-foreground"><input type="radio" name="disp_status" class="accent-primary" /> Não avaliado</label>
        </fieldset>
        <div class="space-y-1">
          <label class="text-xs text-muted-foreground font-medium">Motivo do não avaliado</label>
          <input type="text" placeholder="ex.: curativo oclusivo não removido" class="w-full bg-card border border-border rounded-xl px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/40 outline-none" />
        </div>
        <div class="space-y-1">
          <label class="text-xs text-muted-foreground font-medium">Descrição objetiva</label>
          <textarea rows="2" placeholder="cateteres, sondas, drenos, curativos, lesões por pressão..." class="w-full bg-card border border-border rounded-xl px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/40 outline-none resize-none"></textarea>
        </div>
      </div>
    </details>
  </section>

  <!-- ETAPA 7: EVOLUÇÃO DE ENFERMAGEM -->
  <section class="space-y-3">
    <div class="flex items-center gap-3">
      <span class="inline-flex items-center justify-center rounded-full bg-gold text-primary-foreground w-8 h-8 text-sm font-bold">7</span>
      <h2 class="font-display text-lg sm:text-xl text-foreground">Evolução de enfermagem</h2>
    </div>

    <p class="text-xs text-muted-foreground">Preencha a evolução completa com base na anamnese e no exame físico realizados.</p>

    <div class="glass rounded-3xl p-5 border border-border shadow-glass space-y-4">

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div class="space-y-1">
          <label class="text-xs text-muted-foreground font-medium">Data</label>
          <input type="date" class="w-full bg-card border border-border rounded-xl px-3 py-2 text-sm text-foreground focus:ring-2 focus:ring-primary/40 outline-none" />
        </div>
        <div class="space-y-1">
          <label class="text-xs text-muted-foreground font-medium">Horário</label>
          <input type="time" class="w-full bg-card border border-border rounded-xl px-3 py-2 text-sm text-foreground focus:ring-2 focus:ring-primary/40 outline-none" />
        </div>
      </div>

      <div class="space-y-1">
        <label class="text-xs text-muted-foreground font-medium">Identificação resumida do paciente</label>
        <input type="text" placeholder="ex.: Sra. M.A.S., 68 anos, feminino" class="w-full bg-card border border-border rounded-xl px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/40 outline-none" />
      </div>

      <div class="space-y-1">
        <label class="text-xs text-muted-foreground font-medium">Contexto do atendimento</label>
        <input type="text" placeholder="ex.: admissão na enfermaria de clínica médica" class="w-full bg-card border border-border rounded-xl px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/40 outline-none" />
      </div>

      <div class="space-y-1">
        <label class="text-xs text-muted-foreground font-medium">Resumo da queixa principal</label>
        <textarea rows="2" placeholder="ex.: dispneia progressiva há três dias" class="w-full bg-card border border-border rounded-xl px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/40 outline-none resize-none"></textarea>
      </div>

      <div class="space-y-1">
        <label class="text-xs text-muted-foreground font-medium">Resumo da HDA</label>
        <textarea rows="3" placeholder="síntese da história da doença atual" class="w-full bg-card border border-border rounded-xl px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/40 outline-none resize-none"></textarea>
      </div>

      <div class="space-y-1">
        <label class="text-xs text-muted-foreground font-medium">Achados relevantes do exame físico</label>
        <textarea rows="3" placeholder="principais achados por sistema avaliado" class="w-full bg-card border border-border rounded-xl px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/40 outline-none resize-none"></textarea>
      </div>

      <div class="space-y-1">
        <label class="text-xs text-muted-foreground font-medium">Sinais de risco identificados</label>
        <textarea rows="2" placeholder="red flags presentes, se houver" class="w-full bg-card border border-border rounded-xl px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/40 outline-none resize-none"></textarea>
      </div>

      <div class="space-y-1">
        <label class="text-xs text-muted-foreground font-medium">Condutas realizadas / observadas</label>
        <textarea rows="3" placeholder="ações de enfermagem executadas ou em andamento" class="w-full bg-card border border-border rounded-xl px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/40 outline-none resize-none"></textarea>
      </div>

      <div class="space-y-1">
        <label class="text-xs text-muted-foreground font-medium">Resposta do paciente / estado atual</label>
        <textarea rows="2" placeholder="ex.: melhora parcial da dispneia após posicionamento" class="w-full bg-card border border-border rounded-xl px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/40 outline-none resize-none"></textarea>
      </div>

      <div class="space-y-1">
        <label class="text-xs text-muted-foreground font-medium">Orientação / encaminhamento</label>
        <textarea rows="2" placeholder="orientações ao paciente e encaminhamentos necessários" class="w-full bg-card border border-border rounded-xl px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/40 outline-none resize-none"></textarea>
      </div>

      <div class="space-y-1">
        <label class="text-xs text-muted-foreground font-medium">Assinatura / identificação do acadêmico</label>
        <input type="text" placeholder="nome, turma e instituição" class="w-full bg-card border border-border rounded-xl px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/40 outline-none" />
      </div>
    </div>
  </section>

  <!-- EXEMPLO DE EVOLUÇÃO PRONTA -->
  <section class="space-y-3">
    <div class="flex items-center gap-3">
      <span class="inline-flex items-center justify-center rounded-full bg-success text-primary-foreground w-8 h-8 text-sm font-bold">✓</span>
      <h2 class="font-display text-lg sm:text-xl text-foreground">Exemplo de evolução pronta</h2>
    </div>

    <div class="glass-subtle rounded-3xl p-5 border border-border shadow-glow space-y-3">
      <div class="flex items-center gap-2">
        <span class="inline-flex items-center rounded-full bg-gold/15 text-gold px-3 py-1 text-xs font-semibold tracking-wide">Exemplo respiratório</span>
        <span class="inline-flex items-center rounded-full bg-primary/15 text-primary px-3 py-1 text-xs font-semibold tracking-wide">Modelo para acadêmico</span>
      </div>

      <div class="bg-card rounded-2xl p-4 border border-border text-sm leading-relaxed text-foreground space-y-3">
        <p><strong>Data e horário:</strong> 12/03/2025 — 14h30.</p>
        <p><strong>Paciente:</strong> Sra. M.A.S., 68 anos, feminino, internada na enfermaria de clínica médica, leito 04.</p>
        <p><strong>Contexto:</strong> avaliação de admissão realizada pelo acadêmico de enfermagem sob supervisão do preceptor.</p>
        <p><strong>Queixa principal:</strong> “falta de ar que piora quando faço esforço”.</p>
        <p><strong>HDA:</strong> quadro iniciado há três dias, de forma gradual, com dispneia progressiva aos esforços e tosse seca ocasional. Nega febre, dor torácica ou expectoração. Refere piora ao decúbito dorsal, com melhora parcial ao sentar-se. Não realizou medicação em casa.</p>
        <p><strong>Exame físico:</strong> lúcida, orientada, corada, hidratada, anictérica, afebril. FR 24 irpm, FC 92 bpm, PA 130x80 mmHg, SpO₂ 91% em ar ambiente, axilar 36,7 °C. Tórax simétrico, uso de musculatura acessória, murmúrio vesicular diminuído em bases bilateralmente, sem ruídos adventícios significativos. Extremidades sem edema, perfusão preservada.</p>
        <p><strong>Sinais de risco:</strong> hipoxemia (SpO₂ 91%) e aumento do trabalho respiratório — comunicados ao preceptor.</p>
        <p><strong>Condutas:</strong> elevação da cabeceira a 45°, monitorização contínua de sinais vitais e SpO₂, oxigenoterapia suplementar por máscara simples conforme prescrição, observação do padrão e esforço respiratório.</p>
        <p><strong>Resposta:</strong> paciente refere alívio parcial da dispneia após elevação da cabeceira; SpO₂ evoluiu para 94% com O₂ suplementar, permanecendo em observação.</p>
        <p><strong>Orientações / encaminhamento:</strong> orientados repouso no leito, posicionamento confortável e acionamento da equipe ante qualquer piora. Condutas comunicadas ao preceptor; paciente mantida sob acompanhamento contínuo do acadêmico.</p>
        <p><strong>Acadêmico:</strong> João Silva — 8º período de Enfermagem, Universidade X.</p>
      </div>
    </div>
  </section>

  <!-- SUGESTÕES DE EVOLUÇÃO DO APP -->
  <details class="glass-subtle rounded-2xl p-4 border border-border shadow-soft">
    <summary class="cursor-pointer list-none flex items-center justify-between font-display text-sm text-foreground">
      <span class="flex items-center gap-2">💡 Sugestões de evolução do app</span>
      <span class="text-muted-foreground text-xs">abrir</span>
    </summary>
    <ul class="mt-4 text-xs text-muted-foreground space-y-2">
      <li class="flex gap-2"><span class="text-gold">•</span> Versão resumida para atendimentos rápidos.</li>
      <li class="flex gap-2"><span class="text-gold">•</span> Modo plantão com campos prioritários.</li>
      <li class="flex gap-2"><span class="text-gold">•</span> Exportação do registro preenchido.</li>
      <li class="flex gap-2"><span class="text-gold">•</span> Validação de campos obrigatórios.</li>
      <li class="flex gap-2"><span class="text-gold">•</span> Indicador visual de progresso por etapa.</li>
      <li class="flex gap-2"><span class="text-gold">•</span> Modelos por área (urgência, clínica, domicílio).</li>
    </ul>
  </details>

</section>
