import { Metadata } from "next";
import { fetchProjects, fetchTags } from "@/lib/api";
import ProjectsClient from "./ProjectsClient";

import { getDictionary } from "@/get-dictionary";
import { Locale } from "@/i18n-config";

export const metadata: Metadata = {
    title: "All Projects - Andika Sultanrafli",
    description: "A curated collection of design and development work, focusing on minimalism and functional beauty.",
};

export default async function ProjectsPage({
    params,
    searchParams
}: {
    params: Promise<{ lang: string }>,
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
    const resolvedParams = await params;
    const lang = resolvedParams.lang as Locale;
    const resolvedSearchParams = await searchParams;

    const page = Number(resolvedSearchParams.page) || 1;
    const search = typeof resolvedSearchParams.search === 'string' ? resolvedSearchParams.search : undefined;
    const tag = Number(resolvedSearchParams.tag) || undefined;

    const projectsRes = await fetchProjects(undefined, { page, limit: 10, search, tag }, lang);
    const allTags = await fetchTags();
    const dict = await getDictionary(lang);

    return <ProjectsClient
        initialProjects={projectsRes.data}
        initialMeta={projectsRes.meta}
        initialTags={allTags}
        initialSearch={search || ""}
        initialTagId={tag}
        initialPage={page}
        lang={lang}
        dict={dict}
    />;
}
