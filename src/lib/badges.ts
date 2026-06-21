export type Badge = {
  label: string;
  color: "green" | "blue" | "red" | "amber" | "purple" | "pink" | "gray";
  icon?: string;
};

export const BADGE_PRESETS: Badge[] = [
  { label: "NOVO", color: "green", icon: "🆕" },
  { label: "ATUALIZADO", color: "blue", icon: "🔄" },
  { label: "PROMOÇÃO", color: "red", icon: "🔥" },
  { label: "COMBO", color: "purple", icon: "🎁" },
  { label: "DESTAQUE", color: "amber", icon: "⭐" },
];

export const BADGE_COLOR_CLASS: Record<Badge["color"], string> = {
  green: "bg-emerald-500/20 text-emerald-800 ring-emerald-500/40",
  blue: "bg-sky-500/20 text-sky-800 ring-sky-500/40",
  red: "bg-red-500/20 text-red-800 ring-red-500/40",
  amber: "bg-amber-400/30 text-amber-900 ring-amber-500/40",
  purple: "bg-purple-500/20 text-purple-800 ring-purple-500/40",
  pink: "bg-pink-500/20 text-pink-800 ring-pink-500/40",
  gray: "bg-foreground/10 text-foreground ring-foreground/20",
};

export function parseBadges(raw: unknown): Badge[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .filter((b): b is Badge => !!b && typeof b === "object" && typeof (b as any).label === "string")
    .map((b) => ({
      label: String(b.label),
      color: (BADGE_COLOR_CLASS as any)[(b as any).color] ? (b as any).color : "gray",
      icon: (b as any).icon ?? undefined,
    }));
}
