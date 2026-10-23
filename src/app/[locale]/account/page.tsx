
import Link from "next/link";
import { redirect } from "next/navigation";
import {
  ArrowLeft,
  Crown,
  LogOut,
  History,
  Clock3,
  Heart,
  TicketCheck,
} from "lucide-react";

import ProfileForm from "@/components/account/ProfileForm";
import { isLocale } from "@/i18n/config";
import { createClient } from "@/lib/supabase/server";

type Props = {
  params: Promise<{ locale: string }>;
};

type Country = {
  code: string;
  name_en: string;
  name_es: string;
  flag_emoji: string;
};

type Vote = {
  id: string;
  country_code: string;
  vote_type: string;
  created_at: string;
};

export default async function AccountPage({ params }: Props) {
  const { locale } = await params;

  if (!isLocale(locale)) {
    redirect("/en");
  }

  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    redirect(`/${locale}/login`);
  }

  const isSpanish = locale === "es";

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("display_name, country_code")
    .eq("id", user.id)
    .maybeSingle();

  const { data: countriesData, error: countriesError } = await supabase
    .from("countries")
    .select("code, name_en, name_es, flag_emoji")
    .eq("is_active", true)
    .order("name_en");

  const countries: Country[] = countriesData ?? [];

  // Historial: mostramos como máximo los últimos 20 votos.
  const { data: votesData, error: votesError } = await supabase
    .from("votes")
    .select("id, country_code, vote_type, created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(20);

  const votes: Vote[] = votesData ?? [];

  // Bloqueo del país: comprobar la existencia de cualquier voto,
  // independientemente del límite del historial.
  const { data: firstVote, error: firstVoteError } = await supabase
    .from("votes")
    .select("id")
    .eq("user_id", user.id)
    .limit(1)
    .maybeSingle();

  // Si no podemos verificar los votos, bloqueamos el selector
  // de forma conservadora hasta que se pueda comprobar.
  const hasVoted = Boolean(firstVote) || Boolean(firstVoteError);

  if (profileError) {
    console.error("Error loading profile:", profileError);
  }

  if (countriesError) {
    console.error("Error loading countries:", countriesError);
  }

  if (votesError) {
    console.error("Error loading vote history:", votesError);
  }

  if (firstVoteError) {
    console.error("Error checking whether user has voted:", firstVoteError);
  }

  const initialName =
    profile?.display_name ||
    user.user_metadata?.full_name ||
    user.user_metadata?.name ||
    "";

  const metadata = user.user_metadata ?? {};

  const initialAvatarUrl =
    (typeof metadata.custom_avatar_url === "string"
      ? metadata.custom_avatar_url
      : null) ||
    (typeof metadata.avatar_url === "string"
      ? metadata.avatar_url
      : null) ||
    (typeof metadata.picture === "string"
      ? metadata.picture
      : null) ||
    null;

  const initialCountry = profile?.country_code ?? "";

  const countryByCode = new Map(
    countries.map((country) => [country.code, country]),
  );

  const dateFormatter = new Intl.DateTimeFormat(
    isSpanish ? "es-PE" : "en-US",
    {
      dateStyle: "medium",
      timeStyle: "short",
      timeZone: "America/Lima",
    },
  );

  return (
    <section className="relative min-h-[75vh] overflow-hidden px-5 py-12 sm:px-8 sm:py-16">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-40 h-80 w-80 -translate-x-1/2 rounded-full bg-violet-600/[0.08] blur-[100px]"
      />

      <div className="relative mx-auto max-w-4xl">
        <Link
          href={`/${locale}`}
          className="inline-flex items-center gap-2 text-sm text-white/60 transition hover:text-white"
        >
          <ArrowLeft size={16} />
          {isSpanish ? "Volver al inicio" : "Back to home"}
        </Link>

        <div className="mt-8 overflow-hidden rounded-3xl border border-white/10 bg-[#13101e]">
          {/* Encabezado */}
          <div className="border-b border-white/[0.08] p-6 sm:p-9">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-violet-300/20 bg-violet-400/10 text-violet-300">
                <Crown size={28} />
              </div>

              <div>
                <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
                  {isSpanish ? "Mi cuenta" : "My account"}
                </h1>

                <p className="mt-1 text-sm text-white/50">
                  {isSpanish
                    ? "Administra tu perfil de Global Army Ranking."
                    : "Manage your Global Army Ranking profile."}
                </p>
              </div>
            </div>
          </div>

          {/* Información personal */}
          <div className="p-6 sm:p-9">
            <div className="mb-7">
              <h2 className="text-lg font-semibold">
                {isSpanish
                  ? "Información personal"
                  : "Personal information"}
              </h2>

              <p className="mt-1 text-sm leading-6 text-white/50">
                {isSpanish
                  ? "Personaliza cómo apareces en la comunidad ARMY."
                  : "Customize how you appear in the ARMY community."}
              </p>
            </div>

            {profileError || countriesError ? (
              <div
                role="alert"
                className="mb-6 rounded-xl border border-rose-400/20 bg-rose-400/[0.07] p-4 text-sm leading-6 text-rose-200"
              >
                {isSpanish
                  ? "No pudimos cargar los datos de tu perfil. Recarga la página para intentarlo nuevamente."
                  : "We couldn't load your profile data. Refresh the page to try again."}
              </div>
            ) : (
              <ProfileForm
                locale={locale}
                email={user.email ?? ""}
                initialName={initialName}
                initialCountry={initialCountry}
                initialAvatarUrl={initialAvatarUrl}
                userId={user.id}
                countries={countries}
                hasVoted={hasVoted}
              />
            )}
          </div>

          {/* Historial de votos */}
          <div className="border-t border-white/[0.08] p-6 sm:p-9">
            <div className="flex items-start gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-violet-300/20 bg-violet-400/10 text-violet-300">
                <History size={21} />
              </div>

              <div>
                <h2 className="text-lg font-semibold">
                  {isSpanish ? "Historial de votos" : "Vote history"}
                </h2>

                <p className="mt-1 text-sm leading-6 text-white/50">
                  {isSpanish
                    ? "Consulta los últimos votos emitidos desde tu cuenta."
                    : "Review the latest votes cast from your account."}
                </p>
              </div>
            </div>

            {votesError ? (
              <div
                role="alert"
                className="mt-6 rounded-xl border border-rose-400/20 bg-rose-400/[0.07] p-4 text-sm leading-6 text-rose-200"
              >
                {isSpanish
                  ? "No pudimos cargar tu historial de votos. Recarga la página para intentarlo nuevamente."
                  : "We couldn't load your vote history. Refresh the page to try again."}
              </div>
            ) : votes.length === 0 ? (
              <div className="mt-6 rounded-2xl border border-white/[0.08] bg-white/[0.02] px-5 py-10 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-violet-400/10 text-violet-300">
                  <Heart size={22} />
                </div>

                <p className="mt-4 font-medium">
                  {isSpanish
                    ? "Todavía no tienes votos registrados"
                    : "You don't have any recorded votes yet"}
                </p>

                <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-white/45">
                  {isSpanish
                    ? "Cuando emitas tu primer voto, aparecerá aquí junto con el país y la fecha."
                    : "Once you cast your first vote, it will appear here with its country and date."}
                </p>

                <Link
                  href={`/${locale}/vote`}
                  className="mt-5 inline-flex items-center justify-center gap-2 rounded-xl bg-violet-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-violet-400"
                >
                  <Heart size={16} />
                  {isSpanish ? "Ir a votar" : "Go vote"}
                </Link>
              </div>
            ) : (
              <div className="mt-6 space-y-3">
                {votes.map((vote) => {
                  const country = countryByCode.get(vote.country_code);

                  const countryName = country
                    ? isSpanish
                      ? country.name_es
                      : country.name_en
                    : vote.country_code;

                  const flag = country?.flag_emoji ?? "🌎";

                  return (
                    <div
                      key={vote.id}
                      className="flex flex-col gap-3 rounded-2xl border border-white/[0.08] bg-white/[0.02] p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5"
                    >
                      <div className="flex min-w-0 items-center gap-3">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-violet-400/10 text-violet-300">
                          {vote.vote_type === "free" ? (
                            <Heart size={19} />
                          ) : (
                            <TicketCheck size={19} />
                          )}
                        </div>

                        <div className="min-w-0">
                          <p className="font-semibold">
                            {flag} {countryName}
                          </p>

                          <p className="mt-1 text-xs text-white/45">
                            {vote.vote_type === "free"
                              ? isSpanish
                                ? "Voto gratuito"
                                : "Free vote"
                              : isSpanish
                                ? "Voto pagado"
                                : "Paid vote"}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 text-xs text-white/45 sm:justify-end">
                        <Clock3 size={14} className="shrink-0" />
                        <time dateTime={vote.created_at}>
                          {dateFormatter.format(new Date(vote.created_at))}
                        </time>
                      </div>
                    </div>
                  );
                })}

                <p className="pt-2 text-xs leading-5 text-white/35">
                  {isSpanish
                    ? "Mostrando tus últimos 20 votos."
                    : "Showing your latest 20 votes."}
                </p>
              </div>
            )}
          </div>

          {/* Sesión */}
          <div className="border-t border-white/[0.08] p-6 sm:p-9">
            <h2 className="text-lg font-semibold">
              {isSpanish ? "Sesión" : "Session"}
            </h2>

            <p className="mt-1 text-sm text-white/50">
              {isSpanish
                ? "Cierra tu sesión de forma segura en este dispositivo."
                : "Securely sign out on this device."}
            </p>

            <form
              action={async () => {
                "use server";

                const client = await createClient();
                await client.auth.signOut();

                redirect(`/${locale}`);
              }}
              className="mt-5"
            >
              <button
                type="submit"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 px-4 py-3 text-sm font-semibold text-white/80 transition hover:border-rose-400/30 hover:bg-rose-400/10 hover:text-white"
              >
                <LogOut size={16} />
                {isSpanish ? "Cerrar sesión" : "Sign out"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
