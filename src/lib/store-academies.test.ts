import { describe, expect, test } from 'vitest';
import { storeAcademies } from './store-academies';

const plans = [
  { slug: 'enfermeiro', name: 'Enfermeiro', is_active: true, sort_order: 4 },
  { slug: 'uti', name: 'UTI', is_active: true, sort_order: 5 },
  { slug: 'uti-emergencia', name: 'Cadastro antigo', is_active: true, sort_order: 6 },
];
const apps = [
  { slug: 'enfermeiro', name: 'Enfermeiro', is_active: true },
  { slug: 'uti', name: 'UTI', is_active: false },
];

describe('Academias independentes na loja', () => {
  test('cadastro antigo sem Academia não cria um segundo cartão', () => {
    expect(storeAcademies(plans, apps, 'numeric').map(p => p.slug)).toEqual(['enfermeiro']);
  });
  test('ativar UTI não muda o destino da Academia do Enfermeiro', () => {
    const active = apps.map(a => ({ ...a, is_active: true }));
    expect(storeAcademies(plans, active, 'numeric').map(p => p.slug)).toEqual(['enfermeiro', 'uti']);
  });
  test('desativar Enfermeiro não impede ativar UTI', () => {
    const changed = apps.map(a => ({ ...a, is_active: a.slug === 'uti' }));
    expect(storeAcademies(plans, changed, 'numeric').map(p => p.slug)).toEqual(['uti']);
  });
});