
"use client";

import { createClient } from "@/lib/supabase/client";
import { useState } from "react";

type Props = {
  locale: string;
};

export default function GoogleLoginButton({ locale }: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleGoogleLogin() {
    setLoading(true);
    setError("");

    const supabase = createClient();

    const redirectTo = new URL(
      "/auth/callback",
      window.location.origin,
    );

    redirectTo.searchParams.set("locale", locale);

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: redirectTo.toString(),
      },
    });

    if (error) {
      setError(
        locale === "es"
          ? "No se pudo iniciar sesión con Google. Inténtalo nuevamente."
          : "Could not sign in with Google. Please try again.",
      );
      setLoading(false);
    }
  }

  return (
    <div className="w-full">
      <button
        type="button"
        onClick={handleGoogleLogin}
        disabled={loading}
        className="flex w-full items-center justify-center gap-3 rounded-xl border border-white/10 bg-white px-5 py-3.5 font-semibold text-black transition hover:bg-white/90 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? (
          <span>
            {locale === "es"
              ? "Conectando..."
              : "Connecting..."}
          </span>
        ) : (
          <>
            <svg
              aria-hidden="true"
              viewBox="0 0 48 48"
              className="h-5 w-5"
            >
              <path
                fill="#EA4335"
                d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5Z"
              />
              <path
                fill="#4285F4"
                d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.75 7.18l7.73 6C44.42 37.9 46.98 31.9 46.98 24.55Z"
              />
              <path
                fill="#FBBC05"
                d="M10.53 28.59A14.4 14.4 0 0 1 9.75 24c0-1.59.27-3.13.76-4.59l-7.98-6.19A23.9 23.9 0 0 0 0 24c0 3.87.93 7.53 2.56 10.78l7.97-6.19Z"
              />
              <path
                fill="#34A853"
                d="M24 48c6.48 0 11.93-2.13 15.91-5.8l-7.73-6c-2.15 1.45-4.9 2.3-8.18 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48Z"
              />
            </svg>

            {locale === "es"
              ? "Continuar con Google"
              : "Continue with Google"}
          </>
        )}
      </button>

      {error && (
        <p
          role="alert"
          className="mt-4 text-center text-sm text-rose-400"
        >
          {error}
        </p>
      )}
    </div>
  );
}
