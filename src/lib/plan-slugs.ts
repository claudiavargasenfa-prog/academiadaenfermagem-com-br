// Os 4 aplicativos reais da vitrine.
// Os demais slugs em subscription_plans (ex.: "academico-anual", "tecnico-semestral-v2")
// existem apenas para guardar links de pagamento por período e NÃO devem aparecer na loja.
export const BASE_PLAN_SLUGS = [
  "academico",
  "tecnico",
  "tecnico-estudante",
  "enfermeiro",
  "uti-emergencia",
] as const;

export const BASE_PLAN_SLUG_SET = new Set<string>(BASE_PLAN_SLUGS);

export function isBasePlanSlug(slug: string) {
  return BASE_PLAN_SLUG_SET.has(slug);
}
