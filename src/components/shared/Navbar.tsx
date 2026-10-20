
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRight, Crown, Menu, X } from "lucide-react";
import { useEffect, useState } from "react";

type Props = {
    locale: string;
    isAuthenticated: boolean;
};

export default function Navbar({
    locale,
    isAuthenticated,
}: Props) {
    const pathname = usePathname();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        window.scrollTo({
            top: 0,
            left: 0,
            behavior: "instant",
        });
    }, [pathname]);

    const isSpanish = locale === "es";
    const currentPath = pathname || `/${locale}`;

    const pathWithoutLocale = currentPath.replace(
        /^\/(en|es)(?=\/|$)/,
        "",
    );

    const switchLanguage = (nextLocale: "en" | "es") =>
        `/${nextLocale}${pathWithoutLocale || ""}`;

    const nextLocale = isSpanish ? "en" : "es";

    const homeHref = `/${locale}`;
    const rankingHref = `/${locale}/ranking`;

    const authHref = isAuthenticated
        ? `/${locale}/account`
        : `/${locale}/login`;

    const authLabel = isAuthenticated
        ? isSpanish
            ? "Mi cuenta"
            : "My account"
        : isSpanish
            ? "Iniciar sesión"
            : "Sign in";

    const navLinks = [
        {
            href: homeHref,
            label: isSpanish ? "Inicio" : "Home",
        },
        {
            href: rankingHref,
            label: "Ranking",
        },
        {
            href: `/${locale}/vote`,
            label: isSpanish ? "Votar" : "Vote",
        },
    ];

    const languageSelector = (
        <Link
            href={switchLanguage(nextLocale)}
            hrefLang={nextLocale}
            lang={nextLocale}
            aria-label={
                isSpanish
                    ? "Cambiar idioma a inglés"
                    : "Switch language to Spanish"
            }
            onClick={() => setMobileMenuOpen(false)}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2.5 text-sm font-semibold text-white/80 transition hover:border-violet-300/30 hover:bg-violet-400/10 hover:text-white"
        >
            <span aria-hidden="true">
                {isSpanish ? "🇺🇸" : "🇪🇸"}
            </span>

            <span>{nextLocale.toUpperCase()}</span>
        </Link>
    );

    const authButton = (
        <Link
            href={authHref}
            onClick={() => setMobileMenuOpen(false)}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-violet-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-violet-400"
        >
            <span>{authLabel}</span>
            <ArrowRight size={16} />
        </Link>
    );

    return (
        <header className="sticky top-0 z-50 border-b border-white/[0.08] bg-[#090710]/85 backdrop-blur-xl">
            <nav
                aria-label={
                    isSpanish
                        ? "Navegación principal"
                        : "Main navigation"
                }
                className="mx-auto flex h-[76px] max-w-7xl items-center justify-between px-5 sm:px-8 lg:px-10"
            >
                {/* Logo */}
                <Link
                    href={homeHref}
                    onClick={() => setMobileMenuOpen(false)}
                    aria-label="Global Army Ranking - Home"
                    className="group flex shrink-0 items-center gap-3"
                >
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-violet-300/20 bg-violet-400/10 text-violet-300 transition group-hover:bg-violet-400/20">
                        <Crown size={22} strokeWidth={2.2} />
                    </span>

                    <span className="flex flex-col leading-tight">
                        <span className="text-base font-bold tracking-tight text-white sm:text-lg">
                            Global Army
                        </span>

                        <span className="mt-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-violet-300 sm:text-[11px]">
                            Ranking
                        </span>
                    </span>
                </Link>

                {/* Desktop navigation */}
                <div className="hidden items-center gap-8 md:flex">
                    {navLinks.map((item) => {
                        const isActive =
                            currentPath === item.href ||
                            (item.href === rankingHref &&
                                currentPath.startsWith(
                                    `${rankingHref}/`,
                                ));

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`text-sm font-medium transition ${
                                    isActive
                                        ? "text-violet-300"
                                        : "text-white/65 hover:text-white"
                                }`}
                            >
                                {item.label}
                            </Link>
                        );
                    })}
                </div>

                {/* Desktop actions */}
                <div className="hidden items-center gap-3 md:flex">
                    {languageSelector}
                    {authButton}
                </div>

                {/* Mobile actions: language + menu */}
                <div className="flex items-center gap-2 md:hidden">
                    {languageSelector}

                    <button
                        type="button"
                        aria-label={
                            mobileMenuOpen
                                ? isSpanish
                                    ? "Cerrar menú"
                                    : "Close menu"
                                : isSpanish
                                    ? "Abrir menú"
                                    : "Open menu"
                        }
                        aria-expanded={mobileMenuOpen}
                        aria-controls="mobile-navigation"
                        onClick={() =>
                            setMobileMenuOpen((previous) => !previous)
                        }
                        className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] text-white transition hover:bg-white/[0.08]"
                    >
                        {mobileMenuOpen ? (
                            <X size={21} />
                        ) : (
                            <Menu size={21} />
                        )}
                    </button>
                </div>
            </nav>

            {/* Mobile navigation */}
            {mobileMenuOpen && (
                <div
                    id="mobile-navigation"
                    className="border-t border-white/[0.08] bg-[#090710] px-5 pb-5 pt-4 md:hidden"
                >
                    <div className="mx-auto flex max-w-7xl flex-col gap-2">
                        {navLinks.map((item) => {
                            const isActive =
                                currentPath === item.href ||
                                (item.href === rankingHref &&
                                    currentPath.startsWith(
                                        `${rankingHref}/`,
                                    ));

                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    onClick={() =>
                                        setMobileMenuOpen(false)
                                    }
                                    className={`rounded-xl px-4 py-3 text-sm font-medium transition ${
                                        isActive
                                            ? "bg-violet-400/10 text-violet-300"
                                            : "text-white/70 hover:bg-white/[0.04] hover:text-white"
                                    }`}
                                >
                                    {item.label}
                                </Link>
                            );
                        })}

                        <div className="mt-3 flex flex-col gap-3 border-t border-white/[0.08] pt-4">
                            {authButton}
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
}