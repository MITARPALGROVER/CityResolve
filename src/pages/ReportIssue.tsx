import React, { useState } from 'react';
import { GlassCard } from '../components/ui/GlassCard';
import {
    MapPin, Image as ImageIcon, Camera, Check, ChevronRight, ChevronLeft,
    FileText, AlertTriangle, Upload, Flag,
    Construction, Droplets, Lightbulb, Trash2, Trees, HelpCircle
} from 'lucide-react';

const CATEGORIES = [
    { id: 'road', icon: <Construction size={22} />, label: 'Roads & Traffic', desc: 'Potholes, cracks, signs' },
    { id: 'water', icon: <Droplets size={22} />, label: 'Water & Plumbing', desc: 'Leaks, drainage' },
    { id: 'light', icon: <Lightbulb size={22} />, label: 'Streetlights', desc: 'Outages, flickering' },
    { id: 'waste', icon: <Trash2 size={22} />, label: 'Waste Management', desc: 'Illegal dumping, bins' },
    { id: 'park', icon: <Trees size={22} />, label: 'Parks & Trees', desc: 'Fallen trees, damage' },
    { id: 'other', icon: <HelpCircle size={22} />, label: 'Other', desc: 'Any other issue' },
];

const SEVERITY_LEVELS = [
    { id: 'low', label: 'Low', color: 'text-blue-400', border: 'border-blue-400/40', bg: 'bg-blue-400/10', activeBg: 'bg-blue-400/20', glow: 'shadow-[0_0_12px_rgba(96,165,250,0.3)]', dot: 'bg-blue-400', desc: 'Minor inconvenience' },
    { id: 'medium', label: 'Medium', color: 'text-yellow-400', border: 'border-yellow-400/40', bg: 'bg-yellow-400/10', activeBg: 'bg-yellow-400/20', glow: 'shadow-[0_0_12px_rgba(250,204,21,0.3)]', dot: 'bg-yellow-400', desc: 'Needs attention soon' },
    { id: 'high', label: 'High', color: 'text-orange-400', border: 'border-orange-400/40', bg: 'bg-orange-400/10', activeBg: 'bg-orange-400/20', glow: 'shadow-[0_0_12px_rgba(251,146,60,0.3)]', dot: 'bg-orange-400', desc: 'Urgent fix needed' },
    { id: 'critical', label: 'Critical', color: 'text-red-400', border: 'border-red-400/40', bg: 'bg-red-400/10', activeBg: 'bg-red-400/20', glow: 'shadow-[0_0_12px_rgba(248,113,113,0.3)]', dot: 'bg-red-400', desc: 'Immediate danger' },
];

const STEPS = [
    { num: 1, label: 'Details', icon: <FileText size={16} /> },
    { num: 2, label: 'Location', icon: <MapPin size={16} /> },
    { num: 3, label: 'Photos', icon: <Camera size={16} /> },
    { num: 4, label: 'Review', icon: <Check size={16} /> },
];

export const ReportIssue: React.FC = () => {
    const [step, setStep] = useState(1);
    const [selectedCat, setSelectedCat] = useState('');
    const [severity, setSeverity] = useState('');
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const totalSteps = 4;

    const selectedCatData = CATEGORIES.find(c => c.id === selectedCat);
    const selectedSeverityData = SEVERITY_LEVELS.find(s => s.id === severity);

    const handleSubmit = () => setSubmitted(true);

    if (submitted) {
        return (
            <div className="max-w-2xl mx-auto pb-10 flex items-center justify-center min-h-[60vh]">
                <GlassCard elevated className="p-12 text-center w-full">
                    <div className="relative w-24 h-24 mx-auto mb-6">
                        <div className="absolute inset-0 bg-primary-green/20 rounded-full animate-ping" />
                        <div className="relative w-24 h-24 rounded-full bg-primary-green/20 border-2 border-primary-green flex items-center justify-center shadow-[0_0_40px_rgba(34,197,94,0.4)]">
                            <Check size={44} className="text-primary-green" strokeWidth={2.5} />
                        </div>
                    </div>
                    <h2 className="text-3xl font-bold text-white mb-2">Report Submitted!</h2>
                    <p className="text-text-muted mb-6">Your issue has been logged. Our team will review it shortly and you'll be notified of updates.</p>
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-green/10 border border-primary-green/30 rounded-full text-primary-green text-sm font-mono mb-8">
                        <span className="w-2 h-2 bg-primary-green rounded-full animate-pulse" />
                        Report ID: #CR-{Math.floor(Math.random() * 90000) + 10000}
                    </div>
                    <div className="flex gap-3 justify-center">
                        <button
                            onClick={() => { setSubmitted(false); setStep(1); setTitle(''); setDescription(''); setSelectedCat(''); setSeverity(''); }}
                            className="px-6 py-2.5 rounded-xl border border-white/10 text-text-secondary hover:bg-white/5 transition-colors font-medium"
                        >
                            Report Another
                        </button>
                        <button className="px-6 py-2.5 rounded-xl bg-primary-green text-background font-semibold hover:bg-accent-lime transition-colors">
                            View Dashboard
                        </button>
                    </div>
                </GlassCard>
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto pb-12">
            {/* Header */}
            <header className="mb-10">
                <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-xl bg-primary-green/15 border border-primary-green/30 flex items-center justify-center">
                        <Flag size={18} className="text-primary-green" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-white tracking-tight">Report an Issue</h1>
                        <p className="text-text-muted text-sm">Help improve your city — reports are reviewed within 24 hours.</p>
                    </div>
                </div>
            </header>

            {/* Step Indicator */}
            <div className="mb-8">
                <div className="flex items-center">
                    {STEPS.map((s, i) => (
                        <React.Fragment key={s.num}>
                            <div className="flex flex-col items-center gap-1.5 flex-shrink-0">
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-semibold text-sm transition-all duration-300 border
                                    ${s.num < step
                                        ? 'bg-primary-green border-primary-green text-background'
                                        : s.num === step
                                        ? 'bg-primary-green/15 border-primary-green text-primary-green shadow-[0_0_16px_rgba(34,197,94,0.25)]'
                                        : 'bg-white/[0.04] border-white/10 text-white/30'
                                    }`}
                                >
                                    {s.num < step ? <Check size={16} strokeWidth={2.5} /> : s.icon}
                                </div>
                                <span className={`text-[11px] font-medium tracking-wide ${s.num <= step ? 'text-primary-green' : 'text-white/30'}`}>
                                    {s.label}
                                </span>
                            </div>
                            {i < STEPS.length - 1 && (
                                <div className="flex-1 mx-2 mb-4">
                                    <div className="h-px w-full bg-white/10 relative overflow-hidden rounded-full">
                                        <div
                                            className="absolute inset-y-0 left-0 bg-primary-green transition-all duration-500 rounded-full"
                                            style={{ width: step > s.num ? '100%' : '0%' }}
                                        />
                                    </div>
                                </div>
                            )}
                        </React.Fragment>
                    ))}
                </div>
            </div>

            {/* Card */}
            <GlassCard elevated className="overflow-hidden">
                {/* Step label bar */}
                <div className="px-8 py-4 border-b border-white/[0.06] flex items-center justify-between">
                    <div>
                        <p className="text-xs text-text-muted font-mono uppercase tracking-widest">Step {step} of {totalSteps}</p>
                        <h2 className="text-lg font-semibold text-white mt-0.5">
                            {step === 1 && 'Issue Details'}
                            {step === 2 && 'Pin Location'}
                            {step === 3 && 'Attach Photos'}
                            {step === 4 && 'Review & Submit'}
                        </h2>
                    </div>
                    <div className="w-9 h-9 rounded-lg bg-primary-green/10 border border-primary-green/20 flex items-center justify-center text-primary-green">
                        {STEPS[step - 1].icon}
                    </div>
                </div>

                <div className="p-8">
                    {/* ── Step 1: Details ── */}
                    {step === 1 && (
                        <div className="space-y-7 animate-in fade-in slide-in-from-right-4 duration-300">
                            {/* Title */}
                            <div className="space-y-2">
                                <label className="block text-sm font-semibold text-text-secondary">
                                    Issue Title <span className="text-red-400">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={title}
                                    onChange={e => setTitle(e.target.value)}
                                    placeholder="e.g., Deep pothole on Main Street near junction"
                                    className="w-full px-4 py-3 text-sm rounded-xl"
                                />
                                <p className="text-xs text-text-muted">Be specific — include street name and landmarks.</p>
                            </div>

                            {/* Category */}
                            <div className="space-y-2">
                                <label className="block text-sm font-semibold text-text-secondary">
                                    Category <span className="text-red-400">*</span>
                                </label>
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                    {CATEGORIES.map(cat => (
                                        <button
                                            key={cat.id}
                                            onClick={() => setSelectedCat(cat.id)}
                                            className={`relative p-4 rounded-xl border text-left flex flex-col gap-2 transition-all duration-200 group
                                                ${selectedCat === cat.id
                                                    ? 'border-primary-green bg-primary-green/10 shadow-[0_0_18px_rgba(34,197,94,0.15)]'
                                                    : 'border-white/8 bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.04]'
                                                }`}
                                        >
                                            {selectedCat === cat.id && (
                                                <span className="absolute top-2.5 right-2.5 w-4 h-4 bg-primary-green rounded-full flex items-center justify-center">
                                                    <Check size={10} strokeWidth={3} className="text-background" />
                                                </span>
                                            )}
                                            <span className={`${selectedCat === cat.id ? 'text-primary-green' : 'text-text-muted'} transition-colors`}>{cat.icon}</span>
                                            <div>
                                                <p className={`text-sm font-semibold ${selectedCat === cat.id ? 'text-white' : 'text-text-secondary'}`}>{cat.label}</p>
                                                <p className="text-xs text-text-muted mt-0.5">{cat.desc}</p>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Severity */}
                            <div className="space-y-2">
                                <label className="block text-sm font-semibold text-text-secondary">Severity Level</label>
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                                    {SEVERITY_LEVELS.map(sv => (
                                        <button
                                            key={sv.id}
                                            onClick={() => setSeverity(sv.id)}
                                            className={`px-3 py-3 rounded-xl border flex flex-col items-center gap-1.5 transition-all duration-200
                                                ${severity === sv.id
                                                    ? `${sv.border} ${sv.activeBg} ${sv.glow}`
                                                    : 'border-white/8 bg-white/[0.02] hover:border-white/20'
                                                }`}
                                        >
                                            <span className={`w-2.5 h-2.5 rounded-full ${sv.dot}`} />
                                            <span className={`text-xs font-semibold ${severity === sv.id ? sv.color : 'text-text-muted'}`}>{sv.label}</span>
                                            <span className="text-[10px] text-text-muted text-center leading-tight">{sv.desc}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Description */}
                            <div className="space-y-2">
                                <label className="block text-sm font-semibold text-text-secondary">Description</label>
                                <textarea
                                    rows={4}
                                    value={description}
                                    onChange={e => setDescription(e.target.value)}
                                    placeholder="Describe the issue in detail — when it started, how it affects you, any hazards..."
                                    className="w-full px-4 py-3 text-sm rounded-xl resize-none"
                                />
                                <p className="text-xs text-text-muted text-right">{description.length}/500</p>
                            </div>
                        </div>
                    )}

                    {/* ── Step 2: Location ── */}
                    {step === 2 && (
                        <div className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-300">
                            <div className="space-y-2">
                                <label className="block text-sm font-semibold text-text-secondary">Street Address</label>
                                <div className="relative">
                                    <MapPin size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" />
                                    <input
                                        type="text"
                                        placeholder="Search or enter address..."
                                        className="w-full pl-10 pr-4 py-3 text-sm rounded-xl"
                                    />
                                </div>
                            </div>

                            {/* Map placeholder */}
                            <div className="relative rounded-xl overflow-hidden border border-white/10 h-[340px] cursor-pointer group hover:border-primary-green/40 transition-colors">
                                <div className="absolute inset-0 bg-gradient-to-br from-[#0d2318] via-[#091a10] to-[#071510]" />
                                {/* Grid lines */}
                                <div className="absolute inset-0"
                                    style={{
                                        backgroundImage: 'linear-gradient(rgba(34,197,94,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(34,197,94,0.05) 1px, transparent 1px)',
                                        backgroundSize: '40px 40px'
                                    }}
                                />
                                {/* Roads */}
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="absolute w-full h-px bg-primary-green/10 top-1/3" />
                                    <div className="absolute w-full h-px bg-primary-green/10 top-2/3" />
                                    <div className="absolute h-full w-px bg-primary-green/10 left-1/3" />
                                    <div className="absolute h-full w-px bg-primary-green/10 left-2/3" />
                                </div>
                                {/* Center pin */}
                                <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                                    <div className="relative">
                                        <div className="absolute inset-0 bg-primary-green/30 rounded-full animate-ping scale-150" />
                                        <div className="relative w-14 h-14 bg-surface rounded-full border-2 border-primary-green flex items-center justify-center shadow-[0_0_24px_rgba(34,197,94,0.5)]">
                                            <MapPin size={22} className="text-primary-green" />
                                        </div>
                                    </div>
                                    <div className="px-4 py-2 bg-black/70 backdrop-blur-md rounded-full border border-white/10">
                                        <p className="text-sm font-medium text-white">Click map to drop pin</p>
                                    </div>
                                </div>
                                {/* Map controls */}
                                <div className="absolute top-3 right-3 flex flex-col gap-1">
                                    {['+', '−'].map(btn => (
                                        <button key={btn} className="w-8 h-8 bg-black/60 backdrop-blur border border-white/10 rounded-lg text-white/70 text-base font-bold hover:bg-white/10 transition-colors">
                                            {btn}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="flex items-start gap-2 p-3 bg-primary-green/5 border border-primary-green/15 rounded-xl">
                                <AlertTriangle size={14} className="text-primary-green mt-0.5 flex-shrink-0" />
                                <p className="text-xs text-text-muted">Your precise location helps our team reach the issue faster. You can drag the pin to adjust.</p>
                            </div>
                        </div>
                    )}

                    {/* ── Step 3: Photos ── */}
                    {step === 3 && (
                        <div className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-300">
                            <div className="border-2 border-dashed border-white/10 hover:border-primary-green/40 rounded-xl p-12 flex flex-col items-center text-center cursor-pointer transition-all duration-200 bg-white/[0.02] hover:bg-primary-green/[0.03] group">
                                <div className="w-16 h-16 rounded-2xl bg-white/5 group-hover:bg-primary-green/15 border border-white/10 group-hover:border-primary-green/30 flex items-center justify-center mb-4 transition-all">
                                    <Upload size={26} className="text-text-muted group-hover:text-primary-green transition-colors" />
                                </div>
                                <h3 className="text-base font-semibold text-white mb-1">Drop photos here</h3>
                                <p className="text-sm text-text-muted mb-5">PNG, JPG, HEIC up to 10MB each &mdash; max 3 photos</p>
                                <div className="flex items-center gap-3">
                                    <button className="flex items-center gap-2 px-5 py-2.5 bg-primary-green/15 hover:bg-primary-green/25 border border-primary-green/30 rounded-xl text-primary-green text-sm font-medium transition-colors">
                                        <ImageIcon size={16} /> Browse Files
                                    </button>
                                    <button className="flex items-center gap-2 px-5 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-text-secondary text-sm font-medium transition-colors">
                                        <Camera size={16} /> Use Camera
                                    </button>
                                </div>
                            </div>

                            {/* Photo slots */}
                            <div className="grid grid-cols-3 gap-3">
                                {[1, 2, 3].map(i => (
                                    <div key={i} className="aspect-square rounded-xl border-2 border-dashed border-white/8 bg-white/[0.02] flex flex-col items-center justify-center gap-2 text-text-muted hover:border-white/20 transition-colors cursor-pointer">
                                        <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
                                            <ImageIcon size={16} />
                                        </div>
                                        <span className="text-xs">Photo {i}</span>
                                    </div>
                                ))}
                            </div>

                            <div className="flex items-start gap-2 p-3 bg-white/[0.03] border border-white/8 rounded-xl">
                                <AlertTriangle size={14} className="text-text-muted mt-0.5 flex-shrink-0" />
                                <p className="text-xs text-text-muted">Photos are optional but greatly help our team assess the issue. Clear, well-lit photos speed up resolution.</p>
                            </div>
                        </div>
                    )}

                    {/* ── Step 4: Review ── */}
                    {step === 4 && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                            <div className="flex items-center gap-4 p-5 bg-primary-green/8 border border-primary-green/20 rounded-xl">
                                <div className="w-12 h-12 rounded-xl bg-primary-green/20 border border-primary-green/30 flex items-center justify-center flex-shrink-0">
                                    <Check size={22} className="text-primary-green" />
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-white">All set! Please review before submitting.</p>
                                    <p className="text-xs text-text-muted mt-0.5">Once submitted, you'll receive a tracking ID and email updates.</p>
                                </div>
                            </div>

                            <div className="rounded-xl border border-white/8 overflow-hidden">
                                {[
                                    { label: 'Issue Title', value: title || 'Deep pothole on Main Street', mono: false },
                                    { label: 'Category', value: selectedCatData ? selectedCatData.label : 'Roads & Traffic', mono: false },
                                    { label: 'Severity', value: selectedSeverityData?.label || 'Medium', mono: false },
                                    { label: 'Location', value: 'Main Street & 4th Ave, Zone B', mono: false },
                                    { label: 'Photos', value: '0 attached', mono: false },
                                    { label: 'Submitted by', value: 'You (anonymous)', mono: false },
                                ].map((row, i, arr) => (
                                    <div key={row.label} className={`flex items-center justify-between px-5 py-3.5 ${i < arr.length - 1 ? 'border-b border-white/[0.06]' : ''} ${i % 2 === 0 ? 'bg-white/[0.02]' : ''}`}>
                                        <span className="text-sm text-text-muted w-28 flex-shrink-0">{row.label}</span>
                                        <span className="text-sm font-medium text-white text-right">{row.value}</span>
                                    </div>
                                ))}
                            </div>

                            <div className="flex items-center gap-3 p-3.5 bg-yellow-400/5 border border-yellow-400/15 rounded-xl">
                                <AlertTriangle size={15} className="text-yellow-400 flex-shrink-0" />
                                <p className="text-xs text-text-muted">By submitting, you confirm this report is accurate. False reports may result in account restrictions.</p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Navigation */}
                <div className="px-8 py-5 border-t border-white/[0.06] flex items-center justify-between gap-4">
                    <button
                        onClick={() => setStep(s => Math.max(1, s - 1))}
                        className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-sm transition-all duration-200
                            ${step === 1
                                ? 'opacity-0 pointer-events-none'
                                : 'text-text-secondary hover:text-white border border-white/10 hover:bg-white/5'
                            }`}
                    >
                        <ChevronLeft size={16} /> Back
                    </button>

                    <div className="flex items-center gap-1.5">
                        {STEPS.map(s => (
                            <div key={s.num} className={`h-1.5 rounded-full transition-all duration-300 ${s.num === step ? 'w-6 bg-primary-green' : s.num < step ? 'w-3 bg-primary-green/50' : 'w-3 bg-white/10'}`} />
                        ))}
                    </div>

                    <button
                        onClick={step === totalSteps ? handleSubmit : () => setStep(s => Math.min(totalSteps, s + 1))}
                        className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-semibold text-sm transition-all duration-200
                            ${step === totalSteps
                                ? 'bg-primary-green text-background hover:bg-accent-lime shadow-[0_0_20px_rgba(34,197,94,0.35)] hover:shadow-[0_0_28px_rgba(34,197,94,0.5)]'
                                : 'bg-white/10 text-white hover:bg-white/15 border border-white/10'
                            }`}
                    >
                        {step === totalSteps ? 'Submit Report' : 'Continue'}
                        {step === totalSteps ? <Check size={16} strokeWidth={2.5} /> : <ChevronRight size={16} />}
                    </button>
                </div>
            </GlassCard>
        </div>
    );
};
