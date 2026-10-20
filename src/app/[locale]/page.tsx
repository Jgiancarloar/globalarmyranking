
import { Suspense } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { isLocale } from "@/i18n/config";
import Hero from "@/components/home/Hero";
import RankingPreview from "@/components/home/RankingPreview";
import HowItWorks from "@/components/home/HowItWorks";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({
  params,
}: Props): Promise<Metadata> {
  const { locale } = await params;

  return {
    title:
      locale === "es"
        ? "Ranking mundial de ARMY"
        : "Global ARMY Ranking",
  };
}

function HomeFallback() {
  return (
    <div className="min-h-screen animate-pulse bg-[#090710]" />
  );
}

async function HomeContent({ params }: Props) {
  const { locale } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  return (
    <>
      <Suspense fallback={<HomeFallback />}>
        <Hero locale={locale} />
      </Suspense>

      <Suspense fallback={<HomeFallback />}>
        <RankingPreview locale={locale} />
      </Suspense>

      <HowItWorks locale={locale} />
    </>
  );
}

export default function HomePage({ params }: Props) {
  return (
    <Suspense fallback={<HomeFallback />}>
      <HomeContent params={params} />
    </Suspense>
  );
}
