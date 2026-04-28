import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
    AlertTriangle,
    Camera,
    Check,
    ChevronLeft,
    ChevronRight,
    Construction,
    Droplets,
    FileText,
    Flag,
    HelpCircle,
    Lightbulb,
    MapPin,
    Trash2,
    Trees,
    Upload,
} from 'lucide-react';
import { MapContainer, Marker, TileLayer, useMap, useMapEvents } from 'react-leaflet';
import * as L from 'leaflet';
import { useNavigate } from 'react-router-dom';
import { apiCreateIssue, apiUploadImages } from '../lib/api';

const categories = [
    { id: 'road', icon: Construction, label: 'Roads & Traffic', desc: 'Potholes, cracks, signs', color: '#f97316', bg: '#fff1e8' },
    { id: 'water', icon: Droplets, label: 'Water & Plumbing', desc: 'Leaks, drainage', color: '#3b82f6', bg: '#eff6ff' },
    { id: 'light', icon: Lightbulb, label: 'Streetlights', desc: 'Outages, poles, wiring', color: '#f59e0b', bg: '#fff8e1' },
    { id: 'waste', icon: Trash2, label: 'Waste Management', desc: 'Illegal dumping, bins', color: '#ef4444', bg: '#fef2f2' },
    { id: 'park', icon: Trees, label: 'Parks & Trees', desc: 'Fallen trees, damage', color: '#22c55e', bg: '#f0fdf4' },
    { id: 'other', icon: HelpCircle, label: 'Other', desc: 'Anything else', color: '#9ca3af', bg: '#f3f4f6' },
];

const severityLevels = [
    { id: 'low', label: 'Low', desc: 'Minor inconvenience', color: '#3b82f6', tint: '#eff6ff' },
    { id: 'medium', label: 'Medium', desc: 'Needs attention soon', color: '#f59e0b', tint: '#fff8e1' },
    { id: 'high', label: 'High', desc: 'Urgent fix needed', color: '#ea580c', tint: '#fff7ed' },
    { id: 'critical', label: 'Critical', desc: 'Immediate danger', color: '#ef4444', tint: '#fef2f2' },
];

const steps = [
    { number: 1, label: 'Details', icon: FileText },
    { number: 2, label: 'Location', icon: MapPin },
    { number: 3, label: 'Photos', icon: Camera },
    { number: 4, label: 'Review', icon: Check },
];

function PinEvents(props: { onSelect: (lat: number, lng: number) => void }) {
    useMapEvents({
        click: (event) => props.onSelect(event.latlng.lat, event.latlng.lng),
    });
    return null;
}

function Recenter({ pin }: { pin: { lat: number; lng: number } | null }) {
    const map = useMap();
    useEffect(() => {
        if (pin) map.setView([pin.lat, pin.lng], Math.max(map.getZoom(), 15));
    }, [map, pin]);
    return null;
}

const pinIcon = L.divIcon({
    className: 'cr-report-marker',
    html: '<div style="width:28px;height:28px;border-radius:999px;background:#2d7a4f;border:4px solid white;box-shadow:0 12px 24px rgba(45,122,79,0.35);"></div>',
    iconSize: [28, 28],
    iconAnchor: [14, 14],
});

export const ReportIssue: React.FC = () => {
    const [step, setStep] = useState(1);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [severity, setSeverity] = useState('medium');
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [addressLabel, setAddressLabel] = useState('');
    const [landmark, setLandmark] = useState('');
    const [pin, setPin] = useState<{ lat: number; lng: number } | null>(null);
    const [photos, setPhotos] = useState<File[]>([]);
    const [submitting, setSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);
    const [submittedId, setSubmittedId] = useState<string | null>(null);
    const fileRef = useRef<HTMLInputElement | null>(null);
    const navigate = useNavigate();

    const charCount = description.length;
    const totalSteps = 4;
    const selectedCategoryData = categories.find((item) => item.id === selectedCategory);
    const selectedSeverity = severityLevels.find((item) => item.id === severity);
    const effectiveAddress = addressLabel || (pin ? `${pin.lat.toFixed(4)}, ${pin.lng.toFixed(4)}` : '');
    const progressPercent = (step / totalSteps) * 100;
    const currentStepMeta = steps[step - 1];
    const quickStats = [
        { label: 'Review SLA', value: '24 hrs', tone: 'text-[var(--color-green-primary)]' },
        { label: 'Reward', value: '50 pts', tone: 'text-[#c97a11]' },
        { label: 'Photos', value: `${photos.length}/5`, tone: 'text-[#3b82f6]' },
    ];

    useEffect(() => {
        return () => {
            photos.forEach((file) => URL.revokeObjectURL((file as File & { preview?: string }).preview || ''));
        };
    }, [photos]);

    const previews = useMemo(() => photos.map((file) => ({ file, url: URL.createObjectURL(file) })), [photos]);

    const canContinue = useMemo(() => {
        if (step === 1) return title.trim().length > 0 && selectedCategory.length > 0;
        if (step === 2) return !!pin;
        if (step === 3) return true;
        return !!pin && title.trim().length > 0 && selectedCategory.length > 0;
    }, [step, title, selectedCategory, pin]);

    const resetForm = () => {
        setStep(1);
        setSelectedCategory('');
        setSeverity('medium');
        setTitle('');
        setDescription('');
        setAddressLabel('');
        setLandmark('');
        setPin(null);
        setPhotos([]);
        setSubmitError(null);
        setSubmittedId(null);
    };

    const handleFiles = (list: FileList | null) => {
        if (!list) return;
        const next = [...photos];
        for (const file of Array.from(list)) {
            if (next.length >= 5) break;
            next.push(file);
        }
        setPhotos(next.slice(0, 5));
    };

    const removePhoto = (index: number) => {
        setPhotos((prev) => prev.filter((_, current) => current !== index));
    };

    const handleSubmit = async () => {
        setSubmitting(true);
        setSubmitError(null);
        try {
            if (!pin) throw new Error('Please add a location pin.');
            const upload = photos.length > 0 ? await apiUploadImages(photos) : { urls: [] };
            const res = await apiCreateIssue({
                title: title.trim(),
                description: description.trim(),
                category: selectedCategory as any,
                severity: severity as any,
                addressLabel: effectiveAddress || 'Pinned location',
                lat: pin.lat,
                lng: pin.lng,
                photoUrls: upload.urls,
            });
            setSubmittedId(res.issue._id);
        } catch (error: any) {
            setSubmitError(error?.message || 'Failed to submit');
        } finally {
            setSubmitting(false);
        }
    };

    if (submittedId) {
        return (
            <div className="mx-auto max-w-3xl">
                <div className="app-card overflow-hidden p-0 text-center">
                    <div className="bg-gradient-to-br from-[#0f2318] via-[#18412b] to-[#236a40] px-10 py-12 text-white">
                        <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-white/10 text-white shadow-[0_20px_45px_rgba(10,26,18,0.28)] backdrop-blur">
                            <Check size={40} />
                        </div>
                        <h1 className="mt-6 text-3xl font-extrabold text-white">Report Submitted</h1>
                        <p className="mt-3 text-sm text-white/75">
                            Your report is now in the queue and will be reviewed within 24 hours.
                        </p>
                    </div>
                    <div className="px-10 py-8">
                        <div className="mx-auto inline-flex rounded-full bg-[var(--color-green-pale)] px-4 py-2 text-sm font-semibold text-[var(--color-green-primary)]">
                            Report ID: {submittedId}
                        </div>
                        <div className="mt-8 grid gap-3 text-left sm:grid-cols-3">
                            {[
                                { label: 'Status', value: 'Under Review' },
                                { label: 'Estimated Response', value: 'Within 24 hrs' },
                                { label: 'Reward Pending', value: '50 civic points' },
                            ].map((item) => (
                                <div key={item.label} className="rounded-2xl border border-black/5 bg-[var(--color-bg-card-alt)] p-4">
                                    <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[var(--color-text-muted)]">{item.label}</p>
                                    <p className="mt-2 text-sm font-semibold">{item.value}</p>
                                </div>
                            ))}
                        </div>
                        <div className="mt-8 flex flex-wrap justify-center gap-3">
                            <button onClick={resetForm} className="secondary-button px-5 py-3 text-sm font-semibold">Report Another</button>
                            <button onClick={() => navigate('/dashboard')} className="primary-button px-5 py-3 text-sm font-semibold">View Dashboard</button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="relative mx-auto max-w-6xl space-y-6 pb-8">
            <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-72 rounded-[36px] bg-[radial-gradient(circle_at_top_left,rgba(76,175,125,0.22),transparent_42%),radial-gradient(circle_at_top_right,rgba(45,122,79,0.14),transparent_38%),linear-gradient(180deg,rgba(255,255,255,0.6),transparent)]" />

            <section className="app-card overflow-hidden p-0">
                <div className="grid gap-0 lg:grid-cols-[1.3fr_0.7fr]">
                    <div className="relative overflow-hidden px-6 py-7 md:px-8">
                        <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-[rgba(168,230,192,0.28)] blur-3xl" />
                        <div className="absolute bottom-0 left-10 h-24 w-24 rounded-full bg-[rgba(59,130,246,0.10)] blur-2xl" />
                        <div className="relative">
                            <div className="inline-flex items-center gap-3 rounded-full border border-[rgba(45,122,79,0.12)] bg-[var(--color-green-pale)]/80 px-3 py-2 text-xs font-semibold text-[var(--color-green-primary)]">
                                <span className="h-2.5 w-2.5 rounded-full bg-[var(--color-green-light)] animate-live-dot" />
                                Citizen Reporting
                            </div>
                            <div className="mt-5 flex items-start gap-4">
                                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[var(--color-green-primary)] to-[#49a16f] text-white shadow-[0_18px_40px_rgba(45,122,79,0.22)]">
                                    <Flag size={24} />
                                </div>
                                <div>
                                    <h1 className="text-3xl font-extrabold tracking-tight md:text-4xl">Report an Issue</h1>
                                    <p className="mt-3 max-w-2xl text-sm leading-6 text-[var(--color-text-secondary)] md:text-base">
                                        Turn a civic problem into action fast. Add the issue details, pin the location, attach photos, and send a clean report to the right team.
                                    </p>
                                </div>
                            </div>
                            <div className="mt-6 grid gap-3 sm:grid-cols-3">
                                {quickStats.map((item) => (
                                    <div key={item.label} className="rounded-2xl border border-black/5 bg-white/75 p-4 backdrop-blur-sm">
                                        <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[var(--color-text-muted)]">{item.label}</p>
                                        <p className={`mt-2 text-lg font-extrabold ${item.tone}`}>{item.value}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="border-t border-black/5 bg-[linear-gradient(180deg,#f8fcf8_0%,#eef7f0_100%)] px-6 py-7 lg:border-l lg:border-t-0">
                        <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[var(--color-green-primary)]">Ready To Submit</p>
                        <h2 className="mt-3 text-xl font-extrabold">Clean, structured reports get faster action.</h2>
                        <div className="mt-5 space-y-3">
                            {[
                                { label: 'Required details', done: title.trim().length > 0 && selectedCategory.length > 0 },
                                { label: 'Location pinned', done: !!pin },
                                { label: 'Evidence photos', done: photos.length > 0 },
                            ].map((item) => (
                                <div key={item.label} className="flex items-center justify-between rounded-2xl border border-black/5 bg-white px-4 py-3">
                                    <span className="text-sm font-medium">{item.label}</span>
                                    <span className={`inline-flex h-7 min-w-7 items-center justify-center rounded-full px-2 text-xs font-bold ${item.done ? 'bg-[var(--color-green-pale)] text-[var(--color-green-primary)]' : 'bg-[var(--color-bg-card-alt)] text-[var(--color-text-muted)]'}`}>
                                        {item.done ? 'Done' : 'Pending'}
                                    </span>
                                </div>
                            ))}
                        </div>
                        <div className="mt-5 rounded-2xl border border-[rgba(45,122,79,0.1)] bg-white/80 p-4">
                            <p className="text-sm font-semibold text-[var(--color-green-primary)]">Earn 50 points for each verified report</p>
                            <p className="mt-2 text-sm leading-6 text-[var(--color-text-secondary)]">
                                Clear titles, exact locations, and a couple of photos help the operations team verify your issue much faster.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="app-card overflow-hidden p-0">
                <div className="bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(244,249,246,0.92))] px-6 py-5 md:px-8">
                    <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                        <div>
                            <p className="section-kicker">Progress Flow</p>
                            <h2 className="mt-2 text-2xl font-extrabold">Complete your report in four guided steps</h2>
                            <p className="mt-2 text-sm text-[var(--color-text-secondary)]">You&apos;re on step {step}. We&apos;ll keep everything organized and review-ready.</p>
                        </div>
                        <div className="rounded-2xl border border-black/5 bg-white px-4 py-3 shadow-sm">
                            <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[var(--color-text-muted)]">Completion</p>
                            <p className="mt-1 text-lg font-extrabold text-[var(--color-green-primary)]">{Math.round(progressPercent)}%</p>
                        </div>
                    </div>
                    <div className="mt-5 h-3 overflow-hidden rounded-full bg-[#dbe7dd]">
                        <div className="h-full rounded-full bg-gradient-to-r from-[var(--color-green-primary)] via-[var(--color-green-light)] to-[#9bd3b3]" style={{ width: `${progressPercent}%` }} />
                    </div>
                    <div className="mt-6 grid gap-3 md:grid-cols-4">
                        {steps.map((item) => {
                            const Icon = item.icon;
                            const active = item.number === step;
                            const complete = item.number < step;
                            return (
                                <div
                                    key={item.number}
                                    className={`rounded-3xl border p-4 transition ${
                                        active
                                            ? 'border-[rgba(45,122,79,0.16)] bg-[linear-gradient(180deg,#ffffff_0%,#ecf7ef_100%)] shadow-[0_18px_40px_rgba(45,122,79,0.12)]'
                                            : complete
                                              ? 'border-[rgba(76,175,125,0.22)] bg-[var(--color-green-pale)]/85'
                                              : 'border-black/5 bg-white'
                                    }`}
                                >
                                    <div className="flex items-center justify-between">
                                        <div className={`flex h-11 w-11 items-center justify-center rounded-2xl ${
                                            complete
                                                ? 'bg-[var(--color-green-light)] text-white'
                                                : active
                                                  ? 'bg-[var(--color-green-primary)] text-white'
                                                  : 'bg-[var(--color-bg-card-alt)] text-[var(--color-text-muted)]'
                                        }`}>
                                            {complete ? <Check size={18} /> : <Icon size={18} />}
                                        </div>
                                        <span className="text-[11px] font-bold uppercase tracking-[0.16em] text-[var(--color-text-muted)]">Step {item.number}</span>
                                    </div>
                                    <p className="mt-4 text-base font-bold">{item.label}</p>
                                    <p className="mt-1 text-xs text-[var(--color-text-secondary)]">
                                        {complete ? 'Completed and ready' : active ? 'Currently in focus' : 'Coming next'}
                                    </p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            <section className="app-card overflow-hidden">
                <div className="border-b border-black/5 bg-[linear-gradient(180deg,#ffffff_0%,#f7fbf8_100%)] px-8 py-6">
                    <div className="flex items-center justify-between gap-4">
                        <div>
                            <p className="section-kicker">Step {step} of {totalSteps}</p>
                            <h2 className="mt-2 text-2xl font-bold">
                                {step === 1 && 'Issue Details'}
                                {step === 2 && 'Location'}
                                {step === 3 && 'Photos'}
                                {step === 4 && 'Review'}
                            </h2>
                            <p className="mt-2 text-sm text-[var(--color-text-secondary)]">
                                {step === 1 && 'Add a strong title, category, severity, and enough context for quick triage.'}
                                {step === 2 && 'Pin the issue precisely and add any address or landmark details.'}
                                {step === 3 && 'Photos give the city team visual proof and help speed up verification.'}
                                {step === 4 && 'Review everything before sending your report to the operations queue.'}
                            </p>
                        </div>
                        <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-[linear-gradient(180deg,#eef7f1_0%,#dff1e6_100%)] text-[var(--color-green-primary)] shadow-sm">
                            {React.createElement(currentStepMeta.icon, { size: 22 })}
                        </div>
                    </div>
                </div>

                <div className="p-8">
                    {step === 1 && (
                        <div className="space-y-7">
                            <div>
                                <label className="mb-2 block text-sm font-bold">Issue Title <span className="text-red-500">*</span></label>
                                <input
                                    value={title}
                                    onChange={(event) => setTitle(event.target.value)}
                                    placeholder="e.g., Deep pothole on Main Street near junction"
                                    className="w-full rounded-2xl border border-black/8 bg-white px-4 py-3.5 text-base shadow-[inset_0_1px_1px_rgba(17,24,39,0.02)]"
                                />
                                <p className="mt-2 text-xs text-[var(--color-text-muted)]">Be specific and include the street name, direction, or nearby point of reference.</p>
                            </div>

                            <div>
                                <label className="mb-3 block text-sm font-bold">Category</label>
                                <div className="grid gap-3 md:grid-cols-3">
                                    {categories.map((category) => {
                                        const Icon = category.icon;
                                        const active = selectedCategory === category.id;
                                        return (
                                            <button
                                                key={category.id}
                                                onClick={() => setSelectedCategory(category.id)}
                                                className={`relative overflow-hidden rounded-[22px] border px-4 py-5 text-left transition-all ${
                                                    active
                                                        ? 'border-[rgba(45,122,79,0.18)] bg-[linear-gradient(180deg,#ffffff_0%,#ebf7ef_100%)] shadow-[0_18px_40px_rgba(45,122,79,0.12)]'
                                                        : 'border-[#e5e7eb] bg-white hover:-translate-y-0.5 hover:border-[rgba(45,122,79,0.24)] hover:shadow-[0_16px_34px_rgba(15,35,24,0.08)]'
                                                }`}
                                            >
                                                <span className={`absolute inset-x-0 top-0 h-1 ${active ? 'bg-[var(--color-green-primary)]' : 'bg-transparent'}`} />
                                                {active && (
                                                    <span className="absolute right-3 top-3 flex h-6 w-6 items-center justify-center rounded-full bg-[var(--color-green-primary)] text-white shadow-sm">
                                                        <Check size={12} />
                                                    </span>
                                                )}
                                                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl shadow-sm" style={{ background: category.bg, color: category.color }}>
                                                    <Icon size={20} />
                                                </div>
                                                <p className="text-base font-bold">{category.label}</p>
                                                <p className="mt-1 text-xs leading-5 text-[var(--color-text-muted)]">{category.desc}</p>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            <div>
                                <label className="mb-3 block text-sm font-bold">Severity Level</label>
                                <div className="grid gap-3 md:grid-cols-4">
                                    {severityLevels.map((item) => (
                                        <button
                                            key={item.id}
                                            onClick={() => setSeverity(item.id)}
                                            className={`rounded-[22px] border px-4 py-4 text-center transition-all ${
                                                severity === item.id ? 'shadow-[0_16px_34px_rgba(15,35,24,0.08)]' : 'border-[#e5e7eb] bg-white hover:-translate-y-0.5'
                                            }`}
                                            style={severity === item.id ? { background: `linear-gradient(180deg, #ffffff 0%, ${item.tint} 100%)`, borderColor: item.color } : undefined}
                                        >
                                            <span className="mx-auto mb-3 block h-3 w-3 rounded-full shadow-sm" style={{ background: item.color }} />
                                            <p className="text-sm font-bold">{item.label}</p>
                                            <p className="mt-1 text-[11px] text-[var(--color-text-muted)]">{item.desc}</p>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-bold">Description</label>
                                <textarea
                                    rows={5}
                                    value={description}
                                    onChange={(event) => setDescription(event.target.value.slice(0, 500))}
                                    placeholder="Describe the issue in detail."
                                    className="w-full resize-none rounded-2xl border border-black/8 bg-white px-4 py-3.5"
                                />
                                <p className={`mt-2 text-right text-xs ${charCount >= 480 ? 'text-red-500' : charCount >= 400 ? 'text-amber-500' : 'text-[var(--color-text-muted)]'}`}>
                                    {charCount}/500
                                </p>
                            </div>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="grid gap-5 xl:grid-cols-[1.2fr_0.8fr]">
                            <div className="space-y-5">
                                <div className="h-[360px] overflow-hidden rounded-[24px] border border-black/10 shadow-[0_18px_40px_rgba(15,35,24,0.08)]">
                                    <MapContainer center={[pin?.lat || 28.6139, pin?.lng || 77.209]} zoom={13} className="h-full w-full">
                                        <TileLayer attribution="&copy; OpenStreetMap contributors" url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                                        <PinEvents
                                            onSelect={(lat, lng) => {
                                                setPin({ lat, lng });
                                                if (!addressLabel) setAddressLabel(`${lat.toFixed(4)}, ${lng.toFixed(4)}`);
                                            }}
                                        />
                                        <Recenter pin={pin} />
                                        {pin && <Marker position={[pin.lat, pin.lng]} icon={pinIcon} />}
                                    </MapContainer>
                                </div>

                                <div className="flex flex-wrap gap-3">
                                    <button
                                        onClick={() => {
                                            if (!navigator.geolocation) return;
                                            navigator.geolocation.getCurrentPosition((position) => {
                                                setPin({ lat: position.coords.latitude, lng: position.coords.longitude });
                                                setAddressLabel(`${position.coords.latitude.toFixed(4)}, ${position.coords.longitude.toFixed(4)}`);
                                            });
                                        }}
                                        className="secondary-button px-4 py-3 text-sm font-semibold"
                                    >
                                        Use My Location
                                    </button>
                                    <div className="rounded-full bg-[var(--color-green-pale)] px-4 py-3 text-sm font-semibold text-[var(--color-green-primary)]">
                                        Pin: {pin?.lat.toFixed(4) || '--'}, {pin?.lng.toFixed(4) || '--'}
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="rounded-[24px] border border-[rgba(45,122,79,0.12)] bg-[linear-gradient(180deg,#ffffff_0%,#f4faf6_100%)] p-5">
                                    <p className="section-kicker">Pinning Tips</p>
                                    <h3 className="mt-2 text-lg font-extrabold">Drop the marker exactly where the issue is.</h3>
                                    <div className="mt-4 space-y-3 text-sm leading-6 text-[var(--color-text-secondary)]">
                                        <p>Use the map click or your current location to give the maintenance team a precise spot.</p>
                                        <p>Landmarks help field staff identify the issue faster once they reach the area.</p>
                                    </div>
                                </div>

                                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-1">
                                    <div>
                                        <label className="mb-2 block text-sm font-bold">Address</label>
                                        <input value={addressLabel} onChange={(event) => setAddressLabel(event.target.value)} className="w-full rounded-2xl px-4 py-3.5" placeholder="Street or address" />
                                    </div>
                                    <div>
                                        <label className="mb-2 block text-sm font-bold">Nearest Landmark</label>
                                        <input value={landmark} onChange={(event) => setLandmark(event.target.value)} className="w-full rounded-2xl px-4 py-3.5" placeholder="Optional landmark" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {step === 3 && (
                        <div className="space-y-5">
                            <input
                                ref={fileRef}
                                type="file"
                                accept="image/*"
                                multiple
                                className="hidden"
                                onChange={(event) => {
                                    handleFiles(event.target.files);
                                    event.currentTarget.value = '';
                                }}
                            />
                            <button
                                onClick={() => fileRef.current?.click()}
                                className="relative flex h-[240px] w-full flex-col items-center justify-center overflow-hidden rounded-[26px] border-2 border-dashed border-[#cfdad1] bg-[linear-gradient(180deg,#ffffff_0%,#f4faf6_100%)] text-center transition hover:border-[var(--color-green-primary)] hover:bg-[var(--color-green-pale)]"
                            >
                                <div className="absolute left-1/2 top-6 h-24 w-24 -translate-x-1/2 rounded-full bg-[rgba(168,230,192,0.3)] blur-2xl" />
                                <div className="relative flex h-16 w-16 items-center justify-center rounded-3xl bg-white shadow-[0_18px_40px_rgba(45,122,79,0.12)]">
                                    <Camera size={34} className="text-[var(--color-green-primary)]" />
                                </div>
                                <p className="relative mt-5 text-lg font-extrabold">Drop photos here or click to upload</p>
                                <p className="relative mt-2 text-sm text-[var(--color-text-muted)]">Supports JPG, PNG, HEIC up to 10MB</p>
                                <div className="relative mt-5 inline-flex rounded-full border border-[rgba(45,122,79,0.18)] bg-white px-4 py-2 text-xs font-semibold text-[var(--color-green-primary)]">
                                    Up to 5 images
                                </div>
                            </button>

                            {previews.length > 0 && (
                                <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-5">
                                    {previews.map((preview, index) => (
                                        <div key={preview.url} className="relative h-28 overflow-hidden rounded-[22px] border border-black/10 bg-white shadow-sm">
                                            <img src={preview.url} alt={`Upload ${index + 1}`} className="h-full w-full object-cover" />
                                            <button
                                                onClick={() => removePhoto(index)}
                                                className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-black/60 text-white"
                                            >
                                                x
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}

                            <div className="rounded-[22px] border border-black/5 bg-[var(--color-bg-card-alt)] px-4 py-4 text-sm leading-6 text-[var(--color-text-secondary)]">
                                Max 5 photos. Clear, well-lit images from two angles make verification easier and reduce back-and-forth.
                            </div>
                        </div>
                    )}

                    {step === 4 && (
                        <div className="space-y-5">
                            <div className="rounded-[26px] border border-[rgba(45,122,79,0.12)] bg-[linear-gradient(180deg,#ffffff_0%,#eef7f1_100%)] p-5">
                                <div className="flex flex-wrap items-start justify-between gap-4">
                                    <div>
                                        <p className="text-lg font-bold">{title || 'Untitled issue'}</p>
                                        <p className="mt-2 text-sm text-[var(--color-text-secondary)]">{description || 'No description added yet.'}</p>
                                    </div>
                                    <div className="rounded-2xl bg-white px-4 py-3 text-right shadow-sm">
                                        <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[var(--color-text-muted)]">Reward Preview</p>
                                        <p className="mt-1 text-lg font-extrabold text-[var(--color-green-primary)]">+50 pts</p>
                                    </div>
                                </div>
                                <div className="mt-4 flex flex-wrap gap-2">
                                    <span className="pill-badge bg-white text-[var(--color-green-primary)]">{selectedCategoryData?.label || 'No category'}</span>
                                    <span className="pill-badge bg-white text-[var(--color-text-secondary)]">{selectedSeverity?.label || 'Medium'}</span>
                                </div>
                            </div>

                            <div className="grid gap-4 lg:grid-cols-[1.3fr_0.7fr]">
                                <div className="space-y-4">
                                    <div className="rounded-[24px] border border-black/5 p-4">
                                        <p className="text-sm font-bold">Location</p>
                                        <p className="mt-2 text-sm text-[var(--color-text-secondary)]">{effectiveAddress || 'No address provided'}</p>
                                        {landmark && <p className="mt-1 text-xs text-[var(--color-text-muted)]">Landmark: {landmark}</p>}
                                        <div className="mt-4 h-[140px] overflow-hidden rounded-[22px] border border-black/10">
                                            <MapContainer center={[pin?.lat || 28.6139, pin?.lng || 77.209]} zoom={15} className="h-full w-full" dragging={false} zoomControl={false} scrollWheelZoom={false} doubleClickZoom={false}>
                                                <TileLayer attribution="&copy; OpenStreetMap contributors" url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                                                {pin && <Marker position={[pin.lat, pin.lng]} icon={pinIcon} />}
                                            </MapContainer>
                                        </div>
                                    </div>

                                    <div className="rounded-[24px] border border-black/5 p-4">
                                        <p className="text-sm font-bold">Description</p>
                                        <p className="mt-2 text-sm leading-6 text-[var(--color-text-secondary)]">
                                            {description || 'No description added.'}
                                        </p>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div className="rounded-[24px] border border-black/5 p-4">
                                        <p className="text-sm font-bold">Photos</p>
                                        <div className="mt-3 grid grid-cols-3 gap-2">
                                            {previews.length > 0 ? previews.map((preview) => (
                                                <img key={preview.url} src={preview.url} alt="Preview" className="h-20 w-full rounded-2xl object-cover" />
                                            )) : <p className="col-span-3 text-sm text-[var(--color-text-muted)]">No photos attached</p>}
                                        </div>
                                    </div>
                                    <div className="rounded-[24px] border border-black/5 bg-[var(--color-bg-card-alt)] p-4">
                                        <p className="text-sm font-bold">Rewards Preview</p>
                                        <p className="mt-2 text-sm text-[var(--color-green-primary)]">You&apos;ll earn 50 pts for this report</p>
                                    </div>
                                    {submitError && (
                                        <div className="rounded-2xl border border-[#fecaca] bg-[#fef2f2] px-4 py-3 text-sm text-[#dc2626]">
                                            {submitError}
                                        </div>
                                    )}
                                    <div className="rounded-[24px] border border-[#fde68a] bg-[#fffbeb] px-4 py-3 text-sm text-[#92400e]">
                                        <span className="inline-flex items-center gap-2"><AlertTriangle size={15} /> Please confirm the report is accurate before submitting.</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <div className="flex items-center justify-between border-t border-black/5 bg-[linear-gradient(180deg,#ffffff_0%,#f9fbf9_100%)] px-8 py-5">
                    <button
                        onClick={() => setStep((current) => Math.max(1, current - 1))}
                        className={`inline-flex items-center gap-2 px-4 py-3 text-sm font-semibold ${step === 1 ? 'invisible' : 'secondary-button'}`}
                    >
                        <ChevronLeft size={16} />
                        Back
                    </button>

                    <button
                        onClick={() => {
                            if (step === totalSteps) {
                                void handleSubmit();
                            } else {
                                setStep((current) => Math.min(totalSteps, current + 1));
                            }
                        }}
                        disabled={!canContinue || submitting}
                        className={`inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold ${step === totalSteps ? 'primary-button' : 'secondary-button'} ${!canContinue || submitting ? 'cursor-not-allowed opacity-60' : ''}`}
                    >
                        {submitting ? 'Submitting...' : step === totalSteps ? 'Submit Report' : 'Continue'}
                        {step === totalSteps ? <Upload size={16} /> : <ChevronRight size={16} />}
                    </button>
                </div>
            </section>
        </div>
    );
};
