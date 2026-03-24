import { Resource } from "@/schemas/resource.interface";
import Link from "next/link";
import { Dialog } from "@headlessui/react";
import { RiCodeBoxLine, RiDownload2Fill } from "react-icons/ri";
import ResourcesBadges from "../_shared/ResourcesBadges";
import ResourcePreview from "./ResourcePreview";
import { getTimeAgo } from "@/lib/utils";
import { useMemo, useState } from "react";
import { ClipboardDocumentIcon, XMarkIcon } from "@heroicons/react/20/solid";
import { formatResourceAccessSnippet } from "@/lib/api-access";
import { getBrowserOrigin, getDatasetStablePath } from "@/lib/dataset-links";
import { url as siteUrl } from "@/next-seo.config";

interface ResourcesListProps {
  resources: Array<Resource>;
  orgName: string;
  datasetName: string;
}
export default function ResourcesList({
  resources,
  orgName,
  datasetName,
}: ResourcesListProps) {
  const accessStyles = [
    { id: "curl", label: "curl" },
    { id: "python", label: "Python" },
    { id: "r", label: "R" },
  ] as const;
  const [activeResourceId, setActiveResourceId] = useState<string | null>(null);
  const [accessStyle, setAccessStyle] =
    useState<(typeof accessStyles)[number]["id"]>("curl");
  const [copiedSnippet, setCopiedSnippet] = useState(false);
  const stableDatasetUrl = `${getBrowserOrigin(
    typeof window !== "undefined" ? window : undefined,
    siteUrl
  )}${getDatasetStablePath({
    name: datasetName,
    organization: { name: orgName },
  })}`;
  const activeResource = useMemo(
    () => resources.find((resource) => resource.id === activeResourceId) || null,
    [activeResourceId, resources]
  );
  const activeSnippet = activeResource
    ? formatResourceAccessSnippet(
        { name: datasetName },
        {
          style: accessStyle,
          stableUrl: stableDatasetUrl,
          resourceUrl: activeResource.url,
        }
      )
    : "";

  const copySnippet = async () => {
    if (!activeSnippet) return;

    try {
      await navigator.clipboard.writeText(activeSnippet);
      setCopiedSnippet(true);
      window.setTimeout(() => setCopiedSnippet(false), 2000);
    } catch (error) {
      console.error("Failed to copy API access snippet", error);
    }
  };

  return (
    <>
      <div className="py-2 w-full flex flex-col gap-6">
        {resources.map((resource: Resource) => (
          <div
            key={resource.id}
            className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm"
          >
            <article className="flex flex-col gap-4">
              <div className="flex flex-col gap-3">
                <h4 className="font-semibold text-lg text-zinc-900 leading-tight pr-5">
                  {resource.name || "No title"}
                </h4>
                <p className="text-sm font-normal text-stone-500">
                  {resource.description || "No description"}
                </p>
                <div className="mt-2">
                  <ResourcesBadges resources={[resource]} />
                </div>
                <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-stone-500">
                  <span>
                    <strong className="font-medium text-stone-700">Size:</strong>{" "}
                    {resource.size || "N/A"}
                  </span>
                  <span>
                    <strong className="font-medium text-stone-700">Created:</strong>{" "}
                    {resource.created ? getTimeAgo(resource.created) : "N/A"}
                  </span>
                  <span>
                    <strong className="font-medium text-stone-700">Updated:</strong>{" "}
                    {resource.metadata_modified
                      ? getTimeAgo(resource.metadata_modified)
                      : "N/A"}
                  </span>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {resource.url && (
                  <Link
                    href={resource.url}
                    className="bg-accent px-3 py-2 h-fit shadow hover:shadow-lg transition-all text-sm text-center text-white rounded font-roboto font-bold hover:bg-darkaccent hover:text-white duration-150 flex items-center justify-center gap-1"
                  >
                    <RiDownload2Fill />
                    <span>Download</span>
                  </Link>
                )}
                <button
                  type="button"
                  onClick={() => {
                    setAccessStyle("curl");
                    setCopiedSnippet(false);
                    setActiveResourceId(resource.id);
                  }}
                  className="border border-stone-200 bg-white px-3 py-2 h-fit shadow-sm hover:shadow transition-all text-sm text-center text-stone-700 rounded font-roboto font-bold hover:border-stone-300 duration-150 flex items-center justify-center gap-1"
                >
                  <RiCodeBoxLine />
                  <span>API access</span>
                </button>
              </div>
              <ResourcePreview resource={resource} />
            </article>
          </div>
        ))}
      </div>
      <Dialog
        open={!!activeResource}
        onClose={() => setActiveResourceId(null)}
        className="relative z-[1200]"
      >
        <div className="fixed inset-0 z-[1200] bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 z-[1210] flex items-center justify-center p-4">
          <Dialog.Panel className="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <Dialog.Title className="text-lg font-semibold text-zinc-900">
                  API access
                </Dialog.Title>
                <p className="mt-1 text-sm text-stone-500">
                  Use one of these starter snippets to access this resource directly.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setActiveResourceId(null)}
                className="rounded-lg p-2 text-stone-500 transition hover:bg-stone-100 hover:text-stone-700"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {accessStyles.map((style) => (
                <button
                  key={style.id}
                  type="button"
                  onClick={() => setAccessStyle(style.id)}
                  className={`rounded-full border px-3 py-1.5 text-sm font-medium transition ${
                    accessStyle === style.id
                      ? "border-accent bg-accent/10 text-accent"
                      : "border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50"
                  }`}
                >
                  {style.label}
                </button>
              ))}
            </div>
            <div className="mt-4 rounded-xl border border-slate-200 bg-slate-950 p-4">
              <pre className="whitespace-pre-wrap break-words text-sm text-slate-100">
                <code>{activeSnippet}</code>
              </pre>
            </div>
            <div className="mt-4 flex gap-2">
              <button
                type="button"
                onClick={copySnippet}
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-accent hover:text-accent"
              >
                <ClipboardDocumentIcon className="h-4 w-4" />
                {copiedSnippet ? "Copied" : "Copy snippet"}
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </>
  );
}
