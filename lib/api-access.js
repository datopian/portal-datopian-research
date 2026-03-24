function getApiBaseUrl(apiBaseUrl) {
  return String(apiBaseUrl || "").replace(/\/+$/, "");
}

function getDatasetIdentifier(dataset) {
  return dataset?.id || dataset?.name || "";
}

function getOutputFileName(dataset, resourceUrl) {
  const fileNameFromUrl = String(resourceUrl || "")
    .split("/")
    .filter(Boolean)
    .pop();

  return fileNameFromUrl || `${dataset?.name || "dataset"}.data`;
}

export function formatDatasetApiSnippet(
  dataset,
  { style = "curl", apiBaseUrl } = {}
) {
  const datasetIdentifier = getDatasetIdentifier(dataset);
  const packageShowUrl = `${getApiBaseUrl(
    apiBaseUrl
  )}/api/3/action/package_show?id=${datasetIdentifier}`;

  if (style === "python") {
    return `import requests

response = requests.get("${packageShowUrl}")
response.raise_for_status()
dataset = response.json()["result"]`;
  }

  if (style === "r") {
    return `library(httr2)
library(jsonlite)

response <- request("${packageShowUrl}") |> req_perform()
dataset <- resp_body_json(response)$result`;
  }

  return `curl -L "${packageShowUrl}"`;
}

export function formatResourceAccessSnippet(
  dataset,
  { style = "curl", stableUrl, resourceUrl } = {}
) {
  const accessUrl = resourceUrl || stableUrl || "";
  const outputFileName = getOutputFileName(dataset, accessUrl);

  if (style === "python") {
    return `import pandas as pd

df = pd.read_csv("${accessUrl}")
df.head()`;
  }

  if (style === "r") {
    return `library(readr)

df <- read_csv("${accessUrl}")
head(df)`;
  }

  if (!resourceUrl) {
    return `curl -L "${accessUrl}"`;
  }

  return `curl -L "${accessUrl}" -o "${outputFileName}"`;
}
