import test from "node:test";
import assert from "node:assert/strict";

import {
  formatDatasetApiSnippet,
  formatResourceAccessSnippet,
} from "../lib/api-access.js";

const dataset = {
  id: "1234-5678",
  name: "global-surface-temperature",
};

const stableUrl = "https://research.example.com/@datopian-research/1234-5678";
const apiBaseUrl = "https://api.example.com";
const resourceUrl = "https://data.example.com/global-surface-temperature.csv";

test("formatDatasetApiSnippet builds a curl package_show command", () => {
  assert.equal(
    formatDatasetApiSnippet(dataset, {
      style: "curl",
      apiBaseUrl,
    }),
    'curl -L "https://api.example.com/api/3/action/package_show?id=1234-5678"'
  );
});

test("formatDatasetApiSnippet builds a python snippet for package_show", () => {
  assert.equal(
    formatDatasetApiSnippet(dataset, {
      style: "python",
      apiBaseUrl,
    }),
    `import requests

response = requests.get("https://api.example.com/api/3/action/package_show?id=1234-5678")
response.raise_for_status()
dataset = response.json()["result"]`
  );
});

test("formatDatasetApiSnippet builds an R snippet for package_show", () => {
  assert.equal(
    formatDatasetApiSnippet(dataset, {
      style: "r",
      apiBaseUrl,
    }),
    `library(httr2)
library(jsonlite)

response <- request("https://api.example.com/api/3/action/package_show?id=1234-5678") |> req_perform()
dataset <- resp_body_json(response)$result`
  );
});

test("formatResourceAccessSnippet builds a curl download command", () => {
  assert.equal(
    formatResourceAccessSnippet(dataset, {
      style: "curl",
      resourceUrl,
    }),
    'curl -L "https://data.example.com/global-surface-temperature.csv" -o "global-surface-temperature.csv"'
  );
});

test("formatResourceAccessSnippet builds a python data-loading snippet", () => {
  assert.equal(
    formatResourceAccessSnippet(dataset, {
      style: "python",
      stableUrl,
      resourceUrl,
    }),
    `import pandas as pd

df = pd.read_csv("https://data.example.com/global-surface-temperature.csv")
df.head()`
  );
});

test("formatResourceAccessSnippet falls back to the stable dataset URL when no resource URL exists", () => {
  assert.equal(
    formatResourceAccessSnippet(dataset, {
      style: "curl",
      stableUrl,
    }),
    'curl -L "https://research.example.com/@datopian-research/1234-5678"'
  );
});
