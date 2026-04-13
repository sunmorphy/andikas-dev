import Image from "next/image";
import Link from "next/link";
import { ArrowDown, StarSolid, ArrowUpRight, Bridge3d, Flash, CodeBrackets, Download } from "iconoir-react";
import { fetchUser, fetchExperience, fetchEducation, fetchProjects, fetchSkills } from "@/lib/api";
import { Button } from "@/components/ui/Button";
import { ScrollLink } from "@/components/ScrollLink";
import { getDictionary } from "@/get-dictionary";
import { Locale } from "@/i18n-config";
import JourneyTimeline from "@/components/JourneyTimeline";

export default async function Home({ params }: { params: Promise<{ lang: string }> }) {
  const resolvedParams = await params;
  const lang = resolvedParams.lang as Locale;

  // Run all independent fetches in parallel — key performance fix
  const [dict, user, experiences, educations, skills, projectsRes] = await Promise.all([
    getDictionary(lang),
    fetchUser(undefined, lang),
    fetchExperience(undefined, lang),
    fetchEducation(undefined, lang),
    fetchSkills(undefined),
    fetchProjects(undefined, { highlighted: true, limit: 4 }, lang),
  ]);

  const highlightedProjects = projectsRes.data;

  return (
    <div className="flex flex-col items-center">
      {/* Hero Section */}
      <section className="container mx-auto px-6 pt-20 pb-32 flex flex-col items-center">
        <div className="flex flex-col md:flex-row items-center justify-center gap-12 w-full max-w-5xl mb-16">
          <h1 className="text-6xl md:text-8xl font-bold tracking-tighter leading-tight max-w-2xl text-center md:text-left">
            {user?.name ? (
              <>
                {user.name.split(' ')[0]}<br />
                {user.name.split(' ').slice(1).join(' ')}
              </>
            ) : (
              <>
                Andika<br />Sultanrafli
              </>
            )}
          </h1>
          <div className="relative w-64 h-64 md:w-80 md:h-80 shrink-0">
            {user?.profilePhoto ? (
              <Image
                src={user.profilePhoto}
                alt={user.name}
                fill
                className="object-cover rounded-[40px] shadow-neo-lg border border-neutral-200 grayscale hover:grayscale-0 active:grayscale-0 transition-all duration-500 ease-in-out"
              />
            ) : (
              <div className="w-full h-full bg-neutral-200 rounded-[40px] shadow-neo-lg border border-neutral-200 flex items-center justify-center text-neutral-400">
                <span>Photo</span>
              </div>
            )}
          </div>
        </div>

        <p className="text-xl md:text-2xl text-neutral-600 font-light text-center max-w-3xl mb-12">
          {user?.description || "Independent product designer and full-stack engineer building digital experiences with a focus on minimalism, speed, and functional aesthetics."}
        </p>

        <Button asChild size="lg" className="gap-2">
          <ScrollLink href={`/${lang}#selected-works`} targetId="selected-works">
            {dict.home.viewWork} <ArrowDown className="w-4 h-4" />
          </ScrollLink>
        </Button>
      </section>

      {/* Divider */}
      <div className="container mx-auto px-6">
        <hr className="border-t border-neutral-200" />
      </div>

      {/* Skills Section */}
      <section id="skills" className="container mx-auto px-6 py-32 flex flex-col items-center">
        <CodeBrackets className="w-8 h-8 mb-4 text-neutral-900" />
        <h2 className="text-3xl font-bold mb-20 tracking-tight">{dict.home.skills}</h2>

        <div className="w-full max-w-5xl flex flex-wrap justify-center gap-4 md:gap-6">
          {skills.map((skill) => (
            <div key={skill.id} className="flex items-center gap-3 bg-card dark:bg-card-dark border border-neutral-200 dark:border-neutral-700 rounded-[32px] px-6 py-4 shadow-neo-sm hover:-translate-y-1 hover:shadow-neo transition-all">
              {skill.icon && (
                <div className="relative w-6 h-6 shrink-0">
                  <Image src={skill.icon} alt={skill.name} fill className="object-contain" />
                </div>
              )}
              <span className="font-bold text-neutral-900 tracking-tight">{skill.name}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Divider */}
      <div className="container mx-auto px-6">
        <hr className="border-t border-neutral-200" />
      </div>

      {/* My Journey Section */}
      <section id="journey" className="container mx-auto px-6 py-32 flex flex-col items-center">
        <Bridge3d className="w-8 h-8 mb-4 text-neutral-900" />
        <h2 className="text-3xl font-bold mb-20 tracking-tight">{dict.home.journey}</h2>

        {/* Column Headers */}
        <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] mb-10 hidden md:grid">
          <h3 className="text-2xl font-light text-neutral-400 text-right pr-12">
            {dict.home.academic}
          </h3>
          <div className="w-px" />
          <h3 className="text-2xl font-light text-neutral-400 text-left pl-12">
            {dict.home.professional}
          </h3>
        </div>

        <JourneyTimeline
          educations={educations}
          experiences={experiences}
          showMoreLabel={dict.home.showMore}
          showLessLabel={dict.home.showLess}
        />
      </section>

      {/* Selected Works Section */}
      <section id="selected-works" className="container mx-auto px-6 py-32 bg-neutral-100 rounded-[64px] mb-32 flex flex-col items-center border border-neutral-200">
        <StarSolid className="w-8 h-8 mb-4 text-neutral-900" />
        <h2 className="text-3xl font-bold mb-20 tracking-tight">{dict.home.selectedWorks}</h2>

        <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-16 mb-20">
          {highlightedProjects.map((project) => (
            <div key={project.id} className="flex flex-col group">
              <Link href={`/${lang}/projects/${project.slug}`} className="block relative w-full aspect-[4/3] mb-6">
                <div className="w-full h-full bg-neutral-200 border border-neutral-200 shadow-neo-lg rounded-[40px] overflow-hidden relative transition-transform duration-300 group-hover:-translate-y-2 group-hover:shadow-neo-xl">
                  {project.coverImage ? (
                    <Image
                      src={project.coverImage}
                      alt={project.title}
                      fill
                      className="object-cover grayscale group-hover:grayscale-0 group-active:grayscale-0 transition-all duration-500 ease-in-out"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center p-8 bg-neutral-800 text-neutral-400 font-mono text-sm leading-relaxed">
                      {/* Placeholder text mimicking code block in the design */}
                      Minimalisist<br /><br />
                      &lt;M&gt;<br />
                      &nbsp;&nbsp;Modem minimalis is modern<br />
                      &lt;/M&gt;
                    </div>
                  )}
                </div>
              </Link>

              <Link href={`/${lang}/projects/${project.slug}`}>
                <h3 className="text-2xl font-bold mb-3 tracking-tight group-hover:text-neutral-600 transition-colors">{project.title}</h3>
              </Link>
              <p className="text-neutral-500 mb-6 leading-relaxed line-clamp-2">
                {project.description}
              </p>

              <div className="flex flex-wrap gap-2">
                {project.projectTags?.map((projectTag) => (
                  <span key={projectTag.id} className="text-xs font-bold text-neutral-500 border border-neutral-200 rounded-full px-4 py-1.5 bg-neutral-50 shadow-sm uppercase tracking-wider">
                    {projectTag.tag.name}
                  </span>
                ))}
              </div>
            </div>
          ))}
          {highlightedProjects.length === 0 && (
            <div className="col-span-2 py-20 text-center text-neutral-500">{dict.projects.noProjects}</div>
          )}
        </div>

        <Button asChild size="lg" className="gap-2">
          <Link href={`/${lang}/projects`}>
            {dict.home.seeAllWorks} <span className="ml-1 text-lg leading-none">&rarr;</span>
          </Link>
        </Button>
      </section>

      {/* Let's Talk Section */}
      <section id="contact" className="container mx-auto px-6 py-10 w-full mb-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-12 border-t border-neutral-200 pt-20">
          <div className="flex flex-col max-w-sm">
            <h2 className="text-5xl md:text-6xl font-light tracking-tight mb-6">{dict.home.letsTalk}</h2>
            <p className="text-neutral-500 mb-10 leading-relaxed">
              {dict.home.freelance}
            </p>
            <div className="flex flex-col gap-4 text-neutral-900 font-medium">
              <a href={`tel:${user?.phone || ""}`} className="flex items-center gap-3 hover:text-neutral-500 transition-colors">
                <i className="ph ph-phone text-xl text-neutral-400"></i> {user?.phone || "+62 896-1206-9998"}
              </a>
              <div className="flex items-center gap-3">
                <i className="ph ph-map-pin text-xl text-neutral-400"></i> {user?.location || "Surabaya, Indonesia"}
              </div>
            </div>
          </div>

          <div className="flex flex-col items-start md:items-end gap-10">
            <div className="flex flex-col items-start md:items-end gap-4">
              <a href={`mailto:${user?.email || "hello@andikas.dev"}`} className="group flex items-center justify-between gap-6 bg-neutral-900 text-neutral-50 rounded-full px-8 py-5 hover:bg-neutral-800 transition-colors fixed-shadow-neo-lg">
                <span className="text-xl md:text-2xl font-bold">{user?.email || "hello@andikas.dev"}</span>
                <ArrowUpRight className="w-6 h-6 group-hover:rotate-45 transition-transform" />
              </a>

              {user?.resume && (
                <a href={user.resume} target="_blank" rel="noreferrer" className="group flex items-center justify-between gap-4 bg-neutral-50 border-2 border-neutral-900 text-neutral-900 rounded-full px-8 py-5 hover:bg-neutral-100 transition-colors fixed-shadow-neo-lg">
                  <span className="text-xl md:text-2xl font-bold">{dict.home.downloadResume}</span>
                  <Download className="w-6 h-6 group-hover:-translate-y-1 transition-transform" />
                </a>
              )}
            </div>

            <div className="flex items-center gap-8 text-sm font-bold tracking-widest text-neutral-600">
              {user?.socialMedias?.map((social, idx) => {
                const parts = social.split("|");
                const iconName = parts[0];
                const url = parts.length > 1 ? parts[1] : parts[0];
                const username = url.split("/").filter(Boolean).pop();

                // Convert IconName from PascalCase (GithubLogo) to phosphor web format (ph-github-logo)
                const phosphorClass = `ph-${iconName.replace(/[A-Z]/g, m => "-" + m.toLowerCase()).replace(/^-/, "")}`;

                return (
                  <a key={idx} href={url} target="_blank" rel="noreferrer" className="flex items-center gap-2 hover:text-neutral-900 transition-colors uppercase group">
                    <i className={`ph ${phosphorClass} text-lg group-hover:scale-110 transition-transform`}></i>
                    <span>{username}</span>
                  </a>
                );
              })}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
