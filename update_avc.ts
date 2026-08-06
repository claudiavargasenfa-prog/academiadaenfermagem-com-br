
import { supabaseAdmin } from './src/integrations/supabase/client.server';

async function updateAVC() {
  const slug = 'protocolo-avc-sala-vermelha';
  
  // Primeiro buscamos o conteúdo atual
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

  // 1. Injeta o estilo para o histórico
  const style = `
<style>
  .stroke-history { margin-top: 20px; padding: 15px; background: rgba(0,0,0,0.05); border-radius: 8px; border: 1px solid rgba(0,0,0,0.1); }
  .stroke-entry { padding: 10px; border-bottom: 1px solid rgba(0,0,0,0.1); font-size: 0.85rem; }
  .stroke-entry:last-child { border-bottom: none; }
  .stroke-entry strong { color: #d32f2f; }
  .stroke-badge { display: inline-block; padding: 2px 6px; border-radius: 4px; font-size: 0.7rem; font-weight: bold; margin-right: 5px; }
  .badge-normal { background: #e8f5e9; color: #2e7d32; }
  .badge-alert { background: #ffebee; color: #c62828; }
</style>
`;

  // 2. Modifica a função acionarCodeStroke para salvar no localStorage
  const scriptMatch = content.match(/<script>([\s\S]*?)<\/script>/);
  if (scriptMatch) {
    let scriptContent = scriptMatch[1];
    
    // Adiciona a lógica de salvamento se não existir
    if (!scriptContent.includes('localStorage.setItem')) {
      scriptContent = scriptContent.replace(
        'alert(`🚨 ALERTA CODE STROKE ACIONADO!\\n\\n',
        `
        const historico = JSON.parse(localStorage.getItem('historico_code_stroke') || '[]');
        historico.unshift({
          data: new Date().toLocaleString('pt-BR'),
          befast: befastResult,
          lastKnownWell,
          glicemia
        });
        localStorage.setItem('historico_code_stroke', JSON.stringify(historico.slice(0, 10)));
        renderizarHistorico();
        
        alert(\`🚨 ALERTA CODE STROKE ACIONADO!\\n\\n`
      );
      
      // Adiciona a função de renderização do histórico
      scriptContent += `
        function renderizarHistorico() {
          const container = document.getElementById('historico-stroke-container');
          if (!container) return;
          
          const historico = JSON.parse(localStorage.getItem('historico_code_stroke') || '[]');
          if (historico.length === 0) {
            container.innerHTML = '<p style="font-size: 0.8rem; color: #666; text-align: center;">Nenhum acionamento registrado localmente.</p>';
            return;
          }
          
          container.innerHTML = historico.map(h => \`
            <div class="stroke-entry">
              <div><strong>\${h.data}</strong></div>
              <div style="margin-top:4px;">
                <span class="stroke-badge \${h.befast.includes('NORMAL') ? 'badge-normal' : 'badge-alert'}">BEFAST: \${h.befast}</span>
                <span class="stroke-badge badge-normal">LKW: \${h.lastKnownWell}</span>
                <span class="stroke-badge \${parseInt(h.glicemia) < 60 || parseInt(h.glicemia) > 180 ? 'badge-alert' : 'badge-normal'}">HGT: \${h.glicemia} mg/dL</span>
              </div>
            </div>
          \`).join('');
        }
        
        // Inicializa o histórico após um pequeno delay para garantir o DOM
        setTimeout(renderizarHistorico, 500);
      `;
      
      content = content.replace(scriptMatch[0], `<script>${scriptContent}</script>`);
    }
  }

  // 3. Adiciona a seção de histórico no final do conteúdo
  if (!content.includes('historico-stroke-container')) {
    const historicoHtml = `
${style}
<div class="stroke-history">
  <h4 style="margin: 0 0 10px 0; font-size: 0.9rem; display: flex; align-items: center; gap: 5px;">
    🕒 Histórico Local de Acionamentos
  </h4>
  <div id="historico-stroke-container">
    <p style="font-size: 0.8rem; color: #666; text-align: center;">Carregando histórico...</p>
  </div>
  <p style="font-size: 0.7rem; color: #999; margin-top: 10px; font-style: italic;">
    * Os dados são armazenados apenas neste dispositivo.
  </p>
</div>
`;
    content += historicoHtml;
  }

  // 4. Salva de volta no banco
  const { error: updateError } = await supabaseAdmin
    .from('mini_apps')
    .update({ content_md: content })
    .eq('slug', slug);

  if (updateError) {
    console.error('Erro ao atualizar guia:', updateError);
  } else {
    console.log('Guia de AVC atualizado com sucesso com histórico local!');
  }
}

updateAVC();
