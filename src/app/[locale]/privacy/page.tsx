import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { isLocale } from "@/i18n/config";
import LegalPage from "@/components/legal/LegalPage";

type Props = {
  params: Promise<{ locale: string }>;
};

export const metadata: Metadata = {
  title: "Privacy Policy | Global Army Ranking",
  description:
    "Learn how Global Army Ranking handles account information, profile data, and voting history.",
};

export default async function PrivacyPage({ params }: Props) {
  const { locale } = await params;

  if (!isLocale(locale)) notFound();

  return <LegalPage locale={locale} page="privacy" />;
}