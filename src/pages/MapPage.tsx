import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
    Activity,
    AlertTriangle,
    CheckCircle2,
    ChevronDown,
    Construction,
    Crosshair,
    Droplets,
    HelpCircle,
    Layers3,
    Lightbulb,
    Minus,
    Plus,
    Trash2,
    Trees,
} from 'lucide-react';
import { MapContainer, Marker, Popup, ScaleControl, TileLayer, useMapEvents } from 'react-leaflet';
import * as L from 'leaflet';
import { useNavigate } from 'react-router-dom';
import { apiIssueCounts, apiMapIssues, MapMarker } from '../lib/api';
import { timeAgo } from '../lib/time';

type StatusKey = 'pending' | 'inprogress' | 'resolved' | 'rejected';

const categoryMeta = {
    road: { label: 'Roads & Traffic', icon: Construction, color: '#f97316', bg: '#fff1e8' },
    water: { label: 'Water & Plumbing', icon: Droplets, color: '#3b82f6', bg: '#eff6ff' },
    light: { label: 'Streetlights', icon: Lightbulb, color: '#f59e0b', bg: '#fff8e1' },
    waste: { label: 'Waste Management', icon: Trash2, color: '#ef4444', bg: '#fef2f2' },
    park: { label: 'Parks & Trees', icon: Trees, color: '#22c55e', bg: '#f0fdf4' },
    other: { label: 'Other', icon: HelpCircle, color: '#9ca3af', bg: '#f3f4f6' },
} as const;

const statusMeta: Record<StatusKey, { label: string; color: string }> = {
    pending: { label: 'Pending', color: '#f59e0b' },
    inprogress: { label: 'In Progress', color: '#3b82f6' },
    resolved: { label: 'Resolved', color: '#22c55e' },
    rejected: { label: 'Critical', color: '#ef4444' },
};

function createMarker(marker: MapMarker) {
    const color = statusMeta[marker.status].color;
    const isCritical = marker.status === 'rejected';
    const size = marker.status === 'rejected' ? 28 : 24;
    const inner =
        marker.category === 'road' ? '◆' :
        marker.category === 'water' ? '●' :
        marker.category === 'light' ? '✦' :
        marker.category === 'waste' ? '■' :
        marker.category === 'park' ? '✿' : '•';
    return L.divIcon({
        className: 'cr-map-marker',
        html: `
            <div style="position:relative; width:${size}px; height:${size + 8}px;">
                <span style="position:absolute; left:0; top:0; width:${size}px; height:${size}px; border-radius:999px 999px 999px 0; transform:rotate(-45deg); background:${color}; border:3px solid white; box-shadow:0 10px 22px rgba(0,0,0,0.18);"></span>
                <span style="position:absolute; left:50%; top:50%; transform:translate(-50%,-72%); color:white; font-size:11px; font-weight:700; z-index:2;">${inner}</span>
                ${isCritical ? `<span class="animate-critical-ring" style="position:absolute; inset:-2px 0 auto auto; width:${size}px; height:${size}px; border-radius:999px; border:2px solid rgba(239,68,68,0.55);"></span>` : ''}
            </div>
        `,
        iconSize: [size, size + 8],
        iconAnchor: [size / 2, size + 2],
    });
}

function ViewportEvents(props: { onChange: (bbox: string, center: { lat: number; lng: number }, zoom: number) => void }) {
    const map = useMapEvents({
        moveend: () => {
            const bounds = map.getBounds();
            const center = map.getCenter();
            props.onChange(`${bounds.getWest()},${bounds.getSouth()},${bounds.getEast()},${bounds.getNorth()}`, { lat: center.lat, lng: center.lng }, map.getZoom());
        },
        zoomend: () => {
            const bounds = map.getBounds();
            const center = map.getCenter();
            props.onChange(`${bounds.getWest()},${bounds.getSouth()},${bounds.getEast()},${bounds.getNorth()}`, { lat: center.lat, lng: center.lng }, map.getZoom());
        },
    });
    return null;
}

export const MapPage: React.FC = () => {
    const [categoryFilter, setCategoryFilter] = useState('all');
    const [statusFilter, setStatusFilter] = useState('all');
    const [dateRange, setDateRange] = useState('Last 30 days');
    const [center, setCenter] = useState({ lat: 28.6139, lng: 77.209 });
    const [zoom, setZoom] = useState(12);
    const [bbox, setBbox] = useState('');
    const [mapStyle, setMapStyle] = useState<'street' | 'satellite'>('street');
    const [severity, setSeverity] = useState<Record<string, boolean>>({
        low: true,
        medium: true,
        high: true,
        critical: true,
    });
    const [markers, setMarkers] = useState<MapMarker[]>([]);
    const [counts, setCounts] = useState<{ total: number; pending: number; inprogress: number; resolved: number; rejected: number } | null>(null);
    const mapRef = useRef<L.Map | null>(null);
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
        async function loadMarkers() {
            if (!bbox) return;
            try {
                const res = await apiMapIssues({
                    bbox,
                    category: categoryFilter === 'all' ? undefined : categoryFilter,
                    status: statusFilter === 'all' ? undefined : statusFilter,
                });
                if (!cancelled) setMarkers(res.markers);
            } catch {
                if (!cancelled) setMarkers([]);
            }
        }
        loadMarkers();
        return () => {
            cancelled = true;
        };
    }, [bbox, categoryFilter, statusFilter]);

    const stats = counts || { total: markers.length, pending: 0, inprogress: 0, resolved: 0, rejected: 0 };
    const recent = useMemo(() => [...markers].sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1)).slice(0, 5), [markers]);

    return (
        <div className="space-y-4">
            <section className="app-card overflow-hidden">
                <div className="grid gap-px bg-black/5 sm:grid-cols-2 xl:grid-cols-4">
                    {[
                        { label: 'Total', value: stats.total, icon: Activity, color: '#111827' },
                        { label: 'Pending', value: stats.pending, icon: AlertTriangle, color: '#d97706' },
                        { label: 'In Progress', value: stats.inprogress, icon: Layers3, color: '#2563eb' },
                        { label: 'Resolved', value: stats.resolved, icon: CheckCircle2, color: '#16a34a' },
                    ].map((item) => {
                        const Icon = item.icon;
                        return (
                            <div key={item.label} className="flex items-center gap-3 bg-white px-5 py-4">
                                <div className="icon-chip h-10 w-10 bg-[var(--color-green-pale)] text-[var(--color-green-primary)]">
                                    <Icon size={18} />
                                </div>
                                <div>
                                    <p className="text-lg font-bold" style={{ color: item.color }}>{item.value}</p>
                                    <p className="text-xs uppercase tracking-[0.18em] text-[var(--color-text-muted)]">{item.label}</p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </section>

            <section className="flex h-[calc(100vh-168px)] gap-4">
                <aside className="app-card hidden w-[320px] flex-shrink-0 overflow-hidden xl:flex xl:flex-col">
                    <div className="border-b border-black/5 p-5">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-lg font-bold">Filters</p>
                                <p className="text-sm text-[var(--color-text-muted)]">{markers.length} in view</p>
                            </div>
                            <span className="pill-badge bg-[var(--color-green-pale)] text-[var(--color-green-primary)]">Live</span>
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto p-5">
                        <div className="space-y-5">
                            <div>
                                <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-[var(--color-text-muted)]">Category</p>
                                <div className="relative">
                                    <select value={categoryFilter} onChange={(event) => setCategoryFilter(event.target.value)} className="w-full appearance-none px-4 py-3 pr-10 text-sm">
                                        <option value="all">All Categories</option>
                                        <option value="road">Roads & Traffic</option>
                                        <option value="water">Water & Plumbing</option>
                                        <option value="light">Streetlights</option>
                                        <option value="waste">Waste Management</option>
                                        <option value="park">Parks & Trees</option>
                                    </select>
                                    <ChevronDown size={16} className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]" />
                                </div>
                            </div>

                            <div>
                                <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-[var(--color-text-muted)]">Status</p>
                                <div className="relative">
                                    <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} className="w-full appearance-none px-4 py-3 pr-10 text-sm">
                                        <option value="all">All Statuses</option>
                                        <option value="pending">Pending</option>
                                        <option value="inprogress">In Progress</option>
                                        <option value="resolved">Resolved</option>
                                    </select>
                                    <ChevronDown size={16} className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]" />
                                </div>
                            </div>

                            <div>
                                <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-[var(--color-text-muted)]">Severity</p>
                                <div className="grid grid-cols-2 gap-2">
                                    {[
                                        { key: 'low', color: '#3b82f6' },
                                        { key: 'medium', color: '#f59e0b' },
                                        { key: 'high', color: '#ea580c' },
                                        { key: 'critical', color: '#ef4444' },
                                    ].map((item) => (
                                        <button
                                            key={item.key}
                                            onClick={() => setSeverity((prev) => ({ ...prev, [item.key]: !prev[item.key] }))}
                                            className={`rounded-2xl border px-3 py-3 text-sm font-semibold transition ${
                                                severity[item.key]
                                                    ? 'border-transparent text-white'
                                                    : 'border-black/10 bg-white text-[var(--color-text-secondary)]'
                                            }`}
                                            style={severity[item.key] ? { background: item.color } : undefined}
                                        >
                                            {item.key}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-[var(--color-text-muted)]">Date Range</p>
                                <div className="relative">
                                    <select value={dateRange} onChange={(event) => setDateRange(event.target.value)} className="w-full appearance-none px-4 py-3 pr-10 text-sm">
                                        <option>Today</option>
                                        <option>Last 7 days</option>
                                        <option>Last 30 days</option>
                                        <option>All time</option>
                                    </select>
                                    <ChevronDown size={16} className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]" />
                                </div>
                            </div>

                            <button className="primary-button w-full px-4 py-3 text-sm font-semibold">Apply Filters</button>
                        </div>

                        <div className="mt-8">
                            <p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-[var(--color-text-muted)]">Map Legend</p>
                            <div className="space-y-3 text-sm text-[var(--color-text-secondary)]">
                                {Object.entries(statusMeta).map(([key, item]) => (
                                    <div key={key} className="flex items-center gap-3">
                                        <span className={`h-3 w-3 rounded-full ${key === 'rejected' ? 'animate-critical-ring' : ''}`} style={{ background: item.color }} />
                                        <span>{item.label}</span>
                                    </div>
                                ))}
                            </div>
                            <p className="mt-3 text-xs text-[var(--color-text-muted)]">Pin icon = category, pin color = status.</p>
                        </div>

                        <div className="mt-8">
                            <div className="mb-3 flex items-center justify-between">
                                <p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--color-text-muted)]">Recent Issues</p>
                                <button className="text-xs font-semibold text-[var(--color-green-primary)]">View all</button>
                            </div>
                            <div className="space-y-2">
                                {recent.map((marker) => {
                                    const category = categoryMeta[marker.category];
                                    const Icon = category.icon;
                                    return (
                                        <button
                                            key={marker.id}
                                            onClick={() => {
                                                mapRef.current?.flyTo([marker.lat, marker.lng], 15);
                                            }}
                                            className="w-full rounded-2xl border border-black/5 px-3 py-3 text-left transition hover:border-[rgba(45,122,79,0.22)] hover:bg-[var(--color-green-pale)]"
                                        >
                                            <div className="flex items-start gap-3">
                                                <div className="icon-chip h-8 w-8 flex-shrink-0" style={{ background: category.bg, color: category.color }}>
                                                    <Icon size={15} />
                                                </div>
                                                <div className="min-w-0 flex-1">
                                                    <p className="truncate text-sm font-semibold">{marker.title}</p>
                                                    <div className="mt-1 flex flex-wrap items-center gap-2 text-[11px] text-[var(--color-text-muted)]">
                                                        <span>{statusMeta[marker.status].label}</span>
                                                        <span>•</span>
                                                        <span>{timeAgo(marker.createdAt)}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </aside>

                <div className="app-card relative min-w-0 flex-1 overflow-hidden">
                    <MapContainer
                        center={[center.lat, center.lng]}
                        zoom={zoom}
                        className="h-full w-full"
                        zoomControl={false}
                        ref={(instance) => {
                            if (instance) mapRef.current = instance;
                        }}
                        whenReady={() => {
                            const map = mapRef.current;
                            if (!map) return;
                            const bounds = map.getBounds();
                            const mapCenter = map.getCenter();
                            setBbox(`${bounds.getWest()},${bounds.getSouth()},${bounds.getEast()},${bounds.getNorth()}`);
                            setCenter({ lat: mapCenter.lat, lng: mapCenter.lng });
                            setZoom(map.getZoom());
                        }}
                    >
                        <TileLayer
                            attribution="&copy; OpenStreetMap contributors"
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        <ViewportEvents
                            onChange={(nextBbox, nextCenter, nextZoom) => {
                                setBbox(nextBbox);
                                setCenter(nextCenter);
                                setZoom(nextZoom);
                            }}
                        />
                        <ScaleControl position="bottomright" />
                        {markers.map((marker) => (
                            <Marker
                                key={marker.id}
                                position={[marker.lat, marker.lng]}
                                icon={createMarker(marker)}
                                eventHandlers={{ click: () => {} }}
                            >
                                <Popup>
                                    <div className="min-w-[220px] space-y-3">
                                        <p className="text-sm font-bold">{marker.title}</p>
                                        <div className="flex flex-wrap gap-2 text-xs">
                                            <span className="pill-badge bg-[var(--color-bg-card-alt)] text-[var(--color-text-secondary)]">{categoryMeta[marker.category].label}</span>
                                            <span className="pill-badge bg-[var(--color-green-pale)] text-[var(--color-green-primary)]">{statusMeta[marker.status].label}</span>
                                        </div>
                                        <p className="text-xs text-[var(--color-text-secondary)]">{marker.addressLabel}</p>
                                        <button onClick={() => navigate(`/issues/${marker.id}`)} className="text-sm font-semibold text-[var(--color-green-primary)]">
                                            View Details →
                                        </button>
                                    </div>
                                </Popup>
                            </Marker>
                        ))}
                    </MapContainer>

                    <div className="absolute left-4 top-4 z-[500] rounded-full border border-black/5 bg-white/95 px-4 py-2 text-xs font-medium text-[var(--color-text-secondary)] shadow-sm">
                        {center.lat.toFixed(4)}° N, {center.lng.toFixed(4)}° E
                    </div>

                    <div className="absolute right-4 top-4 z-[500] flex gap-2">
                        <button
                            onClick={() => setMapStyle('satellite')}
                            className={`rounded-full px-4 py-2 text-xs font-semibold shadow-sm ${mapStyle === 'satellite' ? 'bg-[var(--color-green-primary)] text-white' : 'bg-white text-[var(--color-text-secondary)]'}`}
                        >
                            Satellite
                        </button>
                        <button
                            onClick={() => setMapStyle('street')}
                            className={`rounded-full px-4 py-2 text-xs font-semibold shadow-sm ${mapStyle === 'street' ? 'bg-[var(--color-green-primary)] text-white' : 'bg-white text-[var(--color-text-secondary)]'}`}
                        >
                            Street
                        </button>
                    </div>

                    <div className="absolute left-4 top-20 z-[500] flex flex-col gap-2">
                        <button onClick={() => mapRef.current?.zoomIn()} className="rounded-xl bg-white p-3 shadow-sm"><Plus size={16} /></button>
                        <button onClick={() => mapRef.current?.zoomOut()} className="rounded-xl bg-white p-3 shadow-sm"><Minus size={16} /></button>
                        <button
                            onClick={() => {
                                if (!navigator.geolocation || !mapRef.current) return;
                                navigator.geolocation.getCurrentPosition((position) => {
                                    mapRef.current?.flyTo([position.coords.latitude, position.coords.longitude], 15);
                                });
                            }}
                            className="rounded-xl bg-white p-3 shadow-sm"
                        >
                            <Crosshair size={16} />
                        </button>
                    </div>
                </div>
            </section>
        </div>
    );
};
