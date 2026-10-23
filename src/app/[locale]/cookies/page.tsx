import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { isLocale } from "@/i18n/config";
import LegalPage from "@/components/legal/LegalPage";

type Props = {
  params: Promise<{ locale: string }>;
};

export const metadata: Metadata = {
  title: "Cookie Policy | Global Army Ranking",
  description:
    "Learn about cookies and similar technologies used by Global Army Ranking.",
};

export default async function CookiesPage({ params }: Props) {
  const { locale } = await params;

  if (!isLocale(locale)) notFound();

  return <LegalPage locale={locale} page="cookies" />;
}