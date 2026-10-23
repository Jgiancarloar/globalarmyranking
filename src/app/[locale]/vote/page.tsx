
import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft, Crown } from "lucide-react";

import { isLocale } from "@/i18n/config";
import { createClient } from "@/lib/supabase/server";
import VotePanel from "@/components/vote/VotePanel";

type Props = {
  params: Promise<{ locale: string }>;
};

type VoteStatus = {
  success: boolean;
  status: string;
  country_code?: string | null;
  vote_id?: string;
  next_vote_at?: string | null;
};

export default async function VotePage({ params }: Props) {
  const { locale } = await params;

  if (!isLocale(locale)) {
    redirect("/en");
  }

  const isSpanish = locale === "es";
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/${locale}/login`);
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("country_code")
    .eq("id", user.id)
    .maybeSingle();

  if (profileError) {
    console.error("Error loading vote profile:", profileError);
  }

  const countryCode = profile?.country_code ?? "";

  let countryName = "";
  let countryCodeForFlag = "";

  if (countryCode) {
    const { data: country, error: countryError } = await supabase
      .from("countries")
      .select("code, name_en, name_es")
      .eq("code", countryCode)
      .eq("is_active", true)
      .maybeSingle();

    if (countryError) {
      console.error("Error loading vote country:", countryError);
    }

    if (country) {
      countryName = isSpanish ? country.name_es : country.name_en;
      countryCodeForFlag = country.code;
    }
  }

  const { data: statusData, error: statusError } =
    await supabase.rpc("get_free_vote_status");

  const initialStatus: VoteStatus = statusError
    ? { success: false, status: "status_error" }
    : (statusData as VoteStatus);

  return (
    <section className="relative min-h-[75vh] overflow-hidden px-5 py-12 sm:px-8 sm:py-16">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-40 h-80 w-80 -translate-x-1/2 rounded-full bg-violet-600/[0.08] blur-[100px]"
      />

      <div className="relative mx-auto max-w-2xl">
        <Link
          href={`/${locale}`}
          className="inline-flex items-center gap-2 text-sm text-white/60 transition hover:text-white"
        >
          <ArrowLeft size={16} />
          {isSpanish ? "Volver al inicio" : "Back to home"}
        </Link>

        <div className="mb-8 mt-8 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-violet-300/20 bg-violet-400/10 text-violet-300">
            <Crown size={28} />
          </div>

          <h1 className="mt-5 text-3xl font-bold tracking-tight sm:text-4xl">
            {isSpanish ? "Apoya a tu país" : "Support your country"}
          </h1>

          <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-white/55 sm:text-base">
            {isSpanish
              ? "Cada voto ayuda a mostrar la fuerza de la comunidad ARMY en el mundo."
              : "Every vote helps show the strength of the ARMY community around the world."}
          </p>
        </div>

        {profileError ? (
          <div className="rounded-2xl border border-rose-400/20 bg-rose-400/[0.07] p-5 text-sm leading-6 text-rose-200">
            {isSpanish
              ? "No pudimos cargar tu perfil. Recarga la página e inténtalo nuevamente."
              : "We couldn't load your profile. Refresh the page and try again."}
          </div>
        ) : (
          <VotePanel
            locale={locale}
            countryName={countryName}
            countryFlag={countryCodeForFlag}
            initialStatus={initialStatus}
          />
        )}

        <p className="mt-6 text-center text-xs leading-5 text-white/35">
          {isSpanish
            ? "Los votos se validan de forma segura en el servidor."
            : "Votes are securely validated on the server."}
        </p>
      </div>
    </section>
  );
}
