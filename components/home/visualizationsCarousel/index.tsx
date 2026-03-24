import Link from "next/link";
import type { Dataset } from "@/schemas/dataset.interface";
import DatasetItem from "@/components/dataset/search/DatasetItem";

export default function FeaturedDataSection({
  datasets,
}: {
  datasets: Dataset[];
}) {
  if (!datasets.length) return null;

  return (
    <div className="custom-container mx-auto py-10">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h2 className="text-2xl font-black text-gray-900">Featured Data</h2>
          <p className="mt-1 text-sm text-gray-500">
            Explore highlighted datasets from the main catalog.
          </p>
        </div>
        <Link
          href="/search"
          className="text-sm font-semibold text-accent hover:text-accent-600 flex items-center gap-1 transition-colors shrink-0"
        >
          View all datasets
          <svg
            width="14"
            height="14"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path d="M9 18l6-6-6-6" />
          </svg>
        </Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {datasets.slice(0, 4).map((dataset) => (
          <div key={dataset.id} className="h-full">
            <DatasetItem dataset={dataset} className="h-full" />
          </div>
        ))}
      </div>
    </div>
  );
}
