"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft } from "iconoir-react";
import { i18n, Locale } from "@/i18n-config";

import en from "@/dictionaries/en.json";
import id from "@/dictionaries/id.json";
import de from "@/dictionaries/de.json";
import ja from "@/dictionaries/ja.json";
import nl from "@/dictionaries/nl.json";

const dictionaries = { en, id, de, ja, nl };

export default function NotFound() {
    const params = useParams();
    const rawLang = params?.lang;
    const lang: Locale =
        typeof rawLang === "string" && (i18n.locales as readonly string[]).includes(rawLang)
            ? (rawLang as Locale)
            : i18n.defaultLocale;

    const dict = dictionaries[lang].notFound;

    return (
        <section className="container mx-auto px-6 min-h-[70vh] flex flex-col items-center justify-center text-center py-32">
            {/* Giant 404 */}
            <div className="relative mb-8 select-none">
                <span className="text-[160px] md:text-[220px] font-bold tracking-tighter leading-none text-neutral-100">
                    404
                </span>
                <span className="absolute inset-0 flex items-center justify-center text-[160px] md:text-[220px] font-bold tracking-tighter leading-none text-neutral-900 [text-shadow:6px_6px_0_rgba(0,0,0,0.08)]">
                    404
                </span>
            </div>

            <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
                {dict.heading}
            </h1>
            <p className="text-neutral-500 text-lg mb-12 max-w-md leading-relaxed">
                {dict.description}
            </p>

            <Link
                href={`/${lang}`}
                className="inline-flex items-center gap-2 bg-neutral-900 text-white font-bold rounded-full px-8 py-4 shadow-[6px_6px_0_rgba(0,0,0,0.15)] hover:bg-neutral-800 hover:-translate-y-0.5 hover:shadow-[8px_8px_0_rgba(0,0,0,0.15)] transition-all"
            >
                <ArrowLeft className="w-4 h-4" />
                {dict.goHome}
            </Link>
        </section>
    );
}
