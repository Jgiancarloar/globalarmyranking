import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { isLocale } from "@/i18n/config";
import LegalPage from "@/components/legal/LegalPage";

type Props = {
  params: Promise<{ locale: string }>;
};

export const metadata: Metadata = {
  title: "Contact and Support | Global Army Ranking",
  description:
    "Get help with your Global Army Ranking account, profile, or voting experience.",
};

export default async function ContactPage({ params }: Props) {
  const { locale } = await params;

  if (!isLocale(locale)) notFound();

  return <LegalPage locale={locale} page="contact" />;
}