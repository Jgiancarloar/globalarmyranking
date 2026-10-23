import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { isLocale } from "@/i18n/config";
import LegalPage from "@/components/legal/LegalPage";

type Props = {
  params: Promise<{ locale: string }>;
};

export const metadata: Metadata = {
  title: "Terms and Conditions | Global Army Ranking",
  description:
    "Read the terms and conditions for using Global Army Ranking.",
};

export default async function TermsPage({ params }: Props) {
  const { locale } = await params;

  if (!isLocale(locale)) notFound();

  return <LegalPage locale={locale} page="terms" />;
}