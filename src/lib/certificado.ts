import QRCode from "qrcode";
import logoAdec from "@/assets/logo-adec.png.asset.json";
import { CONTEUDO_PROGRAMATICO } from "@/data/conteudo-programatico";
import { TEMAS_POR_CATEGORIA } from "@/data/temas-certificados";


export const SITE_URL = "https://academiadaenfermagem.com.br";

export type CertificadoDados = {
  code: string;
  student_name: string;
  mini_app_name: string;
  app_name?: string | null;
  hours: number;
  issued_at: string;
};

export function linkValidacao(code: string) {
  return `${SITE_URL}/validacao?codigo=${encodeURIComponent(code)}`;
}

function esc(v: string) {
  return v.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c] as string);
}

export async function certificadoHtml(c: CertificadoDados) {
  const qr = await QRCode.toDataURL(linkValidacao(c.code), { margin: 0, width: 320 });
  const logo = new URL(logoAdec.url, SITE_URL).toString();
  const data = new Date(c.issued_at).toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" });

  return `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8">
<title>Certificado ${esc(c.code)}</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@600;700&family=Great+Vibes&family=Montserrat:wght@400;600;700&display=swap" rel="stylesheet">
<style>
  @page { size: A4 landscape; margin: 0; }
  *{box-sizing:border-box}
  body{margin:0;background:#e8ece7;font-family:'Montserrat',sans-serif;color:#123524;display:flex;justify-content:center;padding:20px}
  .folha{position:relative;width:1123px;height:794px;background:#eaf1e6;overflow:hidden;box-shadow:0 18px 50px rgba(0,0,0,.25)}
  .onda{position:absolute;width:470px;height:470px;border-radius:50% 50% 46% 54%}
  .o2{top:-300px;left:-210px;background:linear-gradient(135deg,#e8c874,#b8912f)}
  .o1{top:-312px;left:-232px;background:linear-gradient(135deg,#0f3d28,#1c5c3b);z-index:2}
  .o4{bottom:-300px;right:-210px;background:linear-gradient(135deg,#e8c874,#b8912f)}
  .o3{bottom:-312px;right:-232px;background:linear-gradient(135deg,#0f3d28,#1c5c3b);z-index:2}
  .moldura{position:absolute;inset:26px;border:2px solid #b8912f;z-index:3;pointer-events:none}
  .moldura:after{content:'';position:absolute;inset:9px;border:1px solid rgba(184,145,47,.45)}
  .conteudo{position:relative;z-index:4;height:100%;padding:40px 90px 58px;text-align:center;display:flex;flex-direction:column;align-items:center}
  .topo{display:flex;align-items:center;gap:18px;justify-content:center}
  .topo img{width:74px;height:74px;object-fit:contain}
  .marca{text-align:left;border-left:2px solid rgba(184,145,47,.6);padding-left:16px}
  .marca .n{font-family:'Cormorant Garamond',serif;font-size:44px;font-weight:700;letter-spacing:.06em;line-height:1;color:#0f3d28}
  .marca .s{font-size:13px;font-weight:700;color:#0f3d28;line-height:1.25;margin-top:4px}
  .sub{font-size:11px;color:#a9822a;margin-top:10px;letter-spacing:.02em}
  .div{width:520px;height:1px;background:linear-gradient(90deg,transparent,#b8912f,transparent);margin:14px 0 6px}
  h1{font-family:'Cormorant Garamond',serif;font-size:66px;letter-spacing:.06em;margin:2px 0 0;color:#0d2e1f}
  .cert-linha{font-size:16px;color:#2a4739;margin-top:6px}
  .nome{font-family:'Great Vibes',cursive;font-size:54px;color:#b8912f;line-height:1.2;margin:2px 0 0}
  .regua{width:640px;height:1px;background:#b8912f;opacity:.6;margin:6px 0 16px;position:relative}
  .regua:after{content:'';position:absolute;left:50%;top:-4px;width:8px;height:8px;background:#b8912f;transform:translateX(-50%) rotate(45deg)}
  .txt{font-size:16px;line-height:1.75;color:#20402f;max-width:760px}
  .txt strong{color:#0d2e1f}
  .academia{margin-top:6px;font-size:15px;font-weight:700;color:#0f3d28;letter-spacing:.04em;text-transform:uppercase}
  .rodape{margin-top:auto;margin-bottom:14px;width:100%;display:flex;align-items:flex-end;justify-content:space-between}
  .qr{border:1px solid #b8912f;border-radius:10px;padding:8px;background:#fff;text-align:center;width:128px}
  .qr img{width:100px;height:100px;display:block;margin:6px auto 0}
  .qr span{font-size:9.5px;font-weight:700;letter-spacing:.08em;color:#0f3d28}
  .assin{text-align:center}
  .assin .pena{font-size:38px;color:#b8912f;line-height:1}
  .assin .linha{width:300px;height:1px;background:#0f3d28;opacity:.6;margin:8px auto 6px}
  .assin .nomea{font-family:'Great Vibes',cursive;font-size:26px;color:#0f3d28}
  .selo{width:126px;height:126px;border-radius:50%;background:radial-gradient(circle at 30% 25%,#f0d489,#b8912f);display:flex;align-items:center;justify-content:center;box-shadow:0 6px 18px rgba(0,0,0,.18)}
  .selo .in{width:98px;height:98px;border-radius:50%;background:#0f3d28;border:2px solid #e8c874;color:#f0d489;display:flex;flex-direction:column;align-items:center;justify-content:center;font-size:11px;font-weight:700;letter-spacing:.06em;line-height:1.5}
  .codigo{position:absolute;left:50%;transform:translateX(-50%);bottom:16px;width:660px;text-align:center;font-size:11px;color:#3d5a4b;z-index:5}
  @media print{body{background:#fff;padding:0}.folha{box-shadow:none}}
</style></head><body>
<div class="folha">
  <div class="onda o1"></div><div class="onda o2"></div>
  <div class="onda o3"></div><div class="onda o4"></div>
  <div class="moldura"></div>
  <div class="conteudo">
    <div class="topo">
      <img src="${logo}" alt="ADEC">
      <div class="marca">
        <div class="n">ADEC</div>
        <div class="s">Avaliação Diagnóstica em<br>Enfermagem Clínica</div>
      </div>
    </div>
    <div class="sub">Sistema Brasileiro de Hipótese Diagnóstica em Enfermagem</div>
    <div class="div"></div>
    <h1>CERTIFICADO</h1>
    <p class="cert-linha">Certificamos para os devidos fins que</p>
    <p class="nome">${esc(c.student_name)}</p>
    <div class="regua"></div>
    <p class="txt">
      concluiu com êxito o módulo técnico de especialização em<br>
      <strong>${esc(c.mini_app_name)}</strong><br>
      com carga horária total de <strong>${c.hours} horas</strong>.
    </p>
    ${c.app_name ? `<p class="academia">${esc(c.app_name)}</p>` : ""}
    <div class="rodape">
      <div class="qr"><span>QR CODE<br>VALIDAÇÃO</span><img src="${qr}" alt="QR Code de validação"></div>
      <div class="assin">
        <div class="pena">&#10002;</div>
        <div class="linha"></div>
        <div class="nomea">Assinatura ADEC</div>
      </div>
      <div class="selo"><div class="in"><div>★ ★ ★</div><div>QUALIDADE<br>PREMIUM<br>ADEC</div></div></div>
    </div>
  </div>
  <div class="codigo">Emitido em ${esc(data)} · Código de validação: <strong>${esc(c.code)}</strong> · ${SITE_URL}/validacao</div>
</div>
<script>window.onload=function(){setTimeout(function(){window.print()},600)}</script>
</body></html>`;
}

export async function versoCertificadoHtml(c: CertificadoDados) {
  const logo = new URL(logoAdec.url, SITE_URL).toString();
  const data = new Date(c.issued_at).toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" });
  
  // Tentar encontrar a categoria e o conteúdo programático
  let categoria = "ACADEMICO";
  let conteudo = "Conteúdo programático detalhado da Academia da Enfermagem (ADEC).";
  
  for (const [cat, temas] of Object.entries(TEMAS_POR_CATEGORIA)) {
    if (temas.includes(c.mini_app_name)) {
      categoria = cat;
      const map = CONTEUDO_PROGRAMATICO[cat];
      if (map && map[c.mini_app_name]) {
        conteudo = map[c.mini_app_name];
      }
      break;
    }
  }

  const itens = conteudo.split(/[;|\n]/).map(t => t.trim()).filter(t => t.length > 3);

  return `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8">
<title>Verso Certificado ${esc(c.code)}</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@600;700&family=Montserrat:wght@400;600;700&display=swap" rel="stylesheet">
<style>
  @page { size: A4 landscape; margin: 0; }
  *{box-sizing:border-box}
  body{margin:0;background:#e8ece7;font-family:'Montserrat',sans-serif;color:#123524;display:flex;justify-content:center;padding:20px}
  .folha{position:relative;width:1123px;height:794px;background:#fff;overflow:hidden;box-shadow:0 18px 50px rgba(0,0,0,.25);border:1px solid #eee}
  .moldura{position:absolute;inset:26px;border:1px solid rgba(184,145,47,.3);z-index:3;pointer-events:none}
  .conteudo{position:relative;z-index:4;height:100%;padding:60px 100px;display:flex;flex-direction:column}
  .topo{display:flex;justify-content:space-between;align-items:center;margin-bottom:40px;border-bottom:2px solid #0f3d28;padding-bottom:20px}
  .titulo-verso{font-family:'Cormorant Garamond',serif;font-size:32px;font-weight:700;color:#0f3d28;text-transform:uppercase;letter-spacing:0.1em}
  .logo-mini{height:50px}
  .tema-box{margin-bottom:30px}
  .tema-label{font-size:12px;font-weight:700;color:#b8912f;letter-spacing:0.1em;text-transform:uppercase;margin-bottom:8px}
  .tema-nome{font-family:'Cormorant Garamond',serif;font-size:28px;font-weight:700;color:#123524}
  .grid-conteudo{display:grid;grid-template-columns:1fr 1fr;gap:40px;margin-top:20px}
  .col{display:flex;flex-direction:column;gap:15px}
  .item{font-size:14px;line-height:1.6;color:#2a4739;padding-left:20px;position:relative}
  .item:before{content:'•';position:absolute;left:0;color:#b8912f;font-weight:bold}
  .item strong{color:#0d2e1f;display:block;margin-bottom:2px}
  .info-legal{margin-top:auto;padding-top:30px;border-top:1px solid #eee;display:flex;justify-content:space-between;align-items:center;font-size:11px;color:#666}
  .selo-mini{font-weight:700;color:#0f3d28;border:1px solid #0f3d28;padding:4px 8px;border-radius:4px}
  @media print{body{background:#fff;padding:0}.folha{box-shadow:none;border:none}}
</style></head><body>
<div class="folha">
  <div class="moldura"></div>
  <div class="conteudo">
    <div class="topo">
      <div class="titulo-verso">Conteúdo Programático</div>
      <img src="${logo}" class="logo-mini" alt="ADEC">
    </div>
    
    <div class="tema-box">
      <div class="tema-label">Módulo / Tema</div>
      <div class="tema-nome">${esc(c.mini_app_name)}</div>
    </div>

    <div class="grid-conteudo">
      <div class="col">
        ${itens.slice(0, Math.ceil(itens.length / 2)).map(item => `<div class="item">${esc(item)}</div>`).join('')}
      </div>
      <div class="col">
        ${itens.slice(Math.ceil(itens.length / 2)).map(item => `<div class="item">${esc(item)}</div>`).join('')}
      </div>
    </div>

    <div class="info-legal">
      <div>Código de Autenticidade: <strong>${esc(c.code)}</strong> | Verificação em: ${SITE_URL}/validacao</div>
      <div style="text-align:right">
        Documento emitido eletronicamente em ${esc(data)}<br>
        <span class="selo-mini">ADEC - ACADEMIA DA ENFERMAGEM</span>
      </div>
    </div>
  </div>
</div>
<script>window.onload=function(){setTimeout(function(){window.print()},800)}</script>
</body></html>`;
}

export async function abrirCertificado(c: CertificadoDados) {
  // Abrir frente
  const wFrente = window.open("", "_blank");
  const htmlFrente = await certificadoHtml(c);
  if (wFrente) {
    wFrente.document.write(htmlFrente);
    wFrente.document.close();
  }

  // Abrir verso (um pequeno delay para não bloquear popups)
  setTimeout(async () => {
    const wVerso = window.open("", "_blank");
    const htmlVerso = await versoCertificadoHtml(c);
    if (wVerso) {
      wVerso.document.write(htmlVerso);
      wVerso.document.close();
    }
  }, 500);
}

