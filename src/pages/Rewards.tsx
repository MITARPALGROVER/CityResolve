import React, { useEffect, useMemo, useState } from 'react';
import { CivicPointsCard } from '../components/domain/CivicPointsCard';
import { BadgeShelf, Badge } from '../components/domain/BadgeShelf';
import { Flame, Trophy } from 'lucide-react';
import { apiLeaderboard, apiRewardsMe } from '../lib/api';
import { useAuth } from '../auth/AuthContext';

export const Rewards: React.FC = () => {
    const { user } = useAuth();
    const [profile, setProfile] = useState<{ name: string; avatarUrl?: string; points: number; level: number; badges: string[] } | null>(null);
    const [period, setPeriod] = useState<'month' | 'alltime'>('month');
    const [leaderboard, setLeaderboard] = useState<{ id: string; name: string; avatarUrl?: string; points: number; level: number; resolvedReports: number }[]>([]);

    useEffect(() => {
        let cancelled = false;
        async function loadProfile() {
            try {
                const res = await apiRewardsMe();
                if (!cancelled) setProfile(res.user);
            } catch {
                // ignore
            }
        }
        loadProfile();
        return () => {
            cancelled = true;
        };
    }, []);

    useEffect(() => {
        let cancelled = false;
        async function loadLeaderboard() {
            try {
                const res = await apiLeaderboard(period);
                if (!cancelled) setLeaderboard(res.leaderboard);
            } catch {
                // ignore
            }
        }
        loadLeaderboard();
        return () => {
            cancelled = true;
        };
    }, [period]);

    const badgeShelf: Badge[] = useMemo(() => {
        const earned = new Set(profile?.badges || []);
        const base: Badge[] = [
            { id: 'first-report', name: 'First Report', icon: '📝', earned: earned.has('First Report') },
            { id: 'civic-hero', name: 'Civic Hero', icon: '🦸', earned: earned.has('Civic Hero') },
            { id: 'eagle-eye', name: 'Eagle Eye', icon: '🦅', earned: earned.has('Eagle Eye') },
            { id: 'green-thumb', name: 'Green Thumb', icon: '🌱', earned: earned.has('Green Thumb') },
            { id: 'community-leader', name: 'Community Leader', icon: '👑', earned: earned.has('Community Leader') },
            { id: 'streak', name: '100 Day Streak', icon: '🔥', earned: earned.has('100 Day Streak') },
        ];

        // If backend sends unknown badges, append them as earned.
        for (const b of earned) {
            if (!base.some(x => x.name === b)) {
                base.push({ id: `badge-${b}`, name: b, icon: '🏅', earned: true });
            }
        }
        return base;
    }, [profile?.badges]);

    const points = profile?.points ?? user?.points ?? 0;
    const level = profile?.level ?? user?.level ?? 1;
    const intoLevel = ((points % 1000) + 1000) % 1000;
    const pointsToNextLevel = 1000 - intoLevel;
    const progressPercent = Math.round((intoLevel / 1000) * 100);

    const currentUserId = user?._id || user?.id;

    return (
        <div className="space-y-8 pb-10">
            <header className="mb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-text-primary tracking-tight">Rewards & Leaderboard</h1>
                    <p className="text-text-muted mt-1">Earn points for reporting issues and engaging with the community.</p>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Left Column - User Stats */}
                <div className="space-y-6">
                    <CivicPointsCard
                        points={points}
                        level={level}
                        pointsToNextLevel={pointsToNextLevel}
                        progressPercent={progressPercent}
                    />

                    <BadgeShelf badges={badgeShelf} />
                </div>

                {/* Right Column - Leaderboard */}
                <div className="lg:col-span-2">
                    <div className="rounded-2xl border border-gray-200 bg-white shadow-sm p-0 overflow-hidden">
                        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                                <Trophy size={20} className="text-amber-500" />
                                City Top Contributors
                            </h2>
                            <div className="flex bg-gray-50 rounded-full p-1 border border-gray-200">
                                <button
                                    onClick={() => setPeriod('month')}
                                    className={`px-4 py-1.5 text-sm font-medium rounded-full transition-colors ${period === 'month'
                                        ? 'bg-primary-green text-white shadow-[0_4px_10px_rgba(34,197,94,0.2)]'
                                        : 'text-text-muted hover:text-gray-900'
                                        }`}
                                >
                                    This Month
                                </button>
                                <button
                                    onClick={() => setPeriod('alltime')}
                                    className={`px-4 py-1.5 text-sm font-medium rounded-full transition-colors ${period === 'alltime'
                                        ? 'bg-primary-green text-white shadow-[0_4px_10px_rgba(34,197,94,0.2)]'
                                        : 'text-text-muted hover:text-gray-900'
                                        }`}
                                >
                                    All Time
                                </button>
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-gray-100 text-sm text-text-muted uppercase tracking-wider bg-gray-50">
                                        <th className="p-4 font-medium pl-6">Rank</th>
                                        <th className="p-4 font-medium">Citizen</th>
                                        <th className="p-4 font-medium text-right">Points</th>
                                        <th className="p-4 font-medium text-right pr-6">Reports Resolved</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {leaderboard.map((row, idx) => {
                                        const rank = idx + 1;
                                        const initials = row.name
                                            .split(' ')
                                            .filter(Boolean)
                                            .slice(0, 2)
                                            .map(p => p[0]!.toUpperCase())
                                            .join('');
                                        const isCurrentUser = currentUserId ? row.id === currentUserId : (row.name === profile?.name);

                                        return (
                                        <tr
                                            key={row.id}
                                            className={`group transition-colors ${isCurrentUser ? 'bg-primary-green/5' : 'hover:bg-gray-50'}`}
                                        >
                                            <td className="p-4 pl-6 relative">
                                                {/* Rank Styling */}
                                                {rank === 1 && <div className="absolute left-0 top-0 bottom-0 w-1 bg-amber-400" />}
                                                {rank === 2 && <div className="absolute left-0 top-0 bottom-0 w-1 bg-gray-300" />}
                                                {rank === 3 && <div className="absolute left-0 top-0 bottom-0 w-1 bg-amber-700" />}
                                                {isCurrentUser && rank > 3 && <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary-green" />}

                                                <div className="flex items-center justify-center w-8 h-8 rounded-full font-bold text-sm
                          ${user.rank === 1 ? 'bg-amber-100 text-amber-600 border border-amber-200' :
                            user.rank === 2 ? 'bg-gray-100 text-gray-500 border border-gray-200' :
                            user.rank === 3 ? 'bg-orange-100 text-orange-600 border border-orange-200' :
                            'bg-gray-50 text-text-muted border border-gray-100'
                          }">
                                                    {rank}
                                                </div>
                                            </td>
                                            <td className="p-4">
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold border-2
                             ${isCurrentUser ? 'bg-primary-green border-white text-white' : 'bg-gray-100 border-gray-200 text-text-secondary'}
                           `}>
                                                        {initials}
                                                    </div>
                                                    <div>
                                                        <p className={`font-semibold ${isCurrentUser ? 'text-primary-dark' : 'text-gray-900'}`}>
                                                            {row.name}
                                                            {isCurrentUser && <span className="ml-2 text-xs bg-primary-light text-primary-dark px-2 py-0.5 rounded-full border border-primary-green/30">You</span>}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="p-4 text-right">
                                                <div className="flex items-center justify-end gap-1 font-mono font-medium text-primary-dark">
                                                    <Flame size={14} className={rank <= 3 ? "animate-pulse text-amber-500" : "opacity-50"} />
                                                    {row.points.toLocaleString()}
                                                </div>
                                            </td>
                                            <td className="p-4 pr-6 text-right">
                                                <span className="inline-flex items-center justify-center px-3 py-1 rounded-full bg-pastel-green text-primary-dark text-sm border border-gray-200">
                                                    {row.resolvedReports}
                                                </span>
                                            </td>
                                        </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};
