import Image from "next/image";
import Link from "next/link";
import {
  ArrowDown,
  ArrowRight,
  Crown,
  Globe2,
  Medal,
  Sparkles,
} from "lucide-react";

import { createClient } from "@/lib/supabase/server";

type HeroProps = {
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

type HeroCountry = {
  code: string;
  name_en: string;
  name_es: string;
  flag_emoji: string;
  slug: string;
  votes: number;
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

async function getHeroRanking(): Promise<HeroCountry[]> {
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
    console.error("Error loading hero countries:", countriesError);
  }

  if (aggregateError) {
    console.error("Error loading hero ranking:", aggregateError);
  }

  if (countriesError || aggregateError) {
    return [];
  }

  const countries = (countryData ?? []) as CountryRow[];
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

  return countries
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
    .filter((country) => country.votes > 0)
    .sort(
      (a, b) =>
        b.votes - a.votes ||
        b.members - a.members ||
        a.name_en.localeCompare(b.name_en),
    )
    .slice(0, 3);
}

export default async function Hero({ locale }: HeroProps) {
  const isSpanish = locale === "es";
  const countries = await getHeroRanking();

  const podiumOrder =
    countries.length >= 3
      ? [
          { country: countries[1], position: 2 },
          { country: countries[0], position: 1 },
          { country: countries[2], position: 3 },
        ]
      : countries.map((country, index) => ({
          country,
          position: index + 1,
        }));

  return (
    <section className="relative isolate overflow-hidden">
      <div className="absolute inset-0 -z-20 bg-[#090710]" />

      <div className="absolute inset-0 -z-10">
        <Image
          src="/images/global-army-hero.png"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-center opacity-45"
        />

        <div className="absolute inset-0 bg-gradient-to-r from-[#090710] via-[#090710]/75 to-[#090710]/35" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#090710] via-transparent to-[#090710]/35" />
      </div>

      <div className="mx-auto grid min-h-[690px] max-w-7xl items-center gap-12 px-5 py-20 sm:px-8 lg:min-h-[760px] lg:grid-cols-[1.1fr_0.9fr] lg:px-12">
        <div className="max-w-2xl">
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-violet-300/20 bg-violet-400/10 px-4 py-2 text-sm text-violet-200">
            <Sparkles size={15} />
            {isSpanish ? "Un fandom. Un mundo." : "One fandom. One world."}
          </div>

          <h1 className="text-5xl font-bold leading-[1.06] tracking-tight sm:text-6xl lg:text-7xl">
            {isSpanish ? "El mundo " : "The world "}

            <span className="bg-gradient-to-r from-violet-200 via-purple-300 to-fuchsia-400 bg-clip-text text-transparent">
              {isSpanish ? "de ARMY" : "of ARMY"}
            </span>

            <br />
            {isSpanish ? "se une aquí." : "unites here."}
          </h1>

          <p className="mt-7 max-w-xl text-base leading-8 text-white/65 sm:text-lg">
            {isSpanish
              ? "Descubre qué países lideran la comunidad global de BTS. Apoya al tuyo, suma tu voz y forma parte de algo mundial."
              : "Discover which countries lead the global BTS community. Support yours, make your voice count, and be part of something worldwide."}
          </p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Link
              href={`/${locale}/ranking`}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-violet-500 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-violet-400"
            >
              {isSpanish ? "Explorar ranking" : "Explore ranking"}
              <ArrowRight size={17} />
            </Link>

            <Link
              href={`/${locale}/login`}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/[0.04] px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-white/[0.08]"
            >
              {isSpanish ? "Únete a ARMY" : "Join ARMY"}
            </Link>
          </div>

          <div className="mt-12 flex items-center gap-3 text-sm text-white/50">
            <Globe2 size={18} className="text-violet-300" />
            {isSpanish
              ? "Una comunidad global, una voz por cada ARMY."
              : "One global community, one voice for every ARMY."}
          </div>
        </div>

        <div
          id="ranking-preview"
          className="relative mx-auto hidden w-full max-w-md lg:block"
        >
          <div className="absolute inset-0 rounded-full bg-violet-500/20 blur-[100px]" />

          <div className="relative rounded-3xl border border-white/10 bg-[#100c1c]/80 p-7 shadow-2xl shadow-violet-950/40 backdrop-blur-xl">
            <div className="flex items-center justify-between gap-3">
              <span className="text-sm text-white/65">
                {isSpanish ? "Ranking mundial" : "Global ranking"}
              </span>

              <span className="inline-flex items-center gap-2 text-xs font-medium text-emerald-300">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
                </span>

                {isSpanish ? "Datos reales" : "Real data"}
              </span>
            </div>

            {podiumOrder.length > 0 ? (
              <div className="mt-8 flex items-end justify-center gap-3">
                {podiumOrder.map(({ country, position }) => (
                  <Link
                    key={country.code}
                    href={`/${locale}/ranking/${country.slug}`}
                    className={`flex w-1/3 min-w-0 flex-col items-center rounded-t-2xl border px-2 pt-5 text-center transition hover:-translate-y-1 ${
                      position === 1
                        ? "min-h-52 border-violet-300/30 bg-gradient-to-b from-violet-400/20 to-violet-950/20"
                        : position === 2
                          ? "min-h-40 border-slate-300/15 bg-gradient-to-b from-slate-300/[0.08] to-transparent"
                          : "min-h-32 border-orange-300/15 bg-gradient-to-b from-orange-300/[0.07] to-transparent"
                    }`}
                  >
                    {position === 1 ? (
                      <Crown
                        size={21}
                        className="mb-2 text-violet-200"
                      />
                    ) : (
                      <Medal
                        size={19}
                        className={`mb-2 ${
                          position === 2
                            ? "text-slate-300"
                            : "text-orange-300"
                        }`}
                      />
                    )}

                    <span className="text-3xl sm:text-4xl">
                      {country.flag_emoji}
                    </span>

                    <span className="mt-2 line-clamp-2 w-full text-xs font-semibold text-white sm:text-sm">
                      {isSpanish ? country.name_es : country.name_en}
                    </span>

                    <span className="mt-1 text-[11px] text-white/45">
                      #{position}
                    </span>

                    <span className="mt-auto pt-3 text-xs font-bold tabular-nums text-white/90 sm:text-sm">
                      {formatVotes(country.votes, locale)}
                      <span className="mt-1 block text-[10px] font-normal text-white/40">
                        {isSpanish ? "votos" : "votes"}
                      </span>
                    </span>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="mt-8 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-10 text-center">
                <Sparkles
                  size={25}
                  className="mx-auto text-violet-300"
                />

                <p className="mt-3 text-sm font-medium text-white/80">
                  {isSpanish
                    ? "El podio está esperando a los ARMYs"
                    : "The podium is waiting for ARMYs"}
                </p>

                <p className="mt-2 text-xs leading-5 text-white/45">
                  {isSpanish
                    ? "Los países aparecerán aquí cuando reciban sus primeros votos."
                    : "Countries will appear here when they receive their first votes."}
                </p>
              </div>
            )}

            <Link
              href={`/${locale}/ranking`}
              className="mt-6 flex items-center justify-center gap-2 text-xs font-medium text-violet-300 transition hover:text-violet-200"
            >
              {isSpanish ? "Ver ranking completo" : "View full ranking"}
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </div>

      <a
        href="#ranking-preview"
        aria-label={isSpanish ? "Ver más" : "Scroll down"}
        className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 text-white/40 transition hover:text-white/80 lg:block"
      >
        <ArrowDown size={20} />
      </a>
    </section>
  );
}