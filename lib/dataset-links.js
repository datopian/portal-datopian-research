export function getDatasetStablePath(dataset) {
  const organizationName = dataset?.organization?.name;
  const datasetIdentifier = dataset?.id || dataset?.name;

  if (!organizationName || !datasetIdentifier) {
    return "/";
  }

  return `/@${organizationName}/${datasetIdentifier}`;
}

export function getBrowserOrigin(windowLike, fallbackSiteUrl = "") {
  const browserOrigin = windowLike?.location?.origin;

  if (browserOrigin) {
    return String(browserOrigin).replace(/\/+$/, "");
  }

  return String(fallbackSiteUrl || "").replace(/\/+$/, "");
}

export function getDatasetStableUrl(dataset, siteUrl) {
  const baseUrl = getBrowserOrigin(undefined, siteUrl);
  const stablePath = getDatasetStablePath(dataset);

  return `${baseUrl}${stablePath}`;
}
