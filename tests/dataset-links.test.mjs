import test from "node:test";
import assert from "node:assert/strict";

import {
  getDatasetStablePath,
  getDatasetStableUrl,
  getBrowserOrigin,
} from "../lib/dataset-links.js";

test("getDatasetStablePath prefers dataset id over dataset name", () => {
  assert.equal(
    getDatasetStablePath({
      id: "8d4a59b8-9b58-4c83-85bc-42a07e337f15",
      name: "global-surface-temperature",
      organization: { name: "datopian-research" },
    }),
    "/@datopian-research/8d4a59b8-9b58-4c83-85bc-42a07e337f15"
  );
});

test("getDatasetStablePath falls back to dataset name when id is missing", () => {
  assert.equal(
    getDatasetStablePath({
      name: "global-surface-temperature",
      organization: { name: "datopian-research" },
    }),
    "/@datopian-research/global-surface-temperature"
  );
});

test("getDatasetStableUrl joins the configured site URL with the stable path", () => {
  assert.equal(
    getDatasetStableUrl(
      {
        id: "8d4a59b8-9b58-4c83-85bc-42a07e337f15",
        name: "global-surface-temperature",
        organization: { name: "datopian-research" },
      },
      "https://research.example.com/"
    ),
    "https://research.example.com/@datopian-research/8d4a59b8-9b58-4c83-85bc-42a07e337f15"
  );
});

test("getBrowserOrigin returns the current browser origin when window.location is available", () => {
  assert.equal(
    getBrowserOrigin({
      location: { origin: "https://portal.example.test" },
    }),
    "https://portal.example.test"
  );
});

test("getBrowserOrigin falls back to the configured site URL outside the browser", () => {
  assert.equal(
    getBrowserOrigin(undefined, "https://research.example.com/"),
    "https://research.example.com"
  );
});
