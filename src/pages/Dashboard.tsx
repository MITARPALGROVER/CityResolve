import React, { useEffect, useMemo, useState } from 'react';
import { StatCard } from '../components/domain/StatCard';
import { IssueCard } from '../components/domain/IssueCard';
import {
    Activity,
    CheckCircle,
    Clock,
    Construction,
    Droplets,
    FileWarning,
    Lightbulb,
    MapPin,
    Trash2,
    Trees,
} from 'lucide-react';
import { apiActivity, apiDashboardSummary, ActivityEvent, Issue } from '../lib/api';
import { timeAgo } from '../lib/time';



export const Dashboard: React.FC = () => {
    const [kpis, setKpis] = useState<{ totalIssues: number; pending: number; inprogress: number; resolvedThisMonth: number } | null>(null);
    const [recentIssues, setRecentIssues] = useState<Issue[]>([]);
    const [events, setEvents] = useState<ActivityEvent[]>([]);

    useEffect(() => {
        let cancelled = false;
        async function load() {
            try {
                const res = await apiDashboardSummary();
                if (!cancelled) {
                    setKpis(res.kpis);
                    setRecentIssues(res.recentIssues);
                }
            } catch {
                // ignore
            }
        }
        load();
        return () => {
            cancelled = true;
        };
    }, []);

    useEffect(() => {
        let cancelled = false;
        async function loadFeed() {
            try {
                const res = await apiActivity();
                if (!cancelled) setEvents(res.events);
            } catch {
                // ignore
            }
        }
        loadFeed();
        return () => {
            cancelled = true;
        };
    }, []);

    const stats = useMemo(() => {
        const safe = kpis || { totalIssues: 0, pending: 0, inprogress: 0, resolvedThisMonth: 0 };
        return [
            { title: 'Total Issues\nReported', value: safe.totalIssues, icon: <FileWarning size={28} strokeWidth={2} />, bgClass: 'bg-[#E1F8EB]', iconBgClass: 'bg-[#73DCA3]' },
            { title: 'Pending\nReview', value: safe.pending, icon: <Clock size={28} strokeWidth={2} />, bgClass: 'bg-[#FFE9D6]', iconBgClass: 'bg-[#FFB470]' },
            { title: 'In\nProgress', value: safe.inprogress, icon: <Activity size={28} strokeWidth={2} />, bgClass: 'bg-[#E3F0FF]', iconBgClass: 'bg-[#85BFFF]' },
            { title: 'Resolved\nThis Month', value: safe.resolvedThisMonth, icon: <CheckCircle size={28} strokeWidth={2} />, bgClass: 'bg-[#EFE6FF]', iconBgClass: 'bg-[#B99BFF]' },
        ];
    }, [kpis]);

    const categoryIcon = (category: Issue['category']) => {
        switch (category) {
            case 'road':
                return <Construction size={22} />;
            case 'water':
                return <Droplets size={22} />;
            case 'light':
                return <Lightbulb size={22} />;
            case 'waste':
                return <Trash2 size={22} />;
            case 'park':
                return <Trees size={22} />;
            default:
                return <MapPin size={22} />;
        }
    };

    const actionVerb = (type: ActivityEvent['type']) => {
        switch (type) {
            case 'resolved':
                return 'resolved';
            case 'reported':
                return 'reported';
            case 'assigned':
                return 'assigned';
            case 'upvoted':
                return 'upvoted';
            case 'commented':
                return 'commented';
            case 'escalated':
                return 'escalated';
            case 'badge':
                return 'earned badge';
            default:
                return 'updated';
        }
    };

    return (
        <div className="space-y-8 pb-10">
            <header className="mb-6">
                <h1 className="text-3xl font-bold text-text-primary tracking-tight">Overview</h1>
                <p className="text-text-muted mt-1">Track civic issues and community progress in real-time.</p>
            </header>

            {/* KPI Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                {stats.map((stat, i) => (
                    <StatCard
                        key={i}
                        title={stat.title}
                        value={stat.value}
                        icon={stat.icon}
                        bgClass={stat.bgClass}
                        iconBgClass={stat.iconBgClass}
                    />
                ))}
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 mt-10">
                <div className="xl:col-span-2 space-y-6">
                    <div className="flex justify-between items-center mb-1">
                        <h2 className="text-[22px] font-bold text-gray-900 tracking-tight">Recent Reports</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {recentIssues.map(issue => (
                            <IssueCard
                                key={issue._id}
                                id={issue._id}
                                title={issue.title}
                                category={{ icon: categoryIcon(issue.category), bg: 'bg-[#A7F3D0]', color: 'text-[#064E3B]' }}
                                location={issue.addressLabel}
                                timeAgo={timeAgo(issue.createdAt)}
                                description={issue.description}
                                status={issue.status}
                                upvotes={issue.upvoteCount}
                                comments={issue.commentCount}
                            />
                        ))}
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="bg-white rounded-[32px] shadow-[0_2px_10px_rgba(0,0,0,0.02)] border border-gray-100 flex flex-col p-6 h-full">
                        <h2 className="text-[22px] font-bold text-gray-900 mb-5 tracking-tight">Activity Feed</h2>
                        
                        <div className="bg-[#EBFDF3] rounded-[24px] px-3 py-6 flex-1 flex flex-col relative">
                            {/* Thin right-side green active line for the first element */}
                            <div className="absolute top-[16px] right-2 w-1.5 h-[50px] bg-[#6EE7B7] rounded-full z-10 transition-all"></div>
                            
                            <div className="flex flex-col relative">
                                {events.slice(0, 4).map((event, i) => (
                                    <div key={event._id} className={`flex flex-col gap-0 py-[18px] px-3 ${i !== 3 ? 'border-b border-[#A7F3D0]/60' : ''}`}>
                                        <div className="flex items-center gap-4">
                                            <div className="relative flex-shrink-0">
                                                <div className="w-10 h-10 rounded-full overflow-hidden bg-white shadow-sm ring-2 ring-white">
                                                    <img
                                                        src={event.userId?.avatarUrl || `https://i.pravatar.cc/150?u=${event.userId?.name || event._id}`}
                                                        alt="avatar"
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>
                                            </div>

                                            <div className="flex flex-col flex-1 pb-1">
                                                <div className="bg-[#A7F3D0] px-3 py-1.5 rounded-full inline-flex w-max mb-1 shadow-sm items-center">
                                                    <span className="text-[13px] font-bold text-[#064E3B] tracking-wide">
                                                        {(event.userId?.name || 'System')} {actionVerb(event.type)}
                                                    </span>
                                                </div>
                                                <span className="text-[13px] text-gray-600 font-medium pl-1">{timeAgo(event.createdAt)}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
