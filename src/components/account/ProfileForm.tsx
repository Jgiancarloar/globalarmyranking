
"use client";

import {
    useEffect,
    useRef,
    useState,
    type ChangeEvent,
    type FormEvent,
} from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
    UserRound,
    Mail,
    Globe2,
    Save,
    ChevronDown,
    CheckCircle2,
    AlertCircle,
    Camera,
    LoaderCircle,
    Trash2,
    ShieldCheck,
} from "lucide-react";

import {
    saveProfile,
    saveAvatarUrl,
    deleteMyAccount,
} from "@/app/[locale]/account/actions";
import { createClient } from "@/lib/supabase/client";

type Country = {
    code: string;
    name_en: string;
    name_es: string;
    flag_emoji: string;
};

type Props = {
    locale: string;
    email: string;
    initialName: string;
    initialCountry: string;
    initialAvatarUrl: string | null;
    userId: string;
    countries: Country[];
    hasVoted: boolean;
};

type Feedback = {
    success: boolean;
    message: string;
} | null;

const MAX_AVATAR_SIZE = 2 * 1024 * 1024;

const ALLOWED_TYPES = [
    "image/jpeg",
    "image/png",
    "image/webp",
];

export default function ProfileForm({
    locale,
    email,
    initialName,
    initialCountry,
    initialAvatarUrl,
    userId,
    countries,
    hasVoted,
}: Props) {
    const isSpanish = locale === "es";
    const router = useRouter();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const previewUrlRef = useRef<string | null>(null);

    const [displayName, setDisplayName] = useState(initialName);
    const [countryCode, setCountryCode] = useState(initialCountry);

    const [savedName, setSavedName] = useState(initialName.trim());
    const [savedCountry, setSavedCountry] = useState(initialCountry);

    const [avatarUrl, setAvatarUrl] = useState(initialAvatarUrl);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    const [loading, setLoading] = useState(false);
    const [avatarLoading, setAvatarLoading] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [deleteConfirmation, setDeleteConfirmation] = useState("");
    const [feedback, setFeedback] = useState<Feedback>(null);

    // Si ya votó, no permitimos que el formulario considere
    // el país como un campo editable.
    const effectiveCountryCode = hasVoted
        ? initialCountry
        : countryCode;

    const hasProfileChanges =
        displayName.trim() !== savedName ||
        effectiveCountryCode !== savedCountry;

    const hasChanges = hasProfileChanges || Boolean(selectedFile);
    const isSaving = loading || avatarLoading || deleteLoading;

    useEffect(() => {
        setDisplayName(initialName);
        setCountryCode(initialCountry);
        setSavedName(initialName.trim());
        setSavedCountry(initialCountry);
        setAvatarUrl(initialAvatarUrl);
        setFeedback(null);
    }, [initialName, initialCountry, initialAvatarUrl]);

    // Si la cuenta ya votó, sincronizamos el selector con el país
    // que devuelve el servidor.
    useEffect(() => {
        if (hasVoted) {
            setCountryCode(initialCountry);
            setSavedCountry(initialCountry);
        }
    }, [hasVoted, initialCountry]);

    useEffect(() => {
        return () => {
            if (previewUrlRef.current) {
                URL.revokeObjectURL(previewUrlRef.current);
                previewUrlRef.current = null;
            }
        };
    }, []);

    useEffect(() => {
        if (!feedback) return;

        const timeoutId = window.setTimeout(() => {
            setFeedback(null);
        }, 7000);

        return () => window.clearTimeout(timeoutId);
    }, [feedback]);

    useEffect(() => {
        function handlePageShow(event: PageTransitionEvent) {
            if (event.persisted) {
                router.refresh();
            }
        }

        window.addEventListener("pageshow", handlePageShow);

        return () => {
            window.removeEventListener("pageshow", handlePageShow);
        };
    }, [router]);

    function clearPreview() {
        if (previewUrlRef.current) {
            URL.revokeObjectURL(previewUrlRef.current);
            previewUrlRef.current = null;
        }

        setPreviewUrl(null);
        setSelectedFile(null);

        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    }

    function handleAvatarSelection(
        event: ChangeEvent<HTMLInputElement>,
    ) {
        const file = event.target.files?.[0];

        if (!file) return;

        if (!ALLOWED_TYPES.includes(file.type)) {
            setFeedback({
                success: false,
                message: isSpanish
                    ? "Usa una imagen JPG, PNG o WebP."
                    : "Use a JPG, PNG, or WebP image.",
            });

            event.target.value = "";
            return;
        }

        if (file.size > MAX_AVATAR_SIZE) {
            setFeedback({
                success: false,
                message: isSpanish
                    ? "La imagen debe pesar como máximo 2 MB."
                    : "The image must be 2 MB or smaller.",
            });

            event.target.value = "";
            return;
        }

        if (previewUrlRef.current) {
            URL.revokeObjectURL(previewUrlRef.current);
        }

        const nextPreview = URL.createObjectURL(file);

        previewUrlRef.current = nextPreview;
        setPreviewUrl(nextPreview);
        setSelectedFile(file);
        setFeedback(null);
    }

    function handleCountryChange(
        event: ChangeEvent<HTMLSelectElement>,
    ) {
        if (hasVoted) return;

        setCountryCode(event.target.value);
        setFeedback(null);
    }

    async function uploadAvatar(file: File): Promise<string> {
        const supabase = createClient();

        const {
            data: { user },
            error: authError,
        } = await supabase.auth.getUser();

        if (authError || !user || user.id !== userId) {
            throw new Error(
                isSpanish
                    ? "Tu sesión no es válida. Vuelve a iniciar sesión."
                    : "Your session is invalid. Please sign in again.",
            );
        }

        const filePath = `${userId}/avatar`;

        const { error: uploadError } = await supabase.storage
            .from("avatars")
            .upload(filePath, file, {
                upsert: true,
                contentType: file.type,
                cacheControl: "0",
            });

        if (uploadError) {
            throw new Error(`Storage: ${uploadError.message}`);
        }

        const { data } = supabase.storage
            .from("avatars")
            .getPublicUrl(filePath);

        const publicUrl = `${data.publicUrl}?v=${Date.now()}`;

        const result = await saveAvatarUrl(locale, publicUrl);

        if (!result.success) {
            throw new Error(result.message);
        }

        return publicUrl;
    }

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        if (isSaving || !hasChanges) return;

        const submittedCountry = effectiveCountryCode;

        if (!submittedCountry) {
            setFeedback({
                success: false,
                message: isSpanish
                    ? "Debes elegir un país para guardar tu perfil."
                    : "You must choose a country to save your profile.",
            });
            return;
        }

        if (
            displayName.trim().length < 2 ||
            displayName.trim().length > 40
        ) {
            setFeedback({
                success: false,
                message: isSpanish
                    ? "El nombre debe tener entre 2 y 40 caracteres."
                    : "Your name must contain between 2 and 40 characters.",
            });
            return;
        }

        const formData = new FormData(event.currentTarget);
        const submittedName = displayName.trim();
        const shouldSaveProfile =
            submittedName !== savedName ||
            submittedCountry !== savedCountry;
        const fileToUpload = selectedFile;

        formData.set("display_name", submittedName);
        formData.set("country_code", submittedCountry);

        setFeedback(null);
        setLoading(shouldSaveProfile);
        setAvatarLoading(Boolean(fileToUpload));

        let successMessage = "";
        let saveSucceeded = false;

        try {
            if (shouldSaveProfile) {
                const result = await saveProfile(locale, formData);

                if (!result.success) {
                    setFeedback(result);
                    return;
                }

                setDisplayName(submittedName);
                setCountryCode(submittedCountry);
                setSavedName(submittedName);
                setSavedCountry(submittedCountry);

                successMessage = result.message;
            }

            if (fileToUpload) {
                const newAvatarUrl = await uploadAvatar(fileToUpload);

                setAvatarUrl(newAvatarUrl);
                clearPreview();

                successMessage = isSpanish
                    ? "Foto de perfil actualizada correctamente."
                    : "Profile photo updated successfully.";
            }

            saveSucceeded = true;

            setFeedback({
                success: true,
                message:
                    successMessage ||
                    (isSpanish
                        ? "Cambios guardados correctamente."
                        : "Changes saved successfully."),
            });
        } catch (error) {
            console.error("Error updating profile:", error);

            const details =
                error instanceof Error
                    ? error.message
                    : "Unknown error";

            setFeedback({
                success: false,
                message: isSpanish
                    ? `No pudimos guardar los cambios: ${details}`
                    : `We couldn't save your changes: ${details}`,
            });
        } finally {
            setLoading(false);
            setAvatarLoading(false);

            if (saveSucceeded) {
                router.refresh();
            }
        }
    }

    async function handleDeleteAccount() {
        const expectedConfirmation = isSpanish
            ? "ELIMINAR MI CUENTA"
            : "DELETE MY ACCOUNT";

        if (deleteConfirmation !== expectedConfirmation) {
            setFeedback({
                success: false,
                message: isSpanish
                    ? 'Escribe exactamente "ELIMINAR MI CUENTA" para confirmar.'
                    : 'Type exactly "DELETE MY ACCOUNT" to confirm.',
            });
            return;
        }

        const confirmed = window.confirm(
            isSpanish
                ? "¿Estás completamente seguro?\n\nSe eliminarán tu cuenta, tu perfil, tu foto y los votos asociados. Esta acción es irreversible y no podrás recuperar tu historial."
                : "Are you absolutely sure?\n\nYour account, profile, photo, and associated votes will be deleted. This action is irreversible and your history cannot be recovered.",
        );

        if (!confirmed) return;

        setDeleteLoading(true);
        setFeedback(null);

        try {
            const result = await deleteMyAccount(
                locale,
                deleteConfirmation,
            );

            if (!result.success) {
                setFeedback(result);
                return;
            }

            const supabase = createClient();
            await supabase.auth.signOut();

            router.replace(`/${locale}`);
            router.refresh();
        } catch (error) {
            console.error("Error deleting account:", error);

            setFeedback({
                success: false,
                message: isSpanish
                    ? "Ocurrió un error al eliminar la cuenta. Inténtalo nuevamente."
                    : "An error occurred while deleting your account. Please try again.",
            });
        } finally {
            setDeleteLoading(false);
        }
    }

    const selectedCountry = countries.find(
        (country) => country.code === effectiveCountryCode,
    );

    const selectedCountryName = selectedCountry
        ? isSpanish
            ? selectedCountry.name_es
            : selectedCountry.name_en
        : "";

    const displayedAvatar = previewUrl || avatarUrl;

    const expectedDeleteConfirmation = isSpanish
        ? "ELIMINAR MI CUENTA"
        : "DELETE MY ACCOUNT";

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Foto de perfil */}
            <div className="flex flex-col gap-5 rounded-2xl border border-white/[0.08] bg-white/[0.02] p-5 sm:flex-row sm:items-center">
                <div className="relative h-24 w-24 shrink-0">
                    <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-full border-2 border-violet-400/40 bg-violet-400/10 text-violet-200">
                        {displayedAvatar ? (
                            <Image
                                src={displayedAvatar}
                                alt={isSpanish ? "Foto de perfil" : "Profile photo"}
                                width={96}
                                height={96}
                                unoptimized
                                className="h-full w-full object-cover"
                            />
                        ) : (
                            <UserRound size={38} />
                        )}
                    </div>

                    <div className="absolute bottom-0 right-0 flex h-8 w-8 items-center justify-center rounded-full border-2 border-[#13101e] bg-violet-500 text-white">
                        <Camera size={15} />
                    </div>
                </div>

                <div className="min-w-0 flex-1">
                    <h3 className="font-semibold">
                        {isSpanish ? "Foto de perfil" : "Profile photo"}
                    </h3>

                    <p className="mt-1 text-sm leading-6 text-white/50">
                        {isSpanish
                            ? "Personaliza tu identidad en la comunidad ARMY."
                            : "Personalize your identity in the ARMY community."}
                    </p>

                    <div className="mt-3 flex flex-wrap items-center gap-3">
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/jpeg,image/png,image/webp"
                            onChange={handleAvatarSelection}
                            disabled={isSaving}
                            className="block w-full max-w-full text-xs text-white/50 file:mr-3 file:cursor-pointer file:rounded-lg file:border-0 file:bg-violet-500/15 file:px-3 file:py-2 file:text-sm file:font-semibold file:text-violet-200 hover:file:bg-violet-500/25 disabled:opacity-50 sm:max-w-sm"
                        />

                        {selectedFile && (
                            <button
                                type="button"
                                onClick={() => {
                                    clearPreview();
                                    setFeedback(null);
                                }}
                                disabled={isSaving}
                                className="text-xs font-medium text-white/60 transition hover:text-white disabled:opacity-50"
                            >
                                {isSpanish ? "Cancelar foto" : "Cancel photo"}
                            </button>
                        )}
                    </div>

                    <p className="mt-2 text-xs leading-5 text-white/35">
                        {isSpanish
                            ? "JPG, PNG o WebP. Máximo 2 MB. Guarda los cambios para aplicar la foto."
                            : "JPG, PNG, or WebP. Maximum 2 MB. Save your changes to apply the photo."}
                    </p>
                </div>
            </div>

            {/* Nombre público */}
            <div>
                <label
                    htmlFor="display_name"
                    className="mb-2 flex items-center gap-2 text-sm font-medium text-white/80"
                >
                    <UserRound size={16} className="text-violet-300" />
                    {isSpanish ? "Nombre público" : "Public name"}
                </label>

                <input
                    id="display_name"
                    name="display_name"
                    type="text"
                    value={displayName}
                    onChange={(event) => setDisplayName(event.target.value)}
                    maxLength={40}
                    minLength={2}
                    required
                    autoComplete="nickname"
                    placeholder={
                        isSpanish
                            ? "¿Cómo quieres aparecer?"
                            : "How should your name appear?"
                    }
                    disabled={isSaving}
                    className="h-[50px] w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 text-sm text-white outline-none transition placeholder:text-white/30 focus:border-violet-400/60 focus:ring-2 focus:ring-violet-400/10 disabled:opacity-50"
                />

                <p className="mt-2 text-xs leading-5 text-white/40">
                    {isSpanish
                        ? "Este nombre será visible en el ranking de usuarios."
                        : "This name will be visible in the user ranking."}
                </p>
            </div>

            {/* Correo y país */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="min-w-0">
                    <label
                        htmlFor="email"
                        className="mb-2 flex items-center gap-2 text-sm font-medium text-white/80"
                    >
                        <Mail size={16} className="text-violet-300" />
                        {isSpanish ? "Correo electrónico" : "Email address"}
                    </label>

                    <input
                        id="email"
                        type="email"
                        value={email}
                        readOnly
                        aria-readonly="true"
                        className="h-[50px] w-full min-w-0 cursor-not-allowed rounded-xl border border-white/10 bg-white/[0.03] px-4 text-sm text-white/50 outline-none"
                    />

                    <p className="mt-2 text-xs leading-5 text-white/40">
                        {isSpanish
                            ? "Vinculado a tu cuenta de Google. No editable."
                            : "Linked to your Google account. Not editable."}
                    </p>
                </div>

                <div className="min-w-0">
                    <label
                        htmlFor="country_code"
                        className="mb-2 flex items-center gap-2 text-sm font-medium text-white/80"
                    >
                        <Globe2 size={16} className="text-violet-300" />
                        {isSpanish ? "País al que apoyas" : "Country you support"}
                    </label>

                    <div className="relative">
                        <select
                            id="country_code"
                            name="country_code"
                            required
                            value={effectiveCountryCode}
                            disabled={
                                isSaving ||
                                countries.length === 0 ||
                                hasVoted
                            }
                            onChange={handleCountryChange}
                            aria-describedby="country-help"
                            className="h-[50px] w-full appearance-none rounded-xl border border-white/10 bg-[#0d0a16] py-3 pl-4 pr-12 text-sm text-white outline-none transition hover:border-white/20 focus:border-violet-400/60 focus:ring-2 focus:ring-violet-400/10 disabled:cursor-not-allowed disabled:opacity-70"
                        >
                            <option value="" disabled>
                                {isSpanish
                                    ? "Selecciona tu país"
                                    : "Select your country"}
                            </option>

                            {countries.map((country) => (
                                <option
                                    key={country.code}
                                    value={country.code}
                                >
                                    {country.flag_emoji}{" "}
                                    {isSpanish
                                        ? country.name_es
                                        : country.name_en}
                                </option>
                            ))}
                        </select>

                        <div
                            aria-hidden="true"
                            className="pointer-events-none absolute inset-y-0 right-0 flex w-11 items-center justify-center text-white/60"
                        >
                            <ChevronDown size={18} strokeWidth={1.8} />
                        </div>
                    </div>

                    <p
                        id="country-help"
                        className="mt-2 text-xs leading-5 text-white/40"
                    >
                        {hasVoted
                            ? isSpanish
                                ? "Tu país quedó fijado al emitir tu primer voto y ya no se puede cambiar en esta cuenta."
                                : "Your country was locked when you cast your first vote and can no longer be changed for this account."
                            : isSpanish
                                ? "Puedes corregir tu país hasta emitir tu primer voto. Después quedará fijado para esta cuenta."
                                : "You can correct your country until you cast your first vote. After that, it will be locked for this account."}
                    </p>

                    {hasVoted && (
                        <div className="mt-3 flex items-start gap-2 rounded-xl border border-violet-300/15 bg-violet-400/[0.06] p-3 text-xs leading-5 text-violet-200/80">
                            <ShieldCheck
                                size={16}
                                className="mt-0.5 shrink-0"
                            />
                            <span>
                                {isSpanish
                                    ? "Esta medida mantiene la consistencia de los rankings por país."
                                    : "This keeps country rankings consistent."}
                            </span>
                        </div>
                    )}

                    {!hasVoted &&
                        countryCode !== savedCountry &&
                        selectedCountryName && (
                            <p className="mt-2 text-xs leading-5 text-violet-200/80">
                                {isSpanish
                                    ? `Nuevo país seleccionado: ${selectedCountryName}. Guarda los cambios para aplicarlo.`
                                    : `New country selected: ${selectedCountryName}. Save your changes to apply it.`}
                            </p>
                        )}
                </div>
            </div>

            {/* Mensaje de resultado */}
            {feedback && (
                <div
                    role={feedback.success ? "status" : "alert"}
                    aria-live="polite"
                    className={`flex items-start gap-3 rounded-xl border p-4 text-sm leading-6 ${
                        feedback.success
                            ? "border-emerald-400/20 bg-emerald-400/[0.07] text-emerald-200"
                            : "border-rose-400/20 bg-rose-400/[0.07] text-rose-200"
                    }`}
                >
                    {feedback.success ? (
                        <CheckCircle2
                            size={18}
                            className="mt-1 shrink-0"
                        />
                    ) : (
                        <AlertCircle
                            size={18}
                            className="mt-1 shrink-0"
                        />
                    )}

                    <span>{feedback.message}</span>
                </div>
            )}

            {/* Guardar cambios */}
            <button
                type="submit"
                disabled={
                    isSaving ||
                    !hasChanges ||
                    countries.length === 0
                }
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-violet-500 px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-violet-400 disabled:cursor-not-allowed disabled:opacity-40 sm:w-auto"
            >
                {loading || avatarLoading ? (
                    <LoaderCircle
                        size={17}
                        className="animate-spin"
                    />
                ) : (
                    <Save size={17} />
                )}

                {loading || avatarLoading
                    ? isSpanish
                        ? "Guardando..."
                        : "Saving..."
                    : isSpanish
                        ? "Guardar cambios"
                        : "Save changes"}
            </button>

            {/* Zona de peligro: eliminar cuenta */}
            <div className="mt-10 border-t border-rose-400/20 pt-8">
                <div className="rounded-2xl border border-rose-400/20 bg-rose-400/[0.04] p-5 sm:p-6">
                    <div className="flex items-start gap-3">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-rose-400/20 bg-rose-400/10 text-rose-300">
                            <Trash2 size={21} />
                        </div>

                        <div className="min-w-0 flex-1">
                            <h3 className="font-semibold text-rose-200">
                                {isSpanish
                                    ? "Zona de peligro"
                                    : "Danger zone"}
                            </h3>

                            <p className="mt-2 text-sm leading-6 text-white/60">
                                {isSpanish
                                    ? "Eliminar tu cuenta es permanente. Se eliminarán tu perfil, tu foto y los votos asociados a tu usuario. Esta acción no se puede deshacer."
                                    : "Deleting your account is permanent. Your profile, photo, and votes associated with your user will be deleted. This action cannot be undone."}
                            </p>

                            <label
                                htmlFor="delete-account-confirmation"
                                className="mt-5 block text-sm font-medium text-white/80"
                            >
                                {isSpanish
                                    ? 'Escribe "ELIMINAR MI CUENTA" para confirmar'
                                    : 'Type "DELETE MY ACCOUNT" to confirm'}
                            </label>

                            <input
                                id="delete-account-confirmation"
                                type="text"
                                autoComplete="off"
                                value={deleteConfirmation}
                                onChange={(event) =>
                                    setDeleteConfirmation(event.target.value)
                                }
                                disabled={isSaving}
                                placeholder={expectedDeleteConfirmation}
                                className="mt-2 h-[50px] w-full rounded-xl border border-rose-400/20 bg-black/20 px-4 text-sm text-white outline-none placeholder:text-white/25 focus:border-rose-400/50 disabled:opacity-50"
                            />

                            <button
                                type="button"
                                onClick={handleDeleteAccount}
                                disabled={
                                    isSaving ||
                                    deleteConfirmation !==
                                        expectedDeleteConfirmation
                                }
                                className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-rose-400/30 bg-rose-500/10 px-4 py-3 text-sm font-semibold text-rose-200 transition hover:bg-rose-500/20 disabled:cursor-not-allowed disabled:opacity-40 sm:w-auto"
                            >
                                {deleteLoading ? (
                                    <LoaderCircle
                                        size={17}
                                        className="animate-spin"
                                    />
                                ) : (
                                    <Trash2 size={17} />
                                )}

                                {deleteLoading
                                    ? isSpanish
                                        ? "Eliminando cuenta..."
                                        : "Deleting account..."
                                    : isSpanish
                                        ? "Eliminar mi cuenta definitivamente"
                                        : "Permanently delete my account"}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </form>
    );
}
