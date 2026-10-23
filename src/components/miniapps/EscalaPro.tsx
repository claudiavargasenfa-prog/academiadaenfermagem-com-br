import { useMemo, useState } from "react";
import { useLocal } from "@/lib/storage";
import { PADROES, conflitos, gerarDatas, iso, media, type Padrao } from "@/lib/escala";

type Vinculo = { id: string; nome: string; padrao: Padrao; inicio: string; hIni: string; hFim: string; cor: string; datas: string[] };
type Extra = { id: string; data: string; vinculo: string; horas: number };
type Troca = { id: string; tipo: "passei" | "cobri"; colega: string; data: string; obs: string; status: "Pendente" | "Devolvido" };
type Aula = { id: string; dia: number; materia: string; inicio: string; fim: string; sala: string; prof: string };
type Estagio = { id: string; local: string; dias: string; preceptor: string; orient: string };
type Prova = { id: string; titulo: string; data: string };
type Comp = { id: string; nome: string; horas: number };

const CORES = ["#10B981", "#3B82F6", "#F59E0B", "#EC4899", "#14B8A6", "#EF4444"];
const DIAS = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
const MESES = ["Janeiro","Fevereiro","Março","Abril","Maio","Junho","Julho","Agosto","Setembro","Outubro","Novembro","Dezembro"];
const uid = () => Math.random().toString(36).slice(2, 10);
const inp = "w-full rounded-lg border border-input bg-background px-3 py-2 text-sm";
const btn = "rounded-lg bg-primary px-4 py-2 text-sm font-bold text-primary-foreground hover:opacity-90 disabled:opacity-50";
const box = "rounded-2xl border border-border bg-card p-4 text-card-foreground";

export function EscalaPro() {
  const [modo, setModo] = useLocal<"pro" | "aca">("escala.modo", "pro");
  const [vinculos, setVinculos] = useLocal<Vinculo[]>("escala.vinculos", []);
  const [extras, setExtras] = useLocal<Extra[]>("escala.extras", []);
  const [trocas, setTrocas] = useLocal<Troca[]>("escala.trocas", []);
  const [aulas, setAulas] = useLocal<Aula[]>("escala.aulas", []);
  const [estagios, setEstagios] = useLocal<Estagio[]>("escala.estagios", []);
  const [provas, setProvas] = useLocal<Prova[]>("escala.provas", []);
  const [comp, setComp] = useLocal<Comp[]>("escala.comp", []);
  const [meta, setMeta] = useLocal("escala.meta", 100);
  const hoje = new Date();
  const [mes, setMes] = useState({ y: hoje.getFullYear(), m: hoje.getMonth() });
  const [sel, setSel] = useState<string>(iso(hoje));

  const turnos = useMemo(() => vinculos.flatMap((v) => v.datas.map((data) => ({ data, vinculo: v.nome, cor: v.cor, horas: PADROES[v.padrao].horas }))), [vinculos]);
  const conf = useMemo(() => new Set(conflitos(turnos)), [turnos]);
  const prefixo = `${mes.y}-${String(mes.m + 1).padStart(2, "0")}`;
  const doMes = turnos.filter((t) => t.data.startsWith(prefixo));
  const extrasMes = extras.filter((e) => e.data.startsWith(prefixo));
  const horasMes = doMes.reduce((a, t) => a + t.horas, 0) + extrasMes.reduce((a, e) => a + e.horas, 0);

  const primeiro = new Date(mes.y, mes.m, 1).getDay();
  const nDias = new Date(mes.y, mes.m + 1, 0).getDate();
  const mudarMes = (d: number) => setMes(({ y, m }) => { const n = new Date(y, m + d, 1); return { y: n.getFullYear(), m: n.getMonth() }; });

  // formulário vínculo
  const [fv, setFv] = useState({ nome: "", inicio: iso(hoje), padrao: "12x36-d" as Padrao, hIni: "07:00", hFim: "19:00" });
  const addVinculo = () => {
    if (!fv.nome.trim()) return alert("Informe o hospital ou instituição.");
    const v: Vinculo = { id: uid(), ...fv, nome: fv.nome.trim(), cor: CORES[vinculos.length % CORES.length], datas: gerarDatas(fv.inicio, fv.padrao) };
    setVinculos([...vinculos, v]);
    setFv({ ...fv, nome: "" });
  };

  const [fx, setFx] = useState({ vinculo: "", horas: 12 });
  const [ft, setFt] = useState({ tipo: "passei" as Troca["tipo"], colega: "", data: iso(hoje), obs: "" });

  const turnosDia = turnos.filter((t) => t.data === sel);
  const extrasDia = extras.filter((e) => e.data === sel);

  return (
    <div className="space-y-5">
      <div className="flex gap-2">
        {(["pro", "aca"] as const).map((m) => (
          <button key={m} type="button" onClick={() => setModo(m)} className={`flex-1 rounded-xl border px-4 py-3 text-sm font-bold ${modo === m ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card"}`}>
            {m === "pro" ? "Modo Profissional" : "Modo Acadêmico"}
          </button>
        ))}
      </div>

      {/* Calendário */}
      <section className={box}>
        <div className="flex items-center justify-between gap-2">
          <button type="button" className="rounded-lg border border-border px-3 py-2 text-sm font-bold" onClick={() => mudarMes(-1)}>‹ Anterior</button>
          <h3 className="font-display text-lg font-bold">{MESES[mes.m]} {mes.y}</h3>
          <button type="button" className="rounded-lg border border-border px-3 py-2 text-sm font-bold" onClick={() => mudarMes(1)}>Próximo ›</button>
        </div>
        <div className="mt-3 grid grid-cols-7 gap-1 text-center text-xs">
          {DIAS.map((d) => <div key={d} className="py-1 font-bold">{d}</div>)}
          {Array.from({ length: primeiro }).map((_, i) => <div key={"v" + i} />)}
          {Array.from({ length: nDias }).map((_, i) => {
            const d = `${prefixo}-${String(i + 1).padStart(2, "0")}`;
            const ts = turnos.filter((t) => t.data === d);
            const temExtra = extras.some((e) => e.data === d);
            const temProva = provas.some((p) => p.data === d);
            return (
              <button type="button" key={d} onClick={() => setSel(d)} className={`relative min-h-[46px] rounded-lg border p-1 ${sel === d ? "border-primary ring-2 ring-primary" : "border-border"} ${conf.has(d) ? "bg-destructive/15" : ""}`}>
                <span className="font-semibold">{i + 1}</span>
                <div className="mt-1 flex flex-wrap justify-center gap-0.5">
                  {ts.map((t, k) => <span key={k} className="h-2 w-2 rounded-full" style={{ background: t.cor }} />)}
                  {temExtra && <span className="h-2 w-2 rounded-full bg-accent-foreground" />}
                  {temProva && <span className="text-[9px]">📝</span>}
                </div>
              </button>
            );
          })}
        </div>
        <div className="mt-3 flex flex-wrap gap-3 text-xs">
          {vinculos.map((v) => <span key={v.id}><span style={{ color: v.cor }}>●</span> {v.nome}</span>)}
          <span>● Dobra</span><span>📝 Prova</span><span className="text-destructive">■ Conflito</span>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
          <Stat l="Total de horas" v={`${horasMes}h`} /><Stat l="Plantões" v={doMes.length} />
          <Stat l="Dobras" v={extrasMes.length} /><Stat l="Conflitos" v={[...conf].filter((c) => c.startsWith(prefixo)).length} />
        </div>
        <div className="mt-4 rounded-xl bg-muted p-3 text-sm">
          <p className="font-bold">Dia {sel.split("-").reverse().join("/")}</p>
          {turnosDia.length === 0 && extrasDia.length === 0 ? <p className="text-muted-foreground">Folga.</p> : null}
          {turnosDia.map((t, k) => <p key={k}>🏥 {t.vinculo} — {t.horas}h</p>)}
          {extrasDia.map((e) => <p key={e.id}>➕ Dobra {e.vinculo} — {e.horas}h <button type="button" className="ml-2 text-destructive underline" onClick={() => setExtras(extras.filter((x) => x.id !== e.id))}>remover</button></p>)}
          {conf.has(sel) && <p className="mt-1 font-bold text-destructive">⚠ Conflito de horário neste dia.</p>}
        </div>
      </section>

      {modo === "pro" ? (
        <>
          <section className={box}>
            <h3 className="font-display text-lg font-bold">Gerador de escalas</h3>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <L t="Hospital ou instituição"><input className={inp} value={fv.nome} onChange={(e) => setFv({ ...fv, nome: e.target.value })} placeholder="Nome do hospital" /></L>
              <L t="Data do primeiro plantão"><input type="date" className={inp} value={fv.inicio} onChange={(e) => setFv({ ...fv, inicio: e.target.value })} /></L>
              <L t="Padrão de escala"><select className={inp} value={fv.padrao} onChange={(e) => setFv({ ...fv, padrao: e.target.value as Padrao })}>{Object.entries(PADROES).map(([k, p]) => <option key={k} value={k}>{p.label}</option>)}</select></L>
              <div className="grid grid-cols-2 gap-2">
                <L t="Início"><input type="time" className={inp} value={fv.hIni} onChange={(e) => setFv({ ...fv, hIni: e.target.value })} /></L>
                <L t="Término"><input type="time" className={inp} value={fv.hFim} onChange={(e) => setFv({ ...fv, hFim: e.target.value })} /></L>
              </div>
            </div>
            <button type="button" className={`${btn} mt-4 w-full`} onClick={addVinculo}>Gerar escala anual</button>
          </section>

          <section className={box}>
            <h3 className="font-display text-lg font-bold">Meus vínculos profissionais</h3>
            {vinculos.length === 0 && <p className="mt-2 text-sm text-muted-foreground">Nenhum vínculo ainda. Gere sua primeira escala acima.</p>}
            {vinculos.map((v) => (
              <div key={v.id} className="mt-3 flex items-center justify-between gap-2 rounded-xl border border-border p-3 text-sm">
                <div><p className="font-bold"><span style={{ color: v.cor }}>●</span> {v.nome}</p><p className="text-muted-foreground">{PADROES[v.padrao].label} · {v.hIni}–{v.hFim} · {v.datas.length} plantões no ano</p></div>
                <button type="button" className="text-destructive underline" onClick={() => confirm(`Excluir ${v.nome}?`) && setVinculos(vinculos.filter((x) => x.id !== v.id))}>Excluir</button>
              </div>
            ))}
            {conf.size > 0 && <p className="mt-3 rounded-xl border border-destructive bg-destructive/10 p-3 text-sm font-bold text-destructive">⚠ ALERTA DE CONFLITO: {conf.size} dia(s) com dois vínculos ao mesmo tempo.</p>}
          </section>

          <section className={box}>
            <h3 className="font-display text-lg font-bold">Dobras e horas extras</h3>
            <p className="text-sm text-muted-foreground">Dia selecionado no calendário: {sel.split("-").reverse().join("/")}</p>
            <div className="mt-3 grid grid-cols-2 gap-2">
              <input className={inp} placeholder="Hospital" value={fx.vinculo} onChange={(e) => setFx({ ...fx, vinculo: e.target.value })} />
              <input type="number" className={inp} min={1} max={24} value={fx.horas} onChange={(e) => setFx({ ...fx, horas: Number(e.target.value) })} />
            </div>
            <button type="button" className={`${btn} mt-3 w-full`} onClick={() => { if (!fx.vinculo.trim()) return alert("Informe o hospital."); setExtras([...extras, { id: uid(), data: sel, vinculo: fx.vinculo.trim(), horas: fx.horas || 0 }]); }}>+ Marcar dobra</button>
            <p className="mt-2 text-sm">Horas adicionais no mês: <b>{extrasMes.reduce((a, e) => a + e.horas, 0)}h</b></p>
          </section>

          <section className={box}>
            <h3 className="font-display text-lg font-bold">Trocas de plantão</h3>
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              <select className={inp} value={ft.tipo} onChange={(e) => setFt({ ...ft, tipo: e.target.value as Troca["tipo"] })}><option value="passei">Passei o plantão para um colega</option><option value="cobri">Cobri o plantão de um colega</option></select>
              <input className={inp} placeholder="Nome do colega" value={ft.colega} onChange={(e) => setFt({ ...ft, colega: e.target.value })} />
              <input type="date" className={inp} value={ft.data} onChange={(e) => setFt({ ...ft, data: e.target.value })} />
              <input className={inp} placeholder="Observações" value={ft.obs} onChange={(e) => setFt({ ...ft, obs: e.target.value })} />
            </div>
            <button type="button" className={`${btn} mt-3 w-full`} onClick={() => { if (!ft.colega.trim()) return alert("Informe o colega."); setTrocas([{ id: uid(), ...ft, status: "Pendente" }, ...trocas]); setFt({ ...ft, colega: "", obs: "" }); }}>Registrar movimentação</button>
            {trocas.map((t) => (
              <div key={t.id} className="mt-2 flex items-center justify-between gap-2 rounded-xl border border-border p-3 text-sm">
                <div><b>{t.tipo === "passei" ? "Passei o plantão" : "Cobri o plantão"}</b> · {t.colega} · {t.data.split("-").reverse().join("/")}{t.obs && <p className="text-muted-foreground">{t.obs}</p>}</div>
                <div className="flex gap-2">
                  <button type="button" className="rounded-full bg-muted px-3 py-1 text-xs font-bold" onClick={() => setTrocas(trocas.map((x) => x.id === t.id ? { ...x, status: x.status === "Pendente" ? "Devolvido" : "Pendente" } : x))}>{t.status}</button>
                  <button type="button" className="text-xs text-destructive underline" onClick={() => setTrocas(trocas.filter((x) => x.id !== t.id))}>Excluir</button>
                </div>
              </div>
            ))}
          </section>
        </>
      ) : (
        <Academico {...{ aulas, setAulas, estagios, setEstagios, provas, setProvas, comp, setComp, meta, setMeta, sel }} />
      )}
      <p className="text-center text-xs text-muted-foreground">Seus dados ficam salvos neste aparelho e funcionam mesmo sem internet.</p>
    </div>
  );
}

function Academico(p: {
  aulas: Aula[]; setAulas: (a: Aula[]) => void; estagios: Estagio[]; setEstagios: (a: Estagio[]) => void;
  provas: Prova[]; setProvas: (a: Prova[]) => void; comp: Comp[]; setComp: (a: Comp[]) => void; meta: number; setMeta: (n: number) => void; sel: string;
}) {
  const [dia, setDia] = useState(1);
  const [fa, setFa] = useState({ materia: "", inicio: "08:00", fim: "09:40", sala: "", prof: "" });
  const [fe, setFe] = useState({ local: "", dias: "", preceptor: "", orient: "" });
  const [fp, setFp] = useState({ titulo: "" });
  const [notas, setNotas] = useState("7, 8");
  const [mediaMin, setMediaMin] = useState(7);
  const [fc, setFc] = useState({ nome: "", horas: 4 });
  const doDia = p.aulas.filter((a) => a.dia === dia).sort((a, b) => a.inicio.localeCompare(b.inicio));
  const totalComp = p.comp.reduce((a, c) => a + c.horas, 0);
  const pct = Math.min(100, Math.round((totalComp / (p.meta || 1)) * 100));
  const m = media(notas.split(/[;,\s]+/).filter(Boolean).map((n) => Number(n.replace(",", "."))));
  const hojeIso = iso(new Date());
  const proximas = [...p.provas].filter((x) => x.data >= hojeIso).sort((a, b) => a.data.localeCompare(b.data));

  return (
    <>
      <section className={box}>
        <h3 className="font-display text-lg font-bold">Minha grade de aulas</h3>
        <div className="mt-2 flex flex-wrap gap-1">{DIAS.slice(1).map((d, i) => <button type="button" key={d} onClick={() => setDia(i + 1)} className={`rounded-lg px-3 py-1.5 text-xs font-bold ${dia === i + 1 ? "bg-primary text-primary-foreground" : "bg-muted"}`}>{d}</button>)}</div>
        {doDia.map((a) => <div key={a.id} className="mt-2 flex justify-between rounded-xl border-l-4 border-primary bg-muted p-3 text-sm"><div><b>{a.inicio}–{a.fim} · {a.materia}</b><p className="text-muted-foreground">{a.sala} {a.prof && `· ${a.prof}`}</p></div><button type="button" className="text-xs text-destructive underline" onClick={() => p.setAulas(p.aulas.filter((x) => x.id !== a.id))}>Excluir</button></div>)}
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          <input className={inp} placeholder="Disciplina" value={fa.materia} onChange={(e) => setFa({ ...fa, materia: e.target.value })} />
          <div className="grid grid-cols-2 gap-2"><input type="time" className={inp} value={fa.inicio} onChange={(e) => setFa({ ...fa, inicio: e.target.value })} /><input type="time" className={inp} value={fa.fim} onChange={(e) => setFa({ ...fa, fim: e.target.value })} /></div>
          <input className={inp} placeholder="Sala" value={fa.sala} onChange={(e) => setFa({ ...fa, sala: e.target.value })} />
          <input className={inp} placeholder="Professor(a)" value={fa.prof} onChange={(e) => setFa({ ...fa, prof: e.target.value })} />
        </div>
        <button type="button" className={`${btn} mt-3 w-full`} disabled={doDia.length >= 6} onClick={() => { if (!fa.materia.trim()) return alert("Informe a disciplina."); p.setAulas([...p.aulas, { id: uid(), dia, ...fa }]); setFa({ ...fa, materia: "", sala: "", prof: "" }); }}>{doDia.length >= 6 ? "Limite de 6 matérias no dia" : "+ Adicionar matéria"}</button>
      </section>

      <section className={box}>
        <h3 className="font-display text-lg font-bold">Meus estágios</h3>
        {p.estagios.map((s) => <div key={s.id} className="mt-2 rounded-xl border border-border p-3 text-sm"><div className="flex justify-between"><b>🏥 {s.local}</b><button type="button" className="text-xs text-destructive underline" onClick={() => p.setEstagios(p.estagios.filter((x) => x.id !== s.id))}>Excluir</button></div><p>📅 {s.dias} · 👩‍⚕️ {s.preceptor || "A cadastrar"}</p>{s.orient && <p className="text-muted-foreground">{s.orient}</p>}</div>)}
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          <input className={inp} placeholder="Hospital / setor" value={fe.local} onChange={(e) => setFe({ ...fe, local: e.target.value })} />
          <input className={inp} placeholder="Dias (ex.: seg e qua)" value={fe.dias} onChange={(e) => setFe({ ...fe, dias: e.target.value })} />
          <input className={inp} placeholder="Preceptor(a)" value={fe.preceptor} onChange={(e) => setFe({ ...fe, preceptor: e.target.value })} />
          <input className={inp} placeholder="Orientações do preceptor" value={fe.orient} onChange={(e) => setFe({ ...fe, orient: e.target.value })} />
        </div>
        <button type="button" className={`${btn} mt-3 w-full`} onClick={() => { if (!fe.local.trim()) return alert("Informe o local."); p.setEstagios([...p.estagios, { id: uid(), ...fe }]); setFe({ local: "", dias: "", preceptor: "", orient: "" }); }}>+ Cadastrar novo estágio</button>
      </section>

      <section className={box}>
        <h3 className="font-display text-lg font-bold">Provas, trabalhos e notas</h3>
        <div className="mt-2 flex gap-2"><input className={inp} placeholder={`Prova/trabalho em ${p.sel.split("-").reverse().join("/")}`} value={fp.titulo} onChange={(e) => setFp({ titulo: e.target.value })} /><button type="button" className={btn} onClick={() => { if (!fp.titulo.trim()) return; p.setProvas([...p.provas, { id: uid(), titulo: fp.titulo.trim(), data: p.sel }]); setFp({ titulo: "" }); }}>Adicionar</button></div>
        <p className="mt-1 text-xs text-muted-foreground">Escolha a data tocando no dia do calendário.</p>
        {proximas.map((x) => { const dd = Math.round((new Date(x.data + "T00:00").getTime() - new Date(hojeIso + "T00:00").getTime()) / 864e5); return <div key={x.id} className="mt-2 flex justify-between rounded-xl bg-muted p-3 text-sm"><span>⏰ <b>{x.titulo}</b> · {x.data.split("-").reverse().join("/")} ({dd === 0 ? "hoje" : `em ${dd} dia(s)`})</span><button type="button" className="text-xs text-destructive underline" onClick={() => p.setProvas(p.provas.filter((y) => y.id !== x.id))}>Excluir</button></div>; })}
        <div className="mt-4 rounded-xl border border-border p-3">
          <b className="text-sm">Calculadora de média</b>
          <div className="mt-2 grid grid-cols-2 gap-2"><L t="Notas (separe por vírgula)"><input className={inp} value={notas} onChange={(e) => setNotas(e.target.value)} /></L><L t="Média mínima"><input type="number" step="0.5" className={inp} value={mediaMin} onChange={(e) => setMediaMin(Number(e.target.value))} /></L></div>
          <p className="mt-2 text-lg font-black">Média: {m.toFixed(1).replace(".", ",")} — <span className={m >= mediaMin ? "text-primary" : "text-destructive"}>{m >= mediaMin ? "Aprovado(a)" : "Abaixo da média"}</span></p>
        </div>
      </section>

      <section className={box}>
        <h3 className="font-display text-lg font-bold">Minhas horas complementares</h3>
        <div className="mt-2 flex items-center gap-2 text-sm">Meta: <input type="number" className={`${inp} w-24`} value={p.meta} onChange={(e) => p.setMeta(Number(e.target.value))} /> horas</div>
        <p className="mt-2 text-2xl font-black">{totalComp} / {p.meta} h <span className="text-sm">({pct}%)</span></p>
        <div className="mt-2 h-3 overflow-hidden rounded-full bg-muted"><div className="h-3 bg-primary" style={{ width: `${pct}%` }} /></div>
        <p className="mt-1 text-sm">Faltam <b>{Math.max(0, p.meta - totalComp)} horas</b>.</p>
        {p.comp.map((c) => <div key={c.id} className="mt-2 flex justify-between text-sm"><span>📄 {c.nome} — {c.horas}h</span><button type="button" className="text-xs text-destructive underline" onClick={() => p.setComp(p.comp.filter((x) => x.id !== c.id))}>Excluir</button></div>)}
        <div className="mt-3 grid grid-cols-[1fr_90px] gap-2"><input className={inp} placeholder="Curso, palestra ou certificado ADEC" value={fc.nome} onChange={(e) => setFc({ ...fc, nome: e.target.value })} /><input type="number" className={inp} value={fc.horas} onChange={(e) => setFc({ ...fc, horas: Number(e.target.value) })} /></div>
        <button type="button" className={`${btn} mt-3 w-full`} onClick={() => { if (!fc.nome.trim()) return alert("Informe o certificado."); p.setComp([...p.comp, { id: uid(), nome: fc.nome.trim(), horas: fc.horas || 0 }]); setFc({ nome: "", horas: 4 }); }}>+ Adicionar horas</button>
      </section>
    </>
  );
}

function Stat({ l, v }: { l: string; v: string | number }) {
  return <div className="rounded-xl border border-border p-3"><p className="text-xs text-muted-foreground">{l}</p><p className="text-xl font-black">{v}</p></div>;
}
function L({ t, children }: { t: string; children: React.ReactNode }) {
  return <label className="block text-sm font-semibold">{t}<div className="mt-1">{children}</div></label>;
}
