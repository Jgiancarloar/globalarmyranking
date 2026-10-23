
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ArrowUpRight,
  Heart,
  ShieldCheck,
  FileText,
  Cookie,
  Mail,
  Settings2,
} from "lucide-react";

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

  const exploreLinks = [
    {
      href: `/${locale}`,
      label: isSpanish ? "Inicio" : "Home",
    },
    {
      href: `/${locale}/ranking`,
      label: isSpanish ? "Ranking global" : "Global ranking",
    },
    {
      href: `/${locale}/vote`,
      label: isSpanish ? "Votar" : "Vote",
    },
    {
      href: `/${locale}/login`,
      label: isSpanish ? "Unirse a la comunidad" : "Join the community",
      externalIcon: true,
    },
  ];

  const informationLinks = [
    {
      href: `/${locale}/privacy`,
      label: isSpanish ? "Política de privacidad" : "Privacy policy",
      icon: ShieldCheck,
    },
    {
      href: `/${locale}/terms`,
      label: isSpanish ? "Términos y condiciones" : "Terms and conditions",
      icon: FileText,
    },
    {
      href: `/${locale}/cookies`,
      label: isSpanish ? "Política de cookies" : "Cookie policy",
      icon: Cookie,
    },
    {
      href: `/${locale}/contact`,
      label: isSpanish ? "Contacto y soporte" : "Contact and support",
      icon: Mail,
    },
  ];

  function openCookieSettings() {
    window.dispatchEvent(
      new Event("global-army-open-cookie-settings"),
    );
  }

  return (
    <footer className="border-t border-white/[0.08] bg-[#08060e] px-5 sm:px-8 lg:px-12">
      <div className="mx-auto max-w-7xl py-12">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.35fr_1fr_1.25fr_0.7fr] lg:gap-8">
          {/* Marca */}
          <div className="max-w-sm">
            <Link
              href={`/${locale}`}
              className="inline-flex items-center gap-3"
              aria-label="Global Army Ranking - Inicio"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-violet-300/20 bg-violet-400/10 text-sm font-black text-violet-200">
                GA
              </span>

              <span className="text-sm font-bold tracking-tight text-white">
                Global Army
                <span className="block text-xs font-medium text-violet-300">
                  Ranking
                </span>
              </span>
            </Link>

            <p className="mt-5 text-sm leading-7 text-white/45">
              {isSpanish
                ? "Una comunidad global para celebrar la pasión de ARMY y conectar fans de todo el mundo."
                : "A global community celebrating ARMY's passion and connecting fans around the world."}
            </p>

            <p className="mt-4 text-xs leading-5 text-white/30">
              {isSpanish
                ? "Una plataforma comunitaria independiente, creada por fans para fans."
                : "An independent community platform, created by fans for fans."}
            </p>
          </div>

          {/* Explorar */}
          <div>
            <h2 className="text-sm font-semibold text-white">
              {isSpanish ? "Explorar" : "Explore"}
            </h2>

            <nav
              aria-label={
                isSpanish ? "Navegación del sitio" : "Site navigation"
              }
              className="mt-4 flex flex-col items-start gap-3"
            >
              {exploreLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="inline-flex items-center gap-1 text-sm text-white/50 transition hover:text-violet-300"
                >
                  {link.label}
                  {link.externalIcon && <ArrowUpRight size={14} />}
                </Link>
              ))}
            </nav>
          </div>

          {/* Información */}
          <div>
            <h2 className="text-sm font-semibold text-white">
              {isSpanish ? "Información" : "Information"}
            </h2>

            <nav
              aria-label={
                isSpanish ? "Información legal" : "Legal information"
              }
              className="mt-4 flex flex-col items-start gap-3"
            >
              {informationLinks.map((link) => {
                const Icon = link.icon;

                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="inline-flex items-center gap-2 text-sm text-white/50 transition hover:text-violet-300"
                  >
                    <Icon size={15} className="shrink-0" />
                    {link.label}
                  </Link>
                );
              })}

              <button
                type="button"
                onClick={openCookieSettings}
                className="inline-flex items-center gap-2 text-left text-sm text-white/50 transition hover:text-violet-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-300 focus-visible:ring-offset-2 focus-visible:ring-offset-[#08060e]"
              >
                <Settings2 size={15} className="shrink-0" />
                {isSpanish
                  ? "Preferencias de cookies"
                  : "Cookie preferences"}
              </button>
            </nav>
          </div>

          {/* Idioma */}
          <div>
            <h2 className="text-sm font-semibold text-white">
              {isSpanish ? "Idioma" : "Language"}
            </h2>

            <nav
              aria-label={
                isSpanish ? "Seleccionar idioma" : "Choose language"
              }
              className="mt-4 flex flex-col items-start gap-3"
            >
              <Link
                href={languageHref("en")}
                hrefLang="en"
                lang="en"
                aria-current={locale === "en" ? "page" : undefined}
                className={`text-sm transition hover:text-violet-300 ${
                  locale === "en"
                    ? "text-violet-300"
                    : "text-white/50"
                }`}
              >
                🇺🇸 English
              </Link>

              <Link
                href={languageHref("es")}
                hrefLang="es"
                lang="es"
                aria-current={locale === "es" ? "page" : undefined}
                className={`text-sm transition hover:text-violet-300 ${
                  locale === "es"
                    ? "text-violet-300"
                    : "text-white/50"
                }`}
              >
                🇪🇸 Español
              </Link>
            </nav>
          </div>
        </div>

        {/* Pie inferior */}
        <div className="mt-12 flex flex-col gap-4 border-t border-white/[0.08] pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs leading-5 text-white/35">
            © {new Date().getFullYear()} Global Army Ranking.{" "}
            {isSpanish
              ? "Todos los derechos reservados."
              : "All rights reserved."}
          </p>

          <p className="inline-flex items-center gap-1.5 text-xs text-white/40">
            {isSpanish ? "Hecho con" : "Made with"}
            <Heart
              size={12}
              className="fill-violet-400 text-violet-400"
              aria-label={isSpanish ? "amor" : "love"}
            />
            {isSpanish
              ? "para la comunidad ARMY"
              : "for the ARMY community"}
          </p>
        </div>
      </div>
    </footer>
  );
}
