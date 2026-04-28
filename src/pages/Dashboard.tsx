import React, { useEffect, useMemo, useState } from 'react';
import {
    Activity,
    AlertTriangle,
    CheckCircle2,
    Clock3,
    Construction,
    Droplets,
    FileWarning,
    Leaf,
    Lightbulb,
    Map,
    MapPin,
    MessageCircle,
    Recycle,
    ShieldCheck,
    ThumbsUp,
    Trash2,
    Trees,
    Users,
} from 'lucide-react';
import {
    CartesianGrid,
    Bar,
    BarChart,
    Cell,
    Pie,
    PieChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts';
import { apiDashboardSummary, ActivityEvent, Issue, IssueCategory } from '../lib/api';
import { timeAgo } from '../lib/time';

type DashboardData = {
    kpis: { totalIssues: number; pending: number; inprogress: number; resolvedThisMonth: number };
    healthScore: number;
    recentIssues: Issue[];
    monthlyTrend: { month: string; reported: number; resolved: number; pending: number }[];
    categoryBreakdown: { key: IssueCategory; name: string; value: number }[];
    activeProjects: { id: string; name: string; progress: number; status: string; category: IssueCategory }[];
    events: ActivityEvent[];
};

const categoryColors: Record<IssueCategory, { color: string; bg: string; icon: React.ElementType }> = {
    road: { color: '#f97316', bg: '#fff1e8', icon: Construction },
    water: { color: '#3b82f6', bg: '#eff6ff', icon: Droplets },
    light: { color: '#eab308', bg: '#fff8e1', icon: Lightbulb },
    waste: { color: '#16a34a', bg: '#ecfdf5', icon: Trash2 },
    park: { color: '#22c55e', bg: '#f0fdf4', icon: Trees },
    other: { color: '#6b7280', bg: '#f3f4f6', icon: MapPin },
};

function eventMeta(type: ActivityEvent['type']) {
    switch (type) {
        case 'reported':
            return { color: '#22c55e', label: 'reported a new issue' };
        case 'assigned':
            return { color: '#eab308', label: 'moved an issue to in progress' };
        case 'resolved':
            return { color: '#0D3A1D', label: 'resolved an issue' };
        case 'upvoted':
            return { color: '#3b82f6', label: 'upvoted a report' };
        case 'commented':
            return { color: '#64748b', label: 'commented on an issue' };
        default:
            return { color: '#4CAF7D', label: 'updated city activity' };
    }
}

function statCards(kpis: DashboardData['kpis']) {
    return [
        {
            key: 'totalIssues',
            label: 'Total Issues',
            sublabel: 'Reported',
            value: kpis.totalIssues,
            accent: '#0D3A1D',
            iconBg: '#E8F5EE',
            Icon: FileWarning,
            trend: `+${Math.max(4, Math.min(18, kpis.totalIssues))}%`,
            line: '8,24 24,18 40,20 56,10 72,14',
        },
        {
            key: 'pending',
            label: 'Pending',
            sublabel: 'Review',
            value: kpis.pending,
            accent: '#EAB308',
            iconBg: '#FFF8E1',
            Icon: Clock3,
            trend: `+${Math.max(2, kpis.pending)}%`,
            line: '8,20 24,18 40,18 56,17 72,15',
        },
        {
            key: 'inprogress',
            label: 'In Progress',
            sublabel: 'Active',
            value: kpis.inprogress,
            accent: '#3B82F6',
            iconBg: '#EFF6FF',
            Icon: Activity,
            trend: `+${Math.max(3, kpis.inprogress + 2)}%`,
            line: '8,26 24,21 40,18 56,14 72,10',
        },
        {
            key: 'resolvedThisMonth',
            label: 'Resolved',
            sublabel: 'This Month',
            value: kpis.resolvedThisMonth,
            accent: '#4CAF7D',
            iconBg: '#F0FDF4',
            Icon: CheckCircle2,
            trend: `+${Math.max(6, kpis.resolvedThisMonth * 2 || 6)}%`,
            line: '8,28 24,24 40,18 56,12 72,8',
        },
    ];
}

export const Dashboard: React.FC = () => {
    const [data, setData] = useState<DashboardData | null>(null);

    useEffect(() => {
        let cancelled = false;
        async function load() {
            try {
                const response = await apiDashboardSummary();
                if (!cancelled) setData(response);
            } catch {
                if (!cancelled) setData(null);
            }
        }
        load();
        return () => {
            cancelled = true;
        };
    }, []);

    const kpis = data?.kpis || { totalIssues: 0, pending: 0, inprogress: 0, resolvedThisMonth: 0 };
    const cards = useMemo(() => statCards(kpis), [kpis]);
    const monthlyTrend = data?.monthlyTrend || [];
    const categoryBreakdown = data?.categoryBreakdown.filter((item) => item.value > 0) || [];
    const recentIssues = data?.recentIssues || [];
    const events = data?.events || [];
    const totalCategoryValue = Math.max(categoryBreakdown.reduce((sum, item) => sum + item.value, 0), 1);

    return (
        <div className="space-y-4">
            <section className="app-card p-4 md:p-5">
                <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                        <h1 className="text-[28px] font-extrabold tracking-tight">Eco-Metropolis Dashboard</h1>
                        <p className="mt-1 text-sm text-[var(--color-text-secondary)]">Track civic issues and community progress in real-time.</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <label className="hidden items-center gap-2 rounded-full border border-black/5 bg-[var(--color-bg-card-alt)] px-4 py-2 text-sm text-[var(--color-text-muted)] md:flex">
                            <Map size={14} />
                            <input
                                placeholder="Search dashboard..."
                                className="w-52 border-none bg-transparent p-0 text-sm shadow-none focus:shadow-none"
                            />
                        </label>
                        <div className="inline-flex items-center gap-2 rounded-full bg-[var(--color-green-pale)] px-3 py-2 text-xs font-semibold text-[var(--color-green-primary)]">
                            <span className="h-2 w-2 rounded-full bg-[var(--color-green-light)] animate-live-dot" />
                            Live Update
                        </div>
                    </div>
                </div>
            </section>

            <section className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                {cards.map((card) => {
                    const Icon = card.Icon;
                    return (
                        <article key={card.key} className="app-card p-4">
                            <div className="flex items-start justify-between gap-3">
                                <div className="flex h-11 w-11 items-center justify-center rounded-2xl" style={{ background: card.iconBg, color: card.accent }}>
                                    <Icon size={20} />
                                </div>
                                <span className="pill-badge bg-[var(--color-green-pale)] text-[var(--color-green-primary)]">{card.trend}</span>
                            </div>
                            <div className="mt-3 flex items-end justify-between gap-3">
                                <div>
                                    <p className="text-4xl font-extrabold leading-none">{card.value}</p>
                                    <p className="mt-2 text-xs font-bold uppercase tracking-[0.14em] text-[var(--color-text-secondary)]">{card.label}</p>
                                    <p className="text-xs text-[var(--color-text-muted)]">{card.sublabel}</p>
                                </div>
                                <svg viewBox="0 0 80 32" className="h-8 w-20">
                                    <polyline fill="none" stroke={card.accent} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" points={card.line} />
                                </svg>
                            </div>
                        </article>
                    );
                })}
            </section>

            <section className="space-y-4">
                <div className="">
                    <div className="app-card overflow-hidden bg-gradient-to-br from-[#0D3A1D] via-[#165126] to-[#1e6a32] p-5 text-white ">
                        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                            <div>
                                <p className="text-xs font-bold uppercase tracking-[0.22em] text-white/70">City Health Score</p>
                                <div className="mt-2 flex items-end gap-3">
                                    <span className="text-5xl font-extrabold leading-none">{data?.healthScore || 72}</span>
                                    <span className="pb-1 text-sm text-white/75">Good standing</span>
                                </div>
                                <p className="mt-2 max-w-xl text-sm text-white/75">
                                    Based on live issue resolution rate, response velocity, and active community participation.
                                </p>
                            </div>
                            <div className="grid gap-2 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
                                {[
                                    {
                                        label: 'Avg Time',
                                        value: `${(monthlyTrend.reduce((sum, row) => sum + row.pending, 0) / Math.max(monthlyTrend.filter((row) => row.pending > 0).length, 1) || 0).toFixed(1)}d`,
                                        icon: ShieldCheck,
                                    },
                                    {
                                        label: 'Response',
                                        value: `${Math.round(((kpis.inprogress + kpis.resolvedThisMonth) / Math.max(kpis.totalIssues, 1)) * 100)}%`,
                                        icon: Recycle,
                                    },
                                    {
                                        label: 'Volunteers',
                                        value: `${new Set(events.map((event) => event.userId?._id || event.userId?.name || event._id)).size}`,
                                        icon: Users,
                                    },
                                ].map((item) => {
                                    const ItemIcon = item.icon;
                                    return (
                                        <div key={item.label} className="rounded-2xl border border-white/10 bg-white/10 p-3">
                                            <ItemIcon size={16} className="text-[#A8E6C0]" />
                                            <p className="mt-3 text-lg font-bold">{item.value}</p>
                                            <p className="text-[11px] uppercase tracking-[0.14em] text-white/65">{item.label}</p>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                        <div className="mt-4 h-2.5 rounded-full bg-white/15">
                            <div className="h-full rounded-full bg-[#A8E6C0]" style={{ width: `${data?.healthScore || 72}%` }} />
                        </div>
                    </div>
                </div>

                <div className="grid gap-4 xl:grid-cols-[1.15fr_0.82fr_1.22fr] xl:grid-rows-[minmax(250px,auto)_minmax(320px,auto)]">
                    <div className="app-card p-4 xl:row-span-2">
                        <div className="mb-3 flex items-center justify-between">
                            <div>
                                <p className="text-sm font-bold uppercase tracking-[0.16em] text-[var(--color-text-secondary)]">Priority Queue</p>
                                <p className="text-xs text-[var(--color-text-muted)]">Issues needing action from operations teams</p>
                            </div>
                            <AlertTriangle size={18} className="text-[var(--color-green-primary)]" />
                        </div>
                        <div className="space-y-3">
                            {recentIssues.slice(0, 4).map((issue) => {
                                const meta = categoryColors[issue.category];
                                const Icon = meta.icon;
                                return (
                                    <div key={issue._id} className="rounded-2xl border border-black/5 bg-[var(--color-bg-card-alt)] p-3">
                                        <div className="flex items-start gap-3">
                                            <div className="flex h-10 w-10 items-center justify-center rounded-xl" style={{ background: meta.bg, color: meta.color }}>
                                                <Icon size={16} />
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <div className="flex items-start justify-between gap-3">
                                                    <p className="line-clamp-2 text-sm font-semibold">{issue.title}</p>
                                                    <span className="rounded-full bg-[var(--color-green-pale)] px-2.5 py-1 text-[11px] font-semibold text-[var(--color-green-primary)]">
                                                        {issue.status === 'inprogress' ? 'In Progress' : issue.status.charAt(0).toUpperCase() + issue.status.slice(1)}
                                                    </span>
                                                </div>
                                                <div className="mt-1 flex flex-wrap items-center gap-2 text-[11px] text-[var(--color-text-muted)]">
                                                    <span>{issue.addressLabel}</span>
                                                    <span>•</span>
                                                    <span>{timeAgo(issue.createdAt)}</span>
                                                </div>
                                                <div className="mt-2 h-2 rounded-full bg-[#d8e4d5]">
                                                    <div className="h-full rounded-full bg-[#0D3A1D]" style={{ width: `${issue.progressPercent || 15}%` }} />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                            <div className="app-card flex h-full flex-col p-4">
                                <div className="mb-2 flex items-center justify-between">
                                    <p className="text-sm font-bold uppercase tracking-[0.16em] text-[var(--color-text-secondary)]">Monthly Trend</p>
                                    <Activity size={16} className="text-[var(--color-green-primary)]" />
                                </div>
                                <div className="min-h-[210px] flex-1">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={monthlyTrend} barGap={6} barCategoryGap="24%">
                                            <CartesianGrid vertical={false} stroke="#e5efe2" />
                                            <XAxis
                                                dataKey="month"
                                                axisLine={false}
                                                tickLine={false}
                                                fontSize={11}
                                                tick={{ fill: '#6b7280' }}
                                            />
                                            <YAxis
                                                axisLine={false}
                                                tickLine={false}
                                                fontSize={11}
                                                tick={{ fill: '#6b7280' }}
                                                width={24}
                                            />
                                            <Tooltip
                                                cursor={{ fill: 'rgba(13,58,29,0.05)' }}
                                                contentStyle={{
                                                    borderRadius: '12px',
                                                    border: '1px solid rgba(13,58,29,0.08)',
                                                    boxShadow: '0 12px 30px rgba(15,35,24,0.08)',
                                                }}
                                            />
                                            <Bar dataKey="reported" fill="#0D3A1D" radius={[6, 6, 0, 0]} maxBarSize={16} />
                                            <Bar dataKey="resolved" fill="#4CAF7D" radius={[6, 6, 0, 0]} maxBarSize={16} />
                                            <Bar dataKey="pending" fill="#C6D3C4" radius={[6, 6, 0, 0]} maxBarSize={16} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                                <div className="mt-2 flex flex-wrap gap-3 text-[11px] text-[var(--color-text-secondary)]">
                                    <span className="inline-flex items-center gap-1.5">
                                        <span className="h-2.5 w-2.5 rounded-full bg-[#0D3A1D]" />
                                        Reported
                                    </span>
                                    <span className="inline-flex items-center gap-1.5">
                                        <span className="h-2.5 w-2.5 rounded-full bg-[#4CAF7D]" />
                                        Resolved
                                    </span>
                                    <span className="inline-flex items-center gap-1.5">
                                        <span className="h-2.5 w-2.5 rounded-full bg-[#C6D3C4]" />
                                        Pending
                                    </span>
                                </div>
                            </div>

                    <div className="app-card flex h-full flex-col p-4">
                        <div className="mb-3 flex items-center justify-between">
                            <div>
                                <p className="text-sm font-bold uppercase tracking-[0.16em] text-[var(--color-text-secondary)]">Recent Reports</p>
                                <p className="text-xs text-[var(--color-text-muted)]">Latest reported issues</p>
                            </div>
                            <button className="text-xs font-bold text-[var(--color-green-primary)]">View all</button>
                        </div>
                        <div className="space-y-3">
                            {recentIssues.slice(0, 3).map((issue) => {
                                const meta = categoryColors[issue.category];
                                const Icon = meta.icon;
                                return (
                                    <article key={issue._id} className="rounded-2xl border border-black/5 bg-[var(--color-bg-card-alt)] p-3">
                                        <div className="flex items-start gap-3">
                                            <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl" style={{ background: meta.bg, color: meta.color }}>
                                                <Icon size={16} />
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <p className="line-clamp-2 text-sm font-semibold">{issue.title}</p>
                                                <div className="mt-1 flex flex-wrap items-center gap-2 text-[11px] text-[var(--color-text-muted)]">
                                                    <span>{issue.addressLabel}</span>
                                                    <span>•</span>
                                                    <span>{timeAgo(issue.createdAt)}</span>
                                                </div>
                                                <div className="mt-2 flex items-center gap-3 text-[11px] text-[var(--color-text-secondary)]">
                                                    <span className="inline-flex items-center gap-1"><ThumbsUp size={12} /> {issue.upvoteCount}</span>
                                                    <span className="inline-flex items-center gap-1"><MessageCircle size={12} /> {issue.commentCount}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </article>
                                );
                            })}
                        </div>
                    </div>

                    <div className="app-card flex h-full flex-col p-4">
                        <div className="mb-2 flex items-center justify-between">
                            <p className="text-sm font-bold uppercase tracking-[0.16em] text-[var(--color-text-secondary)]">Urban Mix</p>
                            <Leaf size={16} className="text-[var(--color-green-primary)]" />
                        </div>
                        <div className="flex min-h-[220px] flex-1 items-center justify-center">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie data={categoryBreakdown} dataKey="value" innerRadius={42} outerRadius={82} paddingAngle={3}>
                                        {categoryBreakdown.map((entry) => (
                                            <Cell key={entry.key} fill={categoryColors[entry.key].color} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="mt-2 grid grid-cols-2 gap-x-3 gap-y-2">
                            {categoryBreakdown.map((entry) => (
                                <div key={entry.key} className="flex items-center gap-2 text-[11px] text-[var(--color-text-secondary)]">
                                    <span className="h-2.5 w-2.5 flex-shrink-0 rounded-full" style={{ background: categoryColors[entry.key].color }} />
                                    <span className="truncate">{Math.round((entry.value / totalCategoryValue) * 100)}% {entry.name.split(' ')[0]}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="app-card flex h-full flex-col p-4">
                        <div className="mb-3 flex items-center justify-between">
                            <div>
                                <p className="text-sm font-bold uppercase tracking-[0.16em] text-[var(--color-text-secondary)]">Community Activity</p>
                                <p className="text-xs text-[var(--color-text-muted)]">Recent city engagement</p>
                            </div>
                            <Users size={16} className="text-[var(--color-green-primary)]" />
                        </div>
                        <div className="space-y-3">
                            {events.slice(0, 4).map((event, index) => {
                                const meta = eventMeta(event.type);
                                return (
                                    <div key={event._id} className="relative flex gap-3">
                                        {index < Math.min(events.length, 4) - 1 && (
                                            <span className="absolute left-[10px] top-7 h-[calc(100%-2px)] w-px bg-[rgba(13,58,29,0.12)]" />
                                        )}
                                        <span className="relative z-10 mt-1 h-5 w-5 rounded-full border-2 border-white" style={{ background: meta.color }} />
                                        <div className="pb-2">
                                            <p className="text-sm font-semibold text-[var(--color-text-primary)]">
                                                {event.userId?.name || 'System'} {meta.label}
                                            </p>
                                            <p className="mt-0.5 text-xs text-[var(--color-text-secondary)]">{event.title}</p>
                                            <p className="mt-1 text-[11px] text-[var(--color-text-muted)]">{timeAgo(event.createdAt)}</p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};
