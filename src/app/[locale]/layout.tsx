import { Suspense, type ReactNode } from "react";
import { notFound } from "next/navigation";

import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import { isLocale } from "@/i18n/config";
import { createClient } from "@/lib/supabase/server";

type Props = {
  children: ReactNode;
  params: Promise<{ locale: string }>;
};

type LocaleContentProps = {
  locale: string;
  children: ReactNode;
};

async function AuthenticatedNavbar({
  locale,
}: {
  locale: string;
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <Navbar
      locale={locale}
      isAuthenticated={Boolean(user)}
    />
  );
}

function NavbarFallback() {
  return (
    <div className="h-16" aria-hidden="true" />
  );
}

function LocaleContent({
  locale,
  children,
}: LocaleContentProps) {
  return (
    <>
      <Suspense fallback={<NavbarFallback />}>
        <AuthenticatedNavbar locale={locale} />
      </Suspense>

      <main>{children}</main>

      <Suspense fallback={null}>
        <Footer locale={locale} />
      </Suspense>
    </>
  );
}

async function LocaleContentWithParams({
  children,
  params,
}: Props) {
  const { locale } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  return (
    <LocaleContent locale={locale}>
      {children}
    </LocaleContent>
  );
}

export default function LocaleLayout({
  children,
  params,
}: Props) {
  return (
    <Suspense
      fallback={
        <div
          className="min-h-screen bg-[#090710]"
          aria-hidden="true"
        />
      }
    >
      <LocaleContentWithParams params={params}>
        {children}
      </LocaleContentWithParams>
    </Suspense>
  );
}