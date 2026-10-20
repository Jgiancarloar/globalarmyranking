
import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft, Crown } from "lucide-react";

import GoogleLoginButton from "@/components/account/GoogleLoginButton";
import { isLocale } from "@/i18n/config";
import { createClient } from "@/lib/supabase/server";

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ error?: string }>;
};

export default async function LoginPage({
  params,
  searchParams,
}: Props) {
  const { locale: requestedLocale } = await params;
  const { error: authError } = await searchParams;

  if (!isLocale(requestedLocale)) {
    redirect("/en");
  }

  const locale = requestedLocale;
  const isSpanish = locale === "es";

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect(`/${locale}/account`);
  }

  return (
    <section className="relative flex min-h-[75vh] items-center justify-center overflow-hidden px-5 py-16">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-600/10 blur-[120px]"
      />

      <div className="relative w-full max-w-md">
        <Link
          href={`/${locale}`}
          className="mb-8 inline-flex items-center gap-2 text-sm text-white/60 transition hover:text-white"
        >
          <ArrowLeft size={16} />
          {isSpanish ? "Volver al inicio" : "Back to home"}
        </Link>

        <div className="rounded-3xl border border-white/10 bg-[#13101e]/90 p-7 shadow-2xl shadow-black/20 sm:p-9">
          <div className="mb-7 flex justify-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-violet-300/20 bg-violet-400/10 text-violet-300">
              <Crown size={28} />
            </div>
          </div>

          <div className="text-center">
            <h1 className="text-3xl font-bold tracking-tight">
              {isSpanish ? "Únete al ranking" : "Join the ranking"}
            </h1>

            <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-white/55">
              {isSpanish
                ? "Inicia sesión para apoyar a tu país y formar parte de la comunidad ARMY global."
                : "Sign in to support your country and become part of the global ARMY community."}
            </p>
          </div>

          {authError === "auth" && (
            <p
              role="alert"
              className="mt-6 rounded-xl border border-rose-400/20 bg-rose-400/10 p-3 text-sm text-rose-300"
            >
              {isSpanish
                ? "No pudimos completar el inicio de sesión. Inténtalo nuevamente."
                : "We couldn't complete sign-in. Please try again."}
            </p>
          )}

          <div className="mt-8">
            <GoogleLoginButton locale={locale} />
          </div>

          <p className="mt-6 text-center text-xs leading-5 text-white/40">
            {isSpanish
              ? "Al continuar, aceptas las condiciones de uso de la plataforma."
              : "By continuing, you agree to the platform's terms of use."}
          </p>
        </div>
      </div>
    </section>
  );
}
