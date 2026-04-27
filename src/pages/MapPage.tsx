import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
    MapPin,
    Filter,
    Layers,
    ZoomIn,
    ZoomOut,
    Crosshair,
    Construction,
    Droplets,
    Lightbulb,
    Trash2,
    Trees,
    HelpCircle,
    ChevronDown,
    Clock,
    ThumbsUp,
    ArrowRight,
    X,
    Activity,
    AlertTriangle,
    CheckCircle,
    Circle,
} from 'lucide-react';
import { MapContainer, Marker, TileLayer, useMapEvents } from 'react-leaflet';
import * as L from 'leaflet';
import { useNavigate } from 'react-router-dom';
import { apiIssueCounts, apiMapIssues, MapMarker } from '../lib/api';
import { timeAgo } from '../lib/time';

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

function markerIcon(status: StatusKey, isSelected: boolean) {
    const dotClass =
        status === 'pending'
            ? 'bg-status-pending'
            : status === 'inprogress'
              ? 'bg-status-progress'
              : status === 'resolved'
                ? 'bg-status-resolved'
                : 'bg-status-rejected';

    const ring = isSelected ? ' ring-2 ring-white/40' : '';

    return L.divIcon({
        className: 'cr-issue-marker',
        html: `<div class="w-4 h-4 rounded-full ${dotClass} border-2 border-[#080f0a] shadow-[0_0_10px_rgba(0,0,0,0.15)]${ring}"></div>`,
        iconSize: [16, 16],
        iconAnchor: [8, 8],
    });
}

function MapEvents(props: {
    onViewportChange: (bbox: string, center: { lat: number; lng: number }, zoom: number) => void;
}) {
    const map = useMapEvents({
        moveend: () => {
            const b = map.getBounds();
            const c = map.getCenter();
            const bbox = `${b.getWest()},${b.getSouth()},${b.getEast()},${b.getNorth()}`;
            props.onViewportChange(bbox, { lat: c.lat, lng: c.lng }, map.getZoom());
        },
        zoomend: () => {
            const b = map.getBounds();
            const c = map.getCenter();
            const bbox = `${b.getWest()},${b.getSouth()},${b.getEast()},${b.getNorth()}`;
            props.onViewportChange(bbox, { lat: c.lat, lng: c.lng }, map.getZoom());
        },
    });
    return null;
}

export const MapPage: React.FC = () => {
    const [selectedPin, setSelectedPin] = useState<MapMarker | null>(null);
    const [catFilter, setCatFilter] = useState('all');
    const [statusFilter, setStatusFilter] = useState('active');
    const [showLegend, setShowLegend] = useState(false);
    const [zoom, setZoom] = useState(12);
    const [center, setCenter] = useState<{ lat: number; lng: number }>({ lat: 28.6139, lng: 77.209 });
    const [bbox, setBbox] = useState<string>('');
    const [map, setMap] = useState<L.Map | null>(null);
    const mapRef = useRef<L.Map | null>(null);
    const [markers, setMarkers] = useState<MapMarker[]>([]);
    const [counts, setCounts] = useState<{ total: number; pending: number; inprogress: number; resolved: number; rejected: number } | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (!map || !selectedPin) return;
        map.panTo([selectedPin.lat, selectedPin.lng]);
    }, [map, selectedPin?.id]);

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
        async function loadMarkers() {
            if (!bbox) return;
            try {
                const status = statusFilter === 'resolved' || statusFilter === 'rejected' ? statusFilter : undefined;
                const category = catFilter === 'all' ? undefined : catFilter;
                const res = await apiMapIssues({ bbox, status, category });
                let next = res.markers;
                if (statusFilter === 'active') {
                    next = next.filter(m => m.status === 'pending' || m.status === 'inprogress');
                }
                if (!cancelled) setMarkers(next);
            } catch {
                if (!cancelled) setMarkers([]);
            }
        }
        loadMarkers();
        return () => {
            cancelled = true;
        };
    }, [bbox, catFilter, statusFilter]);

    const stats = useMemo(() => {
        const safe = counts || { total: 0, pending: 0, inprogress: 0, resolved: 0, rejected: 0 };
        return [
            { label: 'Total', value: safe.total, icon: <Activity size={14} />, color: 'text-gray-900' },
            { label: 'Pending', value: safe.pending, icon: <Circle size={14} />, color: 'text-orange-900' },
            { label: 'In Progress', value: safe.inprogress, icon: <AlertTriangle size={14} />, color: 'text-blue-900' },
            { label: 'Resolved', value: safe.resolved, icon: <CheckCircle size={14} />, color: 'text-primary-dark' },
        ];
    }, [counts]);

    const recent = useMemo(() => {
        return [...markers].sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1)).slice(0, 12);
    }, [markers]);

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
                        <div key={s.label} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gray-50 border border-gray-200 text-xs font-medium ${s.color}`}>
                            {s.icon}
                            <span className="font-bold">{s.value}</span>
                            <span className="text-gray-500 text-[11px]">{s.label}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Main content: sidebar + map */}
            <div className="flex flex-1 gap-4 min-h-0">

                {/* ── Left Sidebar ── */}
                <div className="w-72 flex-shrink-0 flex flex-col gap-3 overflow-y-auto">

                    {/* Filter panel */}
                    <div className="rounded-2xl border border-gray-200 bg-white shadow-sm p-4 space-y-4">
                        <div className="flex items-center justify-between">
                            <span className="flex items-center gap-2 text-sm font-semibold text-gray-900">
                                <Filter size={15} className="text-primary-green" /> Filters
                            </span>
                            <span className="text-xs font-mono text-primary-dark bg-primary-light px-2 py-0.5 rounded-full border border-primary-green/20">{markers.length} in view</span>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-[11px] font-semibold text-text-muted uppercase tracking-widest">Category</label>
                            <div className="relative">
                                <select
                                    value={catFilter}
                                    onChange={e => setCatFilter(e.target.value)}
                                    className="w-full text-sm py-2.5 pl-3 pr-8 rounded-xl appearance-none cursor-pointer bg-gray-50 border border-gray-200 text-gray-900 focus:outline-none focus:border-primary-green focus:ring-1 focus:ring-primary-green"
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
                                    className="w-full text-sm py-2.5 pl-3 pr-8 rounded-xl appearance-none cursor-pointer bg-gray-50 border border-gray-200 text-gray-900 focus:outline-none focus:border-primary-green focus:ring-1 focus:ring-primary-green"
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
                            className="w-full flex items-center justify-between text-xs text-text-muted hover:text-gray-900 transition-colors pt-1"
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
                    <div className="rounded-2xl border border-gray-200 bg-white shadow-sm p-4 flex-1 min-h-0 overflow-y-auto">
                        <p className="text-xs font-semibold text-text-muted uppercase tracking-widest mb-3">Recent Issues</p>
                        <div className="space-y-2">
                            {recent.map(pin => {
                                const cat = CAT_CFG[pin.category];
                                const st = STATUS_CFG[pin.status];
                                const isSelected = selectedPin?.id === pin.id;
                                return (
                                    <button
                                        key={pin.id}
                                        onClick={() => setSelectedPin(isSelected ? null : pin)}
                                        className={`w-full text-left p-3 rounded-xl border transition-all duration-200 group
                                            ${isSelected
                                                ? 'border-primary-green/40 bg-primary-light/50'
                                                : 'border-gray-100 hover:border-gray-300 hover:bg-gray-50'
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
                                                        <Clock size={10} /> {timeAgo(pin.createdAt)}
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
                <div className="flex-1 relative rounded-2xl overflow-hidden border border-gray-200 shadow-sm min-h-0">
                    <div className="absolute inset-0">
                        <MapContainer
                            center={[center.lat, center.lng]}
                            zoom={zoom}
                            className="w-full h-full"
                            ref={mapRef}
                            whenReady={() => {
                                const m = mapRef.current;
                                if (!m) return;
                                setMap(m);
                                const b = m.getBounds();
                                const c = m.getCenter();
                                const nextBbox = `${b.getWest()},${b.getSouth()},${b.getEast()},${b.getNorth()}`;
                                setBbox(nextBbox);
                                setCenter({ lat: c.lat, lng: c.lng });
                                setZoom(m.getZoom());
                            }}
                        >
                            <TileLayer
                                attribution='&copy; OpenStreetMap contributors'
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            />
                            <MapEvents
                                onViewportChange={(nextBbox, nextCenter, nextZoom) => {
                                    setBbox(nextBbox);
                                    setCenter(nextCenter);
                                    setZoom(nextZoom);
                                }}
                            />
                            {markers.map((m) => (
                                <Marker
                                    key={m.id}
                                    position={[m.lat, m.lng]}
                                    icon={markerIcon(m.status, selectedPin?.id === m.id)}
                                    eventHandlers={{
                                        click: () => setSelectedPin((cur) => (cur?.id === m.id ? null : m)),
                                    }}
                                />
                            ))}
                        </MapContainer>
                    </div>

                    {/* Selected pin detail card */}
                    {selectedPin && (
                        <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-20 w-80 animate-in fade-in slide-in-from-bottom-3 duration-200">
                            <div className="rounded-2xl border border-gray-200 bg-white/95 backdrop-blur-xl shadow-xl p-4">
                                <div className="flex items-start justify-between gap-2 mb-3">
                                    <div className="flex items-center gap-2.5">
                                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${CAT_CFG[selectedPin.category].bg} ${CAT_CFG[selectedPin.category].color} border border-gray-200`}>
                                            {CAT_CFG[selectedPin.category].icon}
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold text-gray-900 leading-snug">{selectedPin.title}</p>
                                            <div className="flex items-center gap-1 text-[11px] text-text-muted mt-0.5">
                                                <MapPin size={10} /> {selectedPin.addressLabel}
                                            </div>
                                        </div>
                                    </div>
                                    <button onClick={() => setSelectedPin(null)} className="text-text-muted hover:text-white transition-colors flex-shrink-0">
                                        <X size={16} />
                                    </button>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <span className={`flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium border bg-gray-50 ${STATUS_CFG[selectedPin.status].color} border-gray-200`}>
                                            <span className={`w-1.5 h-1.5 rounded-full ${STATUS_CFG[selectedPin.status].dot}`} />
                                            {STATUS_CFG[selectedPin.status].label}
                                        </span>
                                        <span className="flex items-center gap-1 text-xs text-text-muted">
                                            <ThumbsUp size={11} /> {selectedPin.upvotes}
                                        </span>
                                        <span className="flex items-center gap-1 text-xs text-text-muted">
                                            <Clock size={11} /> {timeAgo(selectedPin.createdAt)}
                                        </span>
                                    </div>
                                    <button
                                        onClick={() => navigate(`/issues/${selectedPin.id}`)}
                                        className="text-xs font-medium text-primary-green hover:text-accent-lime flex items-center gap-1 transition-colors"
                                    >
                                        View <ArrowRight size={12} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Zoom controls */}
                    <div className="absolute top-4 right-4 z-10 flex flex-col gap-1.5">
                        {[
                            { icon: <ZoomIn size={17} />, action: () => map?.zoomIn() },
                            { icon: <ZoomOut size={17} />, action: () => map?.zoomOut() },
                            {
                                icon: <Crosshair size={17} />,
                                action: async () => {
                                    if (!map || !navigator.geolocation) return;
                                    navigator.geolocation.getCurrentPosition(
                                        (pos) => {
                                            map.setView([pos.coords.latitude, pos.coords.longitude], Math.max(map.getZoom(), 14));
                                        },
                                        () => {}
                                    );
                                },
                            },
                        ].map((btn, i) => (
                            <button
                                key={i}
                                onClick={btn.action}
                                className="w-9 h-9 rounded-xl bg-white/90 backdrop-blur border border-gray-200 flex items-center justify-center text-text-secondary hover:text-gray-900 hover:border-gray-300 hover:bg-gray-100 transition-all shadow-sm"
                            >
                                {btn.icon}
                            </button>
                        ))}
                    </div>

                    {/* Zoom level badge */}
                    <div className="absolute bottom-4 right-4 z-10 px-2.5 py-1 rounded-lg bg-white/90 backdrop-blur shadow-sm border border-gray-200 text-xs font-mono text-text-secondary">
                        z{zoom}
                    </div>

                    {/* Top-left coordinate display */}
                    <div className="absolute top-4 left-4 z-10 px-3 py-1.5 rounded-xl bg-white/90 backdrop-blur shadow-sm border border-gray-200 text-[11px] font-mono text-text-secondary flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary-green animate-pulse" />
                        {center.lat.toFixed(4)}° N, {center.lng.toFixed(4)}° E
                    </div>
                </div>
            </div>
        </div>
    );
};
