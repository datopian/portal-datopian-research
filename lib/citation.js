export function getCitationAuthor(dataset) {
  return (
    dataset?.author ||
    dataset?.organization?.title ||
    dataset?.organization?.name ||
    "PortalJS Research Repository"
  );
}

export function getCitationTitle(dataset) {
  return dataset?.title || dataset?.name || "Untitled dataset";
}

export function getCitationYear(dataset) {
  const rawDate = dataset?.metadata_modified;
  const parsedDate = rawDate ? new Date(rawDate) : null;

  if (parsedDate && !Number.isNaN(parsedDate.getTime())) {
    return String(parsedDate.getUTCFullYear());
  }

  return String(new Date().getUTCFullYear());
}

export function formatDatasetCitation(
  dataset,
  {
    style = "apa",
    stableUrl,
    doi,
    publisher = "PortalJS Research Repository",
  } = {}
) {
  const author = getCitationAuthor(dataset);
  const title = getCitationTitle(dataset);
  const year = getCitationYear(dataset);
  const doiUrl = doi ? `https://doi.org/${doi}` : stableUrl;

  if (style === "bibtex") {
    return `@misc{${dataset?.name || "dataset"},
  author    = {${author}},
  title     = {${title}},
  year      = {${year}},
  publisher = {${publisher}},
  doi       = {${doi || ""}},
  url       = {${stableUrl || ""}},
  note      = {Data set}
}`;
  }

  return `${author}. (${year}). ${title} [Data set]. ${publisher}. ${doiUrl}`;
}
