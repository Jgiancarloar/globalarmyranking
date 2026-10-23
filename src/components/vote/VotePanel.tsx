
"use client";

import { useCallback, useEffect, useState } from "react";
import {
  CheckCircle2,
  Clock3,
  Heart,
  LoaderCircle,
  ShieldCheck,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

type VoteStatus = {
  success: boolean;
  status: string;
  country_code?: string | null;
  vote_id?: string;
  next_vote_at?: string | null;
};

type Props = {
  locale: string;
  countryName: string;
  countryFlag: string;
  initialStatus: VoteStatus;
};

export default function VotePanel({
  locale,
  countryName,
  countryFlag,
  initialStatus,
}: Props) {
  const isSpanish = locale === "es";

  const [status, setStatus] = useState(initialStatus);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const getStatusMessage = useCallback(
    (result: VoteStatus) => {
      switch (result.status) {
        case "available":
          return isSpanish
            ? "Tu voto gratuito está disponible. ¡Apoya a tu país!"
            : "Your free vote is available. Support your country!";

        case "vote_recorded":
          return isSpanish
            ? "¡Tu voto se registró correctamente!"
            : "Your vote was recorded successfully!";

        case "cooldown":
          return isSpanish
            ? "Ya utilizaste tu voto gratuito. Podrás volver a votar cuando termine el plazo de 24 horas."
            : "You've already used your free vote. You can vote again when the 24-hour period ends.";

        case "country_required":
          return isSpanish
            ? "Primero debes elegir un país en tu perfil."
            : "You must select a country in your profile first.";

        case "profile_missing":
          return isSpanish
            ? "No encontramos tu perfil. Abre tu cuenta y vuelve a intentarlo."
            : "We couldn't find your profile. Open your account and try again.";

        case "country_unavailable":
          return isSpanish
            ? "El país seleccionado ya no está disponible."
            : "Your selected country is no longer available.";

        case "unauthenticated":
          return isSpanish
            ? "Tu sesión ha expirado. Inicia sesión nuevamente."
            : "Your session has expired. Please sign in again.";

        default:
          return isSpanish
            ? "No se pudo completar la operación. Inténtalo nuevamente."
            : "The operation couldn't be completed. Please try again.";
      }
    },
    [isSpanish],
  );

  const refreshStatus = useCallback(async () => {
    const supabase = createClient();

    const { data, error } = await supabase.rpc("get_free_vote_status");

    if (error) {
      console.error("Vote status RPC error:", error);
      setMessage(
        isSpanish
          ? "No pudimos consultar el estado de tu voto."
          : "We couldn't check your vote status.",
      );
      return;
    }

    const result = data as VoteStatus;

    setStatus(result);
    setMessage(getStatusMessage(result));
  }, [getStatusMessage, isSpanish]);

  useEffect(() => {
    if (status.status !== "cooldown" || !status.next_vote_at) {
      return;
    }

    const nextVoteTime = new Date(status.next_vote_at).getTime();
    const remaining = nextVoteTime - Date.now();

    if (remaining <= 0) {
      void refreshStatus();
      return;
    }

    const timeoutId = window.setTimeout(() => {
      void refreshStatus();
    }, remaining + 1000);

    return () => window.clearTimeout(timeoutId);
  }, [status.status, status.next_vote_at, refreshStatus]);

  useEffect(() => {
    function handleVisibilityChange() {
      if (document.visibilityState === "visible") {
        void refreshStatus();
      }
    }

    function handlePageShow() {
      void refreshStatus();
    }

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("pageshow", handlePageShow);

    return () => {
      document.removeEventListener(
        "visibilitychange",
        handleVisibilityChange,
      );
      window.removeEventListener("pageshow", handlePageShow);
    };
  }, [refreshStatus]);

  async function handleVote() {
    if (loading || status.status !== "available") return;

    setLoading(true);
    setMessage("");

    try {
      const supabase = createClient();
      const { data, error } = await supabase.rpc("cast_free_vote");

      if (error) {
        console.error("Vote RPC error:", error);
        setMessage(
          isSpanish
            ? "No pudimos registrar tu voto. Inténtalo nuevamente."
            : "We couldn't register your vote. Please try again.",
        );
        return;
      }

      const result = data as VoteStatus;

      setStatus(result);
      setMessage(getStatusMessage(result));
    } catch (error) {
      console.error("Unexpected vote error:", error);
      setMessage(
        isSpanish
          ? "Ocurrió un error inesperado. Inténtalo nuevamente."
          : "An unexpected error occurred. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  }

  const canVote = status.status === "available";
  const voteUsed = status.status === "cooldown";
  const nextVoteDate = status.next_vote_at
    ? new Date(status.next_vote_at)
    : null;

  const formattedNextVote =
    nextVoteDate && !Number.isNaN(nextVoteDate.getTime())
      ? nextVoteDate.toLocaleString(isSpanish ? "es-PE" : "en-US", {
          dateStyle: "medium",
          timeStyle: "short",
          timeZone: "America/Lima",
        })
      : null;

  const flagCode = /^[A-Za-z]{2}$/.test(countryFlag)
    ? countryFlag.toLowerCase()
    : "";

  return (
    <div className="rounded-3xl border border-white/10 bg-[#13101e] p-6 sm:p-9">
      <div className="flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-400/10 text-violet-300">
          <Heart size={24} />
        </div>

        <div>
          <h2 className="text-xl font-bold">
            {isSpanish ? "Tu voto" : "Your vote"}
          </h2>

          <p className="mt-1 text-sm text-white/50">
            {isSpanish
              ? "Apoya a tu país en el ranking global."
              : "Support your country in the global ranking."}
          </p>
        </div>
      </div>

      <div className="mt-7 rounded-2xl border border-violet-300/15 bg-violet-400/[0.06] p-5">
        <p className="text-sm text-white/50">
          {isSpanish ? "Tu país seleccionado" : "Your selected country"}
        </p>

        <div className="mt-3 flex items-center gap-3">
          {flagCode ? (
            <img
              src={`https://flagcdn.com/${flagCode}.svg`}
              alt={
                countryName
                  ? isSpanish
                    ? `Bandera de ${countryName}`
                    : `Flag of ${countryName}`
                  : ""
              }
              width={48}
              height={32}
              className="block h-auto max-h-8 w-12 shrink-0 rounded-sm object-contain"
            />
          ) : (
            <span
              className="flex h-8 w-12 shrink-0 items-center justify-center text-sm text-white/40"
              aria-hidden="true"
            >
              —
            </span>
          )}

          <span className="text-xl font-semibold">
            {countryName ||
              (isSpanish ? "País no seleccionado" : "No country selected")}
          </span>
        </div>

        <p className="mt-3 text-sm leading-6 text-white/50">
          {isSpanish
            ? "Cada cuenta puede emitir un voto gratuito cada 24 horas."
            : "Each account can cast one free vote every 24 hours."}
        </p>
      </div>

      {voteUsed && (
        <div className="mt-5 rounded-2xl border border-amber-300/15 bg-amber-300/[0.06] p-5">
          <div className="flex items-start gap-3">
            <CheckCircle2
              size={21}
              className="mt-0.5 shrink-0 text-emerald-300"
            />

            <div>
              <p className="font-semibold text-white">
                {isSpanish
                  ? "¡Ya utilizaste tu voto gratuito!"
                  : "You've already used your free vote!"}
              </p>

              <p className="mt-2 text-sm leading-6 text-amber-100/75">
                {isSpanish
                  ? "Podrás volver a votar cuando termine el plazo de 24 horas."
                  : "You can vote again when the 24-hour period ends."}
              </p>
            </div>
          </div>

          {formattedNextVote && (
            <div className="mt-4 flex items-center gap-3 border-t border-amber-200/10 pt-4">
              <Clock3 size={19} className="shrink-0 text-amber-200/80" />

              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-white/45">
                  {isSpanish
                    ? "Próximo voto disponible"
                    : "Next vote available"}
                </p>

                <p className="mt-1 text-sm font-medium text-amber-100">
                  {formattedNextVote}
                </p>

                <p className="mt-1 text-xs text-white/40">
                  {isSpanish ? "Hora de Perú" : "Peru time"}
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {status.status === "country_required" && (
        <a
          href={`/${locale}/account`}
          className="mt-5 inline-flex rounded-xl border border-violet-300/20 px-4 py-3 text-sm font-semibold text-violet-200 transition hover:bg-violet-400/10"
        >
          {isSpanish ? "Elegir país en mi perfil" : "Choose a country in my profile"}
        </a>
      )}

      {message && !voteUsed && (
        <div
          role="status"
          aria-live="polite"
          className="mt-5 flex items-start gap-3 rounded-xl border border-white/10 bg-white/[0.03] p-4 text-sm leading-6 text-white/80"
        >
          {status.status === "vote_recorded" ? (
            <CheckCircle2
              size={18}
              className="mt-1 shrink-0 text-emerald-300"
            />
          ) : (
            <ShieldCheck
              size={18}
              className="mt-1 shrink-0 text-violet-300"
            />
          )}

          <span>{message}</span>
        </div>
      )}

      {status.status !== "country_required" && (
        <button
          type="button"
          onClick={handleVote}
          disabled={loading || !canVote}
          aria-disabled={loading || !canVote}
          className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-violet-500 px-5 py-4 text-sm font-bold text-white transition hover:bg-violet-400 disabled:cursor-not-allowed disabled:bg-violet-500/30 disabled:text-white/50"
        >
          {loading ? (
            <LoaderCircle size={18} className="animate-spin" />
          ) : canVote ? (
            <Heart size={18} />
          ) : (
            <Clock3 size={18} />
          )}

          {loading
            ? isSpanish
              ? "Procesando..."
              : "Processing..."
            : isSpanish
              ? "Emitir voto gratuito"
              : "Cast free vote"}
        </button>
      )}
    </div>
  );
}
