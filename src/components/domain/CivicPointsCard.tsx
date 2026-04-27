import React from 'react';
import { Zap } from 'lucide-react';

interface CivicPointsCardProps {
    points: number;
    level: number;
    pointsToNextLevel: number;
    progressPercent: number;
}

export const CivicPointsCard: React.FC<CivicPointsCardProps> = ({
    points,
    level,
    pointsToNextLevel,
    progressPercent
}) => {
    return (
        <div className="p-6 relative overflow-hidden group rounded-2xl border border-gray-200 bg-white shadow-sm">
            {/* Decorative BG element */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary-light/50 blur-2xl rounded-full translate-x-1/2 -translate-y-1/2" />

            <div className="relative z-10">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-full bg-primary-light border border-primary-green/30 flex items-center justify-center text-primary-dark shadow-[0_0_15px_rgba(34,197,94,0.1)]">
                        <Zap size={20} className="fill-accent-lime animate-pulse" />
                    </div>
                    <h2 className="text-2xl font-bold text-text-primary tracking-tight">
                        {points.toLocaleString()} <span className="text-primary-green font-mono text-xl ml-1">pts</span>
                    </h2>
                </div>

                <div className="space-y-2">
                    <div className="flex justify-between items-end">
                        <span className="text-xs font-mono uppercase tracking-widest text-text-muted">Level {level}</span>
                        <span className="text-xs text-text-muted">Level {level + 1}</span>
                    </div>

                    <div className="h-3 w-full bg-gray-100 rounded-full overflow-hidden shadow-inner">
                        <div
                            className="h-full bg-gradient-to-r from-primary-green to-accent-lime rounded-full relative"
                            style={{ width: `${progressPercent}%` }}
                        >
                            {/* Shimmer effect inside progress bar */}
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent w-full -translate-x-full animate-[shimmer_2s_infinite]" />
                        </div>
                    </div>

                    <p className="text-sm text-text-secondary mt-3">
                        Next: <span className="text-gray-900 font-medium">{pointsToNextLevel} pts</span> to Level {level + 1}
                    </p>
                </div>
            </div>
        </div>
    );
};
