import { supabaseAdmin } from './src/integrations/supabase/client.server';

async function updateAVCUrgencia() {
  const slug = 'protocolo-avc-sala-vermelha';
  
  const { data: guia, error: fetchError } = await supabaseAdmin
    .from('mini_apps')
    .select('content_md')
    .eq('slug', slug)
    .single();

  if (fetchError || !guia) {
    console.error('Erro ao buscar guia:', fetchError);
    return;
  }

  let content = guia.content_md;

  const style = `
<style>
  .stroke-urgencia { margin-top: 15px; padding: 12px; border-radius: 8px; font-weight: bold; text-align: center; border: 2px solid; display: none; }
  .urgencia-critica { background: #ffebee; color: #b71c1c; border-color: #ef5350; }
  .urgencia-moderada { background: #fff8e1; color: #f57f17; border-color: #ffca28; }
  .urgencia-estavel { background: #e8f5e9; color: #1b5e20; border-color: #66bb6a; }
  .urgencia-msg { font-size: 0.85rem; margin-top: 4px; font-weight: normal; }
</style>
`;

  const urgenciaHtml = style + '<div id="status-urgencia-stroke" class="stroke-urgencia"></div>';

  const scriptMatch = content.match(/<script>([\s\S]*?)<\/script>/);
  if (scriptMatch) {
    let scriptContent = scriptMatch[1];
    
    if (!scriptContent.includes('status-urgencia-stroke')) {
      scriptContent = scriptContent.replace(
        'renderizarHistorico();',
        'renderizarHistorico();' +
        'calcularUrgencia(befastResult, lastKnownWell, glicemia);'
      );

      scriptContent += `
        function calcularUrgencia(befast, lkw, hgt) {
          const container = document.getElementById('status-urgencia-stroke');
          if (!container) return;
          
          let nivel = "";
          let classe = "";
          let orientacao = "";
          
          const tempoMinutos = (new Date() - new Date(lkw)) / 60000;
          const befastPositivo = befast !== "NORMAL";
          const hgtAlvo = parseInt(hgt) >= 60 && parseInt(hgt) <= 180;

          if (befastPositivo && tempoMinutos <= 270) {
            nivel = "🚨 PRIORIDADE ABSOLUTA: CRÍTICA";
            classe = "urgencia-critica";
            orientacao = "Janela de Trombólise aberta. TC e Neurologista IMEDIATO.";
          } else if (befastPositivo) {
            nivel = "⚠️ URGÊNCIA: ALERTA";
            classe = "urgencia-moderada";
            orientacao = "Fora da janela convencional. Avaliar Trombectomia / UTI.";
          } else if (!hgtAlvo) {
            nivel = "🟡 ATENÇÃO: METABÓLICO";
            classe = "urgencia-moderada";
            orientacao = "Corrigir Glicemia antes de descartar Stroke.";
          } else {
            nivel = "✅ ESTÁVEL / OBSERVAÇÃO";
            classe = "urgencia-estavel";
            orientacao = "Sinais vitais normais. Manter vigilância neurológica.";
          }

          container.className = "stroke-urgencia " + classe;
          container.innerHTML = '<div>' + nivel + '</div><div class="urgencia-msg">' + orientacao + '</div>';
          container.style.display = 'block';
        }
      `;
      content = content.replace(scriptMatch[0], '<script>' + scriptContent + '</script>');
    }
  }

  if (!content.includes('status-urgencia-stroke')) {
    if (content.includes('<div id="checklist-porta-agulha"')) {
        content = content.replace('<div id="checklist-porta-agulha"', urgenciaHtml + '<div id="checklist-porta-agulha"');
    } else {
        content += urgenciaHtml;
    }
  }

  const { error: updateError } = await supabaseAdmin
    .from('mini_apps')
    .update({ content_md: content })
    .eq('slug', slug);

  if (updateError) {
    console.error('Erro ao atualizar guia:', updateError);
  } else {
    console.log('Cálculo de urgência implementado com sucesso!');
  }
}

updateAVCUrgencia();
