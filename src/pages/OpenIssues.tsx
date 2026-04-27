import React, { useEffect, useState } from 'react';
import { GlassCard } from '../components/ui/GlassCard';
import { StatusBadge, IssueStatus } from '../components/ui/StatusBadge';
import {
    Search, Filter, MapPin, ThumbsUp, MessageCircle, ArrowRight,
    MoreHorizontal, Construction, Droplets, Lightbulb, Trash2, Trees, HelpCircle,
    SlidersHorizontal, ChevronDown, AlertTriangle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { apiIssueCounts, apiListIssues, Issue } from '../lib/api';
import { timeAgo } from '../lib/time';

type Category = 'all' | 'road' | 'water' | 'light' | 'waste' | 'park' | 'other';
type StatusFilter = 'all' | IssueStatus;
type SortOption = 'newest' | 'upvotes' | 'comments';

const CATEGORY_META: Record<string, { icon: React.ReactNode; color: string; bg: string; label: string }> = {
    road:  { icon: <Construction size={18} />,  color: 'text-orange-400', bg: 'bg-orange-500/15', label: 'Roads & Traffic' },
    water: { icon: <Droplets size={18} />,      color: 'text-blue-400',   bg: 'bg-blue-500/15',   label: 'Water & Plumbing' },
    light: { icon: <Lightbulb size={18} />,     color: 'text-yellow-400', bg: 'bg-yellow-500/15', label: 'Streetlights' },
    waste: { icon: <Trash2 size={18} />,        color: 'text-red-400',    bg: 'bg-red-500/15',    label: 'Waste Management' },
    park:  { icon: <Trees size={18} />,         color: 'text-primary-dark', bg: 'bg-primary-light', label: 'Parks & Trees' },
    other: { icon: <HelpCircle size={18} />,    color: 'text-gray-500', bg: 'bg-gray-100',      label: 'Other' },
};

const CATEGORY_TABS: { id: Category; label: string }[] = [
    { id: 'all',   label: 'All' },
    { id: 'road',  label: 'Roads' },
    { id: 'water', label: 'Water' },
    { id: 'light', label: 'Lights' },
    { id: 'waste', label: 'Waste' },
    { id: 'park',  label: 'Parks' },
    { id: 'other', label: 'Other' },
];

type IssueRow = Issue;

const SEVERITY_CONFIG = {
    low:      { label: 'Low',      color: 'text-blue-400',   dot: 'bg-blue-400' },
    medium:   { label: 'Medium',   color: 'text-yellow-400', dot: 'bg-yellow-400' },
    high:     { label: 'High',     color: 'text-orange-400', dot: 'bg-orange-400' },
    critical: { label: 'Critical', color: 'text-red-400',    dot: 'bg-red-400' },
};

export const OpenIssues: React.FC = () => {
    const [search, setSearch] = useState('');
    const [categoryFilter, setCategoryFilter] = useState<Category>('all');
    const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
    const [sortBy, setSortBy] = useState<SortOption>('newest');
    const [showFilters, setShowFilters] = useState(false);
    const [issues, setIssues] = useState<IssueRow[]>([]);
    const [counts, setCounts] = useState<{ total: number; pending: number; inprogress: number; resolved: number; rejected: number } | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        let cancelled = false;
        async function loadCounts() {
            try {
                const res = await apiIssueCounts();
                if (!cancelled) setCounts(res);
            } catch {
                // ignore
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
            setError(null);
            try {
                const sort = sortBy === 'upvotes' ? 'upvoted' : sortBy === 'comments' ? 'commented' : 'newest';
                const res = await apiListIssues({
                    q: search,
                    category: categoryFilter,
                    status: statusFilter,
                    sort,
                    page: 1,
                    pageSize: 50,
                });
                if (!cancelled) setIssues(res.issues);
            } catch (e: any) {
                if (!cancelled) setError(e?.message || 'Failed to load issues');
            } finally {
                if (!cancelled) setLoading(false);
            }
        }
        loadIssues();
        return () => {
            cancelled = true;
        };
    }, [search, categoryFilter, statusFilter, sortBy]);

    const totalCounts = counts || { total: issues.length, pending: 0, inprogress: 0, resolved: 0, rejected: 0 };

    return (
        <div className="space-y-6 pb-12">
            {/* Header */}
            <header>
                <div className="flex items-center gap-3 mb-1">
                    <div className="w-9 h-9 rounded-xl bg-primary-light border border-primary-green/30 flex items-center justify-center">
                        <AlertTriangle size={17} className="text-primary-dark" />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Open Issues</h1>
                </div>
                <p className="text-text-muted text-sm ml-12">Browse and track all reported city issues.</p>
            </header>

            {/* Summary pills */}
            <div className="flex flex-wrap gap-3">
                {([
                    { label: 'Total', value: totalCounts.total, color: 'border-gray-200 text-gray-900 bg-gray-50' },
                    { label: 'Pending', value: totalCounts.pending, color: 'border-orange-200 text-orange-900 bg-orange-50' },
                    { label: 'In Progress', value: totalCounts.inprogress, color: 'border-blue-200 text-blue-900 bg-blue-50' },
                    { label: 'Resolved', value: totalCounts.resolved, color: 'border-green-200 text-primary-dark bg-primary-light' },
                ] as const).map(pill => (
                    <div key={pill.label} className={`px-4 py-1.5 rounded-full border text-sm font-medium flex items-center gap-2 ${pill.color}`}>
                        <span className="font-bold">{pill.value}</span>
                        <span className="text-xs opacity-70">{pill.label}</span>
                    </div>
                ))}
            </div>

            {/* Search + Filter bar */}
            <GlassCard elevated className="p-4">
                <div className="flex flex-col sm:flex-row gap-3">
                    {/* Search */}
                    <div className="relative flex-1">
                        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
                        <input
                            type="text"
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            placeholder="Search by title or location..."
                            className="w-full pl-9 pr-4 py-2.5 text-sm rounded-xl"
                        />
                    </div>

                    {/* Sort */}
                    <div className="relative">
                        <SlidersHorizontal size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
                        <select
                            value={sortBy}
                            onChange={e => setSortBy(e.target.value as SortOption)}
                            className="pl-9 pr-8 py-2.5 text-sm rounded-xl appearance-none cursor-pointer"
                        >
                            <option value="newest">Newest First</option>
                            <option value="upvotes">Most Upvoted</option>
                            <option value="comments">Most Discussed</option>
                        </select>
                        <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
                    </div>

                    {/* Filter toggle */}
                    <button
                        onClick={() => setShowFilters(v => !v)}
                        className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium transition-colors ${showFilters ? 'border-primary-green/40 bg-primary-light/50 text-primary-dark' : 'border-gray-200 text-text-secondary hover:bg-gray-100'}`}
                    >
                        <Filter size={15} />
                        Filters
                    </button>
                </div>

                {/* Expandable filters */}
                {showFilters && (
                    <div className="mt-4 pt-4 border-t border-gray-100 space-y-3 animate-in fade-in slide-in-from-top-2 duration-200">
                        {/* Status filter */}
                        <div>
                            <p className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">Status</p>
                            <div className="flex flex-wrap gap-2">
                                {(['all', 'pending', 'inprogress', 'resolved', 'rejected'] as StatusFilter[]).map(s => (
                                    <button
                                        key={s}
                                        onClick={() => setStatusFilter(s)}
                                        className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${statusFilter === s ? 'border-primary-green/40 bg-primary-light/50 text-primary-dark' : 'border-gray-200 text-text-muted hover:border-gray-300 hover:text-gray-900 hover:bg-gray-50'}`}
                                    >
                                        {s === 'all' ? 'All' : s === 'inprogress' ? 'In Progress' : s.charAt(0).toUpperCase() + s.slice(1)}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </GlassCard>

            {/* Category tabs */}
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
                {CATEGORY_TABS.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setCategoryFilter(tab.id)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all duration-200 flex-shrink-0 border
                            ${categoryFilter === tab.id
                                ? 'bg-primary-light border-primary-green/40 text-primary-dark shadow-[0_0_12px_rgba(34,197,94,0.1)]'
                                : 'bg-white border-gray-200 text-text-muted hover:border-gray-300 hover:text-gray-900 shadow-sm'
                            }`}
                    >
                        {tab.id !== 'all' && (
                            <span className={categoryFilter === tab.id ? 'text-primary-green' : 'text-text-muted'}>
                                {CATEGORY_META[tab.id]?.icon}
                            </span>
                        )}
                        {tab.label}
                        {tab.id === 'all' && (
                            <span className="text-xs px-1.5 py-0.5 rounded-md bg-gray-100 text-text-muted">{totalCounts.total}</span>
                        )}
                    </button>
                ))}
            </div>

            {/* Issues list */}
            {error ? (
                <div className="flex flex-col items-center justify-center py-24 text-text-muted">
                    <p className="text-lg font-medium text-gray-700">{error}</p>
                    <p className="text-sm mt-1">Try refreshing the page.</p>
                </div>
            ) : loading ? (
                <div className="flex flex-col items-center justify-center py-24 text-text-muted">
                    <p className="text-sm">Loading issues…</p>
                </div>
            ) : issues.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-24 text-text-muted">
                    <Search size={40} className="mb-4 opacity-30 text-gray-500" />
                    <p className="text-lg font-medium text-gray-700">No issues found</p>
                    <p className="text-sm mt-1">Try adjusting your search or filters.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                    {issues.map(issue => {
                        const cat = CATEGORY_META[issue.category];
                        const sev = SEVERITY_CONFIG[issue.severity];
                        return (
                            <GlassCard key={issue._id} hoverEffect className="p-5 flex flex-col gap-4">
                                {/* Header */}
                                <div className="flex items-start justify-between gap-3">
                                    <div className="flex items-center gap-3 min-w-0">
                                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${cat.bg} ${cat.color} border border-gray-200`}>
                                            {cat.icon}
                                        </div>
                                        <div className="min-w-0">
                                            <h3 className="font-semibold text-gray-900 text-sm leading-snug line-clamp-2">{issue.title}</h3>
                                            <div className="flex items-center gap-1.5 text-xs text-text-muted mt-0.5">
                                                <MapPin size={11} />
                                                <span className="truncate">{issue.addressLabel}</span>
                                                <span className="text-gray-300">·</span>
                                                <span className="flex-shrink-0">{timeAgo(issue.createdAt)}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <button className="text-text-muted hover:text-gray-900 p-1 rounded-full hover:bg-gray-100 transition-colors flex-shrink-0">
                                        <MoreHorizontal size={17} />
                                    </button>
                                </div>

                                <div className="h-px bg-gray-100" />

                                {/* Description */}
                                <p className="text-sm text-text-secondary line-clamp-2 leading-relaxed">
                                    {issue.description}
                                </p>

                                <div className="h-px bg-gray-100" />

                                {/* Footer */}
                                <div className="flex items-center justify-between gap-2">
                                    <div className="flex items-center gap-2">
                                        <StatusBadge status={issue.status} />
                                        <div className={`flex items-center gap-1.5 px-2 py-0.5 rounded-full border border-gray-200 bg-gray-50 text-xs ${sev.color}`}>
                                            <span className={`w-1.5 h-1.5 rounded-full ${sev.dot}`} />
                                            {sev.label}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className="flex items-center gap-1 text-xs text-text-muted">
                                            <ThumbsUp size={13} /> {issue.upvoteCount}
                                        </span>
                                        <span className="flex items-center gap-1 text-xs text-text-muted">
                                            <MessageCircle size={13} /> {issue.commentCount}
                                        </span>
                                        <button
                                            onClick={() => navigate(`/issues/${issue._id}`)}
                                            className="flex items-center gap-1.5 text-xs font-medium text-primary-green hover:text-accent-lime transition-colors ml-1"
                                        >
                                            View <ArrowRight size={13} />
                                        </button>
                                    </div>
                                </div>
                            </GlassCard>
                        );
                    })}
                </div>
            )}
        </div>
    );
};
