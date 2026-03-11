import React from 'react';
import { GlassCard } from '../ui/GlassCard';
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
        <GlassCard elevated className="p-6 relative overflow-hidden group">
            {/* Decorative BG element */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-accent-lime/10 blur-2xl rounded-full translate-x-1/2 -translate-y-1/2" />

            <div className="relative z-10">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-full bg-accent-lime/20 border border-accent-lime/30 flex items-center justify-center text-accent-lime shadow-[0_0_15px_rgba(163,230,53,0.3)]">
                        <Zap size={20} className="fill-accent-lime animate-pulse" />
                    </div>
                    <h2 className="text-2xl font-bold text-text-primary tracking-tight">
                        {points.toLocaleString()} <span className="text-accent-lime font-mono text-xl ml-1">pts</span>
                    </h2>
                </div>

                <div className="space-y-2">
                    <div className="flex justify-between items-end">
                        <span className="text-xs font-mono uppercase tracking-widest text-text-muted">Level {level}</span>
                        <span className="text-xs text-text-muted">Level {level + 1}</span>
                    </div>

                    <div className="h-3 w-full bg-black/40 rounded-full overflow-hidden border border-white/5 shadow-inner">
                        <div
                            className="h-full bg-gradient-to-r from-primary-green to-accent-lime rounded-full relative"
                            style={{ width: `${progressPercent}%` }}
                        >
                            {/* Shimmer effect inside progress bar */}
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent w-full -translate-x-full animate-[shimmer_2s_infinite]" />
                        </div>
                    </div>

                    <p className="text-sm text-text-secondary mt-3">
                        Next: <span className="text-white font-medium">{pointsToNextLevel} pts</span> to Level {level + 1}
                    </p>
                </div>
            </div>
        </GlassCard>
    );
};
