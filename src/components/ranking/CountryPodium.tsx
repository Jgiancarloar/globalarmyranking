import Link from "next/link";
import { Crown, Medal, Sparkles } from "lucide-react";

import type { RankedCountry } from "@/lib/ranking-types";

type Props = {
  locale: string;
  countries: RankedCountry[];
};

function formatVotes(value: number, locale: string) {
  return new Intl.NumberFormat(
    locale === "es" ? "es-PE" : "en-US",
  ).format(value);
}

export default function CountryPodium({
  locale,
  countries,
}: Props) {
  const isSpanish = locale === "es";

  const podium = countries
    .filter((country) => country.votes > 0)
    .slice(0, 3);

  if (podium.length === 0) {
    return (
      <div className="rounded-3xl border border-white/10 bg-[#100d19] px-6 py-12 text-center">
        <Sparkles
          size={30}
          className="mx-auto text-violet-300"
        />

        <h3 className="mt-4 text-lg font-semibold">
          {isSpanish
            ? "El podio está esperando a los ARMYs"
            : "The podium is waiting for ARMYs"}
        </h3>

        <p className="mt-2 text-sm text-white/45">
          {isSpanish
            ? "Los países aparecerán aquí cuando reciban sus primeros votos."
            : "Countries will appear here when they receive their first votes."}
        </p>
      </div>
    );
  }

  const podiumOrder =
    podium.length >= 3
      ? [
        { country: podium[1], position: 2 },
        { country: podium[0], position: 1 },
        { country: podium[2], position: 3 },
      ]
      : podium.map((country, index) => ({
        country,
        position: index + 1,
      }));

  return (
    <div className="mx-auto grid max-w-3xl grid-cols-3 items-end gap-3 sm:gap-6">
      {podiumOrder.map(({ country, position }) => (
        <Link
          key={country.code}
          href={`/${locale}/ranking/${country.slug}`}
          className={`group flex min-w-0 flex-col items-center rounded-t-2xl border px-2 pt-6 text-center transition duration-300 hover:-translate-y-1 sm:px-5 ${position === 1
              ? "min-h-64 border-violet-300/30 bg-gradient-to-b from-violet-400/20 to-violet-950/10 shadow-[0_0_40px_rgba(139,92,246,0.08)] sm:min-h-72"
              : position === 2
                ? "min-h-52 border-slate-300/15 bg-gradient-to-b from-slate-300/[0.07] to-transparent sm:min-h-60"
                : "min-h-44 border-orange-300/15 bg-gradient-to-b from-orange-300/[0.06] to-transparent sm:min-h-52"
            }`}
        >
          {position === 1 ? (
            <Crown
              size={25}
              className="mb-2 text-violet-200"
            />
          ) : (
            <Medal
              size={22}
              className={
                position === 2
                  ? "mb-2 text-slate-300"
                  : "mb-2 text-orange-300"
              }
            />
          )}

          <span className="mt-1 flex h-10 w-14 shrink-0 items-center justify-center overflow-hidden rounded-sm sm:h-14 sm:w-20">
            <img
              src={`https://flagcdn.com/${country.code.toLowerCase()}.svg`}
              alt={
                isSpanish
                  ? `Bandera de ${country.name_es}`
                  : `Flag of ${country.name_en}`
              }
              width={80}
              height={53}
              loading="lazy"
              className="block h-auto max-h-full w-full object-contain"
            />
          </span>

          <span className="mt-3 line-clamp-2 text-xs font-semibold sm:text-base">
            {isSpanish ? country.name_es : country.name_en}
          </span>

          <span className="mt-2 text-xs text-white/45">
            #{position}
          </span>

          <span className="mt-auto pb-5 pt-4 text-sm font-bold tabular-nums sm:text-base">
            {formatVotes(country.votes, locale)}
            <span className="mt-1 block text-[10px] font-normal text-white/40">
              {isSpanish ? "votos" : "votes"}
            </span>
          </span>
        </Link>
      ))}
    </div>
  );
}