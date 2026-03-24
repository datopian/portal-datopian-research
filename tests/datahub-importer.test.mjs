import test from "node:test";
import assert from "node:assert/strict";

import {
  buildDatapackageUrl,
  buildFallbackDatapackage,
  buildGroupPayloads,
  buildPackagePayload,
  normalizeLicenseId,
  shouldFetchDatapackage,
} from "../scripts/datahub-importer-lib.mjs";

test("buildDatapackageUrl converts a DataHub package page to datapackage.json", () => {
  assert.equal(
    buildDatapackageUrl("https://datahub.io/core/global-temp"),
    "https://datahub.io/core/global-temp/_r/-/datapackage.json"
  );
});

test("buildGroupPayloads deduplicates and slugifies manifest groups", () => {
  const payloads = buildGroupPayloads({
    groups: [
      { name: "Climate Change", description: "Climate datasets" },
      { name: "Public Health", description: "Health datasets" },
      { name: "Climate Change", description: "Duplicate should collapse" },
    ],
  });

  assert.deepEqual(payloads, [
    {
      name: "climate-change",
      title: "Climate Change",
      display_name: "Climate Change",
      description: "Climate datasets",
    },
    {
      name: "public-health",
      title: "Public Health",
      display_name: "Public Health",
      description: "Health datasets",
    },
  ]);
});

test("buildPackagePayload merges local overrides with datapackage metadata", () => {
  const payload = buildPackagePayload({
    ownerOrg: "datopian-research",
    dataset: {
      slug: "global-surface-temperature",
      title: "Global Surface Temperature",
      notes: "Research-ready climate dataset for long-term temperature change.",
      sourceUrl: "https://datahub.io/core/global-temp",
      language: "EN",
      version: "2026-demo",
      author: "Datopian Research",
      author_email: "research@datopian.com",
      maintainer: "Datopian Research",
      maintainer_email: "research@datopian.com",
      coverage: "Global",
      rights: "Open research use with attribution to upstream sources.",
      conforms_to: "Frictionless Data Package",
      has_version: "2026-demo",
      is_version_of: "https://datahub.io/core/global-temp",
      contact_point: "research@datopian.com",
      groups: ["Climate Change"],
      tags: ["climate", "temperature-trends"],
    },
    datapackage: {
      name: "global-temp",
      title: "Global Temp",
      licenses: [{ name: "ODC-PDDL-1.0" }],
      sources: [{ title: "DataHub", path: "https://datahub.io/core/global-temp" }],
      resources: [
        {
          name: "annual",
          path: "https://pkgstore.datahub.io/core/global-temp/annual.csv",
          format: "csv",
          mediatype: "text/csv",
        },
      ],
    },
  });

  assert.deepEqual(payload, {
    name: "global-surface-temperature",
    title: "Global Surface Temperature",
    notes: "Research-ready climate dataset for long-term temperature change.",
    owner_org: "datopian-research",
    license_id: "odc-pddl",
    tags: [
      { name: "climate" },
      { name: "temperature-trends" },
    ],
    language: "EN",
    version: "2026-demo",
    author: "Datopian Research",
    author_email: "research@datopian.com",
    maintainer: "Datopian Research",
    maintainer_email: "research@datopian.com",
    coverage: "Global",
    rights: "Open research use with attribution to upstream sources.",
    conforms_to: "Frictionless Data Package",
    has_version: "2026-demo",
    is_version_of: "https://datahub.io/core/global-temp",
    contact_point: "research@datopian.com",
    source: ["https://datahub.io/core/global-temp"],
    groups: [{ name: "climate-change" }],
    resources: [
      {
        name: "annual",
        url: "https://pkgstore.datahub.io/core/global-temp/annual.csv",
        format: "CSV",
        mimetype: "text/csv",
      },
    ],
  });
});

test("buildPackagePayload resolves relative DataHub resource paths to absolute URLs", () => {
  const payload = buildPackagePayload({
    ownerOrg: "datopian-research",
    dataset: {
      slug: "world-cities",
      title: "World Cities",
      notes: "Cities dataset.",
      sourceUrl: "https://datahub.io/core/world-cities",
      language: "EN",
      version: "2026-demo",
      author: "Datopian Research",
      author_email: "research@datopian.com",
      maintainer: "Datopian Research",
      maintainer_email: "research@datopian.com",
      coverage: "Global",
      rights: "Open research use with attribution to upstream sources.",
      conforms_to: "Frictionless Data Package",
      has_version: "2026-demo",
      is_version_of: "https://datahub.io/core/world-cities",
      contact_point: "research@datopian.com",
      groups: ["Demographics"],
      tags: ["cities"],
    },
    datapackage: {
      name: "world-cities",
      resources: [
        {
          name: "world-cities",
          path: "data/world-cities.csv",
          format: "csv",
          mediatype: "text/csv",
        },
      ],
    },
  });

  assert.equal(
    payload.resources[0].url,
    "https://datahub.io/core/world-cities/_r/-/data/world-cities.csv"
  );
});

test("buildPackagePayload prefers manifest resource overrides when provided", () => {
  const payload = buildPackagePayload({
    ownerOrg: "datopian-research",
    dataset: {
      slug: "life-expectancy-at-birth",
      title: "Life Expectancy at Birth",
      notes: "Health dataset.",
      sourceUrl: "https://datahub.io/core/world-development-indicators/indicators/sp.dyn.le00.in",
      language: "EN",
      version: "2026-demo",
      author: "Datopian Research",
      author_email: "research@datopian.com",
      maintainer: "Datopian Research",
      maintainer_email: "research@datopian.com",
      coverage: "Global by country",
      rights: "Open research use with attribution to upstream sources.",
      conforms_to: "Frictionless Data Package",
      has_version: "2026-demo",
      is_version_of:
        "https://datahub.io/core/world-development-indicators/indicators/sp.dyn.le00.in",
      contact_point: "research@datopian.com",
      groups: ["Public Health"],
      tags: ["health", "life-expectancy"],
      resourceOverrides: [
        {
          name: "data",
          url: "https://datahub.io/core/world-development-indicators/_r/-/indicators/sp.dyn.le00.in/data.csv",
          format: "CSV",
          mimetype: "text/csv",
        },
      ],
    },
    datapackage: {
      name: "world-development-indicators",
      resources: [],
    },
  });

  assert.deepEqual(payload.resources, [
    {
      name: "data",
      url: "https://datahub.io/core/world-development-indicators/_r/-/indicators/sp.dyn.le00.in/data.csv",
      format: "CSV",
      mimetype: "text/csv",
    },
  ]);
});

test("buildPackagePayload supports manifest-driven mixed-source datasets", () => {
  const payload = buildPackagePayload({
    ownerOrg: "datopian-research",
    dataset: {
      slug: "pacific-health-indicators",
      title: "Pacific Health Indicators",
      notes: "Regional health indicators sourced from Demographic and Health Surveys.",
      sourceUrl: "https://pacific-data.sprep.org/dataset/health-indicators",
      source: ["https://pacificdata.org/data/dataset/health-indicators"],
      license_id: "cc-by-nc-sa",
      language: "EN",
      version: "2026-demo",
      author: "Pacific Community - SPC",
      author_email: "research@datopian.com",
      maintainer: "Datopian Research",
      maintainer_email: "research@datopian.com",
      coverage: "Pacific region",
      rights: "Open research use with attribution to Pacific Data Hub.",
      conforms_to: "SDMX-CSV 2.0",
      has_version: "2026-demo",
      is_version_of: "https://pacific-data.sprep.org/dataset/health-indicators",
      contact_point: "research@datopian.com",
      groups: ["Public Health"],
      tags: ["health", "indicators", "pacific"],
      resourceOverrides: [
        {
          name: "Health indicators data",
          url: "https://stats-sdmx-disseminate.pacificdata.org/rest/data/SPC,DF_HEALTH,1.0/all/?format=csvfilewithlabels",
          format: "CSV",
          mimetype: "application/vnd.sdmx.data+csv",
        },
      ],
    },
    datapackage: undefined,
  });

  assert.deepEqual(payload, {
    name: "pacific-health-indicators",
    title: "Pacific Health Indicators",
    notes: "Regional health indicators sourced from Demographic and Health Surveys.",
    owner_org: "datopian-research",
    license_id: "cc-by-nc-sa",
    tags: [
      { name: "health" },
      { name: "indicators" },
      { name: "pacific" },
    ],
    language: "EN",
    version: "2026-demo",
    author: "Pacific Community - SPC",
    author_email: "research@datopian.com",
    maintainer: "Datopian Research",
    maintainer_email: "research@datopian.com",
    coverage: "Pacific region",
    rights: "Open research use with attribution to Pacific Data Hub.",
    conforms_to: "SDMX-CSV 2.0",
    has_version: "2026-demo",
    is_version_of: "https://pacific-data.sprep.org/dataset/health-indicators",
    contact_point: "research@datopian.com",
    source: ["https://pacificdata.org/data/dataset/health-indicators"],
    groups: [{ name: "public-health" }],
    resources: [
      {
        name: "Health indicators data",
        url: "https://stats-sdmx-disseminate.pacificdata.org/rest/data/SPC,DF_HEALTH,1.0/all/?format=csvfilewithlabels",
        format: "CSV",
        mimetype: "application/vnd.sdmx.data+csv",
      },
    ],
  });
});

test("shouldFetchDatapackage skips fetches for explicit mixed-source datasets", () => {
  assert.equal(
    shouldFetchDatapackage({
      sourceUrl: "https://pacific-data.sprep.org/dataset/health-indicators",
      skipDatapackageFetch: true,
      resourceOverrides: [{ name: "data", url: "https://example.com/data.csv", format: "CSV" }],
    }),
    false
  );

  assert.equal(
    shouldFetchDatapackage({
      sourceUrl: "https://datahub.io/core/global-temp",
    }),
    true
  );
});

test("buildFallbackDatapackage creates a manifest-backed package stub", () => {
  assert.deepEqual(
    buildFallbackDatapackage({
      slug: "pacific-health-indicators",
      title: "Pacific Health Indicators",
      notes: "Regional health indicators sourced from Demographic and Health Surveys.",
      sourceUrl: "https://pacific-data.sprep.org/dataset/health-indicators",
    }),
    {
      name: "pacific-health-indicators",
      title: "Pacific Health Indicators",
      description: "Regional health indicators sourced from Demographic and Health Surveys.",
      sources: [{ path: "https://pacific-data.sprep.org/dataset/health-indicators" }],
      resources: [],
    }
  );
});

test("normalizeLicenseId maps upstream names to CKAN license ids", () => {
  assert.equal(normalizeLicenseId("ODC-PDDL-1.0"), "odc-pddl");
  assert.equal(
    normalizeLicenseId("https://creativecommons.org/licenses/by-nc-sa/4.0/legalcode"),
    "cc-by-nc-sa"
  );
  assert.equal(normalizeLicenseId("cc-by-nc-sa"), "cc-by-nc-sa");
});
