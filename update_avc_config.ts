import { supabaseAdmin } from './src/integrations/supabase/client.server';

async function updateAVCConfig() {
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

  // Adiciona o painel de configuração (inicialmente oculto)
  const configPanelHtml = `
<div id="config-urgencia-avc" class="p-4 border rounded-lg bg-gray-50 my-4 hidden">
  <h4 class="font-bold mb-2">⚙️ Configurações de Urgência</h4>
  <div class="space-y-3 text-sm">
    <div>
      <label class="block font-medium">Janela de Trombólise (minutos):</label>
      <input type="number" id="cfg-janela" value="270" class="w-full p-1 border rounded" />
    </div>
    <div>
      <label class="block font-medium">Glicemia Mínima (mg/dL):</label>
      <input type="number" id="cfg-hgt-min" value="60" class="w-full p-1 border rounded" />
    </div>
    <div>
      <label class="block font-medium">Glicemia Máxima (mg/dL):</label>
      <input type="number" id="cfg-hgt-max" value="180" class="w-full p-1 border rounded" />
    </div>
    <button onclick="salvarConfigUrgencia()" class="w-full bg-blue-600 text-white p-2 rounded font-bold">Salvar Configurações</button>
  </div>
</div>
<button id="btn-toggle-config" onclick="document.getElementById('config-urgencia-avc').classList.toggle('hidden')" class="text-xs text-blue-500 underline mt-2">Ajustar critérios de urgência</button>
`;

  // Atualiza o script para suportar configurações
  const scriptMatch = content.match(/<script>([\s\S]*?)<\/script>/);
  if (scriptMatch) {
    let scriptContent = scriptMatch[1];
    
    // Injeta a lógica de carregamento/salvamento de configurações
    if (!scriptContent.includes('salvarConfigUrgencia')) {
        scriptContent += `
        function carregarConfigUrgencia() {
          const saved = localStorage.getItem('avc_urgencia_config');
          if (saved) return JSON.parse(saved);
          return { janela: 270, hgtMin: 60, hgtMax: 180 };
        }

        function salvarConfigUrgencia() {
          const config = {
            janela: parseInt(document.getElementById('cfg-janela').value),
            hgtMin: parseInt(document.getElementById('cfg-hgt-min').value),
            hgtMax: parseInt(document.getElementById('cfg-hgt-max').value)
          };
          localStorage.setItem('avc_urgencia_config', JSON.stringify(config));
          alert('Configurações salvas!');
          location.reload();
        }

        // Sobrescreve a função calcularUrgencia para usar as configurações
        const originalCalcularUrgencia = calcularUrgencia;
        calcularUrgencia = function(befast, lkw, hgt) {
          const cfg = carregarConfigUrgencia();
          const container = document.getElementById('status-urgencia-stroke');
          if (!container) return;
          
          let nivel = "";
          let classe = "";
          let orientacao = "";
          
          const tempoMinutos = (new Date() - new Date(lkw)) / 60000;
          const befastPositivo = befast !== "NORMAL";
          const hgtVal = parseInt(hgt);
          const hgtAlvo = hgtVal >= cfg.hgtMin && hgtVal <= cfg.hgtMax;

          if (befastPositivo && tempoMinutos <= cfg.janela) {
            nivel = "🚨 PRIORIDADE ABSOLUTA: CRÍTICA";
            classe = "urgencia-critica";
            orientacao = "Janela de Trombólise (" + cfg.janela + "min) aberta. TC IMEDIATO.";
          } else if (befastPositivo) {
            nivel = "⚠️ URGÊNCIA: ALERTA";
            classe = "urgencia-moderada";
            orientacao = "Fora da janela de " + cfg.janela + "min. Avaliar Trombectomia.";
          } else if (!hgtAlvo) {
            nivel = "🟡 ATENÇÃO: METABÓLICO";
            classe = "urgencia-moderada";
            orientacao = "Glicemia (" + hgtVal + ") fora da faixa (" + cfg.hgtMin + "-" + cfg.hgtMax + ").";
          } else {
            nivel = "✅ ESTÁVEL / OBSERVAÇÃO";
            classe = "urgencia-estavel";
            orientacao = "Sinais vitais e HGT normais. Manter vigilância.";
          }

          container.className = "stroke-urgencia " + classe;
          container.innerHTML = '<div>' + nivel + '</div><div class="urgencia-msg">' + orientacao + '</div>';
          container.style.display = 'block';
        }
        
        // Inicializa os campos com os valores salvos
        setTimeout(() => {
          const cfg = carregarConfigUrgencia();
          if (document.getElementById('cfg-janela')) {
            document.getElementById('cfg-janela').value = cfg.janela;
            document.getElementById('cfg-hgt-min').value = cfg.hgtMin;
            document.getElementById('cfg-hgt-max').value = cfg.hgtMax;
          }
        }, 500);
      `;
      content = content.replace(scriptMatch[0], '<script>' + scriptContent + '</script>');
    }
  }

  // Insere o painel de configuração no HTML se ainda não existir
  if (!content.includes('config-urgencia-avc')) {
    content = content.replace('<div id="status-urgencia-stroke"></div>', '<div id="status-urgencia-stroke"></div>' + configPanelHtml);
  }

  const { error: updateError } = await supabaseAdmin
    .from('mini_apps')
    .update({ content_md: content })
    .eq('slug', slug);

  if (updateError) {
    console.error('Erro ao atualizar guia:', updateError);
  } else {
    console.log('Painel de configuração de urgência implementado!');
  }
}

updateAVCConfig();
