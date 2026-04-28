import React, { useEffect, useMemo, useState } from 'react';
import { Flame, Info, Shield, Sprout, Trophy, Zap } from 'lucide-react';
import { apiLeaderboard, apiRewardsMe } from '../lib/api';
import { useAuth } from '../auth/AuthContext';

const badgeCatalog = [
    { id: 'First Report', name: 'First Report', icon: '📝', accent: '#3b82f6', goal: 1, progressLabel: 'reports' },
    { id: 'Civic Hero', name: 'Civic Hero', icon: '🛡', accent: '#d4a017', goal: 10, progressLabel: 'issues' },
    { id: 'Eagle Eye', name: 'Eagle Eye', icon: '👁', accent: '#7c3aed', goal: 5, progressLabel: 'weekly reports' },
    { id: 'Green Thumb', name: 'Green Thumb', icon: '🌿', accent: '#22c55e', goal: 3, progressLabel: 'park reports' },
    { id: 'Community Voice', name: 'Community Voice', icon: '📣', accent: '#14b8a6', goal: 50, progressLabel: 'upvotes' },
    { id: 'Power User', name: 'Power User', icon: '⚡', accent: '#ef4444', goal: 30, progressLabel: 'days' },
];

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
                if (!cancelled) setProfile(null);
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
                if (!cancelled) setLeaderboard([]);
            }
        }
        loadLeaderboard();
        return () => {
            cancelled = true;
        };
    }, [period]);

    const points = profile?.points ?? user?.points ?? 0;
    const level = profile?.level ?? user?.level ?? 1;
    const nextLevelPoints = 1000;
    const progress = Math.min(100, Math.round((((points % nextLevelPoints) + nextLevelPoints) % nextLevelPoints / nextLevelPoints) * 100));
    const currentUserId = user?._id || user?.id;
    const earnedBadges = new Set(profile?.badges || []);

    const rankLabel = useMemo(() => {
        const rank = leaderboard.findIndex((entry) => entry.id === currentUserId || entry.name === profile?.name);
        if (rank === -1) return 'Unranked';
        return `#${rank + 1} of ${leaderboard.length || 1} citizens`;
    }, [leaderboard, currentUserId, profile?.name]);

    return (
        <div className="space-y-6">
            <section className="app-card p-6">
                <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
                    <div>
                        <p className="section-kicker">Rewards</p>
                        <h1 className="mt-2 text-3xl font-extrabold tracking-tight">Rewards & Leaderboard</h1>
                        <p className="mt-2 text-sm text-[var(--color-text-secondary)]">
                            Earn points for reporting issues and engaging with the community.
                        </p>
                    </div>
                    <button className="secondary-button inline-flex items-center gap-2 px-4 py-3 text-sm font-semibold">
                        <Info size={16} />
                        How to Earn Points?
                    </button>
                </div>
            </section>

            <section className="grid gap-6 lg:grid-cols-[1.1fr_1.4fr]">
                <div className="space-y-6">
                    <article className="app-card overflow-hidden bg-gradient-to-br from-[#0f2318] via-[#18412b] to-[#1e5c3a] p-6 text-white">
                        <div className="flex items-start justify-between">
                            <div className="inline-flex items-center gap-3">
                                <div className="icon-chip h-12 w-12 bg-white/10 text-[var(--color-green-glow)]">
                                    <Zap size={22} />
                                </div>
                                <div>
                                    <p className="text-xs uppercase tracking-[0.2em] text-[rgba(255,255,255,0.65)]">Your Points</p>
                                    <p className="mt-2 text-5xl font-extrabold">{points} pts</p>
                                </div>
                            </div>
                            <span className="pill-badge bg-white/10 text-white">Level {level}</span>
                        </div>
                        <div className="mt-8">
                            <div className="mb-2 flex items-center justify-between text-sm">
                                <span>Level {level}</span>
                                <span>{1000 - ((points % 1000) || 0)} pts to Level {level + 1}</span>
                            </div>
                            <div className="h-2 rounded-full bg-white/15">
                                <div className="h-full rounded-full bg-[var(--color-green-light)]" style={{ width: `${progress}%` }} />
                            </div>
                        </div>
                    </article>

                    <div className="grid gap-3 sm:grid-cols-3">
                        {[
                            { label: 'Reports Submitted', value: 2 },
                            { label: 'Upvotes Given', value: 1 },
                            { label: 'Days Active', value: 1 },
                        ].map((item) => (
                            <div key={item.label} className="app-card p-4 text-center">
                                <p className="text-2xl font-extrabold">{item.value}</p>
                                <p className="mt-1 text-xs uppercase tracking-[0.16em] text-[var(--color-text-muted)]">{item.label}</p>
                            </div>
                        ))}
                    </div>

                    <article className="app-card p-6">
                        <div className="mb-4 flex items-center justify-between">
                            <div>
                                <p className="text-xl font-bold">Earned Badges</p>
                                <p className="text-sm text-[var(--color-text-muted)]">{earnedBadges.size}/6 unlocked</p>
                            </div>
                            <Shield size={18} className="text-[var(--color-green-primary)]" />
                        </div>
                        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                            {badgeCatalog.map((badge) => {
                                const unlocked = earnedBadges.has(badge.id);
                                const progressValue = unlocked ? badge.goal : 0;
                                return (
                                    <div key={badge.id} className="rounded-2xl border border-black/5 bg-[var(--color-bg-card-alt)] p-4 text-center">
                                        <div
                                            className="mx-auto flex h-[72px] w-[72px] items-center justify-center rounded-full text-3xl"
                                            style={{
                                                background: unlocked ? badge.accent : '#e5e7eb',
                                                color: unlocked ? '#fff' : '#9ca3af',
                                                boxShadow: unlocked ? `0 12px 24px ${badge.accent}33` : 'none',
                                            }}
                                        >
                                            {badge.icon}
                                        </div>
                                        <p className={`mt-3 text-sm font-bold ${unlocked ? 'text-[var(--color-text-primary)]' : 'text-[var(--color-text-muted)]'}`}>{badge.name}</p>
                                        <p className="mt-1 text-[11px] text-[var(--color-text-muted)]">{unlocked ? 'Unlocked' : `0/${badge.goal} ${badge.progressLabel}`}</p>
                                        <div className="mt-3 h-1.5 rounded-full bg-white">
                                            <div className="h-full rounded-full" style={{ width: `${(progressValue / badge.goal) * 100}%`, background: unlocked ? badge.accent : '#d1d5db' }} />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                        <button className="mt-4 text-sm font-semibold text-[var(--color-green-primary)]">See all badges →</button>
                    </article>

                    <article className="app-card p-6">
                        <div className="mb-4 flex items-center gap-2">
                            <Sprout size={18} className="text-[var(--color-green-primary)]" />
                            <p className="text-xl font-bold">How to Earn Points</p>
                        </div>
                        <div className="space-y-3">
                            {[
                                ['+50 pts', 'Report a verified issue'],
                                ['+10 pts', 'Upvote an issue'],
                                ['+5 pts', 'Comment on an issue'],
                                ['+200 pts', 'Issue you reported gets resolved'],
                            ].map(([pointsLabel, description]) => (
                                <div key={pointsLabel} className="flex items-center gap-3 rounded-2xl bg-[var(--color-bg-card-alt)] px-4 py-3">
                                    <span className="pill-badge bg-[var(--color-green-pale)] text-[var(--color-green-primary)]">{pointsLabel}</span>
                                    <span className="text-sm text-[var(--color-text-secondary)]">{description}</span>
                                </div>
                            ))}
                        </div>
                    </article>
                </div>

                <article className="app-card overflow-hidden">
                    <div className="flex flex-col gap-4 border-b border-black/5 p-6 md:flex-row md:items-center md:justify-between">
                        <div>
                            <div className="inline-flex items-center gap-2">
                                <Trophy size={20} className="text-[#d4a017]" />
                                <p className="text-xl font-bold">City Top Contributors</p>
                            </div>
                            <p className="mt-1 text-sm text-[var(--color-text-muted)]">Recognizing residents driving faster city response.</p>
                        </div>
                        <div className="inline-flex rounded-full bg-[var(--color-bg-card-alt)] p-1">
                            <button
                                onClick={() => setPeriod('month')}
                                className={`rounded-full px-4 py-2 text-sm font-semibold ${period === 'month' ? 'bg-[var(--color-green-primary)] text-white' : 'text-[var(--color-text-secondary)]'}`}
                            >
                                This Month
                            </button>
                            <button
                                onClick={() => setPeriod('alltime')}
                                className={`rounded-full px-4 py-2 text-sm font-semibold ${period === 'alltime' ? 'bg-[var(--color-green-primary)] text-white' : 'text-[var(--color-text-secondary)]'}`}
                            >
                                All Time
                            </button>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse">
                            <thead className="bg-[var(--color-bg-card-alt)] text-left text-[11px] uppercase tracking-[0.22em] text-[var(--color-text-muted)]">
                                <tr>
                                    <th className="px-6 py-4">Rank</th>
                                    <th className="px-6 py-4">Citizen</th>
                                    <th className="px-6 py-4">Points</th>
                                    <th className="px-6 py-4">Reports</th>
                                    <th className="px-6 py-4">Resolved</th>
                                </tr>
                            </thead>
                            <tbody>
                                {leaderboard.map((row, index) => {
                                    const rank = index + 1;
                                    const isCurrentUser = row.id === currentUserId || row.name === profile?.name;
                                    const rowStyle =
                                        rank === 1
                                            ? 'bg-[#fff8e1]'
                                            : rank === 2
                                              ? 'bg-[#f8fafc]'
                                              : rank === 3
                                                ? 'bg-[#fff7ed]'
                                                : index % 2 === 0
                                                  ? 'bg-white'
                                                  : 'bg-[#f9fafb]';
                                    const initials = row.name
                                        .split(' ')
                                        .filter(Boolean)
                                        .slice(0, 2)
                                        .map((part) => part[0]?.toUpperCase())
                                        .join('');

                                    return (
                                        <tr key={row.id} className={`${rowStyle} ${isCurrentUser ? 'ring-1 ring-inset ring-[rgba(45,122,79,0.25)]' : ''}`}>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <span className="text-lg">{rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : `#${rank}`}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    {row.avatarUrl ? (
                                                        <img src={row.avatarUrl} alt={row.name} className="h-10 w-10 rounded-full object-cover" />
                                                    ) : (
                                                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--color-sidebar-bg)] text-sm font-bold text-white">
                                                            {initials}
                                                        </div>
                                                    )}
                                                    <div>
                                                        <p className="font-semibold">{row.name}</p>
                                                        {isCurrentUser && <span className="pill-badge mt-1 bg-[var(--color-green-pale)] text-[var(--color-green-primary)]">You</span>}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="inline-flex items-center gap-2 font-semibold text-[var(--color-text-primary)]">
                                                    <Flame size={15} className={rank <= 3 ? 'text-[#d4a017]' : 'text-[var(--color-text-muted)]'} />
                                                    {row.points}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-[var(--color-text-secondary)]">{Math.max(1, Math.round(row.points / 75))}</td>
                                            <td className="px-6 py-4 text-[var(--color-text-secondary)]">{row.resolvedReports}</td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>

                    <div className="border-t border-black/5 px-6 py-5 text-center">
                        <p className="font-semibold text-[var(--color-green-primary)]">Your Rank: {rankLabel}</p>
                        <p className="mt-1 text-sm text-[var(--color-text-muted)]">Keep reporting to maintain your position.</p>
                    </div>
                </article>
            </section>
        </div>
    );
};
