type Academy = { slug: string; name: string; is_active: boolean };
type Plan = { slug: string; name: string; is_active: boolean; sort_order: number };

// Only real Academies can create store cards; payment-only legacy rows cannot.
export function storeAcademies<T extends Plan>(plans: T[], apps: Academy[], mode: string): T[] {
  const bySlug = new Map(apps.map((app) => [app.slug, app]));
  return plans.flatMap((plan) => {
    const app = bySlug.get(plan.slug);
    if (!app?.is_active || !plan.is_active) return [];
    return [{ ...plan, name: app.name }];
  }).sort((a, b) => mode === 'alpha'
    ? a.name.localeCompare(b.name, 'pt-BR')
    : a.sort_order - b.sort_order);
}