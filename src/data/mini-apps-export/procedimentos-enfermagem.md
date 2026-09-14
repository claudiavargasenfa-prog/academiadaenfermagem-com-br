# PUNÇÃO VENOSA PERIFÉRICA E PREVENÇÃO DE FLEBITE

- **Slug:** `procedimentos-enfermagem`
- **Descrição:** 
- **Tipo:** Assistência
- **Preço (cents):** 1999
- **Gratuito:** False
- **Em breve:** False
- **Ativo:** True
- **Acadêmico:** True | **Técnico:** True | **Enfermeiro:** True
- **Vídeo:** nenhum
- **Áudio:** nenhum
- **Badges:** [{"icon": "", "color": "red", "label": "CERTIFICADO OPCIONAL"}, {"icon": "🆕", "color": "green", "label": "NOVO"}, {"icon": "🔄", "color": "blue", "label": "ATUALIZADO"}]

---

<section class="ave-training">

<style>
.ave-training{
  --blue:#0878C9;
  --blue-dark:#07558F;
  --blue-soft:#EAF6FF;
  --green:#176B4D;
  --green-soft:#EEF9F3;
  --green-ok:#16A34A;
  --gold:#D9A441;
  --gold-soft:#FFF8E7;
  --red:#DC2626;
  --red-soft:#FFF1F1;
  --purple:#6551B5;
  --purple-soft:#F5F1FF;
  --ink:#10233F;
  --muted:#60738D;
  --line:#D9E5EF;
  --bg:#F7FAFC;
  --white:#FFFFFF;

  font-family:Inter,Arial,Helvetica,sans-serif;
  color:var(--ink);
  background:var(--bg);
  line-height:1.55;
  width:100%;
  box-sizing:border-box;
}

.ave-training *,
.ave-training *::before,
.ave-training *::after{
  box-sizing:border-box;
}

.ave-container{
  width:min(1180px,calc(100% - 32px));
  margin:0 auto;
}

/* HERO */
.ave-hero{
  position:relative;
  overflow:hidden;
  min-height:390px;
  background:
    linear-gradient(110deg,#F9FCFF 0%,#F4FAFD 48%,#EAF7F5 100%);
  border-bottom:1px solid var(--line);
}

.ave-hero::after{
  content:"";
  position:absolute;
  width:520px;
  height:520px;
  border-radius:50%;
  right:-160px;
  top:-180px;
  background:rgba(8,120,201,.06);
}

.ave-hero-content{
  position:relative;
  z-index:2;
  display:grid;
  grid-template-columns:1.05fr .95fr;
  align-items:center;
  min-height:390px;
  gap:30px;
  padding:45px 0;
}

.ave-eyebrow{
  display:inline-flex;
  align-items:center;
  gap:8px;
  padding:7px 13px;
  border-radius:999px;
  background:var(--blue-soft);
  color:var(--blue-dark);
  font-size:13px;
  font-weight:700;
  letter-spacing:.04em;
  text-transform:uppercase;
  margin-bottom:18px;
}

.ave-hero h1{
  margin:0 0 14px;
  font-size:clamp(34px,5vw,58px);
  line-height:1.02;
  letter-spacing:-.035em;
  color:var(--ink);
}

.ave-hero h1 span{
  color:var(--blue);
}

.ave-hero-sub{
  max-width:680px;
  margin:0;
  color:#176F89;
  font-size:clamp(17px,2vw,22px);
  font-weight:600;
}

.ave-hero-note{
  margin:15px 0 0;
  max-width:650px;
  color:var(--muted);
  font-size:15px;
}

.ave-hero-art{
  position:relative;
  min-height:300px;
  display:flex;
  align-items:center;
  justify-content:center;
}

.ave-arm{
  width:100%;
  max-width:520px;
  height:auto;
}

/* BADGES */
.ave-badges{
  position:relative;
  z-index:5;
  margin-top:-35px;
  margin-bottom:34px;
}

.ave-badge-grid{
  display:grid;
  grid-template-columns:repeat(4,1fr);
  background:#fff;
  border:1px solid var(--line);
  border-radius:18px;
  box-shadow:0 12px 30px rgba(16,35,63,.08);
  overflow:hidden;
}

.ave-badge{
  display:flex;
  align-items:center;
  gap:13px;
  padding:20px 18px;
  border-right:1px solid var(--line);
}

.ave-badge:last-child{
  border-right:0;
}

.ave-badge-icon{
  width:42px;
  height:42px;
  flex:0 0 42px;
  border-radius:12px;
  display:grid;
  place-items:center;
  background:var(--blue-soft);
  color:var(--blue);
}

.ave-badge:nth-child(2) .ave-badge-icon{
  background:var(--green-soft);
  color:var(--green-ok);
}

.ave-badge:nth-child(3) .ave-badge-icon{
  background:var(--gold-soft);
  color:var(--gold);
}

.ave-badge:nth-child(4) .ave-badge-icon{
  background:#EEF8F0;
  color:var(--green);
}

.ave-badge strong{
  display:block;
  font-size:14px;
  line-height:1.25;
}

.ave-badge span{
  color:var(--muted);
  font-size:12px;
}

/* TITLE */
.ave-section-head{
  text-align:center;
  margin:0 auto 28px;
  max-width:800px;
}

.ave-section-head h2{
  margin:0 0 8px;
  font-size:30px;
  color:var(--ink);
}

.ave-section-head p{
  margin:0;
  color:var(--muted);
}

/* ACCORDION */
.ave-accordion{
  display:flex;
  flex-direction:column;
  gap:9px;
  padding-bottom:40px;
}

.ave-item{
  background:#fff;
  border:1px solid var(--line);
  border-radius:14px;
  overflow:hidden;
  box-shadow:0 3px 10px rgba(16,35,63,.025);
}

.ave-item summary{
  list-style:none;
  cursor:pointer;
}

.ave-item summary::-webkit-details-marker{
  display:none;
}

.ave-summary{
  min-height:65px;
  display:grid;
  grid-template-columns:56px 1fr 30px;
  align-items:center;
  gap:12px;
  padding:10px 17px 10px 0;
}

.ave-number{
  align-self:stretch;
  display:grid;
  place-items:center;
  font-weight:800;
  font-size:16px;
  color:#fff;
  background:var(--blue);
}

.ave-item:nth-child(4n+2) .ave-number{
  background:var(--green);
}

.ave-item:nth-child(4n+3) .ave-number{
  background:var(--gold);
}

.ave-item:nth-child(4n+4) .ave-number{
  background:#2E76C7;
}

.ave-summary-title{
  display:flex;
  align-items:center;
  gap:11px;
  font-weight:800;
  font-size:15px;
  color:var(--ink);
}

.ave-summary-title svg{
  width:22px;
  height:22px;
  color:var(--blue);
}

.ave-item:nth-child(4n+2) .ave-summary-title svg{
  color:var(--green);
}

.ave-item:nth-child(4n+3) .ave-summary-title svg{
  color:var(--gold);
}

.ave-chevron{
  width:20px;
  height:20px;
  color:#66778C;
  transition:transform .2s ease;
}

.ave-item[open] .ave-chevron{
  transform:rotate(180deg);
}

.ave-content{
  border-top:1px solid var(--line);
  padding:27px;
  background:#fff;
}

.ave-content-grid{
  display:grid;
  grid-template-columns:1fr 300px;
  gap:28px;
  align-items:start;
}

.ave-content h3{
  margin:0 0 12px;
  font-size:20px;
  color:var(--ink);
}

.ave-content h4{
  margin:20px 0 8px;
  color:var(--blue-dark);
  font-size:15px;
}

.ave-content p{
  margin:0 0 12px;
  color:#43566D;
  font-size:14px;
}

.ave-list{
  padding:0;
  margin:12px 0 0;
  list-style:none;
}

.ave-list li{
  position:relative;
  padding:7px 0 7px 27px;
  color:#34495F;
  font-size:14px;
}

.ave-list li::before{
  content:"✓";
  position:absolute;
  left:0;
  top:7px;
  width:18px;
  height:18px;
  border-radius:50%;
  display:grid;
  place-items:center;
  background:var(--green-soft);
  color:var(--green-ok);
  font-size:11px;
  font-weight:800;
}

.ave-info{
  margin-top:18px;
  padding:13px 15px;
  border-radius:11px;
  background:var(--blue-soft);
  border:1px solid #CBE7FA;
  color:#174A70;
  font-size:13px;
}

.ave-warning{
  margin-top:18px;
  padding:14px 16px;
  border-radius:11px;
  background:var(--gold-soft);
  border:1px solid #F0D58B;
  color:#735718;
  font-size:13px;
}

.ave-danger{
  margin-top:18px;
  padding:14px 16px;
  border-radius:11px;
  background:var(--red-soft);
  border:1px solid #F5C5C5;
  color:#8A2020;
  font-size:13px;
}

.ave-illustration{
  border:1px solid var(--line);
  background:#FAFCFE;
  border-radius:18px;
  padding:15px;
}

.ave-illustration svg{
  width:100%;
  height:auto;
}

/* MINI CARDS */
.ave-mini-grid{
  display:grid;
  grid-template-columns:repeat(2,1fr);
  gap:14px;
  margin-top:18px;
}

.ave-mini-card{
  border:1px solid var(--line);
  border-radius:13px;
  padding:16px;
  background:#fff;
}

.ave-mini-card strong{
  display:block;
  margin-bottom:6px;
  font-size:14px;
}

.ave-mini-card p{
  margin:0;
  font-size:13px;
}

/* PHLEBITIS */
.ave-phlebitis{
  display:grid;
  grid-template-columns:repeat(4,1fr);
  gap:12px;
  margin-top:18px;
}

.ave-grade{
  border:1px solid var(--line);
  border-radius:14px;
  padding:16px;
  background:#fff;
}

.ave-grade-number{
  width:36px;
  height:36px;
  border-radius:10px;
  display:grid;
  place-items:center;
  font-weight:800;
  margin-bottom:12px;
  background:var(--blue-soft);
  color:var(--blue);
}

.ave-grade:nth-child(2) .ave-grade-number{
  background:#EEF9F3;
  color:var(--green);
}

.ave-grade:nth-child(3) .ave-grade-number{
  background:var(--gold-soft);
  color:#9A6C00;
}

.ave-grade:nth-child(4) .ave-grade-number{
  background:var(--red-soft);
  color:var(--red);
}

.ave-grade strong{
  display:block;
  margin-bottom:7px;
  font-size:14px;
}

.ave-grade p{
  font-size:12px;
  margin:0;
}

/* CHECKLIST */
.ave-checklist{
  display:grid;
  grid-template-columns:repeat(2,1fr);
  gap:8px 20px;
  margin-top:15px;
}

.ave-check{
  padding:9px 11px;
  border-radius:8px;
  background:#F8FBFD;
  border:1px solid #E4EDF4;
  font-size:13px;
  color:#40546A;
}

.ave-check::before{
  content:"☐";
  margin-right:8px;
  color:var(--blue);
  font-weight:800;
}

/* FOOTER */
.ave-reference{
  margin:10px 0 50px;
  padding:27px;
  border:1px solid #D8CDF7;
  background:var(--purple-soft);
  border-radius:17px;
}

.ave-reference-head{
  display:flex;
  align-items:center;
  gap:13px;
  margin-bottom:14px;
}

.ave-reference-icon{
  width:44px;
  height:44px;
  display:grid;
  place-items:center;
  border-radius:12px;
  background:#EAE3FF;
  color:var(--purple);
}

.ave-reference h3{
  margin:0;
  color:#4D3A92;
  font-size:18px;
}

.ave-reference p,
.ave-reference li{
  color:#4F4A69;
  font-size:13px;
}

.ave-reference ul{
  margin:10px 0 15px;
  padding-left:20px;
}

.ave-disclaimer{
  margin-top:17px;
  padding-top:15px;
  border-top:1px solid #DDD4F4;
  font-size:12px;
  color:#5C5577;
}

/* SVG */
.ave-svg{
  width:22px;
  height:22px;
  fill:none;
  stroke:currentColor;
  stroke-width:1.8;
  stroke-linecap:round;
  stroke-linejoin:round;
}

/* MOBILE */
@media(max-width:900px){
  .ave-hero-content{
    grid-template-columns:1fr;
    text-align:center;
  }

  .ave-hero-note,
  .ave-hero-sub{
    margin-left:auto;
    margin-right:auto;
  }

  .ave-hero-art{
    min-height:220px;
  }

  .ave-badge-grid{
    grid-template-columns:repeat(2,1fr);
  }

  .ave-badge:nth-child(2){
    border-right:0;
  }

  .ave-badge:nth-child(-n+2){
    border-bottom:1px solid var(--line);
  }

  .ave-content-grid{
    grid-template-columns:1fr;
  }

  .ave-illustration{
    max-width:420px;
    margin:auto;
  }

  .ave-phlebitis{
    grid-template-columns:repeat(2,1fr);
  }
}

@media(max-width:600px){
  .ave-container{
    width:min(100% - 20px,1180px);
  }

  .ave-hero-content{
    padding:32px 0;
  }

  .ave-hero{
    min-height:auto;
  }

  .ave-hero-content{
    min-height:auto;
  }

  .ave-hero h1{
    font-size:35px;
  }

  .ave-badges{
    margin-top:-18px;
  }

  .ave-badge-grid{
    grid-template-columns:1fr;
  }

  .ave-badge{
    border-right:0!important;
    border-bottom:1px solid var(--line);
  }

  .ave-badge:last-child{
    border-bottom:0;
  }

  .ave-summary{
    grid-template-columns:48px 1fr 24px;
  }

  .ave-summary-title{
    font-size:13px;
  }

  .ave-content{
    padding:19px;
  }

  .ave-mini-grid,
  .ave-checklist,
  .ave-phlebitis{
    grid-template-columns:1fr;
  }

  .ave-reference{
    padding:20px;
  }
}
</style>

<!-- ÍCONES -->
<svg style="display:none">
  <symbol id="i-shield" viewBox="0 0 24 24">
    <path d="M12 3l8 3v6c0 5-3.4 8.2-8 9-4.6-.8-8-4-8-9V6l8-3z"/>
    <path d="m8.5 12 2.2 2.2 4.8-5"/>
  </symbol>

  <symbol id="i-users" viewBox="0 0 24 24">
    <circle cx="9" cy="8" r="3"/>
    <circle cx="17" cy="9" r="2.5"/>
    <path d="M3.5 20c.5-4 2.4-6 5.5-6s5 2 5.5 6"/>
    <path d="M14.5 15c2.8-.3 4.7 1.2 5.2 4"/>
  </symbol>

  <symbol id="i-heart" viewBox="0 0 24 24">
    <path d="M20.8 8.7c0 5-8.8 10.2-8.8 10.2S3.2 13.7 3.2 8.7A4.7 4.7 0 0 1 12 6.2a4.7 4.7 0 0 1 8.8 2.5z"/>
  </symbol>

  <symbol id="i-kit" viewBox="0 0 24 24">
    <rect x="3" y="7" width="18" height="13" rx="2"/>
    <path d="M8 7V5h8v2M3 11h18M10 11v3h4v-3"/>
  </symbol>

  <symbol id="i-pin" viewBox="0 0 24 24">
    <path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0z"/>
    <circle cx="12" cy="10" r="2.5"/>
  </symbol>

  <symbol id="i-vein" viewBox="0 0 24 24">
    <path d="M4 18c3-1 4-4 5-7s2-5 5-5 3 2 6 0"/>
    <path d="M8 18c2-1 3-2 4-4"/>
  </symbol>

  <symbol id="i-drop" viewBox="0 0 24 24">
    <path d="M12 3s6 7 6 11a6 6 0 0 1-12 0c0-4 6-11 6-11z"/>
  </symbol>

  <symbol id="i-check" viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="9"/>
    <path d="m8 12 2.5 2.5L16 9"/>
  </symbol>

  <symbol id="i-chevron" viewBox="0 0 24 24">
    <path d="m6 9 6 6 6-6"/>
  </symbol>

  <symbol id="i-book" viewBox="0 0 24 24">
    <path d="M4 5a3 3 0 0 1 3-2h5v17H7a3 3 0 0 0-3 2V5z"/>
    <path d="M20 5a3 3 0 0 0-3-2h-5v17h5a3 3 0 0 1 3 2V5z"/>
  </symbol>
</svg>

<!-- HERO -->
<div class="ave-hero">
  <div class="ave-container ave-hero-content">

    <div>
      <div class="ave-eyebrow">
        <svg class="ave-svg"><use href="#i-shield"></use></svg>
        Treinamento de Enfermagem
      </div>

      <h1>
        ACESSO VENOSO<br>
        <span>PERIFÉRICO</span>
      </h1>

      <p class="ave-hero-sub">
        Conteúdo atualizado e prático para uma punção segura, desde a preparação até a prevenção e manejo das complicações.
      </p>

      <p class="ave-hero-note">
        Conteúdo organizado em etapas para facilitar a aprendizagem, a revisão e a prática segura da assistência de enfermagem.
      </p>
    </div>

    <!-- ILUSTRAÇÃO DO BRAÇO -->
    <div class="ave-hero-art">

      <svg class="ave-arm" viewBox="0 0 560 330" role="img" aria-label="Ilustração de acesso venoso periférico">

        <defs>
          <linearGradient id="skin" x1="0" x2="1">
            <stop offset="0" stop-color="#F5C7A5"/>
            <stop offset="1" stop-color="#E7A77D"/>
          </linearGradient>
          <filter id="shadow">
            <feDropShadow dx="0" dy="10" stdDeviation="10" flood-opacity=".12"/>
          </filter>
        </defs>

        <ellipse cx="280" cy="278" rx="210" ry="22" fill="#DDE8EF"/>

        <path
          d="M85 205
             C110 175 135 150 165 133
             C195 116 222 110 253 120
             C288 132 313 160 342 178
             C376 200 423 200 475 181
             C499 172 520 183 522 205
             C524 229 502 249 472 255
             C411 268 356 264 306 246
             C263 231 225 218 188 224
             C151 230 115 241 89 230
             C76 225 75 216 85 205Z"
          fill="url(#skin)"
          filter="url(#shadow)"
        />

        <!-- veia -->
        <path
          d="M142 193
             C185 176 214 167 246 174
             C282 182 304 209 341 218
             C377 227 405 222 440 208"
          fill="none"
          stroke="#78A5B9"
          stroke-width="7"
          opacity=".55"
        />

        <!-- garrote -->
        <rect x="151" y="150" width="90" height="19" rx="9"
              fill="#75AFC2" opacity=".85"
              transform="rotate(-9 151 150)"/>

        <!-- curativo -->
        <rect x="330" y="184" width="92" height="62" rx="13"
              fill="#F7F7F4" opacity=".95"
              transform="rotate(7 330 184)"/>

        <path d="M343 206 L410 218" stroke="#D8D8D4" stroke-width="3"/>

        <!-- cateter -->
        <g transform="translate(395 190) rotate(9)">
          <rect x="0" y="0" width="55" height="17" rx="8" fill="#EFF7FB" stroke="#7FA7B8"/>
          <rect x="45" y="2" width="58" height="13" rx="6" fill="#2B8DB5"/>
          <rect x="100" y="4" width="45" height="9" rx="4" fill="#DCEAF0"/>
          <path d="M145 8H180" stroke="#9BBAC8" stroke-width="6"/>
        </g>

        <!-- gotas -->
        <path d="M466 113c0 7-5 12-11 12s-11-5-11-12c0-7 11-20 11-20s11 13 11 20z"
              fill="#0878C9" opacity=".8"/>

      </svg>
    </div>

  </div>
</div>

<!-- BADGES -->
<div class="ave-container ave-badges">
  <div class="ave-badge-grid">

    <div class="ave-badge">
      <div class="ave-badge-icon">
        <svg class="ave-svg"><use href="#i-shield"></use></svg>
      </div>
      <div>
        <strong>Segurança<br>do paciente</strong>
      </div>
    </div>

    <div class="ave-badge">
      <div class="ave-badge-icon">
        <svg class="ave-svg"><use href="#i-users"></use></svg>
      </div>
      <div>
        <strong>Técnica<br>asséptica</strong>
      </div>
    </div>

    <div class="ave-badge">
      <div class="ave-badge-icon">
        <svg class="ave-svg"><use href="#i-heart"></use></svg>
      </div>
      <div>
        <strong>Prevenção de<br>complicações</strong>
      </div>
    </div>

    <div class="ave-badge">
      <div class="ave-badge-icon">
        <svg class="ave-svg"><use href="#i-check"></use></svg>
      </div>
      <div>
        <strong>Boas práticas<br>de Enfermagem</strong>
      </div>
    </div>

  </div>
</div>

<!-- CONTEÚDO -->
<div class="ave-container">

  <div class="ave-section-head">
    <h2>Passo a passo do acesso venoso periférico</h2>
    <p>
      Clique em cada etapa para estudar os principais cuidados técnicos e de segurança.
    </p>
  </div>

  <div class="ave-accordion">

    <!-- 01 -->
    <details class="ave-item" open>
      <summary>
        <div class="ave-summary">
          <div class="ave-number">01</div>
          <div class="ave-summary-title">
            <svg class="ave-svg"><use href="#i-users"></use></svg>
            AVALIAÇÃO E PREPARO DO PACIENTE
          </div>
          <svg class="ave-chevron"><use href="#i-chevron"></use></svg>
        </div>
      </summary>

      <div class="ave-content">
        <div class="ave-content-grid">

          <div>
            <h3>Antes de iniciar o procedimento</h3>

            <p>
              A segurança começa antes da punção. Avalie a indicação da terapia,
              as condições clínicas e a rede venosa do paciente.
            </p>

            <ul class="ave-list">
              <li>Conferir a indicação e a prescrição.</li>
              <li>Identificar corretamente o paciente.</li>
              <li>Explicar o procedimento e obter colaboração.</li>
              <li>Avaliar condições clínicas relevantes.</li>
              <li>Verificar integridade da pele e condições do membro.</li>
              <li>Realizar higiene das mãos conforme protocolo.</li>
              <li>Posicionar o paciente de maneira confortável e segura.</li>
            </ul>

            <div class="ave-info">
              <strong>Raciocínio clínico:</strong>
              a escolha do acesso deve considerar finalidade, tipo de terapia,
              duração prevista, características da solução e condições do paciente.
            </div>
          </div>

          <div class="ave-illustration">

            <svg viewBox="0 0 320 240">

              <circle cx="82" cy="57" r="28" fill="#E6B18B"/>
              <path d="M52 53c8-31 57-30 62 3-16-11-38-13-62-3z" fill="#49372D"/>

              <path d="M42 103c13-23 68-23 83 0l18 75H27z"
                    fill="#168C86"/>

              <circle cx="227" cy="62" r="27" fill="#E5B48E"/>
              <path d="M199 57c4-27 51-31 58 4-20-8-37-9-58-4z" fill="#302923"/>

              <path d="M193 104c12-20 59-20 71 0l19 78h-110z"
                    fill="#A9D4E6"/>

              <path d="M115 127c28 12 47 25 77 45"
                    fill="none"
                    stroke="#E6B18B"
                    stroke-width="17"
                    stroke-linecap="round"/>

              <path d="M175 169c18-13 35-22 49-31"
                    fill="none"
                    stroke="#E5B48E"
                    stroke-width="15"
                    stroke-linecap="round"/>

              <circle cx="214" cy="137" r="7" fill="#D9A441"/>

              <path d="M109 117c17 9 28 18 36 31"
                    fill="none"
                    stroke="#fff"
                    stroke-width="3"
                    stroke-linecap="round"/>

            </svg>

          </div>

        </div>
      </div>
    </details>

    <!-- 02 -->
    <details class="ave-item">
      <summary>
        <div class="ave-summary">
          <div class="ave-number">02</div>
          <div class="ave-summary-title">
            <svg class="ave-svg"><use href="#i-kit"></use></svg>
            PREPARO DO MATERIAL
          </div>
          <svg class="ave-chevron"><use href="#i-chevron"></use></svg>
        </div>
      </summary>

      <div class="ave-content">

        <h3>Organize o material antes de iniciar</h3>

        <p>
          O preparo prévio reduz interrupções durante o procedimento e favorece
          a manutenção da técnica asséptica.
        </p>

        <ul class="ave-list">
          <li>Cateter intravenoso periférico adequado à terapia.</li>
          <li>Dispositivo de garroteamento.</li>
          <li>Luvas conforme indicação e protocolo institucional.</li>
          <li>Solução antisséptica apropriada.</li>
          <li>Gaze e curativo estéril.</li>
          <li>Dispositivo de estabilização, quando indicado.</li>
          <li>Extensão/conector sem agulha, quando aplicável.</li>
          <li>Equipo e solução prescrita.</li>
          <li>Recipiente para descarte de perfurocortantes.</li>
          <li>Materiais adicionais conforme terapia e protocolo.</li>
        </ul>

        <div class="ave-warning">
          <strong>Segurança:</strong>
          confira validade, integridade das embalagens e compatibilidade dos materiais
          antes de iniciar.
        </div>

      </div>
    </details>

    <!-- 03 -->
    <details class="ave-item">
      <summary>
        <div class="ave-summary">
          <div class="ave-number">03</div>
          <div class="ave-summary-title">
            <svg class="ave-svg"><use href="#i-pin"></use></svg>
            ESCOLHA DO LOCAL DE PUNÇÃO
          </div>
          <svg class="ave-chevron"><use href="#i-chevron"></use></svg>
        </div>
      </summary>

      <div class="ave-content">

        <h3>Escolha do sítio com raciocínio clínico</h3>

        <p>
          A seleção do local deve considerar a terapia prescrita, a condição
          vascular e as características do paciente.
        </p>

        <ul class="ave-list">
          <li>Preferir membro superior quando indicado.</li>
          <li>Considerar a preferência do paciente quando possível.</li>
          <li>Considerar o membro não dominante.</li>
          <li>Priorizar regiões adequadas e preservadas.</li>
          <li>Considerar a região distal antes da proximal quando clinicamente apropriado.</li>
          <li>Evitar áreas de flexão sempre que possível.</li>
          <li>Evitar áreas com lesões ou infecção.</li>
          <li>Evitar veias com sinais de flebite.</li>
          <li>Evitar locais com infiltração ou extravasamento prévios.</li>
          <li>Preservar membros destinados a acessos vasculares futuros.</li>
        </ul>

        <div class="ave-info">
          <strong>Importante:</strong>
          a seleção do sítio não deve ser baseada apenas na facilidade de punção.
          A terapia e as condições do paciente também determinam a escolha.
        </div>

      </div>
    </details>

    <!-- 04 -->
    <details class="ave-item">
      <summary>
        <div class="ave-summary">
          <div class="ave-number">04</div>
          <div class="ave-summary-title">
            <svg class="ave-svg"><use href="#i-vein"></use></svg>
            ESCOLHA DO VASO E DO DISPOSITIVO
          </div>
          <svg class="ave-chevron"><use href="#i-chevron"></use></svg>
        </div>
      </summary>

      <div class="ave-content">

        <h3>O menor dispositivo adequado</h3>

        <p>
          O cateter deve ser selecionado de acordo com a indicação clínica,
          características da solução, duração da terapia e condições da veia.
        </p>

        <ul class="ave-list">
          <li>Avaliar calibre, trajeto e qualidade da veia.</li>
          <li>Selecionar o menor calibre compatível com a terapia.</li>
          <li>Considerar o tipo e as características da solução.</li>
          <li>Considerar o fluxo necessário.</li>
          <li>Considerar a duração prevista da terapia.</li>
          <li>Evitar dispositivo maior que o necessário.</li>
        </ul>

        <div class="ave-info">
          O objetivo é adequar o dispositivo à necessidade clínica,
          preservando o vaso e reduzindo o risco de complicações.
        </div>

      </div>
    </details>

    <!-- 05 -->
    <details class="ave-item">
      <summary>
        <div class="ave-summary">
          <div class="ave-number">05</div>
          <div class="ave-summary-title">
            <svg class="ave-svg"><use href="#i-vein"></use></svg>
            GARROTEAMENTO E AVALIAÇÃO DA VEIA
          </div>
          <svg class="ave-chevron"><use href="#i-chevron"></use></svg>
        </div>
      </summary>

      <div class="ave-content">

        <h3>Identifique a veia antes da antissepsia</h3>

        <div class="ave-illustration" style="max-width:420px;margin:18px auto;">
          <img
            src="https://id-preview--ee1abee9-28d3-4826-82bc-7387b3880d45.lovable.app/__l5e/assets-v1/ff28b09a-b2a3-4f97-a73b-c5b38419e2b1/pva-garroteando.png"
            alt="Garroteamento para avaliação e punção venosa periférica"
            style="width:100%;height:auto;display:block;border-radius:12px;"
          >
        </div>

        <div class="ave-illustration" style="max-width:420px;margin:18px auto;">
          <img
            src="https://id-preview--ee1abee9-28d3-4826-82bc-7387b3880d45.lovable.app/__l5e/assets-v1/c29e2a44-8c2e-4eac-a973-5b9fa4a7276a/pva-tateando.png"
            alt="Palpação da veia para punção venosa periférica"
            style="width:100%;height:auto;display:block;border-radius:12px;"
          >
        </div>

        <ul class="ave-list">
          <li>Aplicar o garrote de maneira adequada.</li>
          <li>Avaliar visualmente a rede venosa.</li>
          <li>Palpar a veia antes da preparação da pele.</li>
          <li>Escolher previamente o sítio de punção.</li>
          <li>Manter o membro em posição estável.</li>
          <li>Evitar garroteamento excessivo ou prolongado.</li>
        </ul>

        <div class="ave-warning">
          Depois da antissepsia, preserve a área preparada e evite tocar novamente
          no sítio, mantendo a técnica asséptica.
        </div>

      </div>
    </details>

    <!-- 06 -->
    <details class="ave-item">
      <summary>
        <div class="ave-summary">
          <div class="ave-number">06</div>
          <div class="ave-summary-title">
            <svg class="ave-svg"><use href="#i-drop"></use></svg>
            ANTISSEPSIA DA PELE
          </div>
          <svg class="ave-chevron"><use href="#i-chevron"></use></svg>
        </div>
      </summary>

      <div class="ave-content">

        <h3>Preparo adequado da pele</h3>

        <div class="ave-illustration" style="max-width:420px;margin:18px auto;">
          <img
            src="https://id-preview--ee1abee9-28d3-4826-82bc-7387b3880d45.lovable.app/__l5e/assets-v1/baf4fc42-a4b1-497e-a269-16c33fa97fa2/pva-assepsia.png"
            alt="Antissepsia da pele antes da punção venosa"
            style="width:100%;height:auto;display:block;border-radius:12px;"
          >
        </div>

        <ul class="ave-list">
          <li>Realizar higiene das mãos.</li>
          <li>Preparar a pele com antisséptico apropriado conforme protocolo.</li>
          <li>Utilizar o produto de acordo com as orientações do fabricante.</li>
          <li>Respeitar o tempo de contato indicado.</li>
          <li>Aguardar a secagem espontânea.</li>
          <li>Não tocar novamente no sítio preparado.</li>
        </ul>

        <div class="ave-info">
          A técnica asséptica é uma das principais barreiras contra contaminação
          do acesso vascular.
        </div>

      </div>
    </details>

    <!-- 07 -->
    <details class="ave-item">
      <summary>
        <div class="ave-summary">
          <div class="ave-number">07</div>
          <div class="ave-summary-title">
            <svg class="ave-svg"><use href="#i-users"></use></svg>
            POSICIONAMENTO DO PROFISSIONAL E DO MEMBRO
          </div>
          <svg class="ave-chevron"><use href="#i-chevron"></use></svg>
        </div>
      </summary>

      <div class="ave-content">

        <h3>Ergonomia também é segurança</h3>

        <ul class="ave-list">
          <li>Posicionar o paciente confortavelmente.</li>
          <li>Apoiar o membro adequadamente.</li>
          <li>Garantir iluminação suficiente.</li>
          <li>Manter visualização direta do sítio.</li>
          <li>Estabilizar o membro durante a punção.</li>
          <li>Posicionar-se de maneira que permita controle do dispositivo.</li>
          <li>Evitar movimentos desnecessários.</li>
        </ul>

      </div>
    </details>

    <!-- 08 -->
    <details class="ave-item">
      <summary>
        <div class="ave-summary">
          <div class="ave-number">08</div>
          <div class="ave-summary-title">
            <svg class="ave-svg"><use href="#i-vein"></use></svg>
            PUNÇÃO VENOSA
          </div>
          <svg class="ave-chevron"><use href="#i-chevron"></use></svg>
        </div>
      </summary>

      <div class="ave-content">

        <h3>Execução da punção</h3>

        <div class="ave-illustration" style="max-width:420px;margin:18px auto;">
          <img
            src="https://id-preview--ee1abee9-28d3-4826-82bc-7387b3880d45.lovable.app/__l5e/assets-v1/25542875-871f-45e2-ae3a-931bcac39a9c/pva-puncionando-1.png"
            alt="Inserção do dispositivo durante a punção venosa periférica"
            style="width:100%;height:auto;display:block;border-radius:12px;"
          >
        </div>

        <ul class="ave-list">
          <li>Estabilizar adequadamente o membro.</li>
          <li>Tracionar a pele conforme a técnica utilizada.</li>
          <li>Posicionar o dispositivo adequadamente.</li>
          <li>Realizar a punção mantendo técnica asséptica.</li>
          <li>Observar o refluxo sanguíneo conforme o dispositivo.</li>
          <li>Avançar o cateter conforme a técnica recomendada para o dispositivo.</li>
          <li>Liberar o garrote quando apropriado.</li>
          <li>Evitar movimentos desnecessários.</li>
          <li>Descartar imediatamente o perfurocortante.</li>
        </ul>

        <div class="ave-danger">
          <strong>Segurança:</strong>
          nunca reencape, dobre ou manipule desnecessariamente a agulha.
          O descarte deve ocorrer imediatamente no recipiente apropriado.
        </div>

      </div>
    </details>

    <!-- 09 -->
    <details class="ave-item">
      <summary>
        <div class="ave-summary">
          <div class="ave-number">09</div>
          <div class="ave-summary-title">
            <svg class="ave-svg"><use href="#i-drop"></use></svg>
            REFLUXO, RETIRADA DA AGULHA E COMPRESSÃO
          </div>
          <svg class="ave-chevron"><use href="#i-chevron"></use></svg>
        </div>
      </summary>

      <div class="ave-content">

        <h3>Finalização da inserção</h3>

        <div class="ave-illustration" style="max-width:420px;margin:18px auto;">
          <img
            src="https://id-preview--ee1abee9-28d3-4826-82bc-7387b3880d45.lovable.app/__l5e/assets-v1/24561a31-24d1-4f1a-a5cb-65e044fd1c51/pva-retirando-agulha.png"
            alt="Retirada da agulha e compressão do local após a punção"
            style="width:100%;height:auto;display:block;border-radius:12px;"
          >
        </div>

        <ul class="ave-list">
          <li>Observar o refluxo sanguíneo conforme o dispositivo.</li>
          <li>Avançar o cateter e retirar a agulha conforme a técnica do dispositivo.</li>
          <li>Descartar imediatamente o perfurocortante.</li>
          <li>Realizar compressão suave com gaze no local, quando aplicável.</li>
          <li>Controlar o sangramento antes da fixação.</li>
          <li>Observar o sítio de inserção.</li>
        </ul>

        <div class="ave-info">
          A compressão adequada após a retirada da agulha ajuda a controlar
          o sangramento e evita sujidade desnecessária no local.
        </div>

      </div>
    </details>

    <!-- 10 -->
    <details class="ave-item">
      <summary>
        <div class="ave-summary">
          <div class="ave-number">10</div>
          <div class="ave-summary-title">
            <svg class="ave-svg"><use href="#i-kit"></use></svg>
            CONEXÃO COM O SISTEMA DE INFUSÃO
          </div>
          <svg class="ave-chevron"><use href="#i-chevron"></use></svg>
        </div>
      </summary>

      <div class="ave-content">

        <h3>Conecte e observe</h3>

        <ul class="ave-list">
          <li>Conectar o sistema prescrito utilizando técnica asséptica.</li>
          <li>Verificar a permeabilidade conforme protocolo institucional.</li>
          <li>Iniciar a infusão conforme prescrição.</li>
          <li>Observar o sítio durante o início da infusão.</li>
          <li>Avaliar dor, edema, alteração de coloração ou resistência.</li>
          <li>Interromper e avaliar diante de sinais de complicação.</li>
        </ul>

        <div class="ave-warning">
          Dor, edema, resistência ao fluxo ou alteração do local durante a infusão
          exigem avaliação imediata do acesso.
        </div>

      </div>
    </details>

    <!-- 11 -->
    <details class="ave-item">
      <summary>
        <div class="ave-summary">
          <div class="ave-number">11</div>
          <div class="ave-summary-title">
            <svg class="ave-svg"><use href="#i-shield"></use></svg>
            FIXAÇÃO E ESTABILIZAÇÃO
          </div>
          <svg class="ave-chevron"><use href="#i-chevron"></use></svg>
        </div>
      </summary>

      <div class="ave-content">

        <h3>Proteja o acesso</h3>

        <ul class="ave-list">
          <li>Estabilizar adequadamente o cateter.</li>
          <li>Utilizar cobertura apropriada.</li>
          <li>Manter o sítio visível para avaliação.</li>
          <li>Evitar tração ou movimentação do cateter.</li>
          <li>Manter a cobertura íntegra.</li>
          <li>Seguir protocolo institucional e orientação do fabricante.</li>
        </ul>

      </div>
    </details>

    <!-- 12 -->
    <details class="ave-item">
      <summary>
        <div class="ave-summary">
          <div class="ave-number">12</div>
          <div class="ave-summary-title">
            <svg class="ave-svg"><use href="#i-check"></use></svg>
            IDENTIFICAÇÃO E REGISTRO
          </div>
          <svg class="ave-chevron"><use href="#i-chevron"></use></svg>
        </div>
      </summary>

      <div class="ave-content">

        <h3>O procedimento termina com o registro</h3>

        <div class="ave-illustration" style="max-width:420px;margin:18px auto;">
          <img
            src="https://id-preview--ee1abee9-28d3-4826-82bc-7387b3880d45.lovable.app/__l5e/assets-v1/5e9c9aeb-17d9-4d29-9893-90649edf3f54/pva-identificacao.png"
            alt="Identificação do acesso venoso periférico"
            style="width:100%;height:auto;display:block;border-radius:12px;"
          >
        </div>

        <ul class="ave-list">
          <li>Registrar data e horário.</li>
          <li>Registrar local e membro.</li>
          <li>Registrar tipo/calibre do dispositivo quando aplicável.</li>
          <li>Registrar condições do sítio.</li>
          <li>Registrar intercorrências.</li>
          <li>Registrar a terapia instalada.</li>
          <li>Identificar o profissional conforme rotina institucional.</li>
        </ul>

        <div class="ave-info">
          O registro permite rastreabilidade e facilita a continuidade do cuidado
          pela equipe.
        </div>

      </div>
    </details>

    <!-- 13 -->
    <details class="ave-item">
      <summary>
        <div class="ave-summary">
          <div class="ave-number">13</div>
          <div class="ave-summary-title">
            <svg class="ave-svg"><use href="#i-shield"></use></svg>
            PREVENÇÃO DE FLEBITE E OUTRAS COMPLICAÇÕES
          </div>
          <svg class="ave-chevron"><use href="#i-chevron"></use></svg>
        </div>
      </summary>

      <div class="ave-content">

        <h3>Prevenir é avaliar continuamente</h3>

        <ul class="ave-list">
          <li>Selecionar adequadamente o sítio.</li>
          <li>Escolher o dispositivo apropriado.</li>
          <li>Manter técnica asséptica.</li>
          <li>Evitar múltiplas tentativas desnecessárias.</li>
          <li>Estabilizar adequadamente o acesso.</li>
          <li>Avaliar regularmente o sítio de inserção.</li>
          <li>Observar dor.</li>
          <li>Observar eritema.</li>
          <li>Observar edema ou endurecimento.</li>
          <li>Observar alterações durante a infusão.</li>
          <li>Remover o cateter quando houver indicação clínica ou complicação.</li>
        </ul>

        <div class="ave-info">
          A manutenção segura depende de avaliação contínua do paciente,
          do sítio de inserção, do dispositivo e da terapia.
        </div>

      </div>
    </details>

    <!-- 14 -->
    <details class="ave-item">
      <summary>
        <div class="ave-summary">
          <div class="ave-number">14</div>
          <div class="ave-summary-title">
            <svg class="ave-svg"><use href="#i-vein"></use></svg>
            FLEBITE: GRAUS DE EVOLUÇÃO E CONDUTA
          </div>
          <svg class="ave-chevron"><use href="#i-chevron"></use></svg>
        </div>
      </summary>

      <div class="ave-content">

        <h3>Reconheça os sinais precocemente</h3>

        <p>
          A classificação clínica deve ser registrada conforme a escala adotada
          pelo serviço e utilizada para orientar a avaliação e a conduta.
        </p>

        <div class="ave-phlebitis">

          <div class="ave-grade">
            <div class="ave-grade-number">1</div>
            <img
              src="https://id-preview--ee1abee9-28d3-4826-82bc-7387b3880d45.lovable.app/__l5e/assets-v1/66a0acee-a881-40ca-8a83-e0bf4f5a8bee/flebite-g1.png"
              alt="Flebite grau 1"
              style="width:100%;height:auto;display:block;border-radius:12px;margin:0 0 12px;"
            >
            <strong>Grau 1</strong>
            <p>
              Eritema com ou sem dor local.
            </p>
          </div>

          <div class="ave-grade">
            <div class="ave-grade-number">2</div>
            <img
              src="https://id-preview--ee1abee9-28d3-4826-82bc-7387b3880d45.lovable.app/__l5e/assets-v1/f0293734-92b2-4c87-9e41-e81a8459c4b3/flebite-g2.png"
              alt="Flebite grau 2"
              style="width:100%;height:auto;display:block;border-radius:12px;margin:0 0 12px;"
            >
            <strong>Grau 2</strong>
            <p>
              Dor com eritema e/ou edema.
            </p>
          </div>

          <div class="ave-grade">
            <div class="ave-grade-number">3</div>
            <img
              src="https://id-preview--ee1abee9-28d3-4826-82bc-7387b3880d45.lovable.app/__l5e/assets-v1/f74ce4ff-a4b3-4174-a909-a53c8fa9734c/flebite-g3.png"
              alt="Flebite grau 3"
              style="width:100%;height:auto;display:block;border-radius:12px;margin:0 0 12px;"
            >
            <strong>Grau 3</strong>
            <p>
              Dor com eritema e/ou edema, endurecimento e cordão fibroso palpável.
            </p>
          </div>

          <div class="ave-grade">
            <div class="ave-grade-number">4</div>
            <img
              src="https://id-preview--ee1abee9-28d3-4826-82bc-7387b3880d45.lovable.app/__l5e/assets-v1/70e24a92-24fe-4d3c-9073-8709f29054c9/flebite-g4.png"
              alt="Flebite grau 4"
              style="width:100%;height:auto;display:block;border-radius:12px;margin:0 0 12px;"
            >
            <strong>Grau 4</strong>
            <p>
              Sinais do grau 3 associados a cordão venoso palpável maior que
              2,54 cm e drenagem purulenta.
            </p>
          </div>

        </div>

        <h4>O que fazer diante de sinais de flebite?</h4>

        <ul class="ave-list">
          <li>Interromper a infusão e avaliar o acesso.</li>
          <li>Remover o cateter quando indicado.</li>
          <li>Avaliar a extensão dos sinais locais.</li>
          <li>Comunicar a equipe responsável conforme protocolo.</li>
          <li>Registrar o evento e a classificação.</li>
          <li>Providenciar novo acesso quando houver necessidade clínica.</li>
          <li>Acompanhar a evolução do sítio.</li>
        </ul>

        <div class="ave-warning">
          <strong>Atenção:</strong>
          medidas adicionais devem seguir protocolo institucional e avaliação clínica.
          Não utilizar uma conduta medicamentosa única para todos os casos.
        </div>

      </div>
    </details>

    <!-- 15 -->
    <details class="ave-item">
      <summary>
        <div class="ave-summary">
          <div class="ave-number">15</div>
          <div class="ave-summary-title">
            <svg class="ave-svg"><use href="#i-drop"></use></svg>
            INFILTRAÇÃO E EXTRAVASAMENTO: O QUE FAZER
          </div>
          <svg class="ave-chevron"><use href="#i-chevron"></use></svg>
        </div>
      </summary>

      <div class="ave-content">

        <h3>Duas complicações que exigem atenção imediata</h3>

        <div class="ave-mini-grid">

          <div class="ave-mini-card">
            <strong>INFILTRAÇÃO</strong>
            <p>
              Entrada de solução não vesicante no tecido extravascular.
            </p>
          </div>

          <div class="ave-mini-card">
            <strong>EXTRAVASAMENTO</strong>
            <p>
              Saída de medicamento ou solução vesicante para o tecido extravascular.
            </p>
          </div>

        </div>

        <h4>Sinais de alerta</h4>

        <ul class="ave-list">
          <li>Dor ou desconforto.</li>
          <li>Edema.</li>
          <li>Alteração de temperatura.</li>
          <li>Palidez ou eritema.</li>
          <li>Endurecimento.</li>
          <li>Alteração do fluxo ou resistência.</li>
          <li>Alteração durante a infusão.</li>
        </ul>

        <h4>Conduta inicial</h4>

        <ul class="ave-list">
          <li>Interromper imediatamente a infusão.</li>
          <li>Não realizar flush pelo acesso suspeito.</li>
          <li>Avaliar o local e o agente infundido.</li>
          <li>Seguir o protocolo institucional específico.</li>
          <li>Quando indicado pelo protocolo, avaliar aspiração pelo cateter antes da retirada.</li>
          <li>Comunicar a equipe responsável.</li>
          <li>Registrar o evento.</li>
          <li>Acompanhar a evolução do local.</li>
        </ul>

        <div class="ave-danger">
          <strong>Importante:</strong>
          a conduta diante de extravasamento depende do medicamento ou solução envolvida.
          Não existe uma única conduta válida para todos os agentes.
        </div>

      </div>
    </details>

    <!-- 16 -->
    <details class="ave-item">
      <summary>
        <div class="ave-summary">
          <div class="ave-number">16</div>
          <div class="ave-summary-title">
            <svg class="ave-svg"><use href="#i-check"></use></svg>
            CHECKLIST FINAL DE SEGURANÇA
          </div>
          <svg class="ave-chevron"><use href="#i-chevron"></use></svg>
        </div>
      </summary>

      <div class="ave-content">

        <h3>Antes de considerar o procedimento concluído</h3>

        <div class="ave-checklist">

          <div class="ave-check">Indicação conferida</div>
          <div class="ave-check">Paciente identificado</div>
          <div class="ave-check">Material preparado</div>
          <div class="ave-check">Sítio adequado selecionado</div>
          <div class="ave-check">Dispositivo adequado selecionado</div>
          <div class="ave-check">Higiene das mãos realizada</div>
          <div class="ave-check">Antissepsia realizada</div>
          <div class="ave-check">Técnica asséptica mantida</div>
          <div class="ave-check">Punção realizada</div>
          <div class="ave-check">Permeabilidade avaliada</div>
          <div class="ave-check">Sistema conectado</div>
          <div class="ave-check">Infusão conferida</div>
          <div class="ave-check">Cateter estabilizado</div>
          <div class="ave-check">Curativo adequado</div>
          <div class="ave-check">Acesso identificado</div>
          <div class="ave-check">Registro realizado</div>
          <div class="ave-check">Sítio avaliado</div>
          <div class="ave-check">Complicações avaliadas</div>

        </div>

        <div class="ave-info">
          <strong>Boa prática:</strong>
          a avaliação do acesso não termina após a fixação. O sítio deve continuar
          sendo observado durante a permanência do dispositivo.
        </div>

      </div>
    </details>

  </div>

  <!-- FUNDAMENTAÇÃO -->
  <div class="ave-reference">

    <div class="ave-reference-head">

      <div class="ave-reference-icon">
        <svg class="ave-svg"><use href="#i-book"></use></svg>
      </div>

      <div>
        <h3>FUNDAMENTAÇÃO TÉCNICA</h3>
      </div>

    </div>

    <p>
      Conteúdo educacional baseado em recomendações oficiais e referências
      técnico-científicas relacionadas à segurança do paciente e ao uso de
      cateteres intravenosos periféricos.
    </p>

    <ul>
      <li>Agência Nacional de Vigilância Sanitária — ANVISA.</li>
      <li>Protocolos de prevenção de infecção relacionada à assistência à saúde.</li>
      <li>Protocolos de prevenção de infecção da corrente sanguínea associada a dispositivos vasculares.</li>
      <li>Boas práticas de segurança do paciente.</li>
      <li>Referências técnico-científicas de Enfermagem.</li>
    </ul>

    <div class="ave-disclaimer">
      <strong>Conteúdo educacional:</strong>
      destinado ao treinamento e à atualização profissional.
      A execução do procedimento deve respeitar competência profissional,
      protocolo institucional, prescrição, condições clínicas do paciente,
      instruções do fabricante e normas vigentes.
    </div>

  </div>

</div>

</section>
