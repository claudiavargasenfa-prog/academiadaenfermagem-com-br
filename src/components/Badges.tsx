import { BADGE_COLOR_CLASS, parseBadges, type Badge } from "@/lib/badges";

export function BadgeList({ value, size = "sm" }: { value: unknown; size?: "xs" | "sm" }) {
  const badges = parseBadges(value);
  if (badges.length === 0) return null;
  const cls = size === "xs" ? "text-[9px] px-1.5 py-0.5" : "text-[10px] px-2 py-0.5";
  return (
    <div className="flex flex-wrap gap-1">
      {badges.map((b, i) => (
        <BadgeChip key={i} badge={b} className={cls} />
      ))}
    </div>
  );
}

export function BadgeChip({ badge, className = "" }: { badge: Badge; className?: string }) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full font-extrabold uppercase tracking-wide ring-1 ${BADGE_COLOR_CLASS[badge.color]} ${className}`}
    >
      {badge.icon && <span>{badge.icon}</span>}
      {badge.label}
    </span>
  );
}
