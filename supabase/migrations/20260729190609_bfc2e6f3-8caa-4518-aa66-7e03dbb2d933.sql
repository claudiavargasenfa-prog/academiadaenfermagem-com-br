UPDATE public.mini_apps
SET content_md = replace(
  content_md,
  '<div style="text-align: center; color: #0b4da8; font-size: 20px; font-weight: 700; margin-bottom: 20px;">ROTEIRO 1: ANAMNESE DO ADULTO</div>',
  '<div style="position: relative; overflow: hidden; background: linear-gradient(135deg, #062a5c 0%, #0b4da8 55%, #2b8fd6 100%); border-radius: 24px; padding: 34px 24px 30px; text-align: center; margin: 0 0 24px; box-shadow: 0 14px 38px rgba(11,77,168,0.30);">
  <div style="position:absolute; top:-60px; right:-50px; width:190px; height:190px; border-radius:50%; background:rgba(255,255,255,0.08);"></div>
  <div style="position:absolute; bottom:-70px; left:-40px; width:170px; height:170px; border-radius:50%; background:rgba(212,168,75,0.16);"></div>
  <div style="position:relative;">
    <div style="display:inline-block; padding:5px 14px; border-radius:999px; background:rgba(212,168,75,0.18); border:1px solid rgba(212,168,75,0.55); color:#f2d99b; font-size:11px; font-weight:700; letter-spacing:1.5px; text-transform:uppercase;">Academia da Enfermagem</div>
    <div style="font-size:52px; line-height:1; margin:16px 0 10px;">🩺</div>
    <h1 style="color:#ffffff; font-size:24px; line-height:1.25; margin:0 0 8px; font-weight:800;">Anamnese, Exame Físico, Diagnósticos, Prescrição e Evolução</h1>
    <p style="color:#cfe4fb; font-size:14px; line-height:1.6; margin:0 auto; max-width:620px;">Roteiros práticos, passo a passo, para conduzir a consulta de enfermagem com segurança clínica e registro impecável.</p>
    <div style="width:70px; height:3px; background:linear-gradient(90deg,#d4a84b,#f2d99b); border-radius:2px; margin:18px auto 16px;"></div>
    <div style="display:flex; flex-wrap:wrap; justify-content:center; gap:8px;">
      <span style="background:rgba(255,255,255,0.12); border:1px solid rgba(255,255,255,0.22); color:#eaf3ff; font-size:12px; font-weight:600; padding:7px 13px; border-radius:999px;">🗣️ Anamnese</span>
      <span style="background:rgba(255,255,255,0.12); border:1px solid rgba(255,255,255,0.22); color:#eaf3ff; font-size:12px; font-weight:600; padding:7px 13px; border-radius:999px;">🔎 Exame Físico</span>
      <span style="background:rgba(255,255,255,0.12); border:1px solid rgba(255,255,255,0.22); color:#eaf3ff; font-size:12px; font-weight:600; padding:7px 13px; border-radius:999px;">🧠 Diagnósticos</span>
      <span style="background:rgba(255,255,255,0.12); border:1px solid rgba(255,255,255,0.22); color:#eaf3ff; font-size:12px; font-weight:600; padding:7px 13px; border-radius:999px;">📝 Prescrição</span>
      <span style="background:rgba(255,255,255,0.12); border:1px solid rgba(255,255,255,0.22); color:#eaf3ff; font-size:12px; font-weight:600; padding:7px 13px; border-radius:999px;">📈 Evolução</span>
    </div>
  </div>
</div>

<div style="text-align: center; color: #0b4da8; font-size: 20px; font-weight: 700; margin-bottom: 20px;">ROTEIRO 1: ANAMNESE DO ADULTO</div>'
)
WHERE id = '14cc3975-cce4-4086-a8ee-7c3daec90d3f';