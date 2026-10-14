import { describe, it } from "node:test";
import { strict as assert } from "node:assert";
import { safeLandingUrl } from "./adec-editor";

describe("Landing button destinations", () => {
  it("preserves internal and HTTPS destinations chosen by the owner", () => {
    assert.equal(safeLandingUrl("/cadastro/enfermeiro", "/adec"), "/cadastro/enfermeiro");
    assert.equal(safeLandingUrl("https://academiadaenfermagem.com.br/planos/enfermeiro", "/adec"), "https://academiadaenfermagem.com.br/planos/enfermeiro");
  });
  it("does not execute scripts or accept protocol-relative destinations", () => {
    for (const value of ["javascript:alert(1)", "//outside.invalid", "/\\outside.invalid"]) assert.equal(safeLandingUrl(value, "/adec"), "/adec");
  });
});