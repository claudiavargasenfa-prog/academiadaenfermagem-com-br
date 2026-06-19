import type { ReactNode } from "react";

/**
 * Renderizador de markdown minimalista (sem dependência externa).
 * Suporta: # ## ### títulos, **negrito**, *itálico*, `código`,
 * links [texto](url), listas - e 1., parágrafos, e blocos de destaque:
 *   > ⚠️ Atenção: ...   → card amarelo
 *   > ✅ Dica: ...      → card verde
 *   > 📌 Importante: ... → card azul
 *   > (qualquer outro)   → blockquote padrão
 */
export function renderMarkdown(src: string): ReactNode {
  const lines = src.replace(/\r\n/g, "\n").split("\n");
  const blocks: ReactNode[] = [];
  let i = 0;
  let key = 0;
  const nextKey = () => `mdb-${key++}`;

  while (i < lines.length) {
    const line = lines[i];

    if (!line.trim()) {
      i++;
      continue;
    }

    // Heading
    const h = /^(#{1,3})\s+(.*)$/.exec(line);
    if (h) {
      const level = h[1].length;
      const text = h[2];
      const cls =
        level === 1
          ? "mt-4 mb-2 font-display text-2xl font-bold text-foreground"
          : level === 2
            ? "mt-4 mb-2 font-display text-xl font-bold text-foreground"
            : "mt-3 mb-1 font-display text-base font-bold text-foreground";
      const Tag = (`h${level}` as unknown) as keyof React.JSX.IntrinsicElements;
      blocks.push(
        <Tag key={nextKey()} className={cls}>
          {renderInline(text)}
        </Tag>,
      );
      i++;
      continue;
    }

    // Blockquote / callout (collect consecutive > lines)
    if (line.startsWith(">")) {
      const buf: string[] = [];
      while (i < lines.length && lines[i].startsWith(">")) {
        buf.push(lines[i].replace(/^>\s?/, ""));
        i++;
      }
      const first = buf[0] ?? "";
      let style = "border-foreground/20 bg-foreground/5 text-foreground";
      if (/^⚠️|^\s*Atenção/i.test(first))
        style = "border-amber-400 bg-amber-50 text-amber-900";
      else if (/^✅|^\s*Dica/i.test(first))
        style = "border-emerald-400 bg-emerald-50 text-emerald-900";
      else if (/^📌|^\s*Importante/i.test(first))
        style = "border-sky-400 bg-sky-50 text-sky-900";
      blocks.push(
        <div
          key={nextKey()}
          className={`my-3 rounded-xl border-l-4 ${style} px-4 py-3 text-sm`}
        >
          {buf.map((b, j) => (
            <p key={j} className={j > 0 ? "mt-1" : ""}>
              {renderInline(b)}
            </p>
          ))}
        </div>,
      );
      continue;
    }

    // Unordered list
    if (/^[-*]\s+/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^[-*]\s+/.test(lines[i])) {
        items.push(lines[i].replace(/^[-*]\s+/, ""));
        i++;
      }
      blocks.push(
        <ul key={nextKey()} className="my-2 ml-5 list-disc space-y-1 text-sm">
          {items.map((it, j) => (
            <li key={j}>{renderInline(it)}</li>
          ))}
        </ul>,
      );
      continue;
    }

    // Ordered list
    if (/^\d+\.\s+/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^\d+\.\s+/.test(lines[i])) {
        items.push(lines[i].replace(/^\d+\.\s+/, ""));
        i++;
      }
      blocks.push(
        <ol key={nextKey()} className="my-2 ml-5 list-decimal space-y-1 text-sm">
          {items.map((it, j) => (
            <li key={j}>{renderInline(it)}</li>
          ))}
        </ol>,
      );
      continue;
    }

    // Paragraph (until blank line)
    const para: string[] = [line];
    i++;
    while (
      i < lines.length &&
      lines[i].trim() &&
      !/^(#{1,3}\s|>|[-*]\s|\d+\.\s)/.test(lines[i])
    ) {
      para.push(lines[i]);
      i++;
    }
    blocks.push(
      <p key={nextKey()} className="my-2 text-sm leading-relaxed text-foreground">
        {renderInline(para.join(" "))}
      </p>,
    );
  }

  return <>{blocks}</>;
}

function renderInline(text: string): ReactNode {
  // Process [text](url) first, then **bold**, *italic*, `code`
  const nodes: ReactNode[] = [];
  let rest = text;
  let k = 0;
  // simple tokenizer
  const patterns: { re: RegExp; build: (m: RegExpExecArray) => ReactNode }[] = [
    {
      re: /\[([^\]]+)\]\(([^)]+)\)/,
      build: (m) => (
        <a
          key={`l${k++}`}
          href={m[2]}
          target="_blank"
          rel="noreferrer"
          className="font-semibold text-primary underline"
        >
          {m[1]}
        </a>
      ),
    },
    {
      re: /\*\*([^*]+)\*\*/,
      build: (m) => (
        <strong key={`b${k++}`} className="font-bold text-foreground">
          {m[1]}
        </strong>
      ),
    },
    {
      re: /\*([^*]+)\*/,
      build: (m) => (
        <em key={`i${k++}`} className="italic">
          {m[1]}
        </em>
      ),
    },
    {
      re: /`([^`]+)`/,
      build: (m) => (
        <code key={`c${k++}`} className="rounded bg-foreground/10 px-1 py-0.5 text-xs">
          {m[1]}
        </code>
      ),
    },
  ];

  while (rest.length) {
    let best: { idx: number; match: RegExpExecArray; build: (m: RegExpExecArray) => ReactNode } | null = null;
    for (const p of patterns) {
      const m = p.re.exec(rest);
      if (m && (best === null || m.index < best.idx)) {
        best = { idx: m.index, match: m, build: p.build };
      }
    }
    if (!best) {
      nodes.push(rest);
      break;
    }
    if (best.idx > 0) nodes.push(rest.slice(0, best.idx));
    nodes.push(best.build(best.match));
    rest = rest.slice(best.idx + best.match[0].length);
  }
  return <>{nodes}</>;
}
