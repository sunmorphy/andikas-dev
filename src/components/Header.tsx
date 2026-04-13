import Link from "next/link";
import { Code } from "iconoir-react";
import { Button } from "./ui/Button";
import { ScrollLink } from "./ScrollLink";
import { getDictionary } from "@/get-dictionary";
import { Locale } from "@/i18n-config";
import LanguageSwitcher from "./LanguageSwitcher";
import ThemeToggle from "./ThemeToggle";

export default async function Header({ lang }: { lang: Locale }) {
    const dict = await getDictionary(lang);
    return (
        <header className="sticky top-0 z-50 w-full bg-surface/80 dark:bg-surface-dark/80 backdrop-blur-md border-b border-transparent dark:border-neutral-800/50">
            <div className="container mx-auto px-6 h-20 flex items-center justify-between">
                <Link href={`/${lang}`} className="flex items-center gap-2 group">
                    <Code className="w-6 h-6 text-ink dark:text-ink-dark group-hover:text-neutral-600 dark:group-hover:text-neutral-400 transition-colors" />
                    <span className="font-bold text-lg tracking-tight">andikas.dev</span>
                </Link>

                <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
                    <ScrollLink href={`/${lang}#journey`} targetId="journey" className="text-ink-muted dark:text-ink-muted-dark hover:text-ink dark:hover:text-ink-dark transition-colors">{dict.home.journey}</ScrollLink>
                    <ScrollLink href={`/${lang}#selected-works`} targetId="selected-works" className="text-ink-muted dark:text-ink-muted-dark hover:text-ink dark:hover:text-ink-dark transition-colors">{dict.home.selectedWorks}</ScrollLink>
                    <ScrollLink href={`/${lang}#contact`} targetId="contact" className="text-ink-muted dark:text-ink-muted-dark hover:text-ink dark:hover:text-ink-dark transition-colors">{dict.home.contact}</ScrollLink>
                </nav>

                <div className="flex items-center gap-3">
                    <Button asChild>
                        <ScrollLink href={`/${lang}#contact`} targetId="contact">{dict.home.hireMe}</ScrollLink>
                    </Button>
                    {/* <LanguageSwitcher currentLang={lang} /> */}
                    <ThemeToggle />
                </div>
            </div>
        </header>
    );
}
