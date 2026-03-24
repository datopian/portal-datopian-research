import type { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from "next";
import { serialize } from "next-mdx-remote/serialize";
import { MDXRemote, type MDXRemoteSerializeResult } from "next-mdx-remote";
import Layout from "@/components/_shared/Layout";
import Chart from "@/components/stories/Chart";
import { getAllStories, getStorySource, type StoryMeta } from "@/lib/stories";
import Link from "next/link";

import * as greatDecouplingCovers from "../../content/stories/great-decoupling.cover";
import * as biologyCovers from "../../content/stories/biology-got-cheap-medicine-didnt.cover";

// MDX v3 strips JSX props that reference undeclared variables at compile time,
// so scope injection does not work. Instead, we pass story-specific chart
// components via the `components` prop, which MDX properly supports.
const STORY_COMPONENTS: Record<string, Record<string, React.FC<{ title?: string }>>> = {
  "great-decoupling": {
    CoverChart: ({ title = "" }) => (
      <Chart
        title={title}
        csvUrl={greatDecouplingCovers.coverCsvUrl}
        spec={greatDecouplingCovers.coverSpec}
      />
    ),
    TemperatureChart: ({ title = "" }) => (
      <Chart
        title={title}
        csvUrl={greatDecouplingCovers.temperatureCsvUrl}
        spec={greatDecouplingCovers.temperatureSpec}
      />
    ),
    EmittersChart: ({ title = "" }) => (
      <Chart
        title={title}
        csvUrl={greatDecouplingCovers.emittersCsvUrl}
        spec={greatDecouplingCovers.emittersSpec}
      />
    ),
  },
  "biology-got-cheap-medicine-didnt": {
    CoverChart: ({ title = "" }) => (
      <Chart
        title={title}
        csvUrl={biologyCovers.coverCsvUrl}
        spec={biologyCovers.coverSpec}
      />
    ),
    PharmaChart: ({ title = "" }) => (
      <Chart
        title={title}
        csvUrl={biologyCovers.pharmaCsvUrl}
        spec={biologyCovers.pharmaSpec}
      />
    ),
  },
};

export const getStaticPaths: GetStaticPaths = async () => {
  const stories = getAllStories();
  return {
    paths: stories.map((s) => ({ params: { slug: s.slug } })),
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const slug = params?.slug as string;
  const { content, frontmatter } = getStorySource(slug);
  const mdxSource = await serialize(content);
  return {
    props: { mdxSource, frontmatter, slug },
  };
};

function formatDate(dateStr: string): string {
  const [year, month, day] = dateStr.split("-").map(Number);
  return new Date(year, month - 1, day).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export default function StoryPage({
  mdxSource,
  frontmatter,
  slug,
}: InferGetStaticPropsType<typeof getStaticProps> & {
  mdxSource: MDXRemoteSerializeResult;
  frontmatter: StoryMeta;
  slug: string;
}) {
  const storyComponents = STORY_COMPONENTS[slug] ?? {};

  return (
    <Layout>
      <div className="custom-container mx-auto py-12">
        <div className="max-w-3xl mx-auto">
          <nav className="flex items-center gap-1.5 text-sm text-gray-400 mb-6">
            <Link href="/" className="hover:text-gray-600 transition-colors">Home</Link>
            <span>/</span>
            <Link href="/stories" className="hover:text-gray-600 transition-colors">Reports</Link>
            <span>/</span>
            <span className="text-gray-600 truncate">{frontmatter.title}</span>
          </nav>
          <p className="text-sm text-gray-400 mb-3">{formatDate(frontmatter.date)}</p>
          <h1 className="text-4xl font-black text-gray-900 leading-tight mb-4">
            {frontmatter.title}
          </h1>
          <p className="text-lg text-gray-500 mb-10 pb-10 border-b border-gray-100">
            {frontmatter.description}
          </p>

          <article className="prose prose-gray max-w-none prose-headings:font-black prose-a:text-accent">
            <MDXRemote {...mdxSource} components={storyComponents} />
          </article>

          {frontmatter.relatedDatasets?.length > 0 && (
            <div className="mt-16 pt-8 border-t border-gray-100">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Related Datasets</h2>
              <div className="flex flex-col gap-3">
                {frontmatter.relatedDatasets.map((slug) => (
                  <Link
                    key={slug}
                    href={`/@datopian-research/${slug}`}
                    className="flex items-center justify-between px-4 py-3 rounded-xl border border-gray-200 hover:border-accent hover:bg-accent-50 transition-colors group"
                  >
                    <span className="text-sm font-medium text-gray-700 group-hover:text-accent">
                      {slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
                    </span>
                    <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="text-gray-400 group-hover:text-accent">
                      <path d="M9 18l6-6-6-6" />
                    </svg>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
