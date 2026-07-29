UPDATE mini_apps
SET content_md = substring(content_md from 1 for 44389)
  || '<div style="margin:12px 0 4px;border:1px solid #fecaca;border-radius:10px;padding:12px;background:#fff5f5;">
  <div style="font-size:12.5px;font-weight:800;color:#991b1b;margin-bottom:8px;">🩺 Sinais Vitais</div>
  <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:8px;">
    <label style="display:flex;flex-direction:column;gap:4px;font-size:11.5px;font-weight:700;color:#991b1b;">P.A. (mmHg)
      <input type="text" id="sae-sv-pa" class="sae-sv" placeholder="120/80" style="padding:8px 10px;border:1px solid #fecaca;border-radius:6px;font-size:13px;font-weight:600;color:#111827;background:#ffffff;box-sizing:border-box;">
    </label>
    <label style="display:flex;flex-direction:column;gap:4px;font-size:11.5px;font-weight:700;color:#991b1b;">T. (°C)
      <input type="text" id="sae-sv-temp" class="sae-sv" placeholder="36,5" style="padding:8px 10px;border:1px solid #fecaca;border-radius:6px;font-size:13px;font-weight:600;color:#111827;background:#ffffff;box-sizing:border-box;">
    </label>
    <label style="display:flex;flex-direction:column;gap:4px;font-size:11.5px;font-weight:700;color:#991b1b;">R. (irpm)
      <input type="text" id="sae-sv-fr" class="sae-sv" placeholder="18" style="padding:8px 10px;border:1px solid #fecaca;border-radius:6px;font-size:13px;font-weight:600;color:#111827;background:#ffffff;box-sizing:border-box;">
    </label>
    <label style="display:flex;flex-direction:column;gap:4px;font-size:11.5px;font-weight:700;color:#991b1b;">P. (bpm)
      <input type="text" id="sae-sv-fc" class="sae-sv" placeholder="80" style="padding:8px 10px;border:1px solid #fecaca;border-radius:6px;font-size:13px;font-weight:600;color:#111827;background:#ffffff;box-sizing:border-box;">
    </label>
    <label style="display:flex;flex-direction:column;gap:4px;font-size:11.5px;font-weight:700;color:#991b1b;">Dor (0 a 10)
      <input type="number" min="0" max="10" id="sae-sv-dor" class="sae-sv" placeholder="0" style="padding:8px 10px;border:1px solid #fecaca;border-radius:6px;font-size:13px;font-weight:600;color:#111827;background:#ffffff;box-sizing:border-box;">
    </label>
    <label style="display:flex;flex-direction:column;gap:4px;font-size:11.5px;font-weight:700;color:#991b1b;">Glicemia capilar (mg/dL)
      <input type="text" id="sae-sv-glicemia" class="sae-sv" placeholder="99" style="padding:8px 10px;border:1px solid #fecaca;border-radius:6px;font-size:13px;font-weight:600;color:#111827;background:#ffffff;box-sizing:border-box;">
    </label>
  </div>
</div>
'
  || substring(content_md from 44390)
WHERE id = 'c020e2e7-90db-449f-a508-2c173f4cada2';