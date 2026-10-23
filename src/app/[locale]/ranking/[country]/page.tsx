
import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  Crown,
  Globe2,
  Heart,
  Trophy,
  Users,
  UserRound,
} from "lucide-react";

import { isLocale } from "@/i18n/config";
import { createClient } from "@/lib/supabase/server";

type Props = {
  params: Promise<{
    locale: string;
    country: string;
  }>;
};

type Country = {
  code: string;
  name_en: string;
  name_es: string;
  flag_emoji: string;
  is_active: boolean;
};

type TopVoter = {
  user_id: string;
  display_name: string;
  total_votes: number;
  avatar_url: string | null;
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

async function getCountryBySlug(
  slug: string,
): Promise<Country | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("countries")
    .select("code, name_en, name_es, flag_emoji, is_active")
    .eq("is_active", true);

  if (error) {
    console.error("Error loading country:", error);
    return null;
  }

  const countries = (data ?? []) as Country[];

  return (
    countries.find(
      (country) =>
        slugify(country.name_en) === slug ||
        slugify(country.name_es) === slug,
    ) ?? null
  );
}

export async function generateMetadata({
  params,
}: Props): Promise<Metadata> {
  const { locale, country: slug } = await params;

  if (!isLocale(locale)) {
    return {
      title: "Country not found",
    };
  }

  const countryName = slug
    .split("-")
    .filter(Boolean)
    .map(
      (part) =>
        part.charAt(0).toUpperCase() + part.slice(1),
    )
    .join(" ");

  return {
    title: `${countryName} | ${locale === "es" ? "Ranking global" : "Global ranking"
      }`,
  };
}

async function CountryContent({ params }: Props) {
  const { locale, country: slug } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  const country = await getCountryBySlug(slug);

  if (!country) {
    notFound();
  }

  const isSpanish = locale === "es";
  const countryName = isSpanish
    ? country.name_es
    : country.name_en;

  const supabase = await createClient();

  const [
    { data: votersData, error: votersError },
    { count: membersCount, error: membersError },
    { data: votesCount, error: votesError },
  ] = await Promise.all([
    supabase.rpc("get_country_top_voters_with_avatars", {
      p_country_code: country.code,
    }),

    supabase
      .from("profiles")
      .select("id", { count: "exact", head: true })
      .eq("country_code", country.code),

    supabase.rpc("get_country_vote_count", {
      p_country_code: country.code,
    }),
  ]);

  if (votersError) {
    console.error("Error loading top voters:", votersError);
  }

  if (membersError) {
    console.error("Error loading country members:", membersError);
  }

  if (votesError) {
    console.error("Error loading country votes:", votesError);
  }

  const voters = (
    votersError ? [] : votersData ?? []
  ) as TopVoter[];

  const totalVotes = Number(votesCount ?? 0);
  const totalMembers = membersCount ?? 0;

  return (
    <div className="min-h-screen px-5 pb-24 pt-12 sm:px-8 lg:px-12">
      <div className="mx-auto max-w-5xl">
        <Link
          href={`/${locale}/ranking`}
          className="inline-flex items-center gap-2 text-sm text-white/50 transition hover:text-violet-300"
        >
          <ArrowLeft size={16} />
          {isSpanish ? "Volver al ranking" : "Back to ranking"}
        </Link>

        {/* Encabezado del país */}
        <section className="relative mt-8 overflow-hidden rounded-3xl border border-violet-300/15 bg-gradient-to-br from-violet-500/15 via-[#151020] to-[#0d0a16] p-7 sm:p-12">
          <div
            aria-hidden="true"
            className="absolute -right-10 -top-10 h-48 w-48 rounded-full bg-violet-500/10 blur-3xl"
          />

          <div className="relative">
            <div className="flex flex-wrap items-center gap-4">

              <span className="flex h-14 w-20 shrink-0 items-center justify-center overflow-hidden rounded-md sm:h-20 sm:w-28">
                <img
                  src={`https://flagcdn.com/${country.code.toLowerCase()}.svg`}
                  alt={
                    isSpanish
                      ? `Bandera de ${country.name_es}`
                      : `Flag of ${country.name_en}`
                  }
                  width={112}
                  height={75}
                  className="block h-auto max-h-full w-full object-contain"
                />
              </span>


              <div>
                <p className="flex items-center gap-2 text-sm font-medium text-violet-300">
                  <Globe2 size={16} />
                  {isSpanish ? "Ranking por país" : "Country ranking"}
                </p>

                <h1 className="mt-2 text-4xl font-bold tracking-tight sm:text-6xl">
                  {countryName}
                </h1>
              </div>
            </div>

            <p className="mt-5 max-w-2xl text-sm leading-7 text-white/55 sm:text-base">
              {isSpanish
                ? `Descubre a los ARMYs que más votos han acumulado para ${countryName}.`
                : `Discover the ARMYs who have accumulated the most votes for ${countryName}.`}
            </p>

            <div className="mt-9 grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
                <div className="flex items-center gap-2 text-sm text-white/50">
                  <Trophy size={17} className="text-violet-300" />
                  {isSpanish ? "Votos acumulados" : "Total votes"}
                </div>

                <p className="mt-3 text-3xl font-bold tabular-nums">
                  {formatVotes(totalVotes, locale)}
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
                <div className="flex items-center gap-2 text-sm text-white/50">
                  <Users size={17} className="text-violet-300" />
                  {isSpanish
                    ? "Miembros registrados"
                    : "Registered members"}
                </div>

                <p className="mt-3 text-3xl font-bold tabular-nums">
                  {formatVotes(totalMembers, locale)}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Top 100 */}
        <section className="mt-14">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.18em] text-violet-300">
                {isSpanish ? "La comunidad" : "The community"}
              </p>

              <h2 className="mt-2 text-2xl font-bold sm:text-3xl">
                Top 100 ARMYs
              </h2>

              <p className="mt-2 text-sm text-white/45">
                {isSpanish
                  ? "Los usuarios con más votos acumulados."
                  : "Users with the most accumulated votes."}
              </p>
            </div>

            <Crown
              size={27}
              className="mb-1 shrink-0 text-violet-300"
            />
          </div>

          {voters.length > 0 ? (
            <div className="mt-7 overflow-hidden rounded-2xl border border-white/10 bg-[#100d19]">
              {voters.map((voter, index) => {
                const name = voter.display_name?.trim() || "ARMY";
                const isPodium = index < 3;

                return (
                  <div
                    key={voter.user_id}
                    className="flex items-center gap-3 border-b border-white/[0.06] px-4 py-4 last:border-0 sm:gap-4 sm:px-6"
                  >
                    {/* Posición */}
                    <span
                      className={`w-7 shrink-0 text-center text-sm font-bold tabular-nums ${index === 0
                          ? "text-amber-300"
                          : index === 1
                            ? "text-slate-300"
                            : index === 2
                              ? "text-orange-300"
                              : "text-white/35"
                        }`}
                    >
                      {index + 1}
                    </span>

                    {/* Foto de perfil */}
                    <div
                      className={`flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full ${isPodium
                          ? "border border-violet-300/30 bg-violet-400/15 text-violet-200"
                          : "border border-white/10 bg-white/[0.05] text-white/60"
                        }`}
                    >
                      {voter.avatar_url ? (
                        <Image
                          src={voter.avatar_url}
                          alt={name}
                          width={44}
                          height={44}
                          unoptimized
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <span className="flex h-full w-full items-center justify-center">
                          {name !== "ARMY" ? (
                            name.charAt(0).toUpperCase()
                          ) : (
                            <UserRound size={20} />
                          )}
                        </span>
                      )}
                    </div>

                    {/* Nombre */}
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-white">
                        {name}
                      </p>

                      {index === 0 && (
                        <p className="mt-1 text-xs text-violet-300">
                          {isSpanish
                            ? "Líder de la comunidad"
                            : "Community leader"}
                        </p>
                      )}
                    </div>

                    {/* Votos */}
                    <div className="shrink-0 text-right">
                      <p className="text-sm font-bold tabular-nums">
                        {formatVotes(
                          Number(voter.total_votes),
                          locale,
                        )}
                      </p>

                      <p className="mt-1 text-xs text-white/40">
                        {isSpanish ? "votos" : "votes"}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="mt-7 rounded-3xl border border-white/10 bg-[#100d19] px-6 py-12 text-center sm:px-12">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-violet-300/15 bg-violet-400/10 text-violet-300">
                <Heart size={29} />
              </div>

              <h3 className="mt-6 text-xl font-bold">
                {isSpanish
                  ? "¡Sé el primero en representar a tu país!"
                  : "Be the first to represent your country!"}
              </h3>

              <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-white/50">
                {isSpanish
                  ? `Todavía no hay ARMYs en el Top 100 de ${countryName}. Emite tu voto gratuito y ayuda a tu país a subir en el ranking.`
                  : `There are no ARMYs in ${countryName}'s Top 100 yet. Cast your free vote and help your country climb the ranking.`}
              </p>

              <Link
                href={`/${locale}/vote`}
                className="mt-7 inline-flex items-center justify-center gap-2 rounded-xl bg-violet-500 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-violet-400"
              >
                <Heart size={17} />
                {isSpanish
                  ? "Emitir voto gratuito"
                  : "Cast free vote"}
              </Link>
            </div>
          )}

          {voters.length > 0 && (
            <p className="mt-4 text-xs text-white/35">
              {isSpanish
                ? `Mostrando ${voters.length} de hasta 100 ARMYs destacados.`
                : `Showing ${voters.length} of up to 100 top ARMYs.`}
            </p>
          )}
        </section>
      </div>
    </div>
  );
}

function CountryFallback() {
  return (
    <div
      className="min-h-screen animate-pulse bg-[#090710]"
      aria-hidden="true"
    />
  );
}

export default function CountryPage({ params }: Props) {
  return (
    <Suspense fallback={<CountryFallback />}>
      <CountryContent params={params} />
    </Suspense>
  );
}
