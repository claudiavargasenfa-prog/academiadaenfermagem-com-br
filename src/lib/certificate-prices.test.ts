import { describe, expect, it } from "vitest";
import { certificatePriceCents } from "./certificate-prices";

describe("taxa de certificado", () => {
  it("10h custa R$ 18,00", () => expect(certificatePriceCents(10)).toBe(1800));
  it("20h custa R$ 36,00", () => expect(certificatePriceCents(20)).toBe(3600));
  it("30h custa R$ 54,00", () => expect(certificatePriceCents(30)).toBe(5400));
  it("40h custa R$ 69,90", () => expect(certificatePriceCents(40)).toBe(6990));
  it("carga horária inválida não tem preço", () => expect(certificatePriceCents(15)).toBeNull());
});
