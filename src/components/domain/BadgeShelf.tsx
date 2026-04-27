import React from 'react';
import { Lock } from 'lucide-react';

export interface Badge {
    id: string;
    name: string;
    icon: string | React.ReactNode;
    earned: boolean;
    colorClass?: string;
}

interface BadgeShelfProps {
    badges: Badge[];
}

export const BadgeShelf: React.FC<BadgeShelfProps> = ({ badges }) => {
    return (
        <div className="p-6 rounded-2xl border border-gray-200 bg-white shadow-sm">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-text-primary">Earned Badges</h3>
                <span className="text-sm text-text-muted">{badges.filter(b => b.earned).length} / {badges.length} Unlocked</span>
            </div>

            <div className="flex gap-4 overflow-x-auto pb-4 custom-scrollbar">
                {badges.map((badge) => (
                    <div
                        key={badge.id}
                        className="flex flex-col items-center gap-3 min-w-[80px]"
                    >
                        <div className={`relative w-16 h-16 rounded-full flex items-center justify-center border-2 transition-all duration-300
              ${badge.earned
                                ? `bg-gray-50 border-primary-green shadow-[0_0_15px_rgba(34,197,94,0.15)] hover:scale-110 cursor-pointer text-3xl`
                                : 'bg-gray-50 border-gray-200 grayscale opacity-40 text-2xl'
                            }`}
                        >
                            {typeof badge.icon === 'string' ? <span>{badge.icon}</span> : badge.icon}

                            {!badge.earned && (
                                <div className="absolute -bottom-1 -right-1 bg-white border border-gray-200 rounded-full p-1 shadow-sm">
                                    <Lock size={10} className="text-text-muted" />
                                </div>
                            )}
                        </div>
                        <span className={`text-xs text-center font-medium ${badge.earned ? 'text-text-secondary' : 'text-text-muted'}`}>
                            {badge.name}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
};
