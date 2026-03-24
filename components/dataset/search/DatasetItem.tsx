import Link from "next/link";
import { Dataset } from "@portaljs/ckan";
import ResourcesBadges from "../_shared/ResourcesBadges";
import {
  RiMapPinTimeLine,
  RiOrganizationChart,
  RiPriceTagLine,
} from "react-icons/ri";
import { getTimeAgo } from "@/lib/utils";
import { useTheme } from "@/components/theme/theme-provider";
import { generateMockDoi } from "@/lib/doi";
import { cn } from "@/lib/utils";

export default function DatasetItem({
  dataset,
  showOrg = true,
  className,
}: {
  dataset: Dataset;
  showOrg?: boolean;
  className?: string;
}) {
  const {
    theme: { styles },
  } = useTheme();
  const datasetDoi = generateMockDoi(dataset.name);

  return (
    <Link
      href={`/@${dataset.organization.name}/${dataset.name}`}
      className={cn(
        `flex items-start gap-4 hover:bg-white hover:shadow-lg transition-all p-4 rounded-[10px] ${styles.shadowMd}`,
        className
      )}
    >
      <span className="min-w-[5px] min-h-[5px] bg-accent rounded-full mt-3 hidden"></span>
      <div className="w-full">
        <div className="text-lg font-semibold text-gray-900">
          {dataset.title}
        </div>
        <div className="mb-2 mt-1 text-xs text-slate-500">
          <span className="mr-1 font-semibold uppercase tracking-[0.12em] text-slate-400">
            DOI
          </span>
          <code className="rounded bg-slate-100 px-2 py-1 text-[11px] text-slate-700">
            {datasetDoi}
          </code>
        </div>

        <p className="text-sm font-normal  mb-2 line-clamp-2  overflow-y-hidden mb-1">
          {dataset.notes?.replace(/<\/?[^>]+(>|$)/g, "") || "No description"}
        </p>
        <div className="text-sm flex gap-2 flex-col md:flex-row md:flex-wrap">
          <div className="flex items-center gap-2 ">
            <RiOrganizationChart className="text-accent" />
            <span className=" text-gray-500">{dataset.organization.title}</span>
          </div>
          <div className="flex items-center gap-2 ">
            <RiMapPinTimeLine className="text-accent" />
            <span className=" text-gray-500">
              {dataset.metadata_modified &&
                getTimeAgo(dataset.metadata_modified)}
            </span>
          </div>
          {!!dataset.tags?.length && (
            <div className="flex items-center gap-2 ">
              <RiPriceTagLine className="text-accent" />
              <span className="text-gray-500 line-clamp-1">
                {dataset.tags.map((t) => t.display_name).join(", ")}
              </span>
            </div>
          )}
        </div>
        <div className="mt-2">
          <ResourcesBadges resources={dataset.resources} />
        </div>
      </div>
    </Link>
  );
}
