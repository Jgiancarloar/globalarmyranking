
import Link from "next/link";
import {
  ArrowRight,
  Check,
  Globe2,
  Heart,
  Users,
} from "lucide-react";

type Props = {
  locale: string;
};

export default function HowItWorks({ locale }: Props) {
  const isSpanish = locale === "es";

  const steps = [
    {
      number: "01",
      icon: Users,
      title: isSpanish ? "Únete a la comunidad" : "Join the community",
      description: isSpanish
        ? "Inicia sesión con Google y crea tu perfil ARMY en unos pocos pasos."
        : "Sign in with Google and create your ARMY profile in just a few steps.",
      detail: isSpanish ? "Registro sencillo" : "Simple registration",
    },
    {
      number: "02",
      icon: Globe2,
      title: isSpanish ? "Elige tu país" : "Choose your country",
      description: isSpanish
        ? "Selecciona el país que quieres representar y apoyar en el ranking."
        : "Select the country you want to represent and support in the ranking.",
      detail: isSpanish ? "Tu país, tu comunidad" : "Your country, your community",
    },
    {
      number: "03",
      icon: Heart,
      title: isSpanish ? "Apoya a tu comunidad" : "Support your community",
      description: isSpanish
        ? "Participa en la comunidad y ayuda a dar visibilidad a los ARMYs de tu país."
        : "Take part in the community and help showcase ARMYs from your country.",
      detail: isSpanish ? "Una pasión compartida" : "One shared passion",
    },
  ];

  return (
    <section
      id="how-it-works"
      className="relative overflow-hidden border-y border-white/[0.06] bg-[#0d0a16] px-5 py-24 sm:px-8 sm:py-28 lg:px-12"
    >
      <div className="pointer-events-none absolute left-1/2 top-0 h-72 w-72 -translate-x-1/2 rounded-full bg-violet-600/[0.08] blur-[100px]" />

      <div className="relative mx-auto max-w-7xl">
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-violet-300/20 bg-violet-400/[0.07] px-3.5 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-violet-200">
            <Heart size={13} />
            {isSpanish ? "Unidos por ARMY" : "United by ARMY"}
          </span>

          <h2 className="mt-6 text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
            {isSpanish ? (
              <>
                Tu país.
                <span className="text-violet-300"> Tu comunidad.</span>
              </>
            ) : (
              <>
                Your country.
                <span className="text-violet-300"> Your community.</span>
              </>
            )}
          </h2>

          <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-white/50 sm:text-base">
            {isSpanish
              ? "Formar parte del ranking global es sencillo. Conecta con otros fans y representa a tu país."
              : "Being part of the global ranking is simple. Connect with other fans and represent your country."}
          </p>
        </div>

        <div className="relative mt-14 grid gap-5 md:grid-cols-3 md:gap-6">
          {steps.map(({ number, icon: Icon, title, description, detail }) => (
            <article
              key={number}
              className="group relative flex flex-col rounded-2xl border border-white/[0.08] bg-[#100d19]/90 p-6 transition duration-300 hover:-translate-y-1 hover:border-violet-300/30 hover:bg-[#151020] sm:p-8"
            >
              <div className="flex items-center justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-violet-300/15 bg-violet-400/[0.08] text-violet-300 transition group-hover:border-violet-300/30 group-hover:bg-violet-400/[0.14]">
                  <Icon size={22} strokeWidth={1.8} />
                </div>

                <span className="text-3xl font-bold tracking-tight text-white/[0.09]">
                  {number}
                </span>
              </div>

              <h3 className="mt-8 text-xl font-semibold tracking-tight">
                {title}
              </h3>

              <p className="mt-3 flex-1 text-sm leading-7 text-white/50">
                {description}
              </p>

              <div className="mt-7 flex items-center gap-2 border-t border-white/[0.07] pt-5 text-xs font-medium text-violet-200/80">
                <Check size={15} />
                {detail}
              </div>
            </article>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center gap-4 text-center">
          <Link
            href={`/${locale}/login`}
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-violet-500 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-violet-950/20 transition hover:bg-violet-400"
          >
            {isSpanish ? "Únete a la comunidad" : "Join the community"}
            <ArrowRight
              size={17}
              className="transition group-hover:translate-x-1"
            />
          </Link>

          <p className="text-xs text-white/35">
            {isSpanish
              ? "Una comunidad global, conectada por una misma pasión."
              : "One global community, connected by a shared passion."}
          </p>
        </div>
      </div>
    </section>
  );
}
