
UPDATE mini_apps
SET content_md = replace(
  content_md,
  '<div id="wrapper-tabela-prescricao" style="display: none; width: 100%; overflow-x: auto;">
      <table style="width: 100%; border-collapse: collapse; font-family: inherit; font-size: 13px; color: #334155; min-width: 650px; text-align: left;">
        <thead>
          <tr style="background: #f0fdf4; border-bottom: 2px solid #ca8a04;">
            <th style="padding: 12px 10px; font-weight: 700; color: #14532d; width: 60px; text-align: center;">Nº</th>
            <th style="padding: 12px 10px; font-weight: 700; color: #14532d; width: 45%;">PRESCRIÇÃO</th>
            <th style="padding: 12px 10px; font-weight: 700; color: #14532d; width: 20%; text-align: center;">APRAZAMENTO</th>
            <th style="padding: 12px 10px; font-weight: 700; color: #14532d; width: 30%;">ANOTAÇÕES</th>
          </tr>
        </thead>',
  '<div id="wrapper-tabela-prescricao" style="display: none; width: 100%; overflow-x: auto;">
      <div style="border:2px solid #166534;border-bottom:0;background:#ffffff;padding:10px 14px;font-size:12px;color:#14532d;line-height:2;">
        <div style="display:flex;flex-wrap:wrap;gap:14px;align-items:baseline;">
          <span><strong style="color:#166534;">NOME:</strong> <span style="display:inline-block;min-width:220px;border-bottom:1px solid #14532d;">&nbsp;</span></span>
          <span><strong style="color:#166534;">Idade:</strong> <span style="display:inline-block;min-width:50px;border-bottom:1px solid #14532d;">&nbsp;</span></span>
          <span><strong style="color:#166534;">Leito:</strong> <span style="display:inline-block;min-width:60px;border-bottom:1px solid #14532d;">&nbsp;</span></span>
          <span><strong style="color:#166534;">Data intern.:</strong> <span style="display:inline-block;min-width:90px;border-bottom:1px solid #14532d;">&nbsp;</span></span>
          <span><strong style="color:#166534;">Setor/Clínica:</strong> <span style="display:inline-block;min-width:140px;border-bottom:1px solid #14532d;">&nbsp;</span></span>
        </div>
        <div style="display:flex;flex-wrap:wrap;gap:14px;align-items:baseline;margin-top:2px;">
          <span><strong style="color:#166534;">PE.: data</strong> <span style="display:inline-block;min-width:30px;border-bottom:1px solid #14532d;">&nbsp;</span> / <span style="display:inline-block;min-width:30px;border-bottom:1px solid #14532d;">&nbsp;</span> / <span style="display:inline-block;min-width:50px;border-bottom:1px solid #14532d;">&nbsp;</span></span>
          <span><strong style="color:#166534;">Hora:</strong> <span style="display:inline-block;min-width:70px;border-bottom:1px solid #14532d;">&nbsp;</span></span>
          <span><strong style="color:#166534;">Enfermeiro:</strong> <span style="display:inline-block;min-width:260px;border-bottom:1px solid #14532d;">&nbsp;</span></span>
        </div>
      </div>
      <table style="width: 100%; border-collapse: collapse; font-family: inherit; font-size: 13px; color: #14532d; min-width: 650px; text-align: left; border:2px solid #166534;">
        <thead>
          <tr style="background: #ffffff; border-bottom: 2px solid #166534;">
            <th style="padding: 12px 10px; font-weight: 700; color: #14532d; width: 50%; text-align:center; border-right:1px solid #166534;">PRESCRIÇÃO DE ENFERMAGEM</th>
            <th style="padding: 12px 10px; font-weight: 700; color: #14532d; width: 18%; text-align: center; border-right:1px solid #166534;">APRAZAMENTO</th>
            <th style="padding: 12px 10px; font-weight: 700; color: #14532d; width: 32%; text-align:center;">ANOTAÇÕES DE ENFERMAGEM</th>
          </tr>
        </thead>'
)
WHERE id='c020e2e7-90db-449f-a508-2c173f4cada2';
