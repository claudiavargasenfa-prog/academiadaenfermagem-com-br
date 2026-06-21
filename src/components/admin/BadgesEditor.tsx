import { useState } from "react";
import { Plus, X } from "lucide-react";
import { BadgeChip } from "@/components/Badges";
import { BADGE_COLOR_CLASS, BADGE_PRESETS, parseBadges, type Badge } from "@/lib/badges";
import { supabase } from "@/integrations/supabase/client";

const input =
  "w-full rounded-lg border border-border bg-background px-2 py-1 text-xs outline-none focus:ring-2 focus:ring-primary/40";

export function BadgesEditor({
  miniAppId,
  value,
  onChanged,
}: {
  miniAppId: string;
  value: unknown;
  onChanged: (next: Badge[]) => void;
}) {
  const initial = parseBadges(value);
  const [list, setList] = useState<Badge[]>(initial);
  const [busy, setBusy] = useState(false);
  const [adding, setAdding] = useState(false);
  const [custom, setCustom] = useState<Badge>({ label: "", color: "amber", icon: "" });

  async function persist(next: Badge[]) {
    setBusy(true);
    const { error } = await supabase
      .from("mini_apps")
      .update({ badges: next as any })
      .eq("id", miniAppId);
    setBusy(false);
    if (error) {
      alert("Erro ao salvar destaques: " + error.message);
      return;
    }
    setList(next);
    onChanged(next);
  }

  function remove(i: number) {
    persist(list.filter((_, idx) => idx !== i));
  }
  function add(b: Badge) {
    if (!b.label.trim()) return;
    if (list.some((x) => x.label.toUpperCase() === b.label.toUpperCase())) return;
    persist([...list, { ...b, label: b.label.toUpperCase() }]);
    setAdding(false);
    setCustom({ label: "", color: "amber", icon: "" });
  }

  return (
    <div className="space-y-1.5">
      <div className="flex flex-wrap items-center gap-1">
        {list.map((b, i) => (
          <span key={i} className="relative">
            <BadgeChip badge={b} className="text-[10px] px-2 py-0.5 pr-5" />
            <button
              type="button"
              onClick={() => remove(i)}
              disabled={busy}
              className="absolute right-0.5 top-1/2 -translate-y-1/2 rounded-full p-0.5 opacity-60 hover:opacity-100"
              aria-label="Remover"
            >
              <X className="h-3 w-3" />
            </button>
          </span>
        ))}
        {!adding && (
          <button
            type="button"
            onClick={() => setAdding(true)}
            className="inline-flex items-center gap-0.5 rounded-full border border-dashed border-foreground/30 px-2 py-0.5 text-[10px] font-bold text-muted-foreground hover:bg-foreground/5"
          >
            <Plus className="h-3 w-3" /> destaque
          </button>
        )}
      </div>
      {adding && (
        <div className="rounded-lg border border-border bg-background/60 p-2">
          <p className="mb-1 text-[10px] font-bold uppercase text-muted-foreground">Destaques rápidos</p>
          <div className="flex flex-wrap gap-1">
            {BADGE_PRESETS.map((b) => (
              <button
                type="button"
                key={b.label}
                onClick={() => add(b)}
                className="inline-flex"
              >
                <BadgeChip badge={b} className="text-[10px] px-2 py-0.5 hover:brightness-110" />
              </button>
            ))}
          </div>
          <p className="mt-2 mb-1 text-[10px] font-bold uppercase text-muted-foreground">Custom</p>
          <div className="flex flex-wrap items-center gap-1">
            <input
              className={`${input} w-24`}
              placeholder="emoji"
              value={custom.icon ?? ""}
              onChange={(e) => setCustom({ ...custom, icon: e.target.value })}
            />
            <input
              className={`${input} w-32`}
              placeholder="LABEL"
              value={custom.label}
              onChange={(e) => setCustom({ ...custom, label: e.target.value })}
            />
            <select
              className={`${input} w-24`}
              value={custom.color}
              onChange={(e) => setCustom({ ...custom, color: e.target.value as Badge["color"] })}
            >
              {Object.keys(BADGE_COLOR_CLASS).map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            <button
              type="button"
              onClick={() => add(custom)}
              className="rounded-md bg-primary px-2 py-1 text-[10px] font-bold text-primary-foreground"
            >
              adicionar
            </button>
            <button
              type="button"
              onClick={() => setAdding(false)}
              className="rounded-md bg-foreground/10 px-2 py-1 text-[10px] font-bold"
            >
              cancelar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
