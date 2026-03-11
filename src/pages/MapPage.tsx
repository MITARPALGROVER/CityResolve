import React, { useState } from 'react';
import {
    MapPin, Filter, Layers, ZoomIn, ZoomOut, Crosshair,
    Construction, Droplets, Lightbulb, Trash2, Trees, HelpCircle,
    ChevronDown, Clock, ThumbsUp, ArrowRight, X, Activity,
    AlertTriangle, CheckCircle, Circle
} from 'lucide-react';

type StatusKey = 'pending' | 'inprogress' | 'resolved' | 'rejected';

const STATUS_CFG: Record<StatusKey, { label: string; color: string; dot: string; glow: string }> = {
    pending:    { label: 'Pending',     color: 'text-status-pending',  dot: 'bg-status-pending',  glow: 'shadow-[0_0_10px_#F59E0B]' },
    inprogress: { label: 'In Progress', color: 'text-status-progress', dot: 'bg-status-progress', glow: 'shadow-[0_0_10px_#3B82F6]' },
    resolved:   { label: 'Resolved',    color: 'text-status-resolved', dot: 'bg-status-resolved', glow: 'shadow-[0_0_10px_#22C55E]' },
    rejected:   { label: 'Rejected',    color: 'text-status-rejected', dot: 'bg-status-rejected', glow: 'shadow-[0_0_10px_#EF4444]' },
};

const CAT_CFG: Record<string, { icon: React.ReactNode; color: string; bg: string; label: string }> = {
    road:  { icon: <Construction size={14} />, color: 'text-orange-400', bg: 'bg-orange-500/20', label: 'Roads & Traffic' },
    water: { icon: <Droplets size={14} />,     color: 'text-blue-400',   bg: 'bg-blue-500/20',   label: 'Water & Plumbing' },
    light: { icon: <Lightbulb size={14} />,    color: 'text-yellow-400', bg: 'bg-yellow-500/20', label: 'Streetlights' },
    waste: { icon: <Trash2 size={14} />,       color: 'text-red-400',    bg: 'bg-red-500/20',    label: 'Waste Management' },
    park:  { icon: <Trees size={14} />,        color: 'text-primary-green', bg: 'bg-primary-green/20', label: 'Parks & Trees' },
    other: { icon: <HelpCircle size={14} />,   color: 'text-text-muted', bg: 'bg-white/10',      label: 'Other' },
};

interface Pin {
    id: string;
    title: string;
    category: string;
    location: string;
    status: StatusKey;
    upvotes: number;
    timeAgo: string;
    top: string;
    left: string;
    cluster?: number;
}

const PINS: Pin[] = [
    { id: '1', title: 'Large Pothole on MG Road', category: 'road', location: 'Sector 12, Zone B', status: 'pending', upvotes: 124, timeAgo: '2 hrs ago', top: '28%', left: '22%' },
    { id: '2', title: 'Streetlight out on Oakwood Ave', category: 'light', location: 'North District', status: 'inprogress', upvotes: 89, timeAgo: '5 hrs ago', top: '47%', left: '48%' },
    { id: '3', title: 'Water pipe burst', category: 'water', location: 'Downtown Square', status: 'resolved', upvotes: 450, timeAgo: '1 day ago', top: '62%', left: '31%' },
    { id: '4', title: 'Overflowing bins near market', category: 'waste', location: 'Central Market', status: 'pending', upvotes: 67, timeAgo: '3 hrs ago', top: '35%', left: '64%' },
    { id: '5', title: 'Fallen tree on Green Valley Rd', category: 'park', location: 'Green Valley', status: 'inprogress', upvotes: 55, timeAgo: '6 hrs ago', top: '72%', left: '57%' },
    { id: '6', title: '12 issues cluster', category: 'road', location: 'Highway 9', status: 'pending', upvotes: 0, timeAgo: '', top: '22%', left: '72%', cluster: 12 },
];

const RECENT = PINS.filter(p => !p.cluster).slice(0, 4);

export const MapPage: React.FC = () => {
    const [selectedPin, setSelectedPin] = useState<Pin | null>(null);
    const [catFilter, setCatFilter] = useState('all');
    const [statusFilter, setStatusFilter] = useState('active');
    const [showLegend, setShowLegend] = useState(false);
    const [zoom, setZoom] = useState(12);

    const stats = [
        { label: 'Total', value: 42, icon: <Activity size={14} />, color: 'text-white' },
        { label: 'Pending', value: 18, icon: <Circle size={14} />, color: 'text-status-pending' },
        { label: 'In Progress', value: 11, icon: <AlertTriangle size={14} />, color: 'text-status-progress' },
        { label: 'Resolved', value: 13, icon: <CheckCircle size={14} />, color: 'text-status-resolved' },
    ];

    return (
        <div className="flex flex-col h-[calc(100vh-100px)] gap-0 pb-2">
            {/* Top header bar */}
            <div className="flex items-center justify-between mb-4 flex-shrink-0">
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-primary-green/15 border border-primary-green/30 flex items-center justify-center">
                        <MapPin size={17} className="text-primary-green" />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-white tracking-tight">Issue Map</h1>
                        <p className="text-text-muted text-xs">Live city-wide issue overview</p>
                    </div>
                </div>
                {/* Stat pills */}
                <div className="hidden sm:flex items-center gap-2">
                    {stats.map(s => (
                        <div key={s.label} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.04] border border-white/8 text-xs font-medium ${s.color}`}>
                            {s.icon}
                            <span className="font-bold">{s.value}</span>
                            <span className="text-white/40 text-[11px]">{s.label}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Main content: sidebar + map */}
            <div className="flex flex-1 gap-4 min-h-0">

                {/* ── Left Sidebar ── */}
                <div className="w-72 flex-shrink-0 flex flex-col gap-3 overflow-y-auto">

                    {/* Filter panel */}
                    <div className="rounded-2xl border border-white/10 bg-white/[0.05] backdrop-blur-xl p-4 space-y-4">
                        <div className="flex items-center justify-between">
                            <span className="flex items-center gap-2 text-sm font-semibold text-white">
                                <Filter size={15} className="text-primary-green" /> Filters
                            </span>
                            <span className="text-xs font-mono text-primary-green bg-primary-green/10 px-2 py-0.5 rounded-full border border-primary-green/20">42 issues</span>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-[11px] font-semibold text-text-muted uppercase tracking-widest">Category</label>
                            <div className="relative">
                                <select
                                    value={catFilter}
                                    onChange={e => setCatFilter(e.target.value)}
                                    className="w-full text-sm py-2.5 pl-3 pr-8 rounded-xl appearance-none cursor-pointer"
                                >
                                    <option value="all">All Categories</option>
                                    <option value="road">Roads & Traffic</option>
                                    <option value="water">Water & Plumbing</option>
                                    <option value="light">Streetlights</option>
                                    <option value="waste">Waste Management</option>
                                    <option value="park">Parks & Trees</option>
                                </select>
                                <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-[11px] font-semibold text-text-muted uppercase tracking-widest">Status</label>
                            <div className="relative">
                                <select
                                    value={statusFilter}
                                    onChange={e => setStatusFilter(e.target.value)}
                                    className="w-full text-sm py-2.5 pl-3 pr-8 rounded-xl appearance-none cursor-pointer"
                                >
                                    <option value="active">Pending / In Progress</option>
                                    <option value="resolved">Resolved</option>
                                    <option value="all">All Statuses</option>
                                </select>
                                <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
                            </div>
                        </div>

                        {/* Legend toggle */}
                        <button
                            onClick={() => setShowLegend(v => !v)}
                            className="w-full flex items-center justify-between text-xs text-text-muted hover:text-white transition-colors pt-1"
                        >
                            <span className="flex items-center gap-1.5"><Layers size={13} /> Legend</span>
                            <ChevronDown size={13} className={`transition-transform ${showLegend ? 'rotate-180' : ''}`} />
                        </button>
                        {showLegend && (
                            <div className="space-y-2 animate-in fade-in slide-in-from-top-1 duration-150">
                                {(Object.entries(STATUS_CFG) as [StatusKey, typeof STATUS_CFG[StatusKey]][]).map(([key, cfg]) => (
                                    <div key={key} className="flex items-center gap-2 text-xs text-text-muted">
                                        <span className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${cfg.dot}`} />
                                        {cfg.label}
                                    </div>
                                ))}
                                <div className="flex items-center gap-2 text-xs text-text-muted pt-1 border-t border-white/5">
                                    <span className="w-6 h-5 rounded-full bg-status-progress flex items-center justify-center text-[9px] font-bold text-white">N</span>
                                    Cluster (multiple)
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Recent issues list */}
                    <div className="rounded-2xl border border-white/10 bg-white/[0.05] backdrop-blur-xl p-4 flex-1 min-h-0 overflow-y-auto">
                        <p className="text-xs font-semibold text-text-muted uppercase tracking-widest mb-3">Recent Issues</p>
                        <div className="space-y-2">
                            {RECENT.map(pin => {
                                const cat = CAT_CFG[pin.category];
                                const st = STATUS_CFG[pin.status];
                                const isSelected = selectedPin?.id === pin.id;
                                return (
                                    <button
                                        key={pin.id}
                                        onClick={() => setSelectedPin(isSelected ? null : pin)}
                                        className={`w-full text-left p-3 rounded-xl border transition-all duration-200 group
                                            ${isSelected
                                                ? 'border-primary-green/40 bg-primary-green/8'
                                                : 'border-white/[0.06] hover:border-white/15 hover:bg-white/[0.03]'
                                            }`}
                                    >
                                        <div className="flex items-start gap-2.5">
                                            <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 ${cat.bg} ${cat.color} border border-white/10`}>
                                                {cat.icon}
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <p className="text-xs font-semibold text-white line-clamp-1">{pin.title}</p>
                                                <div className="flex items-center gap-1.5 mt-1">
                                                    <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${st.dot}`} />
                                                    <span className={`text-[11px] ${st.color}`}>{st.label}</span>
                                                    <span className="text-white/20 text-[11px]">·</span>
                                                    <span className="text-[11px] text-text-muted flex items-center gap-0.5">
                                                        <Clock size={10} /> {pin.timeAgo}
                                                    </span>
                                                </div>
                                            </div>
                                            <ArrowRight size={13} className="text-text-muted group-hover:text-primary-green transition-colors flex-shrink-0 mt-1" />
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* ── Map area ── */}
                <div className="flex-1 relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl min-h-0">
                    {/* Map background */}
                    <div className="absolute inset-0 bg-[#080f0a]">
                        {/* Grid */}
                        <div className="absolute inset-0"
                            style={{
                                backgroundImage: 'linear-gradient(rgba(34,197,94,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(34,197,94,0.04) 1px, transparent 1px)',
                                backgroundSize: '48px 48px',
                            }}
                        />
                        {/* Minor grid */}
                        <div className="absolute inset-0"
                            style={{
                                backgroundImage: 'linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px)',
                                backgroundSize: '16px 16px',
                            }}
                        />
                        {/* Simulated roads */}
                        <svg className="absolute inset-0 w-full h-full opacity-20" xmlns="http://www.w3.org/2000/svg">
                            <path d="M 0 45% L 100% 45%" stroke="#22C55E" strokeWidth="2" fill="none" strokeDasharray="0" />
                            <path d="M 0 68% L 100% 68%" stroke="#22C55E" strokeWidth="1.5" fill="none" />
                            <path d="M 30% 0 L 30% 100%" stroke="#22C55E" strokeWidth="2" fill="none" />
                            <path d="M 58% 0 L 58% 100%" stroke="#22C55E" strokeWidth="1.5" fill="none" />
                            <path d="M 75% 0 L 75% 100%" stroke="#22C55E" strokeWidth="1" fill="none" />
                            <path d="M 0 25% L 50% 45%" stroke="#22C55E" strokeWidth="1" fill="none" />
                            <path d="M 58% 45% L 100% 30%" stroke="#22C55E" strokeWidth="1" fill="none" />
                            <path d="M 30% 68% L 75% 55%" stroke="#22C55E" strokeWidth="1" fill="none" />
                        </svg>
                        {/* Subtle area highlight */}
                        <div className="absolute rounded-full bg-primary-green/[0.04] blur-3xl w-96 h-64" style={{ top: '30%', left: '35%' }} />
                    </div>

                    {/* Pins */}
                    {PINS.map(pin => {
                        const st = STATUS_CFG[pin.status];
                        const isSelected = selectedPin?.id === pin.id;
                        return (
                            <button
                                key={pin.id}
                                onClick={() => setSelectedPin(isSelected ? null : pin)}
                                className="absolute z-10 -translate-x-1/2 -translate-y-1/2 group"
                                style={{ top: pin.top, left: pin.left }}
                            >
                                {pin.cluster ? (
                                    <div className={`w-9 h-9 rounded-full bg-status-progress border-2 border-background flex items-center justify-center text-xs font-bold text-white shadow-[0_0_16px_#3B82F6] transition-transform group-hover:scale-110`}>
                                        {pin.cluster}
                                    </div>
                                ) : (
                                    <div className="relative flex flex-col items-center">
                                        {/* Pulse ring */}
                                        {(pin.status === 'pending' || pin.status === 'inprogress') && (
                                            <div className={`absolute w-7 h-7 rounded-full ${st.dot} opacity-30 animate-ping`} />
                                        )}
                                        <div className={`w-5 h-5 rounded-full ${st.dot} border-2 border-[#080f0a] ${st.glow} transition-transform group-hover:scale-125 ${isSelected ? 'scale-125 ring-2 ring-white/30' : ''}`} />
                                        {/* Tooltip on hover */}
                                        <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 w-max max-w-[160px] bg-[#0d1a0f]/95 backdrop-blur border border-white/15 rounded-xl px-3 py-2 text-left opacity-0 group-hover:opacity-100 transition-opacity duration-150 pointer-events-none shadow-xl">
                                            <p className="text-xs font-semibold text-white line-clamp-2">{pin.title}</p>
                                            <p className={`text-[11px] mt-0.5 ${st.color}`}>{st.label}</p>
                                        </div>
                                    </div>
                                )}
                            </button>
                        );
                    })}

                    {/* Selected pin detail card */}
                    {selectedPin && !selectedPin.cluster && (
                        <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-20 w-80 animate-in fade-in slide-in-from-bottom-3 duration-200">
                            <div className="rounded-2xl border border-white/15 bg-[#0d1a0f]/95 backdrop-blur-xl shadow-2xl p-4">
                                <div className="flex items-start justify-between gap-2 mb-3">
                                    <div className="flex items-center gap-2.5">
                                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${CAT_CFG[selectedPin.category].bg} ${CAT_CFG[selectedPin.category].color} border border-white/10`}>
                                            {CAT_CFG[selectedPin.category].icon}
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold text-white leading-snug">{selectedPin.title}</p>
                                            <div className="flex items-center gap-1 text-[11px] text-text-muted mt-0.5">
                                                <MapPin size={10} /> {selectedPin.location}
                                            </div>
                                        </div>
                                    </div>
                                    <button onClick={() => setSelectedPin(null)} className="text-text-muted hover:text-white transition-colors flex-shrink-0">
                                        <X size={16} />
                                    </button>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <span className={`flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium border bg-white/[0.04] ${STATUS_CFG[selectedPin.status].color} border-white/10`}>
                                            <span className={`w-1.5 h-1.5 rounded-full ${STATUS_CFG[selectedPin.status].dot}`} />
                                            {STATUS_CFG[selectedPin.status].label}
                                        </span>
                                        <span className="flex items-center gap-1 text-xs text-text-muted">
                                            <ThumbsUp size={11} /> {selectedPin.upvotes}
                                        </span>
                                        <span className="flex items-center gap-1 text-xs text-text-muted">
                                            <Clock size={11} /> {selectedPin.timeAgo}
                                        </span>
                                    </div>
                                    <button className="text-xs font-medium text-primary-green hover:text-accent-lime flex items-center gap-1 transition-colors">
                                        View <ArrowRight size={12} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Zoom controls */}
                    <div className="absolute top-4 right-4 z-10 flex flex-col gap-1.5">
                        {[
                            { icon: <ZoomIn size={17} />, action: () => setZoom(z => Math.min(18, z + 1)) },
                            { icon: <ZoomOut size={17} />, action: () => setZoom(z => Math.max(1, z - 1)) },
                            { icon: <Crosshair size={17} />, action: () => {} },
                        ].map((btn, i) => (
                            <button
                                key={i}
                                onClick={btn.action}
                                className="w-9 h-9 rounded-xl bg-[#0d1a0f]/90 backdrop-blur border border-white/12 flex items-center justify-center text-text-muted hover:text-white hover:border-primary-green/40 hover:bg-primary-green/10 transition-all shadow-lg"
                            >
                                {btn.icon}
                            </button>
                        ))}
                    </div>

                    {/* Zoom level badge */}
                    <div className="absolute bottom-4 right-4 z-10 px-2.5 py-1 rounded-lg bg-[#0d1a0f]/80 backdrop-blur border border-white/10 text-xs font-mono text-text-muted">
                        z{zoom}
                    </div>

                    {/* Top-left coordinate display */}
                    <div className="absolute top-4 left-4 z-10 px-3 py-1.5 rounded-xl bg-[#0d1a0f]/80 backdrop-blur border border-white/10 text-[11px] font-mono text-text-muted flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary-green animate-pulse" />
                        28.6139° N, 77.2090° E
                    </div>
                </div>
            </div>
        </div>
    );
};
