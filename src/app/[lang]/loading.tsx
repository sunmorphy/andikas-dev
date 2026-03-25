import { Code } from "iconoir-react";

export default function Loading() {
    return (
        <div className="fixed inset-0 z-[100] bg-neutral-50 flex items-center justify-center">
            <div className="relative group">
                {/* Abstract shape background / neo-brutalist shadow */}
                <div className="absolute inset-0 bg-neutral-200 rounded-3xl [clip-path:polygon(0_0,100%_15%,100%_100%,15%_100%)] group-hover:bg-neutral-300 transition-colors animate-pulse" />

                {/* Main spinning container */}
                <div className="relative bg-white border-2 border-neutral-900 rounded-2xl p-6 shadow-[8px_8px_0_#171717] animate-[spin_3s_linear_infinite]">
                    <Code className="w-12 h-12 text-neutral-900" />
                </div>
            </div>
        </div>
    );
}
