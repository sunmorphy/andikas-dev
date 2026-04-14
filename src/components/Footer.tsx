import Link from "next/link";
import { Code } from "iconoir-react";
import { fetchUser } from "@/lib/api";
import { getDictionary } from "@/get-dictionary";
import { Locale } from "@/i18n-config";

export default async function Footer({ lang }: { lang: Locale }) {
    const user = await fetchUser(undefined, lang);
    const dict = await getDictionary(lang);

    return (
        <footer className="w-full border-t border-neutral-200 dark:border-neutral-800 mt-20">
            <div className="container mx-auto px-6 py-10 flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex flex-col md:flex-row items-center gap-4 text-sm">
                    <Link href={`/${lang}`} className="flex items-center gap-2 group">
                        <Code className="w-5 h-5 text-ink dark:text-ink-dark group-hover:text-neutral-600 dark:group-hover:text-neutral-400 transition-colors" />
                        <span className="font-bold tracking-tight">andikas.dev</span>
                    </Link>
                    <span>© {new Date().getFullYear()} {dict.footer.rights}</span>
                </div>

                <div className="flex items-center gap-6 text-sm text-neutral-500 dark:text-neutral-400">
                    {user?.socialMedias?.map((social, idx) => {
                        const parts = social.split("|");
                        const iconName = parts[0];
                        const url = parts.length > 1 ? parts[1] : parts[0];
                        const username = url.split("/").filter(Boolean).pop();

                        const phosphorClass = `ph-${iconName.replace(/[A-Z]/g, m => "-" + m.toLowerCase()).replace(/^-/, "")}`;

                        return (
                            <a key={idx} href={url} target="_blank" rel="noreferrer" className="flex items-center gap-2 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors uppercase group">
                                <i className={`ph ${phosphorClass} text-lg group-hover:scale-110 transition-transform`}></i>
                                <span className="sr-only">{username}</span>
                            </a>
                        );
                    })}
                </div>
            </div>
        </footer>
    );
}
