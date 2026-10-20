
"use server";

import { revalidatePath } from "next/cache";

import { isLocale } from "@/i18n/config";
import { createClient } from "@/lib/supabase/server";

type SaveProfileResult = {
  success: boolean;
  message: string;
};

export async function saveProfile(
  locale: string,
  formData: FormData,
): Promise<SaveProfileResult> {
  if (!isLocale(locale)) {
    return {
      success: false,
      message: "Invalid language.",
    };
  }

  const isSpanish = locale === "es";

  const displayName = String(
    formData.get("display_name") ?? "",
  ).trim();

  const countryCode = String(
    formData.get("country_code") ?? "",
  )
    .trim()
    .toUpperCase();

  if (displayName.length < 2 || displayName.length > 40) {
    return {
      success: false,
      message: isSpanish
        ? "El nombre debe tener entre 2 y 40 caracteres."
        : "Your name must contain between 2 and 40 characters.",
    };
  }

  if (countryCode && !/^[A-Z]{2}$/.test(countryCode)) {
    return {
      success: false,
      message: isSpanish
        ? "Selecciona un país válido."
        : "Please select a valid country.",
    };
  }

  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return {
      success: false,
      message: isSpanish
        ? "Tu sesión ha expirado. Inicia sesión nuevamente."
        : "Your session has expired. Please sign in again.",
    };
  }

  const { data: existingProfile, error: profileError } =
    await supabase
      .from("profiles")
      .select("country_code")
      .eq("id", user.id)
      .maybeSingle();

  if (profileError) {
    console.error("Error checking profile:", profileError);

    return {
      success: false,
      message: isSpanish
        ? "No pudimos verificar tu perfil. Inténtalo nuevamente."
        : "We couldn't verify your profile. Please try again.",
    };
  }

  const savedCountry = existingProfile?.country_code ?? null;

  if (
    savedCountry !== null &&
    countryCode !== savedCountry
  ) {
    return {
      success: false,
      message: isSpanish
        ? "Tu país ya está registrado y no se puede cambiar."
        : "Your country has already been registered and cannot be changed.",
    };
  }

  if (countryCode) {
    const { data: country, error: countryError } =
      await supabase
        .from("countries")
        .select("code")
        .eq("code", countryCode)
        .eq("is_active", true)
        .maybeSingle();

    if (countryError || !country) {
      return {
        success: false,
        message: isSpanish
          ? "El país seleccionado no existe o no está disponible."
          : "The selected country does not exist or is unavailable.",
      };
    }
  }

  const { error: saveError } = await supabase
    .from("profiles")
    .upsert(
      {
        id: user.id,
        display_name: displayName,
        country_code: countryCode || null,
      },
      { onConflict: "id" },
    );

  if (saveError) {
    console.error("Error saving profile:", saveError);

    const immutableCountry =
      saveError.message.includes("PROFILE_COUNTRY_IMMUTABLE");

    return {
      success: false,
      message: immutableCountry
        ? isSpanish
          ? "Tu país ya está registrado y no se puede cambiar."
          : "Your country has already been registered and cannot be changed."
        : isSpanish
          ? "No pudimos guardar tu perfil. Inténtalo nuevamente."
          : "We couldn't save your profile. Please try again.",
    };
  }

  revalidatePath(`/${locale}/account`);
  revalidatePath(`/${locale}/ranking`);
  revalidatePath(`/${locale}/vote`);

  return {
    success: true,
    message: isSpanish
      ? "Tu perfil se guardó correctamente."
      : "Your profile was saved successfully.",
  };
}

/**
 * Guarda la URL del avatar del usuario autenticado en profiles
 * y la mantiene sincronizada con los metadatos de Supabase Auth.
 */
export async function saveAvatarUrl(
  locale: string,
  avatarUrl: string,
): Promise<SaveProfileResult> {
  if (!isLocale(locale)) {
    return {
      success: false,
      message: "Invalid language.",
    };
  }

  const isSpanish = locale === "es";
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return {
      success: false,
      message: isSpanish
        ? "Tu sesión ha expirado. Inicia sesión nuevamente."
        : "Your session has expired. Please sign in again.",
    };
  }

  // La URL debe corresponder al archivo avatar del propio usuario
  // dentro del bucket público avatars.
  const expectedPublicUrl = supabase.storage
    .from("avatars")
    .getPublicUrl(`${user.id}/avatar`)
    .data.publicUrl;

  const submittedBaseUrl = avatarUrl.split("?")[0];
  const expectedBaseUrl = expectedPublicUrl.split("?")[0];

  if (
    !avatarUrl ||
    submittedBaseUrl !== expectedBaseUrl
  ) {
    return {
      success: false,
      message: isSpanish
        ? "La URL de la foto no es válida."
        : "The profile photo URL is invalid.",
    };
  }

  // Guardamos la URL en la tabla que consulta el ranking.
  const { error: profileError } = await supabase
    .from("profiles")
    .upsert(
      {
        id: user.id,
        avatar_url: avatarUrl,
      },
      { onConflict: "id" },
    );

  if (profileError) {
    console.error("Error saving avatar to profiles:", profileError);

    return {
      success: false,
      message: isSpanish
        ? "La imagen se subió, pero no pudimos guardar la foto en tu perfil."
        : "The image was uploaded, but we couldn't save it to your profile.",
    };
  }

  // Sincronizamos también los metadatos que usa la cuenta.
  const { error: metadataError } = await supabase.auth.updateUser({
    data: {
      custom_avatar_url: avatarUrl,
    },
  });

  if (metadataError) {
    console.error("Error syncing avatar metadata:", metadataError);
  }

  revalidatePath(`/${locale}/account`);
  revalidatePath(`/${locale}/ranking`);

  return {
    success: true,
    message: isSpanish
      ? "Foto de perfil actualizada correctamente."
      : "Profile photo updated successfully.",
  };
}
