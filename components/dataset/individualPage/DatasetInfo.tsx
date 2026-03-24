import Link from "next/link";
import { Dialog } from "@headlessui/react";
import { Resource, Tag } from "@portaljs/ckan";
import {
  AcademicCapIcon,
  ArrowDownTrayIcon,
  BeakerIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  ClipboardDocumentIcon,
  CommandLineIcon,
  ChevronDownIcon as DropdownChevronDownIcon,
  FingerPrintIcon,
  LinkIcon,
  XMarkIcon,
} from "@heroicons/react/20/solid";
import { getTimeAgo } from "@/lib/utils";
import { Dataset } from "@/schemas/dataset.interface";
import { RiExternalLinkLine } from "react-icons/ri";
import { useEffect, useRef, useState } from "react";
import MarkdownRenderer from "@/components/_shared/MarkdownRenderer";
import { generateMockDoi } from "@/lib/doi";
import { url as siteUrl } from "@/next-seo.config";
import { getBrowserOrigin, getDatasetStablePath } from "@/lib/dataset-links";
import { formatDatasetCitation } from "@/lib/citation";
import { formatDatasetApiSnippet } from "@/lib/api-access";

function uniqueFormat(resources) {
  const formats = resources.map((item: Resource) => item.format);
  return [...new Set(formats)];
}

export default function DatasetInfo({
  dataset,
}: {
  dataset: Dataset;
}) {
  const citationStyles = [
    { id: "apa", label: "APA" },
    { id: "bibtex", label: "BibTeX" },
  ] as const;
  const accessStyles = [
    { id: "curl", label: "curl" },
    { id: "python", label: "Python" },
    { id: "r", label: "R" },
  ] as const;
  const [isTruncated, setIsTruncated] = useState(false);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [isUsePanelOpen, setIsUsePanelOpen] = useState(false);
  const [activeModal, setActiveModal] = useState<null | "stable-url" | "citation" | "api-access">(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [citationStyle, setCitationStyle] =
    useState<(typeof citationStyles)[number]["id"]>("apa");
  const [accessStyle, setAccessStyle] =
    useState<(typeof accessStyles)[number]["id"]>("curl");
  const textRef = useRef<HTMLParagraphElement>(null);
  const usePanelRef = useRef<HTMLDivElement>(null);
  const datasetLicense = dataset.license_title;
  const datasetDoi = generateMockDoi(dataset.name);
  const datasetDoiUrl = `https://doi.org/${datasetDoi}`;
  const datasetUrl = `${getBrowserOrigin(
    typeof window !== "undefined" ? window : undefined,
    siteUrl
  )}${getDatasetStablePath(dataset)}`;
  const apiBaseUrl = process.env.NEXT_PUBLIC_DMS || siteUrl;
  const datasetCitation = formatDatasetCitation(dataset, {
    style: citationStyle,
    stableUrl: datasetUrl,
    doi: datasetDoi,
  });
  const primaryDownloadUrl = dataset.resources?.[0]?.url;
  const datasetAccessSnippet = formatDatasetApiSnippet(dataset, {
    style: accessStyle,
    apiBaseUrl,
  });

  const description =
    dataset.notes?.replace(/<\/?[^>]+(>|$)/g, "") || "No description";

  const metaFormats = [
    { format: "jsonld", label: "JSON-LD" },
    { format: "rdf", label: "RDF" },
    { format: "ttl", label: "TTL" },
  ];

  useEffect(() => {
    const el = textRef.current;
    if (el) {
      requestAnimationFrame(() => {
        setIsTruncated(el.scrollHeight > el.clientHeight);
      });
    }
  }, [dataset.notes]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        usePanelRef.current &&
        !usePanelRef.current.contains(event.target as Node)
      ) {
        setIsUsePanelOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const copyValue = async (label: string, value?: string) => {
    if (!value) return;

    try {
      await navigator.clipboard.writeText(value);
      setCopiedField(label);
      window.setTimeout(() => setCopiedField(null), 2000);
    } catch (error) {
      console.error(`Failed to copy ${label}`, error);
    }
  };

  return (
    <div className="flex flex-col">
      <div className="mb-6 w-full" ref={usePanelRef}>
        <div className="relative w-full">
          <button
            type="button"
            onClick={() => setIsUsePanelOpen((open) => !open)}
            className="inline-flex w-full items-center justify-between gap-2 rounded-xl bg-accent px-4 py-3 text-sm font-semibold text-white transition hover:bg-darkaccent"
          >
            <span className="inline-flex items-center gap-2">
              <BeakerIcon className="h-4 w-4" />
              Use this dataset
            </span>
            <DropdownChevronDownIcon className="h-4 w-4" />
          </button>
          {isUsePanelOpen ? (
            <div className="absolute left-0 top-full z-20 mt-2 w-full overflow-hidden rounded-2xl border border-slate-200 bg-white py-2 shadow-xl">
              {primaryDownloadUrl ? (
                <Link
                  href={primaryDownloadUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex w-full items-center gap-3 px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                >
                  <ArrowDownTrayIcon className="h-4 w-4 text-slate-400" />
                  Download dataset
                </Link>
              ) : null}
              <button
                type="button"
                onClick={() => {
                  setActiveModal("api-access");
                  setIsUsePanelOpen(false);
                }}
                className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm font-medium text-slate-700 transition hover:bg-slate-50"
              >
                <CommandLineIcon className="h-4 w-4 text-slate-400" />
                API access
              </button>
              <button
                type="button"
                onClick={() => {
                  setActiveModal("citation");
                  setIsUsePanelOpen(false);
                }}
                className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm font-medium text-slate-700 transition hover:bg-slate-50"
              >
                <AcademicCapIcon className="h-4 w-4 text-slate-400" />
                Cite this dataset
              </button>
              <button
                type="button"
                onClick={() => {
                  copyValue("doi", datasetDoi);
                  setIsUsePanelOpen(false);
                }}
                className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm font-medium text-slate-700 transition hover:bg-slate-50"
              >
                <FingerPrintIcon className="h-4 w-4 text-slate-400" />
                {copiedField === "doi" ? "DOI copied" : "Copy DOI"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setActiveModal("stable-url");
                  setIsUsePanelOpen(false);
                }}
                className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm font-medium text-slate-700 transition hover:bg-slate-50"
              >
                <LinkIcon className="h-4 w-4 text-slate-400" />
                Show stable URL
              </button>
            </div>
          ) : null}
        </div>
      </div>
      <Dialog
        open={activeModal === "stable-url"}
        onClose={() => setActiveModal(null)}
        className="relative z-[1200]"
      >
        <div className="fixed inset-0 z-[1200] bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 z-[1210] flex items-center justify-center p-4">
          <Dialog.Panel className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <Dialog.Title className="text-lg font-semibold text-zinc-900">
                  Stable URL
                </Dialog.Title>
                <p className="mt-1 text-sm text-stone-500">
                  Use this persistent dataset URL for sharing and referencing. Stable access like this supports the FAIR principles, especially making research outputs more findable and accessible.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="rounded-lg p-2 text-stone-500 transition hover:bg-stone-100 hover:text-stone-700"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>
            <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-4">
              <div className="break-all text-sm text-slate-700">{datasetUrl}</div>
            </div>
            <div className="mt-4 flex gap-2">
              <button
                type="button"
                onClick={() => copyValue("stable-url", datasetUrl)}
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-accent hover:text-accent"
              >
                <ClipboardDocumentIcon className="h-4 w-4" />
                {copiedField === "stable-url" ? "Copied" : "Copy stable URL"}
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
      <Dialog
        open={activeModal === "api-access"}
        onClose={() => setActiveModal(null)}
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
                  Use one of these starter snippets to access this dataset programmatically.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setActiveModal(null)}
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
                <code>{datasetAccessSnippet}</code>
              </pre>
            </div>
            <div className="mt-4 flex gap-2">
              <button
                type="button"
                onClick={() => copyValue("api-access", datasetAccessSnippet)}
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-accent hover:text-accent"
              >
                <ClipboardDocumentIcon className="h-4 w-4" />
                {copiedField === "api-access" ? "Copied" : "Copy snippet"}
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
      <Dialog
        open={activeModal === "citation"}
        onClose={() => setActiveModal(null)}
        className="relative z-[1200]"
      >
        <div className="fixed inset-0 z-[1200] bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 z-[1210] flex items-center justify-center p-4">
          <Dialog.Panel className="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <Dialog.Title className="text-lg font-semibold text-zinc-900">
                  Cite this dataset
                </Dialog.Title>
                <p className="mt-1 text-sm text-stone-500">
                  Choose a citation format and copy a ready-to-use reference generated from this dataset&apos;s metadata.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="rounded-lg p-2 text-stone-500 transition hover:bg-stone-100 hover:text-stone-700"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {citationStyles.map((style) => (
                <button
                  key={style.id}
                  type="button"
                  onClick={() => setCitationStyle(style.id)}
                  className={`rounded-full border px-3 py-1.5 text-sm font-medium transition ${
                    citationStyle === style.id
                      ? "border-accent bg-accent/10 text-accent"
                      : "border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50"
                  }`}
                >
                  {style.label}
                </button>
              ))}
            </div>
            <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-4">
              <div className="whitespace-pre-wrap break-words text-sm text-slate-700">
                {datasetCitation}
              </div>
            </div>
            <div className="mt-4 flex gap-2">
              <button
                type="button"
                onClick={() => copyValue("citation", datasetCitation)}
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-accent hover:text-accent"
              >
                <ClipboardDocumentIcon className="h-4 w-4" />
                {copiedField === "citation" ? "Copied" : "Copy citation"}
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
      <div className="flex flex-col gap-y-3">
        {dataset.type === "visualization" && !!dataset.external_url && (
          <a
            href={dataset.external_url}
            className={`font-medium flex items-center gap-1 text-accent`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <RiExternalLinkLine className="w-5 h-5" />
            Access Visualization
          </a>
        )}
        {!!dataset.resources.length && (
          <span className="font-medium text-gray-500 inline">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-5 h-5 text-accent inline mr-1"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.75 9.776c.112-.017.227-.026.344-.026h15.812c.117 0 .232.009.344.026m-16.5 0a2.25 2.25 0 00-1.883 2.542l.857 6a2.25 2.25 0 002.227 1.932H19.05a2.25 2.25 0 002.227-1.932l.857-6a2.25 2.25 0 00-1.883-2.542m-16.5 0V6A2.25 2.25 0 016 3.75h3.879a1.5 1.5 0 011.06.44l2.122 2.12a1.5 1.5 0 001.06.44H18A2.25 2.25 0 0120.25 9v.776"
              />
            </svg>
            Files: {dataset.resources.length}
          </span>
        )}

        {!!dataset.resources.length && (
          <span className="font-medium text-gray-500 inline">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="h-5 w-5 text-accent inline mr-1"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M7.5 3.75H6A2.25 2.25 0 003.75 6v1.5M16.5 3.75H18A2.25 2.25 0 0120.25 6v1.5m0 9V18A2.25 2.25 0 0118 20.25h-1.5m-9 0H6A2.25 2.25 0 013.75 18v-1.5M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            Formats: {uniqueFormat(dataset.resources).join(", ")}
          </span>
        )}
        <span className="font-medium text-gray-500 inline">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-5 h-5 text-accent inline mr-1"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5m-9-6h.008v.008H12v-.008zM12 15h.008v.008H12V15zm0 2.25h.008v.008H12v-.008zM9.75 15h.008v.008H9.75V15zm0 2.25h.008v.008H9.75v-.008zM7.5 15h.008v.008H7.5V15zm0 2.25h.008v.008H7.5v-.008zm6.75-4.5h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V15zm0 2.25h.008v.008h-.008v-.008zm2.25-4.5h.008v.008H16.5v-.008zm0 2.25h.008v.008H16.5V15z"
            />
          </svg>
          Created:{" "}
          {dataset.metadata_created && getTimeAgo(dataset.metadata_created)}
        </span>
        <div className="font-medium text-gray-500">
          <div className="flex items-start gap-1">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-5 h-5 text-accent inline-block mt-0.5 flex-shrink-0"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 7.5h6M9 12h6m-6 4.5h3m-6.75 3h10.5A2.25 2.25 0 0 0 18 17.25V6.75A2.25 2.25 0 0 0 15.75 4.5H8.25A2.25 2.25 0 0 0 6 6.75v10.5A2.25 2.25 0 0 0 8.25 19.5Z"
              />
            </svg>
            <div className="flex flex-col gap-1 min-w-0">
              <span>DOI:</span>
              <a
                href={datasetDoiUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent hover:text-darkaccent flex items-center gap-1 break-all transition"
              >
                <RiExternalLinkLine className="w-4 h-4 flex-shrink-0" />
                <span className="underline">{datasetDoi}</span>
              </a>
            </div>
          </div>
        </div>
        {dataset.source && dataset.source.length > 0 && (
          <div className="font-medium text-gray-500">
            <div className="flex items-start gap-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-5 h-5 text-accent inline-block mt-0.5 flex-shrink-0"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244"
                />
              </svg>
              <div className="flex flex-col gap-1">
                <span>Source{dataset.source.length > 1 ? "s" : ""}:</span>
                <div className="flex flex-col gap-1.5">
                  {dataset.source.map((url, index) => (
                    <a
                      key={index}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-accent hover:text-darkaccent flex items-center gap-1 break-all transition"
                    >
                      <RiExternalLinkLine className="w-4 h-4 flex-shrink-0" />
                      <span className="underline">{url}</span>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
        {datasetLicense && (
          <div className="font-medium text-gray-500">
            <div className="flex items-start gap-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-5 h-5 text-accent inline-block mt-0.5 flex-shrink-0"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 12.75 11.25 15 15 9.75m5.25 2.25a8.25 8.25 0 11-16.5 0 8.25 8.25 0 0116.5 0Z"
                />
              </svg>
              <div className="flex flex-col gap-1">
                <span>License:</span>
                {dataset.license_url ? (
                  <a
                    href={dataset.license_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-accent hover:text-darkaccent flex items-center gap-1 break-all transition"
                  >
                    <RiExternalLinkLine className="w-4 h-4 flex-shrink-0" />
                    <span className="underline">{datasetLicense}</span>
                  </a>
                ) : (
                  <span>{datasetLicense}</span>
                )}
              </div>
            </div>
          </div>
        )}
        <span className="font-medium text-gray-500 inline">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="h-5 w-5 text-accent inline mr-1"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          Updated:{" "}
          {dataset.metadata_modified && getTimeAgo(dataset.metadata_modified)}
        </span>
      </div>
      <div className="py-4 my-4 border-y">
        <div
          ref={textRef}
          className={`text-sm font-normal text-stone-500 transition-all ${
            !showFullDescription ? "line-clamp-4" : ""
          }`}
        >
          <MarkdownRenderer content={description} />
        </div>
        {isTruncated && (
          <button
            onClick={() => setShowFullDescription(!showFullDescription)}
            className="mt-2 border-b border-accent text-stone-500 hover:text-accent"
          >
            {showFullDescription ? (
              <span className="flex items-center">
                Read less <ChevronUpIcon className="text-accent w-4" />
              </span>
            ) : (
              <span className="flex items-center">
                Read more <ChevronDownIcon className="text-accent w-4" />
              </span>
            )}
          </button>
        )}
      </div>
      <div className="flex flex-wrap gap-1">
        {dataset.tags?.map((tag: Tag) => (
          <span
            className="bg-accent px-4 py-1 rounded-full text-white"
            key={tag.id}
          >
            {tag.display_name}
          </span>
        ))}
      </div>
      <span className="mt-4 font-medium text-gray-500 inline">
        <div className="flex flex-wrap gap-x-2 items-center">
          <div>Export metadata as: </div>
          {metaFormats.map((item) => (
            <div key={item.format}>
              <Link
                href={`${process.env.NEXT_PUBLIC_DMS}/dataset/${dataset.name}.${item.format}`}
                className="font-semibold group flex gap-0.5 hover:text-darkaccent"
              >
                <div className="text-accent group-hover:text-darkaccent transition flex items-center justify-center">
                  <ArrowDownTrayIcon className="h-4 w-4" />
                </div>
                <div className="uppercase">{item.label}</div>
              </Link>
            </div>
          ))}
        </div>
      </span>
    </div>
  );
}
