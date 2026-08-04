import { useCallback, useEffect, useRef, useState } from "react";
import { corrigirTermos, detectarComando } from "@/lib/voz/dicionario";
import { iniciarDitado, suporteVoz, type DitadoSessao } from "@/lib/voz/speech";

export type AcaoDitado = {
  /** Identificador do alvo (ex.: "sintomas", "evolucao", "obs", "anotacao") */
  id: string;
  label: string;
  className?: string;
};

type Props = {
  /** Chave de rascunho (por paciente) no localStorage */
  draftKey: string;
  /** Botões de destino do texto ditado */
  acoes?: AcaoDitado[];
  /** Envia o texto para um campo do mini app */
  onInserir: (alvo: string, texto: string) => void;
};

const ACOES_PADRAO: AcaoDitado[] = [
  { id: "sintomas", label: "➜ Enviar para Sinais e Sintomas", className: "bg-emerald-600" },
  { id: "evolucao", label: "➜ Enviar para Evolução", className: "bg-teal-600" },
];

const AVISO_KEY = "adec-ditado-aviso-lgpd";

function agora(): string {
  return new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
}

export default function BlocoDitado({ draftKey, acoes = ACOES_PADRAO, onInserir }: Props) {

  const [suportado, setSuportado] = useState<boolean | null>(null);
  const [ouvindo, setOuvindo] = useState(false);
  const [parcial, setParcial] = useState("");
  const [texto, setTexto] = useState("");
  const [erro, setErro] = useState<string | null>(null);
  const [aviso, setAviso] = useState(false);
  const [copiado, setCopiado] = useState(false);
  const sessaoRef = useRef<DitadoSessao | null>(null);
  const pausadoRef = useRef(false);

  useEffect(() => {
    setSuportado(suporteVoz());
  }, []);

  // Rascunho por paciente
  useEffect(() => {
    try {
      setTexto(window.localStorage.getItem(`ditado:${draftKey}`) ?? "");
    } catch {
      setTexto("");
    }
  }, [draftKey]);

  useEffect(() => {
    try {
      window.localStorage.setItem(`ditado:${draftKey}`, texto);
    } catch {
      /* storage cheio/indisponível */
    }
  }, [draftKey, texto]);

  const parar = useCallback(() => {
    sessaoRef.current?.parar();
    sessaoRef.current = null;
    pausadoRef.current = false;
    setOuvindo(false);
    setParcial("");
  }, []);

  useEffect(() => () => sessaoRef.current?.parar(), []);

  const aplicarFinal = useCallback((bruto: string) => {
    const cmd = detectarComando(bruto);
    if (cmd === "finalizar") {
      parar();
      return;
    }
    if (cmd === "pausar") {
      pausadoRef.current = true;
      return;
    }
    if (cmd === "continuar") {
      pausadoRef.current = false;
      return;
    }
    if (pausadoRef.current) return;
    if (cmd === "nova-linha") {
      setTexto((t) => (t ? `${t}\n` : t));
      return;
    }
    if (cmd === "apagar-ultima") {
      setTexto((t) => t.split("\n").slice(0, -1).join("\n"));
      return;
    }
    const limpo = corrigirTermos(bruto);
    if (!limpo) return;
    setTexto((t) => `${t ? `${t}\n` : ""}${agora()} — ${limpo}`);
  }, [parar]);

  const iniciar = useCallback(() => {
    setErro(null);
    try {
      if (!window.localStorage.getItem(AVISO_KEY)) {
        setAviso(true);
        window.localStorage.setItem(AVISO_KEY, "1");
      }
    } catch {
      /* ignore */
    }
    const s = iniciarDitado({
      onFinal: aplicarFinal,
      onParcial: setParcial,
      onErro: (m) => {
        setErro(m);
        parar();
      },
    });
    if (!s) {
      setErro("Não foi possível iniciar o microfone neste navegador.");
      return;
    }
    sessaoRef.current = s;
    pausadoRef.current = false;
    setOuvindo(true);
  }, [aplicarFinal, parar]);

  const copiar = async () => {
    try {
      await navigator.clipboard.writeText(texto);
      setCopiado(true);
      window.setTimeout(() => setCopiado(false), 1800);
    } catch {
      setErro("Não foi possível copiar automaticamente. Selecione o texto e copie manualmente.");
    }
  };

  if (suportado === null) return null;

  return (
    <>
    <details className="mb-3 rounded-2xl border border-emerald-200 bg-white/80 p-3 shadow-sm backdrop-blur">
      <summary className="cursor-pointer list-none text-sm font-bold text-emerald-900">
        ❓ Como utilizar o sistema de ditado
      </summary>
      <div className="mt-3 space-y-3 text-xs leading-relaxed text-slate-700">
        <p className="font-semibold text-emerald-900">
          Como usar o Ditado por Voz — passo a passo (antes de começar o seu procedimento)
        </p>

        <div>
          <p className="font-semibold text-emerald-800">1. Navegadores</p>
          <ul className="ml-4 list-disc space-y-1">
            <li>1.1 Chrome (Android/PC).</li>
            <li>1.2 Safari (iPhone/iPad).</li>
            <li>
              1.3 Na primeira vez, o celular vai pedir permissão do microfone: toque em{" "}
              <b>Permitir</b>. Se negar sem querer, vá em Configurações do navegador → Site →
              Microfone → Permitir.
            </li>
            <li>
              1.4 Deixe o celular em um local próximo (bolso do jaleco, suporte na maca). Não
              precisa segurar.
            </li>
          </ul>
        </div>

        <div>
          <p className="font-semibold text-emerald-800">2. Onde encontrar o bloco de ditado</p>
          <ul className="ml-4 list-disc space-y-1">
            <li>
              Academia do Enfermeiro → SAE Descomplicada e Automatizada → o card “Bloco de Ditado
              por Voz”.
            </li>
            <li>
              Academia do Técnico → Coleta de Dados + Admissão de Turno → o bloco está antes do
              botão <b>Gerar Anotação</b>.
            </li>
          </ul>
        </div>

        <div>
          <p className="font-semibold text-emerald-800">3. Passo a passo do uso</p>
          <ul className="ml-4 list-disc space-y-1">
            <li>
              3.1 Antes de se paramentar, abra a sua plataforma e toque em{" "}
              <b>🎙️ Iniciar ditado</b>. O botão fica vermelho piscando = está ouvindo.
            </li>
            <li>3.2 Faça o procedimento normalmente. Fale em voz clara e pausada o que observar:</li>
            <li>3.3 “Paciente refere dor abdominal em cólica, intensidade 7.”</li>
            <li>3.4 “Ferida operatória com secreção serosa, sem sinais flogísticos.”</li>
            <li>3.5 “Saturação 92 por cento em ar ambiente.”</li>
          </ul>
        </div>

        <div>
          <p className="font-semibold text-emerald-800">4. Comandos de voz úteis</p>
          <ul className="ml-4 list-disc space-y-1">
            <li>4.2 “nova linha” → quebra a linha e começa outro registro;</li>
            <li>4.3 “vírgula”, “ponto”, “dois pontos” → pontuação;</li>
            <li>4.4 “finalizar ditado” → encerra a gravação sem tocar na tela.</li>
          </ul>
        </div>

        <ul className="ml-4 list-disc space-y-1">
          <li>
            5. O texto vai aparecendo sozinho dentro da caixa do bloco, já com correção automática
            de termos de enfermagem (dispneia, SatO₂, PA, FC, hipocorado, etc.).
          </li>
          <li>6. Ao terminar, toque em ⏹️ Parar (ou diga “finalizar ditado”).</li>
          <li>
            7. Revise o texto. Você pode editar direto na caixa, corrigir palavras, apagar trechos.
          </li>
          <li>
            8. Envie para o lugar certo usando os botões abaixo da caixa:
            <ul className="ml-4 list-[circle] space-y-1">
              <li>8.2 Na SAE: Enviar para Sinais e Sintomas ou Enviar para Evolução;</li>
              <li>
                8.3 No app do Técnico: Enviar para Observações do turno ou Enviar para a Anotação
                Final;
              </li>
              <li>8.4 Ou toque em Copiar e cole manualmente onde quiser.</li>
            </ul>
          </li>
          <li>
            9. Gere o documento normalmente (Gerar Anotação / Gerar Prescrição / PDF). O que foi
            ditado já entra no texto final.
          </li>
        </ul>

        <div>
          <p className="font-semibold text-emerald-800">10. Boas práticas</p>
          <ul className="ml-4 list-disc space-y-1">
            <li>
              O rascunho é salvo automaticamente por paciente: se a tela apagar ou o app fechar, o
              texto continua lá quando voltar.
            </li>
            <li>
              Fale nomes de medicamentos devagar e confira depois — nome comercial pode sair grafado
              errado.
            </li>
            <li>
              Nunca dite dados que identifiquem o paciente (nome completo, CPF, prontuário) em
              ambiente com terceiros — LGPD. Respeite a proteção de dados e não se comprometa.
            </li>
            <li>
              Se o ambiente estiver muito barulhento, aproxime o celular ou dite frases curtas com
              pausas.
            </li>
            <li>
              Se o navegador não suportar, o bloco avisa e você pode digitar normalmente — nada
              trava.
            </li>
          </ul>
        </div>

        <div className="rounded-lg border border-amber-200 bg-amber-50 p-2 text-amber-900">
          <p className="font-semibold">Atenção — Se não funcionar</p>
          <ul className="ml-4 list-disc space-y-1">
            <li>Botão não inicia → permissão de microfone bloqueada.</li>
            <li>
              Nada é transcrito → verifique se o idioma do navegador está em Português (Brasil).
            </li>
            <li>
              Parou sozinho após alguns segundos → é comportamento do celular ao bloquear a tela;
              toque em Iniciar de novo (o texto anterior é mantido).
            </li>
          </ul>
        </div>
      </div>
    </details>

    <div className="mb-4 rounded-2xl border border-emerald-200 bg-gradient-to-br from-emerald-50/90 to-teal-50/70 p-4 shadow-sm backdrop-blur">
      <div className="mb-2 flex flex-wrap items-center gap-2">
        <h4 className="text-sm font-bold text-emerald-900">🎙️ Ditado de Plantão (voz)</h4>
        <span className="rounded-full bg-emerald-600/10 px-2 py-0.5 text-[11px] font-semibold text-emerald-800">
          Gratuito · sem consumo de créditos
        </span>
        {ouvindo && (
          <span className="flex items-center gap-1.5 rounded-full bg-red-100 px-2 py-0.5 text-[11px] font-semibold text-red-700">
            <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-red-600" />
            Ouvindo…
          </span>
        )}
      </div>

      {!suportado ? (
        <p className="rounded-lg border border-amber-200 bg-amber-50 p-2 text-xs text-amber-900">
          Este navegador não tem reconhecimento de voz nativo. Use o <b>Chrome no Android</b> ou o{" "}
          <b>Safari no iPhone</b> — ou toque no microfone do próprio teclado e dite direto na caixa
          abaixo.
        </p>
      ) : (
        <p className="mb-2 text-xs text-emerald-900/80">
          Fale enquanto estiver paramentado. Comandos por voz: <b>“nova linha”</b>,{" "}
          <b>“apagar última”</b>, <b>“pausar ditado”</b>, <b>“continuar ditado”</b>,{" "}
          <b>“finalizar ditado”</b>. Depois revise e envie para o campo desejado.
        </p>
      )}

      <div className="mb-2 flex flex-wrap gap-2">
        {suportado && (
          <button
            type="button"
            onClick={ouvindo ? parar : iniciar}
            className={`rounded-xl px-5 py-3 text-base font-bold text-white shadow transition ${
              ouvindo ? "bg-red-600 hover:bg-red-700" : "bg-emerald-600 hover:bg-emerald-700"
            }`}
          >
            {ouvindo ? "⏹ Parar ditado" : "🎤 Iniciar ditado"}
          </button>
        )}
      </div>

      {aviso && (
        <div className="mb-2 flex items-start gap-2 rounded-lg border border-sky-200 bg-sky-50 p-2 text-xs text-sky-900">
          <span>
            <b>LGPD:</b> não fale nome completo, CPF ou dados identificáveis do paciente. O áudio não
            é gravado nem armazenado — apenas o texto abaixo, neste aparelho. Revise antes de levar
            ao prontuário.
          </span>
          <button
            type="button"
            onClick={() => setAviso(false)}
            className="ml-auto shrink-0 font-bold text-sky-700"
          >
            ✕
          </button>
        </div>
      )}

      {erro && (
        <div className="mb-2 rounded-lg border border-red-200 bg-red-50 p-2 text-xs text-red-800">
          {erro}
        </div>
      )}

      <textarea
        value={texto}
        onChange={(e) => setTexto(e.target.value)}
        rows={7}
        placeholder="O texto ditado aparece aqui, linha a linha, com horário. Você pode editar livremente antes de enviar."
        className="w-full rounded-xl border border-emerald-200 bg-white/90 p-3 text-sm text-slate-800 outline-none focus:border-emerald-400"
      />
      {ouvindo && parcial && (
        <p className="mt-1 text-xs italic text-emerald-700/70">… {parcial}</p>
      )}

      <div className="mt-2 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={copiar}
          disabled={!texto.trim()}
          className="rounded-lg bg-slate-800 px-3 py-2 text-sm font-semibold text-white disabled:opacity-40"
        >
          {copiado ? "✓ Copiado" : "📋 Copiar tudo"}
        </button>
        {acoes.map((a) => (
          <button
            key={a.id}
            type="button"
            onClick={() => onInserir(a.id, texto)}
            disabled={!texto.trim()}
            className={`rounded-lg px-3 py-2 text-sm font-semibold text-white disabled:opacity-40 ${
              a.className ?? "bg-emerald-600"
            }`}
          >
            {a.label}
          </button>
        ))}

        <button
          type="button"
          onClick={() => {
            if (window.confirm("Apagar todo o texto ditado deste paciente?")) setTexto("");
          }}
          disabled={!texto.trim()}
          className="ml-auto rounded-lg bg-red-100 px-3 py-2 text-sm font-semibold text-red-700 disabled:opacity-40"
        >
          Limpar
        </button>
      </div>
    </div>
    </>
  );
}
