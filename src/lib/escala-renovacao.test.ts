import { describe, expect, it } from "vitest";
import { avisoRenovacao, escalaBloqueada } from "./escala-renovacao";

describe("renovação da Escala", () => {
  it("sem aviso antes de 10/11", () => expect(avisoRenovacao(new Date(2026, 10, 9))).toBeNull());
  it("30% a partir de 10/11", () => expect(avisoRenovacao(new Date(2026, 10, 10))).toEqual({ ano: 2027 }));
  it("oferta vale até 20/12", () => expect(avisoRenovacao(new Date(2026, 11, 20))?.ano).toBe(2027));
  it("sem aviso após 20/12", () => expect(avisoRenovacao(new Date(2026, 11, 21))).toBeNull());
  it("bloqueia sem pagamento confirmado no novo ano", () => expect(escalaBloqueada(new Date(2027, 0, 2), "2026-12-31T23:59:59-03:00", false)).toBe(true));
  it("libera após pagamento confirmado", () => expect(escalaBloqueada(new Date(2027, 0, 2), "2027-12-31T23:59:59-03:00", false)).toBe(false));
  it("admin nunca bloqueia", () => expect(escalaBloqueada(new Date(2027, 0, 2), null, true)).toBe(false));
});
