import { supabaseAdmin } from './src/integrations/supabase/client.server';

async function updateAVCChecklist() {
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

  const style = "<style>.stroke-checklist { margin-top: 20px; padding: 15px; background: #fffde7; border-radius: 8px; border: 1px solid #fbc02d; display: none; }.stroke-checklist h4 { margin: 0 0 10px 0; color: #f57f17; display: flex; align-items: center; gap: 8px; }.checklist-item { display: flex; align-items: flex-start; gap: 10px; margin-bottom: 8px; font-size: 0.9rem; }.checklist-item input { margin-top: 3px; }.checklist-item label { color: #5d4037; cursor: pointer; }</style>";

  const checklistHtml = style + 
    '<div id="checklist-porta-agulha" class="stroke-checklist">' +
    '  <h4>⚡ Checklist Ações Imediatas (Fluxo Porta-Agulha)</h4>' +
    '  <div class="checklist-item"><input type="checkbox" id="c1"><label for="c1">Monitorização contínua (ECG, SpO2, PA) e O2 se SpO2 < 94%</label></div>' +
    '  <div class="checklist-item"><input type="checkbox" id="c2"><label for="c2">Dois acessos venosos calibrosos (preferencialmente em MSE)</label></div>' +
    '  <div class="checklist-item"><input type="checkbox" id="c3"><label for="c3">Coleta de exames (Hemograma, Coagulograma, Bioquímica)</label></div>' +
    '  <div class="checklist-item"><input type="checkbox" id="c4"><label for="c4">Encaminhar IMEDIATAMENTE para TC de Crânio (sem contraste)</label></div>' +
    '  <div class="checklist-item"><input type="checkbox" id="c5"><label for="c5">NPO e cabeceira a 30° (se estável)</label></div>' +
    '  <div class="checklist-item"><input type="checkbox" id="c6"><label for="c6">Pesar o paciente ou estimar peso para cálculo de rtPA</label></div>' +
    '</div>';

  const scriptMatch = content.match(/<script>([\s\S]*?)<\/script>/);
  if (scriptMatch) {
    let scriptContent = scriptMatch[1];
    
    if (!scriptContent.includes('checklist-porta-agulha')) {
      scriptContent = scriptContent.replace(
        'renderizarHistorico();',
        'renderizarHistorico();' +
        'const checklist = document.getElementById("checklist-porta-agulha");' +
        'if (checklist) {' +
        '  checklist.style.display = "block";' +
        '  checklist.scrollIntoView({ behavior: "smooth" });' +
        '}'
      );
      content = content.replace(scriptMatch[0], '<script>' + scriptContent + '</script>');
    }
  }

  if (!content.includes('checklist-porta-agulha')) {
    if (content.includes('<div class="stroke-history">')) {
        content = content.replace('<div class="stroke-history">', checklistHtml + '<div class="stroke-history">');
    } else {
        content += checklistHtml;
    }
  }

  const { error: updateError } = await supabaseAdmin
    .from('mini_apps')
    .update({ content_md: content })
    .eq('slug', slug);

  if (updateError) {
    console.error('Erro ao atualizar guia:', updateError);
  } else {
    console.log('Checklist porta-agulha implementado com sucesso!');
  }
}

updateAVCChecklist();
