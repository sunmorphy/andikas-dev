"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { Search, ViewGrid, List as ListIcon, NavArrowLeft, NavArrowRight } from "iconoir-react";
import { Project, Tag, PaginatedMeta } from "@/lib/types";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

interface ProjectsClientProps {
    initialProjects: Project[];
    initialMeta?: PaginatedMeta;
    initialTags: Tag[];
    initialSearch: string;
    initialTagId?: number;
    initialPage: number;
    lang: string;
    dict: any;
}

export default function ProjectsClient({
    initialProjects,
    initialMeta,
    initialTags,
    initialSearch,
    initialTagId,
    initialPage,
    lang,
    dict
}: ProjectsClientProps) {
    const router = useRouter();
    const pathname = usePathname();
    const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
    const [searchQuery, setSearchQuery] = useState(initialSearch);

    const updateUrl = (params: { search?: string; tag?: number | null; page?: number }) => {
        const url = new URLSearchParams();

        let newSearch = params.search !== undefined ? params.search : initialSearch;
        let newTag = params.tag !== undefined ? params.tag : initialTagId;
        let newPage = params.page !== undefined ? params.page : initialPage;

        if (newSearch) url.set("search", newSearch);
        if (newTag) url.set("tag", newTag.toString());
        if (newPage && newPage > 1) url.set("page", newPage.toString());

        router.push(`${pathname}?${url.toString()}`, { scroll: false });
    };

    // Debounce search query changes
    useEffect(() => {
        const timer = setTimeout(() => {
            if (searchQuery !== initialSearch) {
                updateUrl({ search: searchQuery, page: 1 });
            }
        }, 400);
        return () => clearTimeout(timer);
    }, [searchQuery, initialSearch]);

    const projects = initialProjects;

    return (
        <div className="container mx-auto px-6 pt-20 pb-32 flex flex-col items-center">
            <div className="w-full max-w-5xl">
                <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-6">All Projects</h1>
                <p className="text-xl text-neutral-500 max-w-2xl mb-12 leading-relaxed">
                    A curated collection of design and development work, focusing on minimalism and functional beauty.
                </p>

                {/* Toolbar */}
                <div className="flex flex-col gap-6 mb-10 w-full">
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 w-full">
                        <div className="relative w-full max-w-md">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                            <input
                                type="text"
                                placeholder="Search projects..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full h-12 pl-12 pr-4 rounded-full border border-neutral-200 bg-white focus:outline-none focus:ring-2 focus:ring-neutral-900 transition-shadow"
                            />
                        </div>

                        <div className="hidden md:flex items-center gap-2 bg-neutral-100 p-1 rounded-full">
                            <button
                                onClick={() => setViewMode("grid")}
                                className={cn("p-2 rounded-full transition-colors", viewMode === "grid" ? "bg-neutral-900 text-white shadow-sm" : "text-neutral-500 hover:text-neutral-900")}
                                aria-label="Grid view"
                            >
                                <ViewGrid className="w-5 h-5" />
                            </button>
                            <button
                                onClick={() => setViewMode("list")}
                                className={cn("p-2 rounded-full transition-colors", viewMode === "list" ? "bg-neutral-900 text-white shadow-sm" : "text-neutral-500 hover:text-neutral-900")}
                                aria-label="List view"
                            >
                                <ListIcon className="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                        <button
                            onClick={() => updateUrl({ tag: null, page: 1 })}
                            className={cn(
                                "px-5 py-2.5 rounded-full text-sm font-medium transition-colors",
                                !initialTagId
                                    ? "bg-neutral-900 text-white"
                                    : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
                            )}
                        >
                            {dict.projects.allWorks}
                        </button>
                        {initialTags.map(t => (
                            <button
                                key={t.id}
                                onClick={() => updateUrl({ tag: t.id, page: 1 })}
                                className={cn(
                                    "px-5 py-2.5 rounded-full text-sm font-medium transition-colors",
                                    initialTagId === t.id
                                        ? "bg-neutral-900 text-white"
                                        : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
                                )}
                            >
                                {t.name}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Projects Grid/List */}
                <div className={cn(
                    "w-full mb-20",
                    viewMode === "grid"
                        ? "grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-16"
                        : "flex flex-col gap-8"
                )}>
                    {projects.map((project) => (
                        viewMode === "grid" ? (
                            // GRID VIEW
                            <div key={project.id} className="flex flex-col group">
                                <Link href={`/${lang}/projects/${project.slug}`} className="block relative w-full aspect-[4/3] mb-6">
                                    <div className="w-full h-full bg-neutral-200 border border-neutral-200 shadow-[8px_8px_0_#171717] rounded-[40px] overflow-hidden relative transition-transform duration-300 group-hover:-translate-y-2 group-hover:shadow-[12px_12px_0_#171717]">
                                        {project.coverImage ? (
                                            <Image src={project.coverImage} alt={project.title} fill className="object-cover grayscale group-hover:grayscale-0 group-active:grayscale-0 transition-all duration-500 ease-in-out" />
                                        ) : (
                                            <div className="w-full h-full bg-neutral-800" />
                                        )}
                                    </div>
                                </Link>

                                <Link href={`/${lang}/projects/${project.slug}`}>
                                    <h3 className="text-2xl font-bold mb-3 tracking-tight group-hover:text-neutral-600 transition-colors">{project.title}</h3>
                                </Link>
                                <p className="text-neutral-500 mb-6 leading-relaxed line-clamp-2">{project.description}</p>

                                <div className="flex flex-wrap gap-2">
                                    {project.projectTags?.map((projectTags) => (
                                        <span key={projectTags.id} className="text-xs font-bold text-neutral-600 border border-neutral-200 rounded-full px-4 py-1.5 bg-white shadow-sm uppercase tracking-wider">
                                            {projectTags.tag.name}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            // LIST VIEW
                            <Link key={project.id} href={`/${lang}/projects/${project.slug}`} className="block group">
                                <div className="flex flex-col md:flex-row w-full bg-neutral-50 border border-neutral-300 shadow-[8px_8px_0_#171717] rounded-[40px] overflow-hidden transition-transform duration-300 group-hover:-translate-y-1 group-hover:shadow-[12px_12px_0_#171717]">
                                    <div className="relative w-full md:w-2/5 aspect-[4/3] md:aspect-auto md:min-h-[280px] border-b md:border-b-0 md:border-r border-neutral-300 shrink-0">
                                        {project.coverImage ? (
                                            <Image src={project.coverImage} alt={project.title} fill className="object-cover grayscale group-hover:grayscale-0 group-active:grayscale-0 transition-all duration-500 ease-in-out" />
                                        ) : (
                                            <div className="w-full h-full bg-neutral-800" />
                                        )}
                                    </div>
                                    <div className="p-8 md:p-12 flex flex-col justify-center grow">
                                        <h3 className="text-3xl font-bold mb-4 tracking-tight group-hover:text-neutral-600 transition-colors">{project.title}</h3>
                                        <p className="text-neutral-500 mb-8 leading-relaxed max-w-xl">{project.description}</p>
                                        <div className="flex flex-wrap gap-2 mt-auto">
                                            {project.projectTags?.map((projectTags) => (
                                                <span key={projectTags.id} className="text-xs font-bold text-neutral-500 border border-neutral-200 rounded-full px-4 py-1.5 bg-white uppercase tracking-wider">
                                                    {projectTags.tag.name}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        )
                    ))}
                    {projects.length === 0 && (
                        <div className="col-span-full py-20 text-center text-neutral-500">{dict.projects.noProjects}</div>
                    )}
                </div>

                {/* Pagination */}
                {initialMeta && (
                    <div className="flex justify-center items-center gap-2">
                        <Button
                            variant="outline"
                            size="icon"
                            className="rounded-full w-10 h-10"
                            aria-label="Previous page"
                            disabled={initialPage <= 1}
                            onClick={() => updateUrl({ page: initialPage - 1 })}
                        >
                            <NavArrowLeft className="w-4 h-4" />
                        </Button>

                        {Array.from({ length: initialMeta.totalPages }).map((_, i) => {
                            const pageNum = i + 1;
                            const isActive = pageNum === initialPage;
                            return (
                                <Button
                                    key={pageNum}
                                    variant={isActive ? undefined : "ghost"}
                                    className={cn("rounded-full w-10 h-10 p-0", isActive ? "text-white bg-neutral-900 border-none hover:bg-neutral-800" : "text-neutral-600 hover:bg-neutral-200")}
                                    onClick={() => updateUrl({ page: pageNum })}
                                >
                                    {pageNum}
                                </Button>
                            );
                        })}

                        <Button
                            variant="outline"
                            size="icon"
                            className="rounded-full w-10 h-10"
                            aria-label="Next page"
                            disabled={initialPage >= initialMeta.totalPages}
                            onClick={() => updateUrl({ page: initialPage + 1 })}
                        >
                            <NavArrowRight className="w-4 h-4" />
                        </Button>
                    </div>
                )}

            </div>
        </div>
    );
}
