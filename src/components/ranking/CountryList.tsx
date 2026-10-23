"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowLeft, ArrowRight, Crown } from "lucide-react";

import type { RankedCountry } from "@/lib/ranking-types";

type Props = {
    locale: string;
    countries: RankedCountry[];
};

const PAGE_SIZE = 25;

function formatVotes(value: number, locale: string) {
    return new Intl.NumberFormat(
        locale === "es" ? "es-PE" : "en-US",
    ).format(value);
}

export default function CountryList({
    locale,
    countries,
}: Props) {
    const isSpanish = locale === "es";
    const [currentPage, setCurrentPage] = useState(1);

    const totalPages = Math.ceil(countries.length / PAGE_SIZE);
    const safePage = Math.min(currentPage, Math.max(totalPages, 1));
    const startIndex = (safePage - 1) * PAGE_SIZE;
    const visibleCountries = countries.slice(
        startIndex,
        startIndex + PAGE_SIZE,
    );

    function goToPage(page: number) {
        setCurrentPage(page);
    }

    return (
        <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#100d19]">
            <div className="hidden grid-cols-[70px_minmax(0,1fr)_130px_130px_50px] gap-4 border-b border-white/10 px-6 py-4 text-xs font-semibold uppercase tracking-wider text-white/40 sm:grid">
                <span>{isSpanish ? "Pos." : "Rank"}</span>
                <span>{isSpanish ? "País" : "Country"}</span>
                <span className="text-right">
                    {isSpanish ? "Votos" : "Votes"}
                </span>
                <span className="text-right">
                    {isSpanish ? "Miembros" : "Members"}
                </span>
                <span />
            </div>

            {visibleCountries.length > 0 ? (
                visibleCountries.map((country, index) => {
                    const position = startIndex + index + 1;
                    const isLeader = country.votes > 0 && position === 1;

                    return (
                        <Link
                            key={country.code}
                            href={`/${locale}/ranking/${country.slug}`}
                            className="group grid grid-cols-[30px_minmax(0,1fr)_auto_16px] items-center gap-3 border-b border-white/[0.06] px-3 py-4 transition last:border-0 hover:bg-violet-400/[0.045] sm:grid-cols-[70px_minmax(0,1fr)_130px_130px_50px] sm:gap-4 sm:px-6 sm:py-5"
                        >
                            <span
                                className={`flex items-center gap-1 text-xs font-semibold tabular-nums sm:text-sm ${position === 1 && country.votes > 0
                                    ? "text-amber-300"
                                    : position === 2 && country.votes > 0
                                        ? "text-slate-300"
                                        : position === 3 && country.votes > 0
                                            ? "text-orange-300"
                                            : "text-white/40"
                                    }`}
                            >
                                {position === 1 && country.votes > 0 ? (
                                    <Crown size={15} />
                                ) : (
                                    String(position).padStart(2, "0")
                                )}
                            </span>

                            <span className="flex min-w-0 items-center gap-2.5 sm:gap-3">

                                <span className="flex h-6 w-9 shrink-0 items-center justify-center overflow-hidden rounded-sm">
                                    <img
                                        src={`https://flagcdn.com/${country.code.toLowerCase()}.svg`}
                                        alt={
                                            isSpanish
                                                ? `Bandera de ${country.name_es}`
                                                : `Flag of ${country.name_en}`
                                        }
                                        width={36}
                                        height={24}
                                        loading="lazy"
                                        className="block h-auto max-h-6 w-full object-contain"
                                    />
                                </span>

                                <span className="min-w-0">
                                    <span className="block truncate text-sm font-semibold sm:text-base">
                                        {isSpanish ? country.name_es : country.name_en}
                                    </span>

                                    <span className="mt-1 block text-xs text-white/40 sm:hidden">
                                        {formatVotes(country.members, locale)}{" "}
                                        {isSpanish ? "miembros" : "members"}
                                    </span>
                                </span>
                            </span>

                            <span className="text-right">
                                <span
                                    className={`block text-sm font-bold tabular-nums sm:text-base ${isLeader ? "text-violet-200" : "text-white"
                                        }`}
                                >
                                    {formatVotes(country.votes, locale)}
                                </span>

                                <span className="mt-1 block text-[10px] text-white/35 sm:hidden">
                                    {isSpanish ? "votos" : "votes"}
                                </span>
                            </span>

                            <span className="hidden text-right text-sm tabular-nums text-white/55 sm:block">
                                {formatVotes(country.members, locale)}
                            </span>

                            <ArrowRight
                                size={18}
                                className="text-white/30 transition group-hover:text-violet-300"
                            />
                        </Link>
                    );
                })
            ) : (
                <div className="px-6 py-12 text-center">
                    <p className="font-medium">
                        {isSpanish
                            ? "No hay países disponibles."
                            : "No countries available."}
                    </p>

                    <p className="mt-2 text-sm text-white/45">
                        {isSpanish
                            ? "Los países activos aparecerán aquí."
                            : "Active countries will appear here."}
                    </p>
                </div>
            )}

            {totalPages > 1 && (
                <div className="flex flex-col gap-4 border-t border-white/[0.06] px-3 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
                    <p className="text-center text-xs text-white/45 sm:text-left">
                        {isSpanish ? "Mostrando" : "Showing"}{" "}
                        <span className="font-semibold text-white/80">
                            {startIndex + 1}–
                            {Math.min(startIndex + PAGE_SIZE, countries.length)}
                        </span>{" "}
                        {isSpanish ? "de" : "of"}{" "}
                        <span className="font-semibold text-white/80">
                            {countries.length}
                        </span>{" "}
                        {isSpanish ? "países" : "countries"}
                    </p>

                    <div className="flex items-center justify-center gap-1.5">
                        {Array.from(
                            { length: totalPages },
                            (_, index) => index + 1,
                        )
                            .filter(
                                (page) =>
                                    page === 1 ||
                                    page === totalPages ||
                                    Math.abs(page - safePage) <= 1,
                            )
                            .map((page, index, pages) => {
                                const previousPage = pages[index - 1];
                                const showEllipsis =
                                    previousPage !== undefined &&
                                    page - previousPage > 1;

                                return (
                                    <span key={page} className="flex items-center gap-1.5">
                                        {showEllipsis && (
                                            <span
                                                className="px-0.5 text-xs text-white/35"
                                                aria-hidden="true"
                                            >
                                                ...
                                            </span>
                                        )}

                                        <button
                                            type="button"
                                            onClick={() => goToPage(page)}
                                            aria-label={`${isSpanish ? "Página" : "Page"} ${page}`}
                                            aria-current={safePage === page ? "page" : undefined}
                                            className={`h-9 min-w-9 rounded-lg px-2 text-sm font-semibold transition ${safePage === page
                                                ? "bg-violet-500 text-white shadow-lg shadow-violet-500/20"
                                                : "text-white/55 hover:bg-violet-400/10 hover:text-white"
                                                }`}
                                        >
                                            {page}
                                        </button>
                                    </span>
                                );
                            })}
                    </div>
                </div>
            )}

            <p className="border-t border-white/[0.06] px-5 py-4 text-xs leading-5 text-white/35 sm:px-6">
                {isSpanish
                    ? "Los países se ordenan por votos acumulados. En caso de empate, se priorizan los que tienen más miembros."
                    : "Countries are ranked by accumulated votes. Ties are broken by registered members."}
            </p>
        </div>
    );
}
