"use server";

import { revalidatePath } from "next/cache";
import { createClient as createSupabaseAdminClient } from "@supabase/supabase-js";

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
        return { success: false, message: "Invalid language." };
    }

    const isSpanish = locale === "es";

    const displayName = String(formData.get("display_name") ?? "").trim();
    const countryCode = String(formData.get("country_code") ?? "")
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

    if (!/^[A-Z]{2}$/.test(countryCode)) {
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

    const { data: country, error: countryError } = await supabase
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

    // Actualizamos el país actual del perfil.
    // No actualizamos la tabla votes: el historial conserva el país
    // registrado en cada voto.
    const { error: saveError } = await supabase
        .from("profiles")
        .upsert(
            {
                id: user.id,
                display_name: displayName,
                country_code: countryCode,
            },
            { onConflict: "id" },
        );


    if (saveError) {
        console.error("Error saving profile:", saveError);

        const isImmutableCountry =
            saveError.message.includes("COUNTRY_CHANGE_NOT_ALLOWED") ||
            saveError.message.includes("PROFILE_COUNTRY_IMMUTABLE");

        return {
            success: false,
            message: isImmutableCountry
                ? isSpanish
                    ? "Ya has votado. Tu país no se puede cambiar después de emitir tu primer voto."
                    : "You've already voted. Your country cannot be changed after your first vote."
                : isSpanish
                    ? "No pudimos guardar tu perfil. Inténtalo nuevamente."
                    : "We couldn't save your profile. Please try again.",
        };
    }


    revalidatePath(`/${locale}/account`);
    revalidatePath(`/${locale}/ranking`);
    revalidatePath(`/${locale}/vote`);
    revalidatePath(`/${locale}`);

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
        return { success: false, message: "Invalid language." };
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

    const expectedPublicUrl = supabase.storage
        .from("avatars")
        .getPublicUrl(`${user.id}/avatar`).data.publicUrl;

    const submittedBaseUrl = avatarUrl.split("?")[0];
    const expectedBaseUrl = expectedPublicUrl.split("?")[0];

    if (!avatarUrl || submittedBaseUrl !== expectedBaseUrl) {
        return {
            success: false,
            message: isSpanish
                ? "La URL de la foto no es válida."
                : "The profile photo URL is invalid.",
        };
    }

    const { error: profileError } = await supabase
        .from("profiles")
        .upsert(
            { id: user.id, avatar_url: avatarUrl },
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

    const { error: metadataError } = await supabase.auth.updateUser({
        data: { custom_avatar_url: avatarUrl },
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

/**
 * Elimina únicamente la cuenta autenticada.
 * La base de datos ya tiene ON DELETE CASCADE para profiles y votes.
 */
export async function deleteMyAccount(
    locale: string,
    confirmation: string,
): Promise<SaveProfileResult> {
    if (!isLocale(locale)) {
        return { success: false, message: "Invalid language." };
    }

    const isSpanish = locale === "es";

    const expectedConfirmation = isSpanish
        ? "ELIMINAR MI CUENTA"
        : "DELETE MY ACCOUNT";

    if (confirmation !== expectedConfirmation) {
        return {
            success: false,
            message: isSpanish
                ? 'Escribe exactamente "ELIMINAR MI CUENTA" para confirmar.'
                : 'Type exactly "DELETE MY ACCOUNT" to confirm.',
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

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !serviceRoleKey) {
        console.error("Missing server-side Supabase admin environment variables.");

        return {
            success: false,
            message: isSpanish
                ? "La eliminación de cuentas no está configurada todavía. Contacta con soporte."
                : "Account deletion is not configured yet. Please contact support.",
        };
    }

    const admin = createSupabaseAdminClient(supabaseUrl, serviceRoleKey, {
        auth: {
            autoRefreshToken: false,
            persistSession: false,
        },
    });

    // El avatar se guarda en una ruta fija dentro del bucket privado/público.
    // Si falla la eliminación del archivo, no eliminamos la cuenta a medias.
    const { error: avatarError } = await admin.storage
        .from("avatars")
        .remove([`${user.id}/avatar`]);

    if (avatarError) {
        console.error("Error deleting account avatar:", avatarError);

        return {
            success: false,
            message: isSpanish
                ? "No pudimos eliminar la foto de perfil. No se eliminó la cuenta; inténtalo nuevamente."
                : "We couldn't delete your profile photo. Your account was not deleted; please try again.",
        };
    }

    const { error: deleteError } = await admin.auth.admin.deleteUser(user.id);

    if (deleteError) {
        console.error("Error deleting user account:", deleteError);

        return {
            success: false,
            message: isSpanish
                ? "No pudimos eliminar tu cuenta. Inténtalo nuevamente o contacta con soporte."
                : "We couldn't delete your account. Please try again or contact support.",
        };
    }

    revalidatePath(`/${locale}/account`);
    revalidatePath(`/${locale}/ranking`);
    revalidatePath(`/${locale}/vote`);
    revalidatePath(`/${locale}`);

    return {
        success: true,
        message: isSpanish
            ? "Tu cuenta se eliminó correctamente."
            : "Your account was deleted successfully.",
    };
}
