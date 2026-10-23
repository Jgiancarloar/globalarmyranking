
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Cookie, Settings2, ShieldCheck, X } from "lucide-react";

type Props = {
  locale: string;
};

type ConsentPreferences = {
  necessary: true;
  analytics: boolean;
  updatedAt: string;
};

const STORAGE_KEY = "global-army-cookie-consent-v1";
const OPEN_SETTINGS_EVENT = "global-army-open-cookie-settings";

export default function CookieConsent({ locale }: Props) {
  const isSpanish = locale === "es";

  const [ready, setReady] = useState(false);
  const [preferences, setPreferences] =
    useState<ConsentPreferences | null>(null);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [analyticsEnabled, setAnalyticsEnabled] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);

      if (saved) {
        const parsed = JSON.parse(saved) as Partial<ConsentPreferences>;

        if (
          parsed.necessary === true &&
          typeof parsed.analytics === "boolean"
        ) {
          setPreferences({
            necessary: true,
            analytics: parsed.analytics,
            updatedAt:
              typeof parsed.updatedAt === "string"
                ? parsed.updatedAt
                : new Date().toISOString(),
          });

          setAnalyticsEnabled(parsed.analytics);
        }
      }
    } catch {
      // If storage is unavailable, show the banner and allow a new choice.
    }

    setReady(true);

    const openSettings = () => {
      setSettingsOpen(true);
    };

    window.addEventListener(OPEN_SETTINGS_EVENT, openSettings);

    return () => {
      window.removeEventListener(OPEN_SETTINGS_EVENT, openSettings);
    };
  }, []);

  function savePreferences(analytics: boolean) {
    const nextPreferences: ConsentPreferences = {
      necessary: true,
      analytics,
      updatedAt: new Date().toISOString(),
    };

    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(nextPreferences),
      );
    } catch {
      // The selection remains usable for the current page session.
    }

    setPreferences(nextPreferences);
    setAnalyticsEnabled(analytics);
    setSettingsOpen(false);
  }

  if (!ready) {
    return null;
  }

  if (preferences && !settingsOpen) {
    return null;
  }

  return (
    <>
      {!preferences && (
        <section
          aria-label={
            isSpanish ? "Preferencias de cookies" : "Cookie preferences"
          }
          aria-describedby="cookie-consent-description"
          className="fixed inset-x-0 bottom-0 z-[100] p-3 sm:p-5"
        >
          <div className="mx-auto max-w-5xl overflow-hidden rounded-2xl border border-violet-300/20 bg-[#100c1c] shadow-[0_-12px_60px_rgba(0,0,0,0.4)]">
            <div className="h-1 bg-gradient-to-r from-violet-600 via-fuchsia-400 to-violet-600" />

            <div className="flex flex-col gap-5 p-5 sm:p-6 md:flex-row md:items-center md:justify-between">
              <div className="flex gap-4">
                <div className="hidden h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-violet-300/20 bg-violet-400/10 text-violet-200 sm:flex">
                  <Cookie size={22} />
                </div>

                <div className="min-w-0">
                  <h2 className="text-base font-bold text-white">
                    {isSpanish
                      ? "Tú decides tus cookies"
                      : "You control your cookies"}
                  </h2>

                  <p
                    id="cookie-consent-description"
                    className="mt-2 max-w-2xl text-sm leading-6 text-white/60"
                  >
                    {isSpanish
                      ? "Utilizamos almacenamiento necesario para que el sitio funcione. En el futuro, podremos utilizar analítica opcional para comprender cómo se utiliza la plataforma. Tú decides si la autorizas."
                      : "We use necessary storage to make the site work. In the future, we may use optional analytics to understand how the platform is used. You decide whether to allow it."}
                  </p>

                  <Link
                    href={`/${locale}/cookies`}
                    className="mt-2 inline-flex text-xs font-medium text-violet-300 underline decoration-violet-300/40 underline-offset-4 transition hover:text-violet-200"
                  >
                    {isSpanish
                      ? "Leer la política de cookies"
                      : "Read the cookie policy"}
                  </Link>
                </div>
              </div>

              <div className="flex shrink-0 flex-col gap-2 sm:flex-row sm:flex-wrap md:max-w-[290px] md:flex-col">
                <button
                  type="button"
                  onClick={() => savePreferences(true)}
                  className="rounded-xl bg-violet-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-violet-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-300"
                >
                  {isSpanish
                    ? "Aceptar opcionales"
                    : "Accept optional"}
                </button>

                <button
                  type="button"
                  onClick={() => savePreferences(false)}
                  className="rounded-xl border border-white/15 bg-white/[0.04] px-4 py-3 text-sm font-medium text-white/80 transition hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-300"
                >
                  {isSpanish
                    ? "Rechazar opcionales"
                    : "Reject optional"}
                </button>

                <button
                  type="button"
                  onClick={() => setSettingsOpen(true)}
                  className="inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2 text-sm text-white/55 transition hover:text-violet-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-300"
                >
                  <Settings2 size={15} />
                  {isSpanish ? "Configurar" : "Customize"}
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      {settingsOpen && (
        <div
          className="fixed inset-0 z-[110] flex items-end justify-center bg-black/70 p-3 backdrop-blur-sm sm:items-center sm:p-5"
          onClick={(event) => {
            if (event.target === event.currentTarget) {
              setSettingsOpen(false);
            }
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="cookie-settings-title"
            className="w-full max-w-lg rounded-2xl border border-violet-300/20 bg-[#100c1c] p-5 shadow-2xl sm:p-7"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-violet-400/10 text-violet-300">
                  <Settings2 size={21} />
                </div>

                <h2
                  id="cookie-settings-title"
                  className="text-lg font-bold text-white"
                >
                  {isSpanish
                    ? "Preferencias de privacidad"
                    : "Privacy preferences"}
                </h2>

                <p className="mt-2 text-sm leading-6 text-white/55">
                  {isSpanish
                    ? "Elige qué almacenamiento opcional autorizas. Puedes cambiar tu decisión después."
                    : "Choose which optional storage you allow. You can change your decision later."}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setSettingsOpen(false)}
                aria-label={isSpanish ? "Cerrar" : "Close"}
                className="rounded-lg p-2 text-white/50 transition hover:bg-white/10 hover:text-white"
              >
                <X size={19} />
              </button>
            </div>

            <div className="mt-6 space-y-3">
              <div className="flex items-start justify-between gap-4 rounded-xl border border-white/10 bg-white/[0.03] p-4">
                <div className="flex gap-3">
                  <ShieldCheck
                    size={19}
                    className="mt-0.5 shrink-0 text-emerald-300"
                  />
                  <div>
                    <p className="text-sm font-semibold text-white">
                      {isSpanish
                        ? "Almacenamiento necesario"
                        : "Necessary storage"}
                    </p>
                    <p className="mt-1 text-xs leading-5 text-white/50">
                      {isSpanish
                        ? "Necesario para funciones esenciales del sitio. No se puede desactivar desde estas preferencias."
                        : "Required for essential site functions. It cannot be disabled in these preferences."}
                    </p>
                  </div>
                </div>

                <span className="shrink-0 rounded-full border border-emerald-300/20 bg-emerald-300/10 px-2.5 py-1 text-xs font-medium text-emerald-200">
                  {isSpanish ? "Siempre activo" : "Always on"}
                </span>
              </div>

              <label className="flex cursor-pointer items-start justify-between gap-4 rounded-xl border border-white/10 bg-white/[0.03] p-4">
                <div>
                  <p className="text-sm font-semibold text-white">
                    {isSpanish
                      ? "Analítica opcional"
                      : "Optional analytics"}
                  </p>
                  <p className="mt-1 text-xs leading-5 text-white/50">
                    {isSpanish
                      ? "Permite medir el uso de la plataforma para mejorarla. La analítica todavía no está instalada."
                      : "Allows us to measure platform usage to improve it. Analytics is not installed yet."}
                  </p>
                </div>

                <input
                  type="checkbox"
                  checked={analyticsEnabled}
                  onChange={(event) =>
                    setAnalyticsEnabled(event.target.checked)
                  }
                  className="mt-1 h-5 w-5 shrink-0 accent-violet-500"
                />
              </label>
            </div>

            <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => savePreferences(false)}
                className="rounded-xl border border-white/15 px-4 py-3 text-sm font-medium text-white/75 transition hover:bg-white/5"
              >
                {isSpanish ? "Rechazar opcionales" : "Reject optional"}
              </button>

              <button
                type="button"
                onClick={() => savePreferences(analyticsEnabled)}
                className="rounded-xl bg-violet-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-violet-400"
              >
                {isSpanish
                  ? "Guardar preferencias"
                  : "Save preferences"}
              </button>
            </div>
          </section>
        </div>
      )}
    </>
  );
}
