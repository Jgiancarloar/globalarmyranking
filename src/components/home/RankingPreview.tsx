
import Link from "next/link";
import { ArrowRight, Trophy } from "lucide-react";

import { createClient } from "@/lib/supabase/server";

type Props = {
  locale: string;
};

type CountryRow = {
  code: string;
  name_en: string;
  name_es: string;
  flag_emoji: string;
};

type CountryAggregate = {
  country_code: string;
  total_votes: number | string;
  total_members: number | string;
};

type RankedCountry = {
  code: string;
  name_en: string;
  name_es: string;
  flag_emoji: string;
  slug: string;
  votes: number;
  members: number;
};

function slugify(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function formatVotes(value: number, locale: string) {
  return new Intl.NumberFormat(
    locale === "es" ? "es-PE" : "en-US",
  ).format(value);
}

async function getTopCountries(): Promise<RankedCountry[]> {
  const supabase = await createClient();

  const [
    { data: countryData, error: countriesError },
    { data: aggregateData, error: aggregateError },
  ] = await Promise.all([
    supabase
      .from("countries")
      .select("code, name_en, name_es, flag_emoji")
      .eq("is_active", true),

    supabase.rpc("get_global_country_ranking"),
  ]);

  if (countriesError) {
    console.error(
      "Error loading preview countries:",
      countriesError,
    );
  }

  if (aggregateError) {
    console.error(
      "Error loading preview ranking:",
      aggregateError,
    );
  }

  if (countriesError || aggregateError) {
    return [];
  }

  const countryRows = (countryData ?? []) as CountryRow[];
  const aggregates = (aggregateData ?? []) as CountryAggregate[];

  const aggregateByCode = new Map(
    aggregates.map((item) => [
      item.country_code,
      {
        votes: Number(item.total_votes) || 0,
        members: Number(item.total_members) || 0,
      },
    ]),
  );

  return countryRows
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
    )
    .slice(0, 10);
}

export default async function RankingPreview({ locale }: Props) {
  const isSpanish = locale === "es";
  const countries = await getTopCountries();

  return (
    <section
      id="ranking-preview"
      className="px-5 py-24 sm:px-8 lg:px-12"
    >
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-violet-300">
              {isSpanish
                ? "La competencia global"
                : "The global competition"}
            </p>

            <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
              {isSpanish
                ? "¿Quién lidera el mundo?"
                : "Who's leading the world?"}
            </h2>

            <p className="mt-3 max-w-xl text-sm leading-7 text-white/50 sm:text-base">
              {isSpanish
                ? "Descubre cómo se posicionan las comunidades ARMY de cada país."
                : "Discover how ARMY communities around the world are ranking."}
            </p>
          </div>

          <Link
            href={`/${locale}/ranking`}
            className="inline-flex items-center gap-2 self-start text-sm font-semibold text-violet-300 transition hover:text-violet-200 sm:self-auto"
          >
            {isSpanish
              ? "Ver ranking completo"
              : "View full ranking"}
            <ArrowRight size={17} />
          </Link>
        </div>

        <div className="mt-10 overflow-hidden rounded-2xl border border-white/10 bg-[#100d19]">
          <div className="flex items-center justify-between border-b border-white/[0.07] px-5 py-4 sm:px-7">
            <span className="text-sm font-semibold">
              {isSpanish ? "Países destacados" : "Top countries"}
            </span>

            <span className="text-xs text-amber-300">
              <Trophy size={14} className="mr-1 inline" />
              Top 10
            </span>
          </div>

          {countries.length > 0 ? (
            countries.map((country, index) => (
              <Link
                key={country.code}
                href={`/${locale}/ranking/${country.slug}`}
                className="group flex items-center gap-3 border-b border-white/[0.06] px-4 py-5 transition last:border-0 hover:bg-white/[0.035] sm:gap-4 sm:px-7"
              >
                <span
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-sm font-bold ${
                    index === 0
                      ? "bg-amber-300/15 text-amber-200"
                      : index === 1
                        ? "bg-slate-300/10 text-slate-200"
                        : index === 2
                          ? "bg-orange-300/10 text-orange-200"
                          : "bg-white/[0.05] text-white/45"
                  }`}
                >
                  {index + 1}
                </span>

                <span
                  className="shrink-0 text-2xl"
                  role="img"
                  aria-label={
                    isSpanish ? country.name_es : country.name_en
                  }
                >
                  {country.flag_emoji}
                </span>

                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-semibold sm:text-base">
                    {isSpanish ? country.name_es : country.name_en}
                  </span>

                  <span className="mt-1 block text-xs text-white/40">
                    {formatVotes(country.members, locale)}{" "}
                    {isSpanish ? "miembros" : "members"}
                  </span>
                </span>

                <span className="shrink-0 text-right">
                  <span className="block text-sm font-bold tabular-nums">
                    {formatVotes(country.votes, locale)}
                  </span>

                  <span className="mt-1 block text-xs text-white/40">
                    {isSpanish ? "votos" : "votes"}
                  </span>
                </span>

                <ArrowRight
                  size={16}
                  className="hidden shrink-0 text-white/30 transition group-hover:translate-x-1 group-hover:text-violet-300 sm:block"
                />
              </Link>
            ))
          ) : (
            <div className="px-6 py-12 text-center">
              <Trophy
                size={28}
                className="mx-auto text-violet-300"
              />

              <p className="mt-4 text-sm font-semibold">
                {isSpanish
                  ? "El ranking no está disponible por ahora"
                  : "The ranking is unavailable right now"}
              </p>

              <p className="mt-2 text-xs text-white/45">
                {isSpanish
                  ? "Inténtalo de nuevo en unos momentos."
                  : "Please try again in a moment."}
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
