import Image from "next/image";
import Link from "next/link";
import { ArrowDown, StarSolid, ArrowUpRight, Bridge3d, GraduationCap, Suitcase, Flash, CodeBrackets } from "iconoir-react";
import { fetchUser, fetchExperience, fetchEducation, fetchProjects, fetchSkills } from "@/lib/api";
import { Button } from "@/components/ui/Button";
import { ScrollLink } from "@/components/ScrollLink";
import { getDictionary } from "@/get-dictionary";
import { Locale } from "@/i18n-config";

export default async function Home({ params }: { params: Promise<{ lang: string }> }) {
  const resolvedParams = await params;
  const lang = resolvedParams.lang as Locale;
  const dict = await getDictionary(lang);

  const user = await fetchUser(undefined, lang);
  const experiences = await fetchExperience(undefined, lang);
  const educations = await fetchEducation(undefined, lang);
  const skills = await fetchSkills(undefined);

  // Fetch only highlighted projects with a limit of 4
  const projectsRes = await fetchProjects(undefined, { highlighted: true, limit: 4 }, lang);
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
                className="object-cover rounded-[40px] shadow-[8px_8px_0_#171717] border border-neutral-200 grayscale hover:grayscale-0 transition-all duration-500 ease-in-out"
              />
            ) : (
              <div className="w-full h-full bg-neutral-200 rounded-[40px] shadow-[8px_8px_0_#171717] border border-neutral-200 flex items-center justify-center text-neutral-400">
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
            <div key={skill.id} className="flex items-center gap-3 bg-white border border-neutral-200 rounded-[32px] px-6 py-4 shadow-[4px_4px_0_#171717] hover:-translate-y-1 hover:shadow-[6px_6px_0_#171717] transition-all">
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

        {/* Unified Year-aligned Timeline */}
        <div className="w-full max-w-5xl relative">
          {/* Vertical centre line */}
          <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-neutral-200 -translate-x-1/2 z-0" />

          {(() => {
            // Flatten all items into one chronologically sorted list
            type EduItem = { kind: 'edu'; year: number; data: typeof educations[0] };
            type ExpItem = { kind: 'exp'; year: number; data: typeof experiences[0] };
            type TimelineItem = EduItem | ExpItem;

            const items: TimelineItem[] = [
              ...educations.map(edu => ({ kind: 'edu' as const, year: Number(String(edu.year).split('-')[0]), data: edu })),
              ...experiences.map(exp => ({ kind: 'exp' as const, year: exp.startYear, data: exp })),
            ].sort((a, b) => a.year - b.year);

            return items.map((item) => (
              <div key={`${item.kind}-${item.data.id}`} className="grid grid-cols-1 md:grid-cols-[1fr_40px_1fr] gap-y-4 md:gap-y-0 mb-8 items-start">
                {/* Left column — Education */}
                <div className="flex flex-col md:items-end">
                  {item.kind === 'edu' ? (
                    <div className="w-full max-w-md md:ml-auto bg-white rounded-[32px] p-8 border border-neutral-200 shadow-[6px_6px_0_#171717] text-center md:text-right">
                      <div className="text-xs font-bold text-neutral-400 mb-2 uppercase tracking-widest">{item.data.year}</div>
                      <h4 className="text-lg font-bold mb-1">{item.data.institutionName}</h4>
                      <div className="text-sm font-medium text-neutral-900 mb-3">{item.data.degree}</div>
                      <p className="text-neutral-500 text-sm whitespace-pre-wrap">{item.data.description}</p>
                    </div>
                  ) : <div className="hidden md:block" />}
                </div>

                {/* Centre node */}
                <div className="hidden md:flex justify-center pt-8 z-10 relative">
                  {item.kind === 'edu'
                    ? <GraduationCap className="w-5 h-5 text-neutral-900 bg-neutral-50 p-0.5 box-content" />
                    : <Suitcase className="w-5 h-5 text-neutral-900 bg-neutral-50 p-0.5 box-content" />
                  }
                </div>

                {/* Right column — Experience */}
                <div className="flex flex-col md:items-start">
                  {item.kind === 'exp' ? (
                    <div className="w-full max-w-md md:mr-auto bg-white rounded-[32px] p-8 border border-neutral-200 shadow-[6px_6px_0_#171717] text-center md:text-left">
                      <div className="text-xs font-bold text-neutral-400 mb-2 uppercase tracking-widest">
                        {item.data.startYear} — {item.data.endYear || 'PRESENT'}
                      </div>
                      <h4 className="text-lg font-bold mb-1">{item.data.companyName}</h4>
                      <p className="text-neutral-500 text-sm whitespace-pre-wrap">{item.data.description}</p>
                    </div>
                  ) : <div className="hidden md:block" />}
                </div>
              </div>
            ));
          })()}
        </div>
      </section>

      {/* Selected Works Section */}
      <section id="selected-works" className="container mx-auto px-6 py-32 bg-neutral-100 rounded-[64px] mb-32 flex flex-col items-center border border-neutral-200">
        <StarSolid className="w-8 h-8 mb-4 text-neutral-900" />
        <h2 className="text-3xl font-bold mb-20 tracking-tight">{dict.home.selectedWorks}</h2>

        <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-16 mb-20">
          {highlightedProjects.map((project) => (
            <div key={project.id} className="flex flex-col group">
              <Link href={`/projects/${project.slug}`} className="block relative w-full aspect-[4/3] mb-6">
                <div className="w-full h-full bg-neutral-200 border border-neutral-200 shadow-[8px_8px_0_#171717] rounded-[40px] overflow-hidden relative transition-transform duration-300 group-hover:-translate-y-2 group-hover:shadow-[12px_12px_0_#171717]">
                  {project.coverImage ? (
                    <Image
                      src={project.coverImage}
                      alt={project.title}
                      fill
                      className="object-cover grayscale group-hover:grayscale-0 transition-all duration-500 ease-in-out"
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

              <Link href={`/projects/${project.slug}`}>
                <h3 className="text-2xl font-bold mb-3 tracking-tight group-hover:text-neutral-600 transition-colors">{project.title}</h3>
              </Link>
              <p className="text-neutral-500 mb-6 leading-relaxed line-clamp-2">
                {project.description}
              </p>

              <div className="flex flex-wrap gap-2">
                {project.projectTags?.map((projectTag) => (
                  <span key={projectTag.id} className="text-xs font-bold text-neutral-600 border border-neutral-200 rounded-full px-4 py-1.5 bg-white shadow-sm uppercase tracking-wider">
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
            <a href={`mailto:${user?.email || "hello@andikas.dev"}`} className="group flex items-center justify-between gap-6 bg-neutral-900 text-white rounded-full px-8 py-5 hover:bg-neutral-800 transition-colors shadow-[8px_8px_0_rgba(0,0,0,0.1)]">
              <span className="text-xl md:text-2xl font-bold">{user?.email || "hello@andikas.dev"}</span>
              <ArrowUpRight className="w-6 h-6 group-hover:rotate-45 transition-transform" />
            </a>

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
