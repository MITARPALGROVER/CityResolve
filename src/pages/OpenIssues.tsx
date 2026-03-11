import React, { useState } from 'react';
import { GlassCard } from '../components/ui/GlassCard';
import { StatusBadge, IssueStatus } from '../components/ui/StatusBadge';
import {
    Search, Filter, MapPin, ThumbsUp, MessageCircle, ArrowRight,
    MoreHorizontal, Construction, Droplets, Lightbulb, Trash2, Trees, HelpCircle,
    SlidersHorizontal, ChevronDown, AlertTriangle
} from 'lucide-react';

type Category = 'all' | 'road' | 'water' | 'light' | 'waste' | 'park' | 'other';
type StatusFilter = 'all' | IssueStatus;
type SortOption = 'newest' | 'upvotes' | 'comments';

const CATEGORY_META: Record<string, { icon: React.ReactNode; color: string; bg: string; label: string }> = {
    road:  { icon: <Construction size={18} />,  color: 'text-orange-400', bg: 'bg-orange-500/15', label: 'Roads & Traffic' },
    water: { icon: <Droplets size={18} />,      color: 'text-blue-400',   bg: 'bg-blue-500/15',   label: 'Water & Plumbing' },
    light: { icon: <Lightbulb size={18} />,     color: 'text-yellow-400', bg: 'bg-yellow-500/15', label: 'Streetlights' },
    waste: { icon: <Trash2 size={18} />,        color: 'text-red-400',    bg: 'bg-red-500/15',    label: 'Waste Management' },
    park:  { icon: <Trees size={18} />,         color: 'text-primary-green', bg: 'bg-primary-green/15', label: 'Parks & Trees' },
    other: { icon: <HelpCircle size={18} />,    color: 'text-text-muted', bg: 'bg-white/10',      label: 'Other' },
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

interface Issue {
    id: string;
    title: string;
    category: string;
    location: string;
    timeAgo: string;
    description: string;
    status: IssueStatus;
    upvotes: number;
    comments: number;
    severity: 'low' | 'medium' | 'high' | 'critical';
}

const ISSUES: Issue[] = [
    {
        id: '1',
        title: 'Large Pothole on MG Road near Junction',
        category: 'road',
        location: 'Sector 12, Zone B',
        timeAgo: '2 hrs ago',
        description: 'Large pothole causing damage to vehicles near the main intersection. Needs immediate filling before monsoon starts.',
        status: 'pending',
        upvotes: 124,
        comments: 32,
        severity: 'high',
    },
    {
        id: '2',
        title: 'Streetlight completely out on Oakwood Ave',
        category: 'light',
        location: 'Oakwood Avenue, North District',
        timeAgo: '5 hrs ago',
        description: 'Entire street is pitch black at night, causing safety concerns for pedestrians and drivers.',
        status: 'inprogress',
        upvotes: 89,
        comments: 14,
        severity: 'high',
    },
    {
        id: '3',
        title: 'Water pipe leaking uncontrollably',
        category: 'water',
        location: 'Downtown Square',
        timeAgo: '1 day ago',
        description: 'A major water main burst early this morning. Gallons of water are being wasted and road is flooded.',
        status: 'resolved',
        upvotes: 450,
        comments: 120,
        severity: 'critical',
    },
    {
        id: '4',
        title: 'Overflowing garbage bins near market',
        category: 'waste',
        location: 'Central Market, Zone A',
        timeAgo: '3 hrs ago',
        description: 'Garbage bins have not been collected for 4 days. Strong smell and sanitation concerns.',
        status: 'pending',
        upvotes: 67,
        comments: 9,
        severity: 'medium',
    },
    {
        id: '5',
        title: 'Fallen tree blocking footpath',
        category: 'park',
        location: 'Green Valley Road',
        timeAgo: '6 hrs ago',
        description: 'A large tree fell during last nights storm and is blocking the entire footpath and part of the road.',
        status: 'inprogress',
        upvotes: 55,
        comments: 7,
        severity: 'medium',
    },
    {
        id: '6',
        title: 'Road divider broken and dangerous',
        category: 'road',
        location: 'Highway 9, Near Toll',
        timeAgo: '2 days ago',
        description: 'The concrete road divider has crumbled and sharp debris is scattered across both lanes.',
        status: 'pending',
        upvotes: 210,
        comments: 45,
        severity: 'critical',
    },
    {
        id: '7',
        title: 'Storm drain clogged, flooding risk',
        category: 'water',
        location: 'Elm Street, East Zone',
        timeAgo: '12 hrs ago',
        description: 'Drain is completely clogged with debris. Any rain will cause street flooding.',
        status: 'pending',
        upvotes: 38,
        comments: 5,
        severity: 'high',
    },
    {
        id: '8',
        title: 'Flickering streetlights near school',
        category: 'light',
        location: 'School Road, Zone C',
        timeAgo: '3 days ago',
        description: 'Multiple streetlights are flickering intermittently near the school gate causing visibility issues.',
        status: 'resolved',
        upvotes: 44,
        comments: 6,
        severity: 'low',
    },
];

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

    const filtered = ISSUES
        .filter(issue => {
            const matchesSearch = issue.title.toLowerCase().includes(search.toLowerCase()) ||
                issue.location.toLowerCase().includes(search.toLowerCase());
            const matchesCategory = categoryFilter === 'all' || issue.category === categoryFilter;
            const matchesStatus = statusFilter === 'all' || issue.status === statusFilter;
            return matchesSearch && matchesCategory && matchesStatus;
        })
        .sort((a, b) => {
            if (sortBy === 'upvotes') return b.upvotes - a.upvotes;
            if (sortBy === 'comments') return b.comments - a.comments;
            return 0; // newest — already in order
        });

    const counts = {
        all: ISSUES.length,
        pending: ISSUES.filter(i => i.status === 'pending').length,
        inprogress: ISSUES.filter(i => i.status === 'inprogress').length,
        resolved: ISSUES.filter(i => i.status === 'resolved').length,
    };

    return (
        <div className="space-y-6 pb-12">
            {/* Header */}
            <header>
                <div className="flex items-center gap-3 mb-1">
                    <div className="w-9 h-9 rounded-xl bg-primary-green/15 border border-primary-green/30 flex items-center justify-center">
                        <AlertTriangle size={17} className="text-primary-green" />
                    </div>
                    <h1 className="text-2xl font-bold text-white tracking-tight">Open Issues</h1>
                </div>
                <p className="text-text-muted text-sm ml-12">Browse and track all reported city issues.</p>
            </header>

            {/* Summary pills */}
            <div className="flex flex-wrap gap-3">
                {([
                    { label: 'Total', value: counts.all, color: 'border-white/10 text-white' },
                    { label: 'Pending', value: counts.pending, color: 'border-status-pending/30 text-status-pending' },
                    { label: 'In Progress', value: counts.inprogress, color: 'border-status-progress/30 text-status-progress' },
                    { label: 'Resolved', value: counts.resolved, color: 'border-status-resolved/30 text-status-resolved' },
                ] as const).map(pill => (
                    <div key={pill.label} className={`px-4 py-1.5 rounded-full border bg-white/[0.03] text-sm font-medium flex items-center gap-2 ${pill.color}`}>
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
                        className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium transition-colors ${showFilters ? 'border-primary-green/40 bg-primary-green/10 text-primary-green' : 'border-white/10 text-text-secondary hover:bg-white/5'}`}
                    >
                        <Filter size={15} />
                        Filters
                    </button>
                </div>

                {/* Expandable filters */}
                {showFilters && (
                    <div className="mt-4 pt-4 border-t border-white/[0.06] space-y-3 animate-in fade-in slide-in-from-top-2 duration-200">
                        {/* Status filter */}
                        <div>
                            <p className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">Status</p>
                            <div className="flex flex-wrap gap-2">
                                {(['all', 'pending', 'inprogress', 'resolved', 'rejected'] as StatusFilter[]).map(s => (
                                    <button
                                        key={s}
                                        onClick={() => setStatusFilter(s)}
                                        className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${statusFilter === s ? 'border-primary-green/40 bg-primary-green/10 text-primary-green' : 'border-white/8 text-text-muted hover:border-white/20 hover:text-white'}`}
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
                                ? 'bg-primary-green/15 border-primary-green/40 text-primary-green shadow-[0_0_12px_rgba(34,197,94,0.15)]'
                                : 'bg-white/[0.03] border-white/8 text-text-muted hover:border-white/20 hover:text-white'
                            }`}
                    >
                        {tab.id !== 'all' && (
                            <span className={categoryFilter === tab.id ? 'text-primary-green' : 'text-text-muted'}>
                                {CATEGORY_META[tab.id]?.icon}
                            </span>
                        )}
                        {tab.label}
                        {tab.id === 'all' && (
                            <span className="text-xs px-1.5 py-0.5 rounded-md bg-white/10 text-text-muted">{counts.all}</span>
                        )}
                    </button>
                ))}
            </div>

            {/* Issues list */}
            {filtered.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-24 text-text-muted">
                    <Search size={40} className="mb-4 opacity-30" />
                    <p className="text-lg font-medium text-white/50">No issues found</p>
                    <p className="text-sm mt-1">Try adjusting your search or filters.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                    {filtered.map(issue => {
                        const cat = CATEGORY_META[issue.category];
                        const sev = SEVERITY_CONFIG[issue.severity];
                        return (
                            <GlassCard key={issue.id} hoverEffect className="p-5 flex flex-col gap-4">
                                {/* Header */}
                                <div className="flex items-start justify-between gap-3">
                                    <div className="flex items-center gap-3 min-w-0">
                                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${cat.bg} ${cat.color} border border-white/10`}>
                                            {cat.icon}
                                        </div>
                                        <div className="min-w-0">
                                            <h3 className="font-semibold text-white text-sm leading-snug line-clamp-2">{issue.title}</h3>
                                            <div className="flex items-center gap-1.5 text-xs text-text-muted mt-0.5">
                                                <MapPin size={11} />
                                                <span className="truncate">{issue.location}</span>
                                                <span className="text-white/20">·</span>
                                                <span className="flex-shrink-0">{issue.timeAgo}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <button className="text-text-muted hover:text-white p-1 rounded-full hover:bg-white/5 transition-colors flex-shrink-0">
                                        <MoreHorizontal size={17} />
                                    </button>
                                </div>

                                <div className="h-px bg-white/[0.05]" />

                                {/* Description */}
                                <p className="text-sm text-text-secondary line-clamp-2 leading-relaxed">
                                    {issue.description}
                                </p>

                                <div className="h-px bg-white/[0.05]" />

                                {/* Footer */}
                                <div className="flex items-center justify-between gap-2">
                                    <div className="flex items-center gap-2">
                                        <StatusBadge status={issue.status} />
                                        <div className={`flex items-center gap-1.5 px-2 py-0.5 rounded-full border border-white/8 bg-white/[0.02] text-xs ${sev.color}`}>
                                            <span className={`w-1.5 h-1.5 rounded-full ${sev.dot}`} />
                                            {sev.label}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className="flex items-center gap-1 text-xs text-text-muted">
                                            <ThumbsUp size={13} /> {issue.upvotes}
                                        </span>
                                        <span className="flex items-center gap-1 text-xs text-text-muted">
                                            <MessageCircle size={13} /> {issue.comments}
                                        </span>
                                        <button className="flex items-center gap-1.5 text-xs font-medium text-primary-green hover:text-accent-lime transition-colors ml-1">
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
