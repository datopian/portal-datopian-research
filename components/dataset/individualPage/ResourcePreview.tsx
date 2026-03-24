"use client";

import dynamic from "next/dynamic";
import { PrimeReactProvider } from "primereact/api";
import { Resource } from "@/schemas/resource.interface";

const PdfViewer = dynamic(
  () => import("@portaljs/components").then((mod) => mod.PdfViewer),
  { ssr: false }
);

const ExcelViewer = dynamic(
  () => import("@portaljs/components").then((mod) => mod.Excel),
  { ssr: false }
);

const GeoJsonMap = dynamic(
  () => import("@/components/dataset/resource/GeoJsonMap"),
  { ssr: false }
);

const ResponsiveGridData = dynamic(
  () => import("@/components/responsiveGrid"),
  { ssr: false }
);

function canPreview(resource: Resource) {
  const format = resource.format?.toLowerCase();
  return ["csv", "pdf", "xlsx", "xls", "geojson"].includes(format || "") || resource?.iframe;
}

export default function ResourcePreview({ resource }: { resource?: Resource | null }) {
  if (!resource) return null;

  const resourceFormat = resource.format?.toLowerCase();

  if (!canPreview(resource)) {
    return (
      <div className="rounded-xl border border-stone-200 bg-stone-50 p-4 text-sm text-stone-600">
        This resource does not support inline preview yet.
      </div>
    );
  }

  return (
    <PrimeReactProvider>
      <div className="space-y-4">
        {resourceFormat === "csv" ? <ResponsiveGridData dataUrl={resource.url} /> : null}
        {resourceFormat === "pdf" ? (
          <PdfViewer layout={true} url={resource.url} parentClassName="h-[900px]" />
        ) : null}
        {["xlsx", "xls"].includes(resourceFormat || "") ? (
          <ExcelViewer url={resource.url} />
        ) : null}
        {resourceFormat === "geojson" ? (
          <GeoJsonMap dataUrl={resource.url} />
        ) : null}
        {resource?.iframe ? (
          <iframe src={resource.url} style={{ width: "100%", height: "600px" }} />
        ) : null}
      </div>
    </PrimeReactProvider>
  );
}
