"use client";

import { useState } from "react";
import { GraduationCap, Suitcase, NavArrowDown, NavArrowUp } from "iconoir-react";
import { Education, Experience } from "@/lib/types";
import { cn } from "@/lib/utils";

type EduItem = { kind: "edu"; year: number; data: Education };
type ExpItem = { kind: "exp"; year: number; data: Experience };
type TimelineItem = EduItem | ExpItem;

interface Props {
    educations: Education[];
    experiences: Experience[];
    showMoreLabel: string;
    showLessLabel: string;
}

const INITIAL_LIMIT = 3;

export default function JourneyTimeline({ educations, experiences, showMoreLabel, showLessLabel }: Props) {
    const [expanded, setExpanded] = useState(false);

    const items: TimelineItem[] = [
        ...educations.map(edu => ({ kind: "edu" as const, year: Number(String(edu.year).split("-")[0]), data: edu })),
        ...experiences.map(exp => ({ kind: "exp" as const, year: exp.startYear, data: exp })),
    ].sort((a, b) => b.year - a.year);

    const hasMore = items.length > INITIAL_LIMIT;
    const visibleItems = expanded ? items : items.slice(0, INITIAL_LIMIT);

    return (
        <div className="w-full max-w-5xl relative">
            {/* Vertical centre line */}
            <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-neutral-200 -translate-x-1/2 z-0" />

            {visibleItems.map((item) => (
                <div key={`${item.kind}-${item.data.id}`} className="grid grid-cols-1 md:grid-cols-[1fr_40px_1fr] gap-y-4 md:gap-y-0 mb-8 items-start">
                    {/* Left column — Education */}
                    <div className="flex flex-col md:items-end">
                        {item.kind === "edu" ? (
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
                        {item.kind === "edu"
                            ? <GraduationCap className="w-5 h-5 text-neutral-900 bg-neutral-50 p-0.5 box-content" />
                            : <Suitcase className="w-5 h-5 text-neutral-900 bg-neutral-50 p-0.5 box-content" />
                        }
                    </div>

                    {/* Right column — Experience */}
                    <div className="flex flex-col md:items-start">
                        {item.kind === "exp" ? (
                            <div className="w-full max-w-md md:mr-auto bg-white rounded-[32px] p-8 border border-neutral-200 shadow-[6px_6px_0_#171717] text-center md:text-left">
                                <div className="text-xs font-bold text-neutral-400 mb-2 uppercase tracking-widest">
                                    {item.data.startYear} — {item.data.endYear || "PRESENT"}
                                </div>
                                <h4 className="text-lg font-bold mb-1">{item.data.companyName}</h4>
                                <p className="text-neutral-500 text-sm whitespace-pre-wrap">{item.data.description}</p>
                            </div>
                        ) : <div className="hidden md:block" />}
                    </div>
                </div>
            ))}

            {/* Show more / Show less */}
            {hasMore && (
                <div className="flex justify-center mt-4">
                    <button
                        onClick={() => setExpanded(!expanded)}
                        className={cn(
                            "inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest",
                            "text-neutral-400 hover:text-neutral-900 transition-colors"
                        )}
                    >
                        {expanded ? (
                            <><NavArrowUp className="w-4 h-4" /> {showLessLabel}</>
                        ) : (
                            <><NavArrowDown className="w-4 h-4" /> {showMoreLabel} ({items.length - INITIAL_LIMIT})</>
                        )}
                    </button>
                </div>
            )}
        </div>
    );
}
