import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "iconoir-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { fetchProjectBySlug } from "@/lib/api";
import { Button } from "@/components/ui/Button";
import { getDictionary } from "@/get-dictionary";
import { Locale } from "@/i18n-config";

interface Props {
    params: Promise<{ lang: string; slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { lang, slug } = await params;
    const project = await fetchProjectBySlug(slug, undefined, lang);
    if (!project) return { title: "Project Not Found" };

    return {
        title: `${project.title} - Andika Sultanrafli`,
        description: project.description,
    };
}

export default async function ProjectDetailsPage({ params }: Props) {
    const { lang, slug } = await params;
    const project = await fetchProjectBySlug(slug, undefined, lang);
    const dict = await getDictionary(lang as Locale);

    if (!project) {
        notFound();
    }

    return (
        <article className="container mx-auto px-6 pt-12 pb-32 flex flex-col items-center">
            <div className="w-full max-w-5xl">
                <Link href={`/${lang}/projects`} className="inline-flex items-center gap-2 text-sm font-bold text-neutral-500 hover:text-neutral-900 transition-colors mb-12 uppercase tracking-widest">
                    <ArrowLeft className="w-4 h-4" /> {dict.projects.backToProjects}
                </Link>

                <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 max-w-4xl leading-tight">
                    {project.title}
                </h1>

                <p className="text-xl md:text-2xl text-neutral-500 font-light max-w-3xl mb-16 leading-relaxed">
                    {project.description}
                </p>

                {/* Cover Image */}
                <div className="w-full aspect-[4/3] bg-neutral-100 rounded-[40px] overflow-hidden relative mb-16 fixed-shadow-neo border border-neutral-200">
                    {project.coverImage ? (
                        <Image src={project.coverImage} fill alt={project.title} className="object-cover" priority />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-neutral-300">{dict.projects.noCoverImage}</div>
                    )}
                </div>

                {/* Metadata section */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-8 border-y border-neutral-200 mb-20">
                    <div className="flex flex-col gap-2">
                        <span className="text-xs font-bold text-neutral-400 uppercase tracking-widest">{dict.projects.client}</span>
                        <span className="font-medium">{project.client || "N/A"}</span>
                    </div>
                    <div className="flex flex-col gap-2">
                        <span className="text-xs font-bold text-neutral-400 uppercase tracking-widest">{dict.projects.tags}</span>
                        <span className="font-medium">{project.projectTags?.map(t => t.tag.name).join(", ") || "N/A"}</span>
                    </div>
                    <div className="flex flex-col gap-2">
                        <span className="text-xs font-bold text-neutral-400 uppercase tracking-widest">{dict.projects.year}</span>
                        <span className="font-medium">{project.year || "N/A"}</span>
                    </div>
                    <div className="flex flex-col gap-2">
                        <span className="text-xs font-bold text-neutral-400 uppercase tracking-widest">{dict.projects.industry}</span>
                        <span className="font-medium">{project.industry || "N/A"}</span>
                    </div>
                </div>

                {/* Content Section: Challenge */}
                {project.challenge && (
                    <div className="flex flex-col md:flex-row gap-12 mb-20">
                        <div className="w-full md:w-1/4 shrink-0">
                            <div className="w-12 h-12 bg-neutral-900 text-neutral-50 rounded-full flex items-center justify-center mb-6">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
                            </div>
                            <h2 className="text-xl font-bold tracking-tight uppercase">{dict.projects.theChallenge}</h2>
                        </div>
                        <div className="w-full md:w-3/4 prose prose-neutral prose-lg prose-p:font-light prose-p:leading-relaxed dark:prose-invert max-w-none">
                            <ReactMarkdown remarkPlugins={[remarkGfm]}>{project.challenge}</ReactMarkdown>
                        </div>
                    </div>
                )}

                {/* Content Section: My Role */}
                {project.myRole && (
                    <div className="flex flex-col md:flex-row gap-12 mb-20">
                        <div className="w-full md:w-1/4 shrink-0">
                            <div className="w-12 h-12 bg-neutral-100 border border-neutral-200 text-neutral-900 rounded-full flex items-center justify-center mb-6">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
                            </div>
                            <h2 className="text-xl font-bold tracking-tight uppercase">{dict.projects.myRole}</h2>
                        </div>
                        <div className="w-full md:w-3/4 prose prose-neutral prose-lg prose-p:font-light prose-p:leading-relaxed dark:prose-invert max-w-none">
                            <ReactMarkdown remarkPlugins={[remarkGfm]}>{project.myRole}</ReactMarkdown>
                        </div>
                    </div>
                )}

                {/* Content Section: The Outcome */}
                {project.outcome && (
                    <div className="flex flex-col md:flex-row gap-12 mb-32">
                        <div className="w-full md:w-1/4 shrink-0">
                            <div className="w-12 h-12 bg-neutral-900 text-neutral-50 rounded-full flex items-center justify-center mb-6">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 15l8.3-8.3-1.4-1.4L12 12.2l-3.3-3.3-1.4 1.4z" /><path d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z" /></svg>
                            </div>
                            <h2 className="text-xl font-bold tracking-tight uppercase">{dict.projects.theOutcome}</h2>
                        </div>
                        <div className="w-full md:w-3/4 prose prose-neutral prose-lg prose-p:font-light prose-p:leading-relaxed dark:prose-invert max-w-none">
                            <ReactMarkdown remarkPlugins={[remarkGfm]}>{project.outcome}</ReactMarkdown>
                        </div>
                    </div>
                )}

                {/* Full markdown content block if challenge/role/outcome was not provided but generic content is available */}
                {project.content && !project.challenge && !project.myRole && !project.outcome && (
                    <div className="w-full prose prose-neutral prose-lg prose-p:font-light prose-p:leading-relaxed dark:prose-invert max-w-none mb-32">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>{project.content}</ReactMarkdown>
                    </div>
                )}

                {/* Content Images */}
                {project.contentImages && project.contentImages.length > 0 && (
                    <div className="flex flex-col gap-8 mb-32">
                        {project.contentImages.map((img, idx) => (
                            <div key={idx} className="w-full aspect-[16/9] bg-neutral-100 rounded-[40px] overflow-hidden relative fixed-shadow-neo border border-neutral-200">
                                <Image src={img} fill alt={`${project.title} — image ${idx + 1}`} className="object-cover" />
                            </div>
                        ))}
                    </div>
                )}

                {/* Footer CTA */}
                <div className="flex flex-col items-center justify-center py-20 border-t border-neutral-200">
                    <h2 className="text-3xl md:text-4xl font-light mb-8">{dict.projects.interestedTitle}</h2>
                    <Button asChild size="lg" className="mb-16">
                        <Link href={`/${lang}#contact`}>{dict.projects.letsTalk}</Link>
                    </Button>

                    <Link href={`/${lang}/projects`} className="inline-flex items-center gap-2 text-sm font-bold text-neutral-400 hover:text-neutral-900 transition-colors uppercase tracking-widest">
                        <ArrowLeft className="w-4 h-4" /> {dict.projects.backToProjects}
                    </Link>
                </div>

            </div>
        </article>
    );
}
