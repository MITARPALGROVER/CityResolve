import React from 'react';
import { StatCard } from '../components/domain/StatCard';
import { IssueCard } from '../components/domain/IssueCard';
import { FileWarning, CheckCircle, Clock, Activity, MapPin, UserCheck, AlertTriangle, Wrench, ThumbsUp, MessageCircle, Star } from 'lucide-react';
import { IssueStatus } from '../components/ui/StatusBadge';

const STATS = [
    { title: 'Total Issues Reported', value: '2,451', icon: <FileWarning size={24} />, bg: 'bg-primary-green', trend: { value: 12, isPositive: true } },
    { title: 'Pending Review', value: '432', icon: <Clock size={24} />, bg: 'bg-status-pending', trend: { value: 5, isPositive: false } },
    { title: 'In Progress', value: '89', icon: <Activity size={24} />, bg: 'bg-status-progress' },
    { title: 'Resolved This Month', value: '1,204', icon: <CheckCircle size={24} />, bg: 'bg-status-resolved', trend: { value: 18, isPositive: true } },
];

const ISSUES = [
    {
        id: '1',
        title: 'Large Pothole on MG Road near Junction',
        category: { icon: '🛣️', bg: 'bg-orange-500/20', color: 'text-orange-400' },
        location: 'Sector 12, Zone B',
        timeAgo: '2 hrs ago',
        description: 'Large pothole causing damage to vehicles near the main intersection. Needs immediate filling before monsoon starts.',
        status: 'pending' as IssueStatus,
        upvotes: 124,
        comments: 32,
    },
    {
        id: '2',
        title: 'Streetlight completely out',
        category: { icon: '💡', bg: 'bg-yellow-500/20', color: 'text-yellow-400' },
        location: 'Oakwood Avenue, North District',
        timeAgo: '5 hrs ago',
        description: 'Entire street is pitch black at night, causing safety concerns for pedestrians and drivers.',
        status: 'inprogress' as IssueStatus,
        upvotes: 89,
        comments: 14,
    },
    {
        id: '3',
        title: 'Water pipe leaking uncontrollably',
        category: { icon: '💧', bg: 'bg-blue-500/20', color: 'text-blue-400' },
        location: 'Downtown Square',
        timeAgo: '1 day ago',
        description: 'A major water main burst early this morning. Gallons of water are being wasted.',
        status: 'resolved' as IssueStatus,
        upvotes: 450,
        comments: 120,
    }
];

interface FeedEvent {
    id: string;
    type: 'resolved' | 'reported' | 'assigned' | 'upvoted' | 'commented' | 'escalated' | 'badge';
    user: string;
    avatar: string;
    action: string;
    target: string;
    location?: string;
    time: string;
    isNew?: boolean;
}

const FEED: FeedEvent[] = [
    { id: '1', type: 'resolved', user: 'City Dept.', avatar: 'CD', action: 'resolved', target: 'Broken traffic signal on Ring Road', location: 'Ring Road, Zone A', time: '2 min ago', isNew: true },
    { id: '2', type: 'reported', user: 'Arjun M.', avatar: 'AM', action: 'reported', target: 'Overflowing drain near Park St', location: 'Park Street', time: '8 min ago', isNew: true },
    { id: '3', type: 'upvoted', user: 'Priya S.', avatar: 'PS', action: 'upvoted', target: 'Large Pothole on MG Road', time: '15 min ago' },
    { id: '4', type: 'assigned', user: 'Dept. PWD', avatar: 'PW', action: 'assigned to team', target: 'Water pipe leaking on Main Ave', location: 'Main Avenue', time: '22 min ago' },
    { id: '5', type: 'commented', user: 'Rahul K.', avatar: 'RK', action: 'commented on', target: 'Streetlight out on Oakwood Ave', time: '35 min ago' },
    { id: '6', type: 'escalated', user: 'System', avatar: 'SY', action: 'escalated', target: 'Fallen tree blocking Highway 9', location: 'Highway 9', time: '1 hr ago' },
    { id: '7', type: 'badge', user: 'Meera T.', avatar: 'MT', action: 'earned badge', target: 'Civic Champion', time: '1 hr ago' },
    { id: '8', type: 'resolved', user: 'City Dept.', avatar: 'CD', action: 'resolved', target: 'Garbage bins not collected — Zone C', location: 'Zone C', time: '2 hrs ago' },
    { id: '9', type: 'reported', user: 'Vikram N.', avatar: 'VN', action: 'reported', target: 'Road divider broken near Toll', location: 'Highway 9', time: '2 hrs ago' },
];

const FEED_ICON: Record<FeedEvent['type'], { icon: React.ReactNode; color: string; bg: string }> = {
    resolved:  { icon: <CheckCircle size={13} />,    color: 'text-status-resolved', bg: 'bg-status-resolved/15' },
    reported:  { icon: <AlertTriangle size={13} />,  color: 'text-status-pending',  bg: 'bg-status-pending/15' },
    assigned:  { icon: <Wrench size={13} />,         color: 'text-status-progress', bg: 'bg-status-progress/15' },
    upvoted:   { icon: <ThumbsUp size={13} />,       color: 'text-accent-teal',     bg: 'bg-accent-teal/15' },
    commented: { icon: <MessageCircle size={13} />,  color: 'text-text-secondary',  bg: 'bg-white/10' },
    escalated: { icon: <AlertTriangle size={13} />,  color: 'text-red-400',         bg: 'bg-red-400/15' },
    badge:     { icon: <Star size={13} />,           color: 'text-yellow-400',      bg: 'bg-yellow-400/15' },
};

export const Dashboard: React.FC = () => {
    return (
        <div className="space-y-8 pb-10">
            <header className="mb-6">
                <h1 className="text-3xl font-bold text-text-primary tracking-tight">Overview</h1>
                <p className="text-text-muted mt-1">Track civic issues and community progress in real-time.</p>
            </header>

            {/* KPI Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                {STATS.map((stat, i) => (
                    <StatCard
                        key={i}
                        title={stat.title}
                        value={stat.value}
                        icon={stat.icon}
                        iconBgColor={stat.bg}
                        trend={stat.trend}
                    />
                ))}
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 mt-10">
                <div className="xl:col-span-2 space-y-6">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-bold text-text-primary">Recent Reports</h2>
                        <button className="text-sm text-primary-green hover:text-accent-teal transition-colors font-medium">
                            View All &rarr;
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {ISSUES.map(issue => (
                            <IssueCard key={issue.id} {...issue} />
                        ))}
                        {ISSUES.slice(0, 1).map(issue => (
                            <IssueCard key={`${issue.id}-dup`} {...issue} />
                        ))}
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-bold text-text-primary">Activity Feed</h2>
                        <div className="flex items-center gap-1.5 text-xs text-primary-green font-medium">
                            <span className="w-1.5 h-1.5 rounded-full bg-primary-green animate-pulse" />
                            Live
                        </div>
                    </div>

                    <div className="glass-card border border-white/[0.07] overflow-hidden">
                        {/* Feed header */}
                        <div className="px-4 py-3 border-b border-white/[0.06] flex items-center justify-between">
                            <span className="text-xs text-text-muted font-mono">Today · {FEED.length} events</span>
                            <button className="text-xs text-primary-green hover:text-accent-teal transition-colors">View all</button>
                        </div>

                        {/* Feed items */}
                        <div className="divide-y divide-white/[0.04] max-h-[520px] overflow-y-auto">
                            {FEED.map(event => {
                                const cfg = FEED_ICON[event.type];
                                return (
                                    <div key={event.id} className={`flex items-start gap-3 px-4 py-3.5 hover:bg-white/[0.02] transition-colors ${event.isNew ? 'bg-primary-green/[0.03]' : ''}`}>
                                        {/* Avatar */}
                                        <div className="relative flex-shrink-0">
                                            <div className="w-8 h-8 rounded-full bg-white/10 border border-white/10 flex items-center justify-center text-[10px] font-bold text-text-secondary">
                                                {event.avatar}
                                            </div>
                                            {/* Type badge */}
                                            <div className={`absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full flex items-center justify-center border border-[#0A0F0A] ${cfg.bg} ${cfg.color}`}>
                                                {cfg.icon}
                                            </div>
                                        </div>

                                        {/* Content */}
                                        <div className="flex-1 min-w-0">
                                            <p className="text-xs leading-snug text-text-secondary">
                                                <span className="font-semibold text-white">{event.user}</span>
                                                {' '}<span className={cfg.color}>{event.action}</span>
                                            </p>
                                            <p className="text-xs text-white/70 font-medium mt-0.5 truncate">"{event.target}"</p>
                                            {event.location && (
                                                <p className="flex items-center gap-1 text-[11px] text-text-muted mt-0.5">
                                                    <MapPin size={10} /> {event.location}
                                                </p>
                                            )}
                                        </div>

                                        {/* Time + new dot */}
                                        <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
                                            <span className="text-[11px] text-text-muted whitespace-nowrap">{event.time}</span>
                                            {event.isNew && <span className="w-1.5 h-1.5 rounded-full bg-primary-green" />}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Footer */}
                        <div className="px-4 py-3 border-t border-white/[0.06] flex items-center justify-center">
                            <button className="text-xs text-text-muted hover:text-primary-green transition-colors flex items-center gap-1.5">
                                <UserCheck size={13} /> Load more activity
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
