
import { NextResponse, type NextRequest } from "next/server";

import { createClient } from "@/lib/supabase/server";
import { defaultLocale, isLocale } from "@/i18n/config";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = request.nextUrl;

  const code = searchParams.get("code");
  const requestedLocale = searchParams.get("locale");

  const locale =
    requestedLocale && isLocale(requestedLocale)
      ? requestedLocale
      : defaultLocale;

  if (!code) {
    return NextResponse.redirect(
      new URL(`/${locale}/login?error=auth`, origin),
    );
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    return NextResponse.redirect(
      new URL(`/${locale}/login?error=auth`, origin),
    );
  }

  return NextResponse.redirect(
    new URL(`/${locale}/account`, origin),
  );
}
