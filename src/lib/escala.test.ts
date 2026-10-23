import { describe, expect, test } from "vitest";
import { conflitos, gerarDatas } from "./escala";

describe("Escala automática", () => {
  test("12x36 trabalha dia sim, dia não", () => {
    expect(gerarDatas("2026-10-01", "12x36-d", 5)).toEqual(["2026-10-01", "2026-10-03", "2026-10-05"]);
  });
  test("24x72 trabalha a cada 4 dias", () => {
    expect(gerarDatas("2026-10-01", "24x72", 9)).toEqual(["2026-10-01", "2026-10-05", "2026-10-09"]);
  });
  test("24x144 trabalha a cada 7 dias", () => {
    expect(gerarDatas("2026-10-01", "24x144", 8)).toEqual(["2026-10-01", "2026-10-08"]);
  });
  test("diarista só trabalha de segunda a sexta", () => {
    // 03/10/2026 é sábado
    expect(gerarDatas("2026-10-02", "d40", 4)).toEqual(["2026-10-02", "2026-10-05"]);
  });
  test("dois hospitais no mesmo dia geram conflito", () => {
    expect(conflitos([{ data: "2026-10-01", vinculo: "A" }, { data: "2026-10-01", vinculo: "B" }, { data: "2026-10-02", vinculo: "A" }])).toEqual(["2026-10-01"]);
  });
});
