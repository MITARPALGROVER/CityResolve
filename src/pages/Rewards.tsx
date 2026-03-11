import React from 'react';
import { CivicPointsCard } from '../components/domain/CivicPointsCard';
import { BadgeShelf, Badge } from '../components/domain/BadgeShelf';
import { GlassCard } from '../components/ui/GlassCard';
import { Crown, Medal, Award, Flame } from 'lucide-react';

const MOCK_BADGES: Badge[] = [
    { id: '1', name: 'First Report', icon: '📝', earned: true },
    { id: '2', name: 'Civic Hero', icon: '🦸', earned: true },
    { id: '3', name: 'Eagle Eye', icon: '🦅', earned: true },
    { id: '4', name: 'Green Thumb', icon: '🌱', earned: false },
    { id: '5', name: 'Community Leader', icon: '👑', earned: false },
    { id: '6', name: '100 Day Streak', icon: '🔥', earned: false },
];

const LEADERBOARD_DATA = [
    { rank: 1, name: 'Sarah Jenkins', avatar: 'SJ', points: 14500, issues: 42, isCurrentUser: false },
    { rank: 2, name: 'Michael Chen', avatar: 'MC', points: 12100, issues: 38, isCurrentUser: false },
    { rank: 3, name: 'Priya Gupta', avatar: 'PG', points: 10450, issues: 29, isCurrentUser: false },
    { rank: 4, name: 'You', avatar: 'ME', points: 9200, issues: 24, isCurrentUser: true },
    { rank: 5, name: 'David Smith', avatar: 'DS', points: 8800, issues: 21, isCurrentUser: false },
    { rank: 6, name: 'Elena Rodriguez', avatar: 'ER', points: 7400, issues: 18, isCurrentUser: false },
    { rank: 7, name: 'James Wilson', avatar: 'JW', points: 6100, issues: 15, isCurrentUser: false },
];

export const Rewards: React.FC = () => {
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
                        points={9200}
                        level={4}
                        pointsToNextLevel={800}
                        progressPercent={75}
                    />

                    <BadgeShelf badges={MOCK_BADGES} />
                </div>

                {/* Right Column - Leaderboard */}
                <div className="lg:col-span-2">
                    <GlassCard className="p-0 overflow-hidden">
                        <div className="p-6 border-b border-white/10 flex items-center justify-between">
                            <h2 className="text-xl font-bold flex items-center gap-2">
                                <Trophy size={20} className="text-amber-400" />
                                City Top Contributors
                            </h2>
                            <div className="flex bg-white/5 rounded-full p-1 border border-white/10">
                                <button className="px-4 py-1.5 text-sm font-medium bg-primary-green text-background rounded-full shadow-[0_0_10px_rgba(34,197,94,0.3)]">This Month</button>
                                <button className="px-4 py-1.5 text-sm font-medium text-text-muted hover:text-white transition-colors">All Time</button>
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-white/5 text-sm text-text-muted uppercase tracking-wider">
                                        <th className="p-4 font-medium pl-6">Rank</th>
                                        <th className="p-4 font-medium">Citizen</th>
                                        <th className="p-4 font-medium text-right">Points</th>
                                        <th className="p-4 font-medium text-right pr-6">Reports Resolved</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {LEADERBOARD_DATA.map((user) => (
                                        <tr
                                            key={user.rank}
                                            className={`group transition-colors ${user.isCurrentUser ? 'bg-primary-green/10' : 'hover:bg-white/5'}`}
                                        >
                                            <td className="p-4 pl-6 relative">
                                                {/* Rank Styling */}
                                                {user.rank === 1 && <div className="absolute left-0 top-0 bottom-0 w-1 bg-amber-400" />}
                                                {user.rank === 2 && <div className="absolute left-0 top-0 bottom-0 w-1 bg-gray-300" />}
                                                {user.rank === 3 && <div className="absolute left-0 top-0 bottom-0 w-1 bg-amber-700" />}
                                                {user.isCurrentUser && user.rank > 3 && <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary-green" />}

                                                <div className="flex items-center justify-center w-8 h-8 rounded-full font-bold text-sm
                          ${user.rank === 1 ? 'bg-amber-400/20 text-amber-400 border border-amber-400/50' :
                            user.rank === 2 ? 'bg-gray-300/20 text-gray-300 border border-gray-300/50' :
                            user.rank === 3 ? 'bg-amber-700/20 text-amber-600 border border-amber-700/50' :
                            'bg-white/5 text-text-muted'
                          }">
                                                    {user.rank}
                                                </div>
                                            </td>
                                            <td className="p-4">
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold border-2
                             ${user.isCurrentUser ? 'bg-primary-green border-background text-background' : 'bg-surface border-white/20 text-text-secondary'}
                           `}>
                                                        {user.avatar}
                                                    </div>
                                                    <div>
                                                        <p className={`font-semibold ${user.isCurrentUser ? 'text-primary-green text-glow' : 'text-text-primary'}`}>
                                                            {user.name}
                                                            {user.isCurrentUser && <span className="ml-2 text-xs bg-primary-green/20 text-primary-green px-2 py-0.5 rounded-full border border-primary-green/30">You</span>}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="p-4 text-right">
                                                <div className="flex items-center justify-end gap-1 font-mono font-medium text-accent-lime">
                                                    <Flame size={14} className={user.rank <= 3 ? "animate-pulse" : "opacity-50"} />
                                                    {user.points.toLocaleString()}
                                                </div>
                                            </td>
                                            <td className="p-4 pr-6 text-right">
                                                <span className="inline-flex items-center justify-center px-3 py-1 rounded-full bg-status-resolved/10 text-status-resolved text-sm border border-status-resolved/20">
                                                    {user.issues}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </GlassCard>
                </div>

            </div>
        </div>
    );
};

// Quick import for trophy
import { Trophy } from 'lucide-react';
