export default function GuiaColetaTurno() {
  return (
    <details className="mb-3 rounded-2xl border border-sky-200 bg-white/80 p-3 shadow-sm backdrop-blur">
      <summary className="cursor-pointer list-none text-sm font-bold text-sky-900">
        ⚙️ Como utilizar esse sistema automático
      </summary>

      <div className="mt-3 space-y-3 text-xs leading-relaxed text-slate-700">
        <p className="font-semibold text-sky-900">
          Coleta de Dados + Ditado + Admissão de Turno + Anotações Automáticas — passo a passo
        </p>
        <p>
          Este módulo funciona como um bloco de plantão digital: você marca o que observou, dita o
          que for texto livre e o sistema escreve a anotação de enfermagem pronta para o prontuário.
          Tudo é salvo automaticamente no próprio aparelho, por paciente.
        </p>

        <div>
          <p className="font-semibold text-sky-800">1. Adicionar o paciente</p>
          <ul className="ml-4 list-disc space-y-1">
            <li>
              1.1 Toque em <b>+ Adicionar paciente</b>. Cada paciente vira uma aba no topo do mini
              app.
            </li>
            <li>
              1.2 Identifique com <b>somente o 1º nome</b> + enfermaria/quarto/leito — por exemplo:{" "}
              <b>Maria — Enf. B / Qto 204 / Leito 2</b>. Nunca digite nome completo, CPF ou número
              de prontuário (LGPD).
            </li>
            <li>
              1.3 Para trocar de paciente, basta tocar na aba dele: o formulário inteiro muda junto,
              sem perder o que já foi preenchido do outro.
            </li>
            <li>1.4 Pode manter vários pacientes abertos ao mesmo tempo durante todo o plantão.</li>
          </ul>
        </div>

        <div>
          <p className="font-semibold text-sky-800">2. Admissão de turno (sanfonas 1 a 6)</p>
          <ul className="ml-4 list-disc space-y-1">
            <li>2.1 Abra cada sanfona na ordem e vá marcando o que se aplica ao paciente.</li>
            <li>
              2.2 <b>Identificação e procedência</b>: origem (PS, centro cirúrgico, transferência),
              acompanhante, alergias e restrições.
            </li>
            <li>
              2.3 <b>Sinais vitais</b>: PA, FC, FR, Tax, SatO₂, dor e HGT. Valores fora da
              normalidade já são destacados na anotação final.
            </li>
            <li>
              2.4 <b>Nível de consciência, mobilidade e riscos</b>: risco de queda, lesão por
              pressão, contenções, grades elevadas.
            </li>
            <li>
              2.5 <b>Dispositivos</b>: AVP, SVD, SNE/SNG, TQT, drenos, O₂ — com data de instalação e
              aspecto do sítio.
            </li>
            <li>
              2.6 <b>Eliminações, dieta e higiene</b>: diurese, evacuação, aceitação da dieta, banho
              e mudança de decúbito.
            </li>
            <li>
              2.7 <b>Observações do turno</b>: campo livre para queixas, intercorrências e condutas.
              É aqui que o ditado por voz é despejado.
            </li>
            <li>
              2.8 Tudo o que você marca é gravado na hora (autosave). Se a tela apagar ou o app
              fechar, ao voltar está tudo lá.
            </li>
          </ul>
        </div>

        <div>
          <p className="font-semibold text-sky-800">3. Ditado por voz (opcional e gratuito)</p>
          <ul className="ml-4 list-disc space-y-1">
            <li>
              3.1 O bloco <b>🎙️ Ditado de Plantão (voz)</b> fica logo acima do botão{" "}
              <b>Gerar Anotação</b>.
            </li>
            <li>
              3.2 Toque em <b>Iniciar ditado</b> antes de se paramentar e fale o que observar
              durante o cuidado — o texto entra linha a linha, com horário.
            </li>
            <li>
              3.3 Ao terminar, revise e toque em <b>Enviar para Observações do turno</b>: o texto
              ditado passa a fazer parte da anotação que será gerada.
            </li>
            <li>
              3.4 O rascunho do ditado também é salvo por paciente. Detalhes completos na sanfona{" "}
              <b>“Como utilizar o sistema de ditado”</b>.
            </li>
          </ul>
        </div>

        <div>
          <p className="font-semibold text-sky-800">4. Gerar a Anotação</p>
          <ul className="ml-4 list-disc space-y-1">
            <li>
              4.1 Com as sanfonas preenchidas, toque em <b>Gerar Anotação</b>.
            </li>
            <li>
              4.2 O sistema converte automaticamente as marcações em texto técnico corrido, na
              sequência lógica da anotação de enfermagem: identificação → estado geral e consciência
              → sinais vitais → dispositivos → eliminações e dieta → intercorrências e condutas →
              observações/ditado.
            </li>
            <li>
              4.3 O resultado aparece no painel <b>Anotação Final</b>, já com data e horário. Você
              pode editar livremente antes de usar.
            </li>
            <li>
              4.4 Pode gerar quantas anotações quiser no mesmo plantão: cada uma é guardada no{" "}
              <b>Histórico do plantão</b> daquele paciente, com carimbo de horário.
            </li>
          </ul>
        </div>

        <div>
          <p className="font-semibold text-sky-800">5. Usar e arquivar</p>
          <ul className="ml-4 list-disc space-y-1">
            <li>5.1 Use os botões de copiar/baixar para levar o texto ao prontuário da instituição.</li>
            <li>
              5.2 Assine sempre com <b>nome, categoria e número do COREN</b> no prontuário — o app
              gera o texto, a responsabilidade do registro é do profissional.
            </li>
            <li>
              5.3 Ao final do plantão, apague os pacientes: os dados ficam apenas no seu aparelho e
              não devem permanecer após a passagem de plantão.
            </li>
          </ul>
        </div>

        <div className="rounded-lg border border-amber-200 bg-amber-50 p-2 text-amber-900">
          <p className="font-semibold">Atenção</p>
          <ul className="ml-4 list-disc space-y-1">
            <li>
              Este módulo é apoio à documentação: revise sempre o texto gerado antes de transcrever.
            </li>
            <li>
              Não registre dados identificáveis do paciente (nome completo, CPF, prontuário) — use
              só o 1º nome e o leito.
            </li>
            <li>
              Nada é enviado para servidor: as informações ficam salvas localmente no navegador do
              seu aparelho.
            </li>
          </ul>
        </div>
      </div>
    </details>
  );
}
