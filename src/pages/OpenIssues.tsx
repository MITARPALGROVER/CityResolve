import React, { useEffect, useMemo, useState } from 'react';
import {
    AlertTriangle,
    ArrowRight,
    CalendarRange,
    ChevronDown,
    Construction,
    Droplets,
    HelpCircle,
    Lightbulb,
    MapPin,
    MessageCircle,
    Search,
    SlidersHorizontal,
    ThumbsUp,
    Trash2,
    Trees,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { apiIssueCounts, apiListIssues, Issue } from '../lib/api';
import { timeAgo } from '../lib/time';

type Category = 'all' | 'road' | 'water' | 'light' | 'waste' | 'park' | 'other';
type SortOption = 'newest' | 'oldest' | 'upvotes' | 'critical';
type Severity = 'low' | 'medium' | 'high' | 'critical';
type StatusFilter = 'all' | 'pending' | 'inprogress' | 'resolved';

const categoryConfig = {
    road: { label: 'Roads', full: 'Roads & Traffic', color: '#f97316', bg: '#fff1e8', icon: Construction },
    water: { label: 'Water', full: 'Water & Plumbing', color: '#3b82f6', bg: '#eff6ff', icon: Droplets },
    light: { label: 'Lights', full: 'Streetlights', color: '#f59e0b', bg: '#fff8e1', icon: Lightbulb },
    waste: { label: 'Waste', full: 'Waste Management', color: '#ef4444', bg: '#fef2f2', icon: Trash2 },
    park: { label: 'Parks', full: 'Parks & Trees', color: '#22c55e', bg: '#f0fdf4', icon: Trees },
    other: { label: 'Other', full: 'Other', color: '#9ca3af', bg: '#f3f4f6', icon: HelpCircle },
} as const;

const severityStyle: Record<Severity, string> = {
    low: 'bg-[#eff6ff] text-[#2563eb]',
    medium: 'bg-[#fff8e1] text-[#d97706]',
    high: 'bg-[#fff7ed] text-[#ea580c]',
    critical: 'bg-[#fef2f2] text-[#dc2626]',
};

const statusStyle: Record<Exclude<StatusFilter, 'all'>, string> = {
    pending: 'bg-[#fff8e1] text-[#d97706]',
    inprogress: 'bg-[#eff6ff] text-[#2563eb]',
    resolved: 'bg-[#f0fdf4] text-[#16a34a]',
};

export const OpenIssues: React.FC = () => {
    const [search, setSearch] = useState('');
    const [categoryFilter, setCategoryFilter] = useState<Category>('all');
    const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
    const [selectedSeverities, setSelectedSeverities] = useState<Severity[]>([]);
    const [sortBy, setSortBy] = useState<SortOption>('newest');
    const [showFilters, setShowFilters] = useState(false);
    const [issues, setIssues] = useState<Issue[]>([]);
    const [counts, setCounts] = useState<{ total: number; pending: number; inprogress: number; resolved: number; rejected: number } | null>(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        let cancelled = false;
        async function loadCounts() {
            try {
                const res = await apiIssueCounts();
                if (!cancelled) setCounts(res);
            } catch {
                if (!cancelled) setCounts(null);
            }
        }
        loadCounts();
        return () => {
            cancelled = true;
        };
    }, []);

    useEffect(() => {
        let cancelled = false;
        async function loadIssues() {
            setLoading(true);
            try {
                const sort = sortBy === 'upvotes' ? 'upvoted' : 'newest';
                const res = await apiListIssues({
                    q: search,
                    category: categoryFilter,
                    status: statusFilter,
                    sort,
                    page: 1,
                    pageSize: 50,
                });
                if (!cancelled) setIssues(res.issues);
            } catch {
                if (!cancelled) setIssues([]);
            } finally {
                if (!cancelled) setLoading(false);
            }
        }
        loadIssues();
        return () => {
            cancelled = true;
        };
    }, [search, categoryFilter, statusFilter, sortBy]);

    const visibleIssues = useMemo(() => {
        let next = [...issues];
        if (selectedSeverities.length > 0) {
            next = next.filter((issue) => selectedSeverities.includes(issue.severity));
        }
        if (sortBy === 'oldest') {
            next.sort((a, b) => (a.createdAt > b.createdAt ? 1 : -1));
        } else if (sortBy === 'critical') {
            const order = { critical: 0, high: 1, medium: 2, low: 3 };
            next.sort((a, b) => order[a.severity] - order[b.severity]);
        } else if (sortBy === 'upvotes') {
            next.sort((a, b) => b.upvoteCount - a.upvoteCount);
        }
        return next;
    }, [issues, selectedSeverities, sortBy]);

    const safeCounts = counts || { total: visibleIssues.length, pending: 0, inprogress: 0, resolved: 0, rejected: 0 };

    const categoryCounts = useMemo(() => {
        const entries = { all: safeCounts.total, road: 0, water: 0, light: 0, waste: 0, park: 0, other: 0 } as Record<Category, number>;
        issues.forEach((issue) => {
            entries[issue.category] += 1;
        });
        return entries;
    }, [issues, safeCounts.total]);

    const toggleSeverity = (value: Severity) => {
        setSelectedSeverities((prev) => (prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value]));
    };

    return (
        <div className="space-y-6">
            <section className="app-card p-6">
                <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
                    <div>
                        <p className="section-kicker">Issue Registry</p>
                        <h1 className="mt-2 text-3xl font-extrabold tracking-tight">Open Issues</h1>
                        <p className="mt-2 text-sm text-[var(--color-text-secondary)]">Browse and track all reported city issues.</p>
                    </div>
                    <div className="flex flex-wrap gap-3">
                        <button className="secondary-button px-4 py-3 text-sm font-semibold">Export CSV</button>
                        <button className="primary-button px-4 py-3 text-sm font-semibold">+ Report New Issue</button>
                    </div>
                </div>
            </section>

            <section className="app-card overflow-hidden">
                <div className="grid sm:grid-cols-2 xl:grid-cols-4">
                    {[
                        { label: 'Total', value: safeCounts.total, key: 'all', color: '#111827' },
                        { label: 'Pending', value: safeCounts.pending, key: 'pending', color: '#d97706' },
                        { label: 'In Progress', value: safeCounts.inprogress, key: 'inprogress', color: '#2563eb' },
                        { label: 'Resolved', value: safeCounts.resolved, key: 'resolved', color: '#16a34a' },
                    ].map((item, index) => (
                        <button
                            key={item.label}
                            onClick={() => setStatusFilter(item.key as StatusFilter)}
                            className={`border-b px-6 py-5 text-left transition sm:border-b-0 sm:border-r ${
                                index === 3 ? 'sm:border-r-0' : ''
                            } ${
                                statusFilter === item.key
                                    ? 'bg-[var(--color-green-pale)] border-[rgba(45,122,79,0.18)]'
                                    : 'border-black/5 bg-white'
                            }`}
                        >
                            <p className="text-3xl font-extrabold" style={{ color: item.color }}>{item.value}</p>
                            <p className="mt-1 text-xs uppercase tracking-[0.18em] text-[var(--color-text-muted)]">{item.label}</p>
                        </button>
                    ))}
                </div>
            </section>

            <section className="app-card p-5">
                <div className="flex flex-col gap-3 lg:flex-row">
                    <label className="flex flex-1 items-center gap-3 rounded-full border border-black/10 bg-white px-4 py-3">
                        <Search size={16} className="text-[var(--color-text-muted)]" />
                        <input
                            value={search}
                            onChange={(event) => setSearch(event.target.value)}
                            placeholder="Search by title, location, or ID..."
                            className="w-full border-none bg-transparent p-0 shadow-none focus:shadow-none"
                        />
                    </label>
                    <div className="relative">
                        <select
                            value={sortBy}
                            onChange={(event) => setSortBy(event.target.value as SortOption)}
                            className="h-full min-w-[180px] appearance-none rounded-full border border-black/10 bg-white px-4 py-3 pr-10 text-sm"
                        >
                            <option value="newest">Newest First</option>
                            <option value="oldest">Oldest First</option>
                            <option value="upvotes">Most Upvoted</option>
                            <option value="critical">Critical First</option>
                        </select>
                        <ChevronDown size={16} className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]" />
                    </div>
                    <button
                        onClick={() => setShowFilters((prev) => !prev)}
                        className="secondary-button inline-flex items-center justify-center gap-2 px-4 py-3 text-sm font-semibold"
                    >
                        <SlidersHorizontal size={16} />
                        Filters
                    </button>
                </div>
            </section>

            <section className="flex gap-6">
                <div className="min-w-0 flex-1 space-y-5">
                    <div className="scrollbar-hide flex gap-2 overflow-x-auto pb-1">
                        {(['all', 'road', 'water', 'light', 'waste', 'park', 'other'] as Category[]).map((category) => {
                            const config = category === 'all' ? null : categoryConfig[category];
                            return (
                                <button
                                    key={category}
                                    onClick={() => setCategoryFilter(category)}
                                    className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition ${
                                        categoryFilter === category
                                            ? 'border-[var(--color-green-primary)] bg-[var(--color-green-primary)] text-white'
                                            : 'border-black/10 bg-white text-[var(--color-text-secondary)] hover:border-[var(--color-green-primary)]'
                                    }`}
                                >
                                    {config && <config.icon size={14} />}
                                    <span>{category === 'all' ? 'All' : config?.label}</span>
                                    <span className={`rounded-full px-2 py-0.5 text-xs ${categoryFilter === category ? 'bg-white/15' : 'bg-[var(--color-bg-card-alt)]'}`}>
                                        {categoryCounts[category]}
                                    </span>
                                </button>
                            );
                        })}
                    </div>

                    {loading ? (
                        <div className="app-card flex h-52 items-center justify-center p-6 text-sm text-[var(--color-text-muted)]">Loading issues...</div>
                    ) : visibleIssues.length === 0 ? (
                        <div className="app-card flex min-h-[320px] flex-col items-center justify-center p-8 text-center">
                            <div className="icon-chip h-20 w-20 bg-[var(--color-green-pale)] text-[var(--color-green-primary)]">
                                <AlertTriangle size={34} />
                            </div>
                            <h2 className="mt-5 text-2xl font-bold">No issues found</h2>
                            <p className="mt-2 max-w-md text-sm text-[var(--color-text-secondary)]">
                                Try adjusting your filters or report a new issue to start your city response queue.
                            </p>
                            <button className="primary-button mt-6 px-5 py-3 text-sm font-semibold">+ Report Issue</button>
                        </div>
                    ) : (
                        <div className="grid gap-4 xl:grid-cols-2">
                            {visibleIssues.map((issue) => {
                                const category = categoryConfig[issue.category];
                                const Icon = category.icon;
                                const progress = issue.status === 'inprogress' ? Math.min(95, 35 + issue.commentCount * 8 + issue.upvoteCount * 4) : 0;
                                return (
                                    <article key={issue._id} className="app-card p-5" style={{ borderLeft: `4px solid ${category.color}` }}>
                                        <div className="flex items-start justify-between gap-4">
                                            <div className="flex min-w-0 gap-4">
                                                <div className="icon-chip h-10 w-10 flex-shrink-0" style={{ background: category.bg, color: category.color }}>
                                                    <Icon size={18} />
                                                </div>
                                                <div className="min-w-0">
                                                    <h3 className="text-base font-bold leading-6">{issue.title}</h3>
                                                    <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-[var(--color-text-secondary)]">
                                                        <span className="inline-flex items-center gap-1.5"><MapPin size={14} /> {issue.addressLabel}</span>
                                                        <span>{timeAgo(issue.createdAt)}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <button className="rounded-full p-2 text-[var(--color-text-muted)] hover:bg-[var(--color-bg-card-alt)]">⋯</button>
                                        </div>

                                        <div className="my-4 h-px bg-black/5" />
                                        <div className="flex flex-wrap items-center gap-2 text-xs font-semibold">
                                            <span className={`pill-badge ${statusStyle[issue.status as Exclude<StatusFilter, 'all'>] || 'bg-[#fef2f2] text-[#dc2626]'}`}>{issue.status === 'inprogress' ? 'In Progress' : issue.status}</span>
                                            <span className={`pill-badge ${severityStyle[issue.severity]}`}>{issue.severity}</span>
                                        </div>

                                        <div className="mt-4 flex items-center justify-between gap-4">
                                            <div className="flex items-center gap-4 text-sm text-[var(--color-text-secondary)]">
                                                <span className="inline-flex items-center gap-1.5"><ThumbsUp size={15} /> {issue.upvoteCount}</span>
                                                <span className="inline-flex items-center gap-1.5"><MessageCircle size={15} /> {issue.commentCount}</span>
                                            </div>
                                            <button onClick={() => navigate(`/issues/${issue._id}`)} className="inline-flex items-center gap-1 text-sm font-semibold text-[var(--color-green-primary)]">
                                                View <ArrowRight size={14} />
                                            </button>
                                        </div>

                                        {issue.status === 'inprogress' && (
                                            <div className="mt-4">
                                                <div className="mb-1 flex items-center justify-between text-[11px] uppercase tracking-[0.16em] text-[var(--color-text-muted)]">
                                                    <span>Completion</span>
                                                    <span>{progress}%</span>
                                                </div>
                                                <div className="h-2 rounded-full bg-[#e5e7eb]">
                                                    <div className="h-full rounded-full bg-[#3b82f6]" style={{ width: `${progress}%` }} />
                                                </div>
                                            </div>
                                        )}
                                    </article>
                                );
                            })}
                        </div>
                    )}
                </div>

                {showFilters && (
                    <aside className="app-card hidden w-[320px] flex-shrink-0 p-5 xl:block">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-lg font-bold">Filters</p>
                                <p className="text-sm text-[var(--color-text-muted)]">Fine-tune the active issue list.</p>
                            </div>
                            <button onClick={() => setShowFilters(false)} className="text-[var(--color-text-muted)]">✕</button>
                        </div>

                        <div className="mt-5 space-y-5">
                            <div>
                                <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-[var(--color-text-muted)]">Status</p>
                                <div className="flex flex-wrap gap-2">
                                    {(['all', 'pending', 'inprogress', 'resolved'] as StatusFilter[]).map((status) => (
                                        <button
                                            key={status}
                                            onClick={() => setStatusFilter(status)}
                                            className={`rounded-full px-3 py-2 text-xs font-semibold transition ${
                                                statusFilter === status ? 'bg-[var(--color-green-primary)] text-white' : 'bg-[var(--color-bg-card-alt)] text-[var(--color-text-secondary)]'
                                            }`}
                                        >
                                            {status === 'inprogress' ? 'In Progress' : status}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-[var(--color-text-muted)]">Severity</p>
                                <div className="grid grid-cols-2 gap-2">
                                    {(['low', 'medium', 'high', 'critical'] as Severity[]).map((severity) => (
                                        <button
                                            key={severity}
                                            onClick={() => toggleSeverity(severity)}
                                            className={`rounded-2xl border px-3 py-3 text-left text-sm font-semibold transition ${
                                                selectedSeverities.includes(severity)
                                                    ? `border-transparent ${severityStyle[severity]}`
                                                    : 'border-black/10 bg-white text-[var(--color-text-secondary)]'
                                            }`}
                                        >
                                            {severity}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-[var(--color-text-muted)]">Date Range</p>
                                <button className="secondary-button inline-flex w-full items-center justify-between px-4 py-3 text-sm font-semibold">
                                    <span className="inline-flex items-center gap-2">
                                        <CalendarRange size={15} />
                                        Last 30 days
                                    </span>
                                    <ChevronDown size={15} />
                                </button>
                            </div>

                            <button className="primary-button w-full px-4 py-3 text-sm font-semibold">Apply Filters</button>
                            <button
                                onClick={() => {
                                    setStatusFilter('all');
                                    setSelectedSeverities([]);
                                    setCategoryFilter('all');
                                }}
                                className="w-full text-sm font-semibold text-[var(--color-green-primary)]"
                            >
                                Reset
                            </button>
                        </div>
                    </aside>
                )}
            </section>
        </div>
    );
};
