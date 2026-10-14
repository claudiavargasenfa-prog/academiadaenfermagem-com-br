import { describe, it as test } from "node:test";
import { strict as assert } from "node:assert";
import { oauthReturnPath } from "./oauth-return-path";
describe("OAuth return destination", () => {
  test("preserves authorization query and fragment", () => {
    assert.equal(oauthReturnPath("/.lovable/oauth/consent?authorization_id=abc#confirmar"), "/.lovable/oauth/consent?authorization_id=abc#confirmar");
  });
  test("rejects external and malformed destinations", () => {
    for (const path of ["//outside.invalid", "/\\outside.invalid", "https://outside.invalid", "/\nmalicious"]) assert.equal(oauthReturnPath(path), "/");
  });
});