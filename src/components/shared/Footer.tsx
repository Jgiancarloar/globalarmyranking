
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowUpRight, Heart } from "lucide-react";

type Props = {
  locale: string;
};

export default function Footer({ locale }: Props) {
  const pathname = usePathname();
  const isSpanish = locale === "es";

  const currentPath = pathname || `/${locale}`;
  const pathWithoutLocale = currentPath.replace(/^\/(en|es)(?=\/|$)/, "");

  const languageHref = (nextLocale: "en" | "es") =>
    `/${nextLocale}${pathWithoutLocale || ""}`;

  return (
    <footer className="border-t border-white/[0.08] bg-[#08060e] px-5 sm:px-8 lg:px-12">
      <div className="mx-auto max-w-7xl py-12">
        <div className="grid gap-10 md:grid-cols-[1.5fr_1fr_1fr]">
          <div className="max-w-sm">
            <Link href={`/${locale}`} className="inline-flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-violet-300/20 bg-violet-400/10 text-sm font-black text-violet-200">
                GA
              </span>
              <span className="text-sm font-bold tracking-tight">
                Global Army
                <span className="block text-xs font-medium text-violet-300">
                  World Ranking
                </span>
              </span>
            </Link>

            <p className="mt-5 text-sm leading-7 text-white/45">
              {isSpanish
                ? "Una comunidad global para celebrar la pasión de ARMY y conectar fans de todo el mundo."
                : "A global community celebrating ARMY's passion and connecting fans around the world."}
            </p>
          </div>

          <div>
            <h2 className="text-sm font-semibold">
              {isSpanish ? "Explorar" : "Explore"}
            </h2>
            <div className="mt-4 flex flex-col items-start gap-3">
              <Link href={`/${locale}`} className="text-sm text-white/50 transition hover:text-violet-300">
                {isSpanish ? "Inicio" : "Home"}
              </Link>
              <Link href={`/${locale}/ranking`} className="text-sm text-white/50 transition hover:text-violet-300">
                {isSpanish ? "Ranking global" : "Global ranking"}
              </Link>
              <Link href={`/${locale}/login`} className="inline-flex items-center gap-1 text-sm text-white/50 transition hover:text-violet-300">
                {isSpanish ? "Unirse a la comunidad" : "Join the community"}
                <ArrowUpRight size={14} />
              </Link>
            </div>
          </div>

          <div>
            <h2 className="text-sm font-semibold">
              {isSpanish ? "Idioma" : "Language"}
            </h2>
            <div className="mt-4 flex flex-col items-start gap-3">
              <Link href={languageHref("en")} hrefLang="en" lang="en" className={`text-sm transition hover:text-violet-300 ${locale === "en" ? "text-violet-300" : "text-white/50"}`}>
                English
              </Link>
              <Link href={languageHref("es")} hrefLang="es" lang="es" className={`text-sm transition hover:text-violet-300 ${locale === "es" ? "text-violet-300" : "text-white/50"}`}>
                Español
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-white/[0.08] pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-white/35">
            © {new Date().getFullYear()} Global Army Ranking.{" "}
            {isSpanish ? "Todos los derechos reservados." : "All rights reserved."}
          </p>

          <p className="inline-flex items-center gap-1.5 text-xs text-white/40">
            {isSpanish ? "Hecho con" : "Made with"}
            <Heart size={12} className="fill-violet-400 text-violet-400" />
            {isSpanish ? "para la comunidad ARMY" : "for the ARMY community"}
          </p>
        </div>
      </div>
    </footer>
  );
}
