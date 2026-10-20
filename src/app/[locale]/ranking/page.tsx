import { Suspense } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Trophy } from "lucide-react";

import { isLocale } from "@/i18n/config";
import { createClient } from "@/lib/supabase/server";
import type {
  RankedCountry,
  RankingStats,
} from "@/lib/ranking-types";

import CountryPodium from "@/components/ranking/CountryPodium";
import CountryList from "@/components/ranking/CountryList";
import CountryStats from "@/components/ranking/CountryStats";

type Props = {
  params: Promise<{ locale: string }>;
};

type CountryRow = {
  code: string;
  name_en: string;
  name_es: string;
  flag_emoji: string;
  is_active: boolean;
};

type CountryAggregate = {
  country_code: string;
  total_votes: number | string;
  total_members: number | string;
};

function slugify(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export async function generateMetadata({
  params,
}: Props): Promise<Metadata> {
  const { locale } = await params;

  return {
    title:
      locale === "es"
        ? "Ranking global"
        : "Global ranking",
  };
}

async function getGlobalRanking(): Promise<{
  countries: RankedCountry[];
  stats: RankingStats;
}> {
  const supabase = await createClient();

  const [
    { data: countryData, error: countriesError },
    { data: aggregateData, error: aggregateError },
  ] = await Promise.all([
    supabase
      .from("countries")
      .select("code, name_en, name_es, flag_emoji, is_active")
      .eq("is_active", true),

    supabase.rpc("get_global_country_ranking"),
  ]);

  if (countriesError) {
    console.error(
      "Error loading ranking countries:",
      countriesError,
    );
  }

  if (aggregateError) {
    console.error(
      "Error loading global ranking:",
      aggregateError,
    );
  }

  const countryRows = (countryData ?? []) as CountryRow[];

  const aggregates = (
    aggregateError ? [] : aggregateData ?? []
  ) as CountryAggregate[];

  const aggregateByCode = new Map(
    aggregates.map((item) => [
      item.country_code,
      {
        votes: Number(item.total_votes) || 0,
        members: Number(item.total_members) || 0,
      },
    ]),
  );

  const countries: RankedCountry[] = countryRows
    .map((country) => {
      const aggregate = aggregateByCode.get(country.code);

      return {
        code: country.code,
        name_en: country.name_en,
        name_es: country.name_es,
        flag_emoji: country.flag_emoji,
        slug: slugify(country.name_en),
        votes: aggregate?.votes ?? 0,
        members: aggregate?.members ?? 0,
      };
    })
    .sort(
      (a, b) =>
        b.votes - a.votes ||
        b.members - a.members ||
        a.name_en.localeCompare(b.name_en),
    );

  const participatingCountries = countries.filter(
    (country) => country.members > 0,
  );

  const stats: RankingStats = {
    countries: participatingCountries.length,
    votes: countries.reduce(
      (total, country) => total + country.votes,
      0,
    ),
    members: countries.reduce(
      (total, country) => total + country.members,
      0,
    ),
    leader:
      countries.find((country) => country.votes > 0) ?? null,
  };

  return { countries, stats };
}

async function RankingContent({ params }: Props) {
  const { locale } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  const isSpanish = locale === "es";
  const { countries, stats } = await getGlobalRanking();

  return (
    <div
      id="ranking-page-top"
      className="min-h-screen scroll-mt-[76px] px-5 pb-24 pt-16 sm:px-8 lg:px-12"
    >
      <div className="mx-auto max-w-7xl">
        <header className="max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-violet-300/20 bg-violet-400/10 px-3 py-2 text-xs font-medium text-violet-200">
            <Trophy size={14} />

            {isSpanish
              ? "La clasificación mundial"
              : "The world leaderboard"}
          </div>

          <h1 className="mt-6 text-4xl font-bold tracking-tight sm:text-6xl">
            {isSpanish ? "Ranking " : "Global "}

            <span className="text-violet-300">
              {isSpanish ? "global" : "ranking"}
            </span>
          </h1>

          <p className="mt-5 max-w-2xl text-sm leading-7 text-white/55 sm:text-base">
            {isSpanish
              ? "Explora las comunidades ARMY de todo el mundo y descubre qué países lideran la clasificación."
              : "Explore ARMY communities around the world and discover which countries lead the leaderboard."}
          </p>
        </header>

        <section className="mt-10">
          <CountryStats
            locale={locale}
            stats={stats}
          />
        </section>

        <section className="mt-16">
          <div className="mb-8">
            <p className="text-sm font-medium uppercase tracking-[0.18em] text-violet-300">
              {isSpanish ? "Los líderes" : "The leaders"}
            </p>

            <h2 className="mt-2 text-2xl font-bold sm:text-3xl">
              {isSpanish
                ? "El podio global"
                : "The global podium"}
            </h2>
          </div>

          <CountryPodium
            locale={locale}
            countries={countries}
          />
        </section>

        <section className="mt-16">
          <div className="mb-7">
            <p className="text-sm font-medium uppercase tracking-[0.18em] text-violet-300">
              {isSpanish
                ? "Clasificación completa"
                : "Full leaderboard"}
            </p>

            <h2 className="mt-2 text-2xl font-bold sm:text-3xl">
              {isSpanish
                ? "Todos los países"
                : "All countries"}
            </h2>
          </div>

          <CountryList
            locale={locale}
            countries={countries}
          />
        </section>
      </div>
    </div>
  );
}

function RankingFallback() {
  return (
    <div
      className="min-h-screen animate-pulse bg-[#090710]"
      aria-hidden="true"
    />
  );
}

export default function RankingPage({ params }: Props) {
  return (
    <Suspense fallback={<RankingFallback />}>
      <RankingContent params={params} />
    </Suspense>
  );
}
