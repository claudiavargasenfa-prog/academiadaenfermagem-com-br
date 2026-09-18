import { useEffect, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ShieldCheck, QrCode, CheckCircle2, XCircle, Search } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import logoAdec from "@/assets/logo-adec.png.asset.json";

type Resultado = {
  code: string;
  student_name: string;
  mini_app_name: string;
  app_name: string | null;
  hours: number;
  issued_at: string;
};

export const Route = createFileRoute("/validacao")({
  component: ValidacaoPage,
  validateSearch: (s: Record<string, unknown>) => ({ codigo: typeof s.codigo === "string" ? s.codigo : undefined }),
  head: () => ({
    meta: [
      { title: "Validar Certificado ADEC | Academia da Enfermagem" },
      {
        name: "description",
        content:
          "Confira a autenticidade dos certificados da Academia da Enfermagem (ADEC). Digite o código impresso no certificado ou escaneie o QR Code.",
      },
      { property: "og:title", content: "Validar Certificado ADEC" },
      {
        property: "og:description",
        content: "Consulta pública de autenticidade dos certificados emitidos pela Academia da Enfermagem.",
      },
      { property: "og:url", content: "https://academiadaenfermagem.com.br/validacao" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "https://academiadaenfermagem.com.br/validacao" }],
  }),
});

function ValidacaoPage() {
  const { codigo } = Route.useSearch();
  const navigate = useNavigate();
  const [valor, setValor] = useState(codigo ?? "");
  const [busy, setBusy] = useState(false);
  const [resultado, setResultado] = useState<Resultado | null>(null);
  const [naoEncontrado, setNaoEncontrado] = useState(false);
  const [validadoEm, setValidadoEm] = useState<Date | null>(null);

  async function consultar(code: string) {
    if (!code.trim()) return;
    setBusy(true);
    setResultado(null);
    setNaoEncontrado(false);
    const { data } = await supabase.rpc("validar_certificado", { _code: code.trim() });
    const row = (data as Resultado[] | null)?.[0] ?? null;
    setBusy(false);
    setValidadoEm(new Date());
    if (row) setResultado(row);
    else setNaoEncontrado(true);
  }

  useEffect(() => {
    if (codigo) {
      setValor(codigo);
      void consultar(codigo);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [codigo]);

  return (
    <div className="min-h-screen bg-[#f3f6f2]">
      {/* Topo */}
      <header className="relative overflow-hidden bg-gradient-to-b from-[#0d3122] to-[#124430] px-4 pb-16 pt-10 text-center text-[#f3f6f2]">
        <img src={logoAdec.url} alt="Logotipo ADEC" className="mx-auto h-20 w-20 object-contain" />
        <h1 className="mt-4 font-display text-2xl font-bold tracking-[0.16em] sm:text-3xl">VALIDAR CERTIFICADO</h1>
        <div className="mx-auto mt-4 flex w-full max-w-sm items-center gap-3">
          <span className="h-px flex-1 bg-gradient-to-r from-transparent to-[#b8912f]" />
          <span className="h-2 w-2 rotate-45 bg-[#e8c874]" />
          <span className="h-px flex-1 bg-gradient-to-l from-transparent to-[#b8912f]" />
        </div>
        <p className="mt-3 text-sm text-[#cfe0d5]">Academia da Enfermagem · Consulta pública de autenticidade</p>
      </header>

      <main className="mx-auto w-full max-w-4xl px-4 pb-16">
        {/* Instrução */}
        <div className="mt-5 flex items-start gap-3 rounded-2xl border border-[#b8912f]/30 bg-white p-4 shadow-sm">
          <ShieldCheck className="mt-0.5 h-6 w-6 shrink-0 text-[#b8912f]" />
          <p className="text-sm text-[#254434]">
            Digite o código do seu certificado no campo abaixo ou escaneie o QR Code impresso no documento para
            confirmar a autenticidade.
          </p>
        </div>

        {/* Formulário */}
        <div className="mt-5 grid gap-5 rounded-2xl border border-[#0d3122]/10 bg-white p-5 shadow-sm sm:grid-cols-[1.4fr_1fr]">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              navigate({ to: "/validacao", search: { codigo: valor.trim() } });
              void consultar(valor);
            }}
          >
            <label className="text-xs font-bold tracking-[0.14em] text-[#0d3122]" htmlFor="codigo">
              CÓDIGO DO CERTIFICADO
            </label>
            <input
              id="codigo"
              value={valor}
              onChange={(e) => setValor(e.target.value)}
              placeholder="ADEC-01-023-0099-08/2026"
              className="mt-2 w-full rounded-xl border border-[#0d3122]/20 bg-[#f8fbf8] px-4 py-3 text-sm text-[#0d3122] outline-none focus:border-[#b8912f]"
            />
            <button
              type="submit"
              disabled={busy}
              className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#0f4c35] px-5 py-3 text-sm font-bold tracking-[0.12em] text-[#f3f6f2] transition hover:bg-[#0d3122] disabled:opacity-60"
            >
              <Search className="h-4 w-4" />
              {busy ? "VALIDANDO..." : "VALIDAR"}
            </button>
          </form>

          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-[#b8912f]/50 bg-[#fbf8f1] p-4 text-center">
            <QrCode className="h-10 w-10 text-[#b8912f]" />
            <p className="mt-2 text-xs font-bold tracking-[0.14em] text-[#0d3122]">OU ESCANEIE O QR CODE</p>
            <p className="mt-1 text-xs text-[#4b6559]">
              Aponte a câmera do celular para o QR Code do certificado. A validação abre automaticamente.
            </p>
          </div>
        </div>

        {/* Resultado */}
        {resultado && (
          <div className="mt-6 overflow-hidden rounded-2xl border-2 border-[#0f4c35]/30 bg-white shadow-sm">
            <div className="flex items-center gap-3 bg-[#0f4c35] px-5 py-4 text-[#f3f6f2]">
              <CheckCircle2 className="h-6 w-6" />
              <p className="font-display text-sm font-bold tracking-[0.12em]">
                CERTIFICADO VÁLIDO — AUTENTICIDADE CONFIRMADA
              </p>
            </div>
            <div className="grid gap-5 p-5 sm:grid-cols-[1.5fr_1fr]">
              <div>
                <p className="text-xs font-bold tracking-[0.14em] text-[#b8912f]">DADOS DO CERTIFICADO</p>
                <dl className="mt-3 space-y-2 text-sm text-[#20402f]">
                  <Linha rotulo="Nome do Aluno" valor={resultado.student_name} />
                  <Linha rotulo="Academia" valor={resultado.app_name ?? "Academia da Enfermagem"} />
                  <Linha rotulo="Curso / Módulo" valor={resultado.mini_app_name} />
                  <Linha rotulo="Carga Horária" valor={`${resultado.hours} horas`} />
                  <Linha
                    rotulo="Data de Conclusão"
                    valor={new Date(resultado.issued_at).toLocaleDateString("pt-BR")}
                  />
                  <Linha rotulo="Código" valor={resultado.code} />
                </dl>
              </div>
              <div className="rounded-xl border border-[#b8912f]/30 bg-[#fbf8f1] p-4 text-center">
                <p className="text-xs font-bold tracking-[0.14em] text-[#0d3122]">DATA DA VALIDAÇÃO</p>
                <p className="mt-2 text-sm text-[#20402f]">{validadoEm?.toLocaleString("pt-BR")}</p>
                <div className="mx-auto my-3 h-px w-24 bg-[#b8912f]/60" />
                <p className="text-xs text-[#4b6559]">
                  Academia da Enfermagem — ADEC
                  <br />
                  Assinatura institucional
                </p>
              </div>
            </div>
          </div>
        )}

        {naoEncontrado && (
          <div className="mt-6 overflow-hidden rounded-2xl border-2 border-red-300 bg-white shadow-sm">
            <div className="flex items-center gap-3 bg-red-700 px-5 py-4 text-white">
              <XCircle className="h-6 w-6" />
              <p className="font-display text-sm font-bold tracking-[0.12em]">CERTIFICADO NÃO LOCALIZADO</p>
            </div>
            <p className="p-5 text-sm text-[#20402f]">
              Não encontramos nenhum certificado com esse código. Confira se digitou exatamente como está impresso,
              incluindo os traços e a barra da data.
            </p>
          </div>
        )}

        {/* Rodapé de confiança */}
        <div className="mt-8 rounded-2xl border border-[#0d3122]/10 bg-white p-5 text-center">
          <p className="text-xs font-bold tracking-[0.16em] text-[#b8912f]">SEGURANÇA E CONFIANÇA</p>
          <p className="mx-auto mt-2 max-w-2xl text-sm text-[#4b6559]">
            Todos os certificados emitidos pela Academia da Enfermagem possuem código único e QR Code de verificação.
            Esta consulta é pública e gratuita.
          </p>
        </div>
      </main>

      <footer className="bg-[#0d3122] py-4 text-center text-xs text-[#cfe0d5]">
        © {new Date().getFullYear()} Academia da Enfermagem · ADEC — Todos os direitos reservados.
      </footer>
    </div>
  );
}

function Linha({ rotulo, valor }: { rotulo: string; valor: string }) {
  return (
    <div className="flex flex-wrap gap-x-2 border-b border-dashed border-[#0d3122]/10 pb-1.5">
      <dt className="min-w-[9rem] text-[#4b6559]">{rotulo}:</dt>
      <dd className="font-semibold">{valor}</dd>
    </div>
  );
}
