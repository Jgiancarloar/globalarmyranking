import { Activity, Globe2, Trophy, Users } from "lucide-react";

import type { RankingStats } from "@/lib/ranking-types";

type Props = {
  locale: string;
  stats: RankingStats;
};

function formatVotes(value: number, locale: string) {
  return new Intl.NumberFormat(
    locale === "es" ? "es-PE" : "en-US",
  ).format(value);
}

export default function CountryStats({ locale, stats }: Props) {
  const isSpanish = locale === "es";

  const items = [
    {
      label: isSpanish ? "Países participantes" : "Participating countries",
      value: formatVotes(stats.countries, locale),
      icon: Globe2,
    },
    {
      label: isSpanish ? "Votos acumulados" : "Total votes",
      value: formatVotes(stats.votes, locale),
      icon: Activity,
    },
    {
      label: isSpanish ? "ARMYs registrados" : "Registered ARMYs",
      value: formatVotes(stats.members, locale),
      icon: Users,
    },
    {
      label: isSpanish ? "País líder" : "Leading country",
      value: stats.leader
        ? `${stats.leader.flag_emoji} ${
            isSpanish
              ? stats.leader.name_es
              : stats.leader.name_en
          }`
        : "—",
      icon: Trophy,
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      {items.map(({ label, value, icon: Icon }) => (
        <div
          key={label}
          className="min-w-0 rounded-2xl border border-white/[0.08] bg-white/[0.025] p-4 sm:p-5"
        >
          <Icon size={19} className="text-violet-300" />

          <p className="mt-5 break-words text-xl font-bold tracking-tight sm:text-2xl">
            {value}
          </p>

          <p className="mt-2 text-xs leading-5 text-white/45">
            {label}
          </p>
        </div>
      ))}
    </div>
  );
}