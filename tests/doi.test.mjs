import test from "node:test";
import assert from "node:assert/strict";

import { generateMockDoi } from "../lib/doi.js";

test("generateMockDoi is deterministic for a dataset name", () => {
  assert.equal(generateMockDoi("my-dataset"), "10.5281/portaljs.2026.b0383957");
});

test("generateMockDoi pads the hash suffix to 8 hex characters", () => {
  const doi = generateMockDoi("a");
  assert.match(doi, /^10\.5281\/portaljs\.2026\.[0-9a-f]{8}$/);
});
