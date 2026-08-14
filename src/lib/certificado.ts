import QRCode from "qrcode";
import logoAdec from "@/assets/logo-adec.png.asset.json";

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
  .o1{top:-312px;left:-232px;background:linear-gradient(135deg,#0f3d28,#1c5c3b)}
  .o4{bottom:-300px;right:-210px;background:linear-gradient(135deg,#e8c874,#b8912f)}
  .o3{bottom:-312px;right:-232px;background:linear-gradient(135deg,#0f3d28,#1c5c3b)}
  .moldura{position:absolute;inset:26px;border:2px solid #b8912f;z-index:3;pointer-events:none}
  .moldura:after{content:'';position:absolute;inset:9px;border:1px solid rgba(184,145,47,.45)}
  .conteudo{position:relative;z-index:4;height:100%;padding:58px 90px;text-align:center;display:flex;flex-direction:column;align-items:center}
  .topo{display:flex;align-items:center;gap:18px;justify-content:center}
  .topo img{width:86px;height:86px;object-fit:contain}
  .marca{text-align:left;border-left:2px solid rgba(184,145,47,.6);padding-left:16px}
  .marca .n{font-family:'Cormorant Garamond',serif;font-size:44px;font-weight:700;letter-spacing:.06em;line-height:1;color:#0f3d28}
  .marca .s{font-size:13px;font-weight:700;color:#0f3d28;line-height:1.25;margin-top:4px}
  .sub{font-size:11px;color:#a9822a;margin-top:10px;letter-spacing:.02em}
  .div{width:520px;height:1px;background:linear-gradient(90deg,transparent,#b8912f,transparent);margin:14px 0 6px}
  h1{font-family:'Cormorant Garamond',serif;font-size:78px;letter-spacing:.06em;margin:6px 0 2px;color:#0d2e1f}
  .cert-linha{font-size:16px;color:#2a4739;margin-top:6px}
  .nome{font-family:'Great Vibes',cursive;font-size:64px;color:#b8912f;line-height:1.25;margin:6px 0 2px}
  .regua{width:640px;height:1px;background:#b8912f;opacity:.6;margin:6px 0 16px;position:relative}
  .regua:after{content:'';position:absolute;left:50%;top:-4px;width:8px;height:8px;background:#b8912f;transform:translateX(-50%) rotate(45deg)}
  .txt{font-size:17px;line-height:1.9;color:#20402f;max-width:760px}
  .txt strong{color:#0d2e1f}
  .academia{margin-top:6px;font-size:15px;font-weight:700;color:#0f3d28;letter-spacing:.04em;text-transform:uppercase}
  .rodape{margin-top:auto;width:100%;display:flex;align-items:flex-end;justify-content:space-between}
  .qr{border:1px solid #b8912f;border-radius:10px;padding:10px;background:#fff;text-align:center;width:150px}
  .qr img{width:120px;height:120px;display:block;margin:6px auto 0}
  .qr span{font-size:9.5px;font-weight:700;letter-spacing:.08em;color:#0f3d28}
  .assin{text-align:center}
  .assin .pena{font-size:38px;color:#b8912f;line-height:1}
  .assin .linha{width:300px;height:1px;background:#0f3d28;opacity:.6;margin:8px auto 6px}
  .assin .nomea{font-family:'Great Vibes',cursive;font-size:26px;color:#0f3d28}
  .selo{width:150px;height:150px;border-radius:50%;background:radial-gradient(circle at 30% 25%,#f0d489,#b8912f);display:flex;align-items:center;justify-content:center;box-shadow:0 6px 18px rgba(0,0,0,.18)}
  .selo .in{width:118px;height:118px;border-radius:50%;background:#0f3d28;border:2px solid #e8c874;color:#f0d489;display:flex;flex-direction:column;align-items:center;justify-content:center;font-size:11px;font-weight:700;letter-spacing:.06em;line-height:1.5}
  .codigo{position:absolute;left:0;right:0;bottom:34px;text-align:center;font-size:11px;color:#3d5a4b;z-index:5}
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

export async function abrirCertificado(c: CertificadoDados) {
  const w = window.open("", "_blank");
  const html = await certificadoHtml(c);
  if (w) {
    w.document.write(html);
    w.document.close();
  }
}
