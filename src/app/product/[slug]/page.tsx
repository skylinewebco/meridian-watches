import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getWatch, watches } from "@/lib/products";
import { ProductDetail } from "@/components/product/ProductDetail";

export function generateStaticParams() {
  return watches.map((w) => ({ slug: w.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const watch = getWatch(slug);
  if (!watch) return { title: "Not found — MERIDIAN" };
  return {
    title: `${watch.name} — MERIDIAN`,
    description: watch.description,
  };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const watch = getWatch(slug);
  if (!watch) notFound();
  return <ProductDetail watch={watch} />;
}
