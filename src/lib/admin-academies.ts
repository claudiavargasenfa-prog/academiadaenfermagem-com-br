type AdminAcademy = { id: string; name: string; ordem: number; is_active: boolean };

// Admin inventory is independent of customer-facing activation.
export function adminAcademies<T extends AdminAcademy>(academies: readonly T[]): T[] {
  return [...academies].sort((a, b) =>
    a.ordem - b.ordem || a.name.localeCompare(b.name, 'pt-BR'),
  );
}