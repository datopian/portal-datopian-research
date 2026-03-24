import test from "node:test";
import assert from "node:assert/strict";

import {
  formatDatasetCitation,
  getCitationAuthor,
  getCitationYear,
} from "../lib/citation.js";

const dataset = {
  name: "global-surface-temperature",
  title: "Global Surface Temperature Time Series",
  metadata_modified: "2025-01-15T12:00:00.000000",
  organization: {
    name: "datopian-research",
    title: "Datopian Research",
  },
};

const stableUrl = "https://research.example.com/@datopian-research/1234-5678";
const doi = "10.5281/portaljs.2026.b0383957";

test("getCitationAuthor prefers dataset author over organization metadata", () => {
  assert.equal(
    getCitationAuthor({
      ...dataset,
      author: "NOAA",
    }),
    "NOAA"
  );
});

test("getCitationYear extracts the year from metadata_modified", () => {
  assert.equal(getCitationYear(dataset), "2025");
});

test("formatDatasetCitation builds APA citations with DOI links", () => {
  assert.equal(
    formatDatasetCitation(dataset, {
      style: "apa",
      stableUrl,
      doi,
    }),
    "Datopian Research. (2025). Global Surface Temperature Time Series [Data set]. PortalJS Research Repository. https://doi.org/10.5281/portaljs.2026.b0383957"
  );
});

test("formatDatasetCitation builds BibTeX citations with DOI and stable URL", () => {
  assert.equal(
    formatDatasetCitation(dataset, {
      style: "bibtex",
      stableUrl,
      doi,
    }),
    `@misc{global-surface-temperature,
  author    = {Datopian Research},
  title     = {Global Surface Temperature Time Series},
  year      = {2025},
  publisher = {PortalJS Research Repository},
  doi       = {10.5281/portaljs.2026.b0383957},
  url       = {https://research.example.com/@datopian-research/1234-5678},
  note      = {Data set}
}`
  );
});
