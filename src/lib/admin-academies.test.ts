import { describe, expect, test } from 'vitest';
import { adminAcademies } from './admin-academies';

describe('Inventário das Academias no painel', () => {
  test('UTI inativa permanece disponível sem ser ativada', () => {
    const uti = { id: 'uti', name: 'Terapia Intensiva', ordem: 5, is_active: false };
    expect(adminAcademies([uti])).toEqual([uti]);
    expect(uti.is_active).toBe(false);
  });

  test('qualquer Academia futura inativa aparece sem depender de seu nome ou código', () => {
    const academies = [
      { id: 'nova-academia', name: 'Nova Academia', ordem: 9, is_active: false },
      { id: 'enfermeiro', name: 'Enfermeiro', ordem: 4, is_active: true },
      { id: 'arquivo', name: 'Arquivo', ordem: 999, is_active: false },
    ];
    expect(adminAcademies(academies).map(a => a.id)).toEqual(['enfermeiro', 'nova-academia', 'arquivo']);
  });
});