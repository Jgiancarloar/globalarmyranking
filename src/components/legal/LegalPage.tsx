import Link from "next/link";
import {
  ArrowLeft,
  ArrowUpRight,
  Cookie,
  FileText,
  Mail,
  ShieldCheck,
} from "lucide-react";

export type LegalPageType = "privacy" | "terms" | "cookies" | "contact";

type Props = {
  locale: string;
  page: LegalPageType;
};

const content = {
  es: {
    back: "Volver al inicio",
    updated: "Última actualización: 22 de octubre de 2026",
    intro:
      "Esta información explica cómo funciona Global Army Ranking y qué debes saber al utilizar la plataforma.",
    privacy: {
      eyebrow: "Transparencia y datos",
      title: "Política de privacidad",
      description:
        "Queremos que sepas qué información utilizamos, para qué la necesitamos y cómo puedes ejercer control sobre tus datos.",
      sections: [
        {
          title: "1. Información que recopilamos",
          paragraphs: [
            "Cuando creas una cuenta, podemos recibir información básica de autenticación de Google, como tu identificador de usuario y dirección de correo electrónico.",
            "También podemos almacenar tu nombre público, país seleccionado, foto de perfil, historial de votos y datos técnicos necesarios para mantener la seguridad y el funcionamiento de la plataforma.",
          ],
        },
        {
          title: "2. Para qué utilizamos los datos",
          paragraphs: [
            "Utilizamos esta información para crear y mantener tu cuenta, mostrar tu perfil, registrar tus votos, calcular los rankings, evitar usos abusivos y prestar soporte.",
            "El país que aparece actualmente en tu perfil puede cambiar. Los votos históricos deben conservar el país al que correspondían cuando se emitieron.",
          ],
        },
        {
          title: "3. Inicio de sesión y proveedores",
          paragraphs: [
            "El inicio de sesión puede realizarse mediante Google. La autenticación y el almacenamiento de datos se gestionan mediante los servicios configurados para la plataforma, incluidos Supabase cuando corresponda.",
            "Estos proveedores procesan información conforme a sus propias condiciones y políticas de privacidad. Consulta sus políticas para conocer sus prácticas.",
          ],
        },
        {
          title: "4. Visibilidad de la información",
          paragraphs: [
            "Tu nombre público, avatar, país actual y la información de votos que la plataforma decida mostrar pueden ser visibles para otros visitantes. No incluyas en tu nombre público información que no quieras hacer pública.",
            "No publiques información personal sensible en campos públicos ni en comunicaciones dirigidas a la comunidad.",
          ],
        },
        {
          title: "5. Conservación y eliminación",
          paragraphs: [
            "Conservamos los datos durante el tiempo necesario para operar la cuenta, mantener la seguridad y cumplir las obligaciones aplicables.",
            "Puedes solicitar o iniciar la eliminación de tu cuenta desde las opciones disponibles en tu perfil. La eliminación puede borrar tu perfil y los votos asociados, conforme al funcionamiento de la plataforma y a las obligaciones legales aplicables.",
          ],
        },
        {
          title: "6. Seguridad",
          paragraphs: [
            "Aplicamos medidas técnicas y organizativas razonables para proteger la información. Ningún sistema conectado a Internet puede garantizar seguridad absoluta.",
            "No compartas contraseñas, códigos de acceso ni información confidencial con terceros.",
          ],
        },
        {
          title: "7. Tus opciones y derechos",
          paragraphs: [
            "Puedes actualizar los datos de perfil que la plataforma permita editar y utilizar la función de eliminación de cuenta. También puedes contactar con nosotros para consultas o solicitudes relacionadas con tus datos personales.",
            "Los derechos específicos disponibles y el procedimiento para ejercerlos dependen de la normativa aplicable a tu situación.",
          ],
        },
        {
          title: "8. Cambios en esta política",
          paragraphs: [
            "Podemos actualizar esta política si cambian la plataforma, sus proveedores o sus obligaciones. Publicaremos la versión vigente en esta página e indicaremos la fecha de actualización.",
          ],
        },
      ],
    },
    terms: {
      eyebrow: "Reglas de la comunidad",
      title: "Términos y condiciones",
      description:
        "Al acceder a Global Army Ranking, aceptas utilizar la plataforma de forma responsable y respetar estas condiciones.",
      sections: [
        {
          title: "1. Sobre la plataforma",
          paragraphs: [
            "Global Army Ranking es una plataforma comunitaria destinada a que los fans participen en rankings relacionados con la comunidad ARMY. Las funciones disponibles pueden cambiar conforme evolucione el proyecto.",
            "La plataforma no debe interpretarse como una clasificación oficial de artistas, países, organizaciones o comunidades.",
          ],
        },
        {
          title: "2. Cuenta y responsabilidad",
          paragraphs: [
            "Debes proporcionar información razonablemente correcta y mantener el control de tu cuenta. Eres responsable de las actividades realizadas mediante tu sesión.",
            "No debes intentar acceder a cuentas ajenas, eludir controles de seguridad ni utilizar la plataforma para actividades ilegales.",
          ],
        },
        {
          title: "3. Votaciones",
          paragraphs: [
            "Las votaciones están sujetas a las reglas que se muestren en la plataforma, incluidos los límites de frecuencia y las condiciones de elegibilidad.",
            "No está permitido manipular el ranking mediante automatizaciones no autorizadas, cuentas fraudulentas, explotación de errores o interferencia técnica.",
            "Cambiar el país actual de tu perfil no modifica retroactivamente los países registrados en votos anteriores. La disponibilidad de un nuevo voto depende de las reglas de votación vigentes.",
          ],
        },
        {
          title: "4. Uso prohibido",
          paragraphs: [
            "No puedes interferir con el servicio, realizar pruebas de carga sin autorización, explotar vulnerabilidades, distribuir código malicioso ni intentar acceder a información que no te corresponda.",
            "Tampoco puedes usar la plataforma para acosar, amenazar, suplantar a otras personas o infringir derechos de terceros.",
          ],
        },
        {
          title: "5. Disponibilidad y cambios",
          paragraphs: [
            "Podemos actualizar, suspender o retirar funciones por motivos técnicos, de seguridad, mantenimiento o cumplimiento normativo.",
            "No garantizamos que el servicio esté disponible sin interrupciones ni que los rankings permanezcan inalterados ante correcciones legítimas o incidencias técnicas.",
          ],
        },
        {
          title: "6. Propiedad intelectual y marcas",
          paragraphs: [
            "No debes utilizar contenido de terceros sin contar con los permisos o derechos necesarios. Los nombres, logotipos, imágenes y marcas de terceros pertenecen a sus respectivos titulares.",
            "La mención de BTS, ARMY u otras marcas identificativas no implica afiliación, patrocinio ni aprobación oficial.",
          ],
        },
        {
          title: "7. Cuentas suspendidas o eliminadas",
          paragraphs: [
            "Podemos restringir cuentas cuando existan indicios razonables de fraude, abuso, incumplimiento de estos términos o riesgos para la seguridad.",
            "Puedes eliminar tu cuenta mediante las opciones disponibles. La eliminación es irreversible y puede borrar los datos y votos asociados, según se indique durante el proceso.",
          ],
        },
        {
          title: "8. Responsabilidad y cambios en los términos",
          paragraphs: [
            "La plataforma se ofrece en el estado en que está disponible, dentro de los límites permitidos por la legislación aplicable. Estos términos no excluyen derechos que legalmente no puedan excluirse.",
            "Podemos actualizar estas condiciones y publicaremos la versión vigente en esta página.",
          ],
        },
      ],
    },
    cookies: {
      eyebrow: "Tecnología y preferencias",
      title: "Política de cookies",
      description:
        "Esta página explica el uso de cookies y tecnologías similares que pueden ser necesarias para utilizar Global Army Ranking.",
      sections: [
        {
          title: "1. ¿Qué son las cookies?",
          paragraphs: [
            "Las cookies son pequeños archivos que un sitio web puede guardar en tu navegador. También pueden utilizarse tecnologías similares para recordar sesiones, proteger servicios y guardar preferencias.",
          ],
        },
        {
          title: "2. Cookies necesarias",
          paragraphs: [
            "Los servicios de autenticación pueden utilizar cookies o mecanismos similares para mantener tu sesión, permitir que navegues entre páginas autenticadas y proteger las solicitudes.",
            "Si estas tecnologías son necesarias para prestar una función que hayas solicitado, pueden operar sin un control de preferencias independiente, cuando la normativa aplicable lo permita.",
          ],
        },
        {
          title: "3. Preferencias e idioma",
          paragraphs: [
            "La plataforma puede recordar preferencias, como el idioma seleccionado, mediante cookies, almacenamiento del navegador u otros mecanismos. El mecanismo exacto depende de la implementación vigente.",
          ],
        },
        {
          title: "4. Analítica y servicios de terceros",
          paragraphs: [
            "Si incorporamos herramientas de analítica, publicidad o medición de terceros, esta política deberá actualizarse para identificar las herramientas utilizadas, las finalidades y las opciones disponibles.",
            "No afirmamos que estas herramientas estén activas actualmente. Su uso dependerá de la configuración real del sitio y de los consentimientos o avisos exigidos por la normativa aplicable.",
          ],
        },
        {
          title: "5. Cómo gestionar las cookies",
          paragraphs: [
            "Puedes revisar y eliminar cookies desde la configuración de tu navegador, o bloquearlas. Ten en cuenta que bloquear las cookies necesarias puede impedir que inicies sesión o utilices ciertas funciones.",
          ],
        },
        {
          title: "6. Actualizaciones",
          paragraphs: [
            "Actualizaremos esta política si cambia el uso de cookies o se incorporan nuevos proveedores. La fecha de actualización indicará la versión publicada.",
          ],
        },
      ],
    },
    contact: {
      eyebrow: "Estamos para ayudarte",
      title: "Contacto y soporte",
      description:
        "¿Tienes una consulta sobre tu cuenta, tus votos o el funcionamiento de Global Army Ranking? Aquí tienes cómo ponerte en contacto con el equipo.",
      sections: [
        {
          title: "Soporte de la plataforma",
          paragraphs: [
            "Puedes escribirnos para informar de errores, problemas de inicio de sesión, dificultades con tu perfil o incidencias con las votaciones.",
            "Para ayudarnos a revisar el caso, describe el problema, indica la página donde ocurre y, si es posible, incluye los pasos necesarios para reproducirlo. No envíes contraseñas, códigos de acceso ni datos bancarios.",
          ],
        },
        {
          title: "Privacidad y datos personales",
          paragraphs: [
            "También puedes utilizar el canal de contacto para consultas relacionadas con la privacidad, la actualización de datos personales o la eliminación de tu cuenta.",
          ],
        },
        {
          title: "Tiempos de respuesta",
          paragraphs: [
            "Haremos esfuerzos razonables para revisar las solicitudes, pero no garantizamos un plazo de respuesta específico. El tiempo puede depender del tipo de consulta y de la disponibilidad del equipo.",
          ],
        },
      ],
    },
  },
  en: {
    back: "Back to home",
    updated: "Last updated: October 22, 2026",
    intro:
      "This information explains how Global Army Ranking works and what you should know when using the platform.",
    privacy: {
      eyebrow: "Transparency and data",
      title: "Privacy policy",
      description:
        "We want you to understand what information we use, why we need it, and how you can manage your data.",
      sections: [
        {
          title: "1. Information we collect",
          paragraphs: [
            "When you create an account, we may receive basic authentication information from Google, such as your user identifier and email address.",
            "We may also store your public name, selected country, profile photo, voting history, and technical information needed to operate and secure the platform.",
          ],
        },
        {
          title: "2. How we use information",
          paragraphs: [
            "We use this information to create and maintain your account, display your profile, record votes, calculate rankings, prevent abuse, and provide support.",
            "Your current profile country may change. Historical votes should retain the country they were cast for at the time of voting.",
          ],
        },
        {
          title: "3. Sign-in and service providers",
          paragraphs: [
            "You may sign in using Google. Authentication and data storage are handled by the services configured for the platform, including Supabase where applicable.",
            "These providers process information under their own terms and privacy policies. Review their policies to understand their practices.",
          ],
        },
        {
          title: "4. Information visibility",
          paragraphs: [
            "Your public name, avatar, current country, and voting information that the platform chooses to display may be visible to other visitors. Do not include information in your public name that you do not want to share.",
            "Do not publish sensitive personal information in public fields or community communications.",
          ],
        },
        {
          title: "5. Retention and deletion",
          paragraphs: [
            "We retain data for as long as needed to operate accounts, maintain security, and meet applicable obligations.",
            "You can request or initiate account deletion through the options available in your profile. Deletion may remove your profile and associated votes, subject to platform functionality and applicable legal obligations.",
          ],
        },
        {
          title: "6. Security",
          paragraphs: [
            "We use reasonable technical and organizational measures to protect information. No Internet-connected system can guarantee absolute security.",
            "Do not share passwords, access codes, or confidential information with others.",
          ],
        },
        {
          title: "7. Your choices and rights",
          paragraphs: [
            "You can update profile information that the platform allows you to edit and use the account deletion feature. You can also contact us with questions or requests concerning your personal data.",
            "The specific rights available and how to exercise them depend on the laws applicable to your circumstances.",
          ],
        },
        {
          title: "8. Policy changes",
          paragraphs: [
            "We may update this policy when the platform, its providers, or its obligations change. The current version will be published on this page with its update date.",
          ],
        },
      ],
    },
    terms: {
      eyebrow: "Community rules",
      title: "Terms and conditions",
      description:
        "By accessing Global Army Ranking, you agree to use the platform responsibly and follow these terms.",
      sections: [
        {
          title: "1. About the platform",
          paragraphs: [
            "Global Army Ranking is a community platform where fans can participate in rankings related to the ARMY community. Available features may change as the project develops.",
            "The platform should not be interpreted as an official ranking of artists, countries, organizations, or communities.",
          ],
        },
        {
          title: "2. Accounts and responsibility",
          paragraphs: [
            "You must provide reasonably accurate information and maintain control of your account. You are responsible for activity carried out through your session.",
            "You must not attempt to access another person's account, bypass security controls, or use the platform for unlawful activity.",
          ],
        },
        {
          title: "3. Voting",
          paragraphs: [
            "Voting is subject to the rules displayed on the platform, including frequency limits and eligibility requirements.",
            "Manipulating rankings through unauthorized automation, fraudulent accounts, exploitation of bugs, or technical interference is prohibited.",
            "Changing your current profile country does not retroactively change the countries recorded for previous votes. Eligibility for another vote depends on the current voting rules.",
          ],
        },
        {
          title: "4. Prohibited use",
          paragraphs: [
            "You must not interfere with the service, conduct unauthorized load tests, exploit vulnerabilities, distribute malicious code, or attempt to access information that does not belong to you.",
            "You must not use the platform to harass, threaten, impersonate others, or infringe third-party rights.",
          ],
        },
        {
          title: "5. Availability and changes",
          paragraphs: [
            "We may update, suspend, or remove features for technical, security, maintenance, or compliance reasons.",
            "We do not guarantee uninterrupted service or that rankings will remain unchanged after legitimate corrections or technical incidents.",
          ],
        },
        {
          title: "6. Intellectual property and trademarks",
          paragraphs: [
            "You must not use third-party content without the necessary permission or rights. Third-party names, logos, images, and trademarks belong to their respective owners.",
            "Mention of BTS, ARMY, or other identifying marks does not imply official affiliation, sponsorship, or endorsement.",
          ],
        },
        {
          title: "7. Suspended or deleted accounts",
          paragraphs: [
            "We may restrict accounts where there are reasonable indications of fraud, abuse, violations of these terms, or security risks.",
            "You may delete your account through the available options. Deletion is irreversible and may remove associated data and votes as described during the process.",
          ],
        },
        {
          title: "8. Liability and changes to these terms",
          paragraphs: [
            "The platform is provided as available, subject to the limits of applicable law. These terms do not exclude rights that cannot legally be excluded.",
            "We may update these terms and publish the current version on this page.",
          ],
        },
      ],
    },
    cookies: {
      eyebrow: "Technology and preferences",
      title: "Cookie policy",
      description:
        "This page explains the use of cookies and similar technologies that may be needed to use Global Army Ranking.",
      sections: [
        {
          title: "1. What are cookies?",
          paragraphs: [
            "Cookies are small files that a website may store in your browser. Similar technologies may also be used to maintain sessions, protect services, and remember preferences.",
          ],
        },
        {
          title: "2. Essential cookies",
          paragraphs: [
            "Authentication services may use cookies or similar mechanisms to maintain your session, let you navigate authenticated pages, and protect requests.",
            "Where permitted by applicable law, technologies necessary to provide a feature you requested may operate without a separate preference control.",
          ],
        },
        {
          title: "3. Preferences and language",
          paragraphs: [
            "The platform may remember preferences, such as your selected language, using cookies, browser storage, or other mechanisms. The exact mechanism depends on the current implementation.",
          ],
        },
        {
          title: "4. Analytics and third-party services",
          paragraphs: [
            "If we add analytics, advertising, or third-party measurement tools, this policy should be updated to identify the tools used, their purposes, and available choices.",
            "We do not claim that these tools are currently active. Their use depends on the site's actual configuration and any consent or notice required by applicable law.",
          ],
        },
        {
          title: "5. Managing cookies",
          paragraphs: [
            "You can review and delete cookies in your browser settings or block them. Blocking essential cookies may prevent you from signing in or using some features.",
          ],
        },
        {
          title: "6. Updates",
          paragraphs: [
            "We will update this policy if cookie usage changes or new providers are added. The update date will indicate the published version.",
          ],
        },
      ],
    },
    contact: {
      eyebrow: "We're here to help",
      title: "Contact and support",
      description:
        "Have a question about your account, votes, or Global Army Ranking? Here is how to contact the team.",
      sections: [
        {
          title: "Platform support",
          paragraphs: [
            "You can contact us to report bugs, sign-in problems, profile issues, or voting incidents.",
            "To help us investigate, describe the problem, identify the page where it occurs, and include reproduction steps if possible. Do not send passwords, access codes, or payment card details.",
          ],
        },
        {
          title: "Privacy and personal data",
          paragraphs: [
            "You can also use the contact channel for questions about privacy, updating personal information, or deleting your account.",
          ],
        },
        {
          title: "Response times",
          paragraphs: [
            "We will make reasonable efforts to review requests, but we do not guarantee a specific response time. Timing may depend on the request and team availability.",
          ],
        },
      ],
    },
  },
};

const icons = {
  privacy: ShieldCheck,
  terms: FileText,
  cookies: Cookie,
  contact: Mail,
};

export default function LegalPage({ locale, page }: Props) {
  const language = locale === "es" ? "es" : "en";
  const copy = content[language];
  const pageContent = copy[page];
  const Icon = icons[page];

  return (
    <main className="min-h-[70vh] bg-[#08060e] px-5 py-12 text-white sm:px-8 sm:py-16 lg:px-12">
      <article className="mx-auto max-w-4xl">
        <Link
          href={`/${language}`}
          className="inline-flex items-center gap-2 text-sm text-white/50 transition hover:text-violet-300"
        >
          <ArrowLeft size={16} />
          {copy.back}
        </Link>

        <header className="mt-10 border-b border-white/[0.08] pb-8">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-violet-300/20 bg-violet-400/10 text-violet-200">
            <Icon size={23} />
          </div>

          <p className="mt-6 text-xs font-semibold uppercase tracking-[0.2em] text-violet-300">
            {pageContent.eyebrow}
          </p>

          <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
            {pageContent.title}
          </h1>

          <p className="mt-4 max-w-3xl text-base leading-7 text-white/60">
            {pageContent.description}
          </p>

          <p className="mt-5 text-xs text-white/35">{copy.updated}</p>
        </header>

        <div className="divide-y divide-white/[0.08]">
          {pageContent.sections.map((section) => (
            <section key={section.title} className="py-7">
              <h2 className="text-lg font-semibold text-white">
                {section.title}
              </h2>

              <div className="mt-3 space-y-3">
                {section.paragraphs.map((paragraph, index) => (
                  <p
                    key={`${section.title}-${index}`}
                    className="text-sm leading-7 text-white/60 sm:text-base"
                  >
                    {paragraph}
                  </p>
                ))}
              </div>
            </section>
          ))}
        </div>

        {page === "contact" && (
          <div className="mt-8 rounded-2xl border border-violet-300/15 bg-violet-400/[0.05] p-5 sm:p-6">
            <h2 className="text-base font-semibold">
              {language === "es" ? "Canal de contacto" : "Contact channel"}
            </h2>

            <p className="mt-2 text-sm leading-6 text-white/60">
              {language === "es"
                ? "Configura una dirección de correo de soporte antes de publicar esta página. Hasta entonces, puedes utilizar los canales de soporte que estén disponibles dentro de la plataforma."
                : "Configure a support email address before publishing this page. Until then, use any support channels available within the platform."}
            </p>

            {process.env.NEXT_PUBLIC_CONTACT_EMAIL && (
              <a
                href={`mailto:${process.env.NEXT_PUBLIC_CONTACT_EMAIL}`}
                className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-violet-300 transition hover:text-violet-200"
              >
                <Mail size={16} />
                {process.env.NEXT_PUBLIC_CONTACT_EMAIL}
                <ArrowUpRight size={14} />
              </a>
            )}
          </div>
        )}

        <nav
          aria-label={language === "es" ? "Más información" : "More information"}
          className="mt-10 flex flex-wrap gap-x-5 gap-y-3 border-t border-white/[0.08] pt-6"
        >
          {(
            [
              ["privacy", language === "es" ? "Privacidad" : "Privacy"],
              ["terms", language === "es" ? "Términos" : "Terms"],
              ["cookies", language === "es" ? "Cookies" : "Cookies"],
              ["contact", language === "es" ? "Contacto" : "Contact"],
            ] as [LegalPageType, string][]
          ).filter(([key]) => key !== page).map(([key, label]) => (
            <Link
              key={key}
              href={`/${language}/${key}`}
              className="text-sm text-white/45 transition hover:text-violet-300"
            >
              {label}
            </Link>
          ))}
        </nav>
      </article>
    </main>
  );
}