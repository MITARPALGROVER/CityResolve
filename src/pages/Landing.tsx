import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    ArrowRight, MapPin, CheckCircle, AlertTriangle, Users, Zap,
    Shield, BarChart3, Bell, Star, ChevronRight, Leaf,
    Construction, Droplets, Lightbulb, Trash2, Trees,
    TrendingUp, Clock, Award, Play, Menu, X
} from 'lucide-react';

/* ── Floating nav ── */
const LandingNav: React.FC<{ onEnter: () => void }> = ({ onEnter }) => {
    const [scrolled, setScrolled] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);

    useEffect(() => {
        const fn = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', fn);
        return () => window.removeEventListener('scroll', fn);
    }, []);

    return (
        <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled
            ? 'bg-background/85 backdrop-blur-xl border-b border-primary-green/15 shadow-[0_4px_40px_rgba(0,0,0,0.6)] py-3'
            : 'bg-transparent py-5'}`}>
            <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
                {/* Logo */}
                <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-primary-green to-accent-teal flex items-center justify-center">
                        <Leaf size={16} className="text-background" />
                    </div>
                    <span className="text-xl font-bold tracking-tight text-white">
                        City<span className="text-primary-green">Resolve</span>
                    </span>
                </div>

                {/* Desktop links */}
                <div className="hidden md:flex items-center gap-8 text-sm font-medium text-white/60">
                    {['Features', 'How It Works', 'Stats', 'Leaderboard'].map(link => (
                        <a key={link} href={`#${link.toLowerCase().replace(' ', '-')}`}
                            className="hover:text-white transition-colors">{link}</a>
                    ))}
                </div>

                {/* CTA */}
                <div className="hidden md:flex items-center gap-3">
                    <button onClick={onEnter} className="text-sm font-medium text-white/70 hover:text-white transition-colors px-4 py-2">
                        Sign In
                    </button>
                    <button onClick={onEnter}
                        className="flex items-center gap-2 px-5 py-2.5 bg-primary-green text-background rounded-xl text-sm font-semibold hover:bg-accent-lime transition-colors shadow-[0_0_20px_rgba(34,197,94,0.3)]">
                        Get Started <ArrowRight size={15} />
                    </button>
                </div>

                {/* Mobile burger */}
                <button className="md:hidden text-white/70 hover:text-white" onClick={() => setMobileOpen(v => !v)}>
                    {mobileOpen ? <X size={22} /> : <Menu size={22} />}
                </button>
            </div>

            {/* Mobile menu */}
            {mobileOpen && (
                <div className="md:hidden bg-background/95 backdrop-blur-xl border-t border-white/10 px-6 py-4 flex flex-col gap-3 animate-in fade-in slide-in-from-top-2 duration-200">
                    {['Features', 'How It Works', 'Stats', 'Leaderboard'].map(link => (
                        <a key={link} href={`#${link.toLowerCase().replace(' ', '-')}`}
                            className="text-sm text-white/70 hover:text-white py-1"
                            onClick={() => setMobileOpen(false)}>{link}</a>
                    ))}
                    <button onClick={onEnter} className="mt-2 w-full py-3 bg-primary-green text-background rounded-xl text-sm font-semibold">
                        Open Dashboard
                    </button>
                </div>
            )}
        </nav>
    );
};

/* ── Stat counter ── */
const CountStat: React.FC<{ value: string; label: string; icon: React.ReactNode; color: string }> = ({ value, label, icon, color }) => (
    <div className="text-center">
        <div className={`text-3xl md:text-4xl font-bold ${color} mb-1`}>{value}</div>
        <div className="flex items-center justify-center gap-1.5 text-xs text-text-muted">
            {icon}{label}
        </div>
    </div>
);

/* ── Feature card ── */
const FeatureCard: React.FC<{ icon: React.ReactNode; title: string; desc: string; color: string; bg: string }> = ({ icon, title, desc, color, bg }) => (
    <div className="group p-6 rounded-2xl border border-white/[0.07] bg-white/[0.03] hover:border-primary-green/30 hover:bg-primary-green/[0.04] transition-all duration-300">
        <div className={`w-11 h-11 rounded-xl ${bg} ${color} border border-white/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
            {icon}
        </div>
        <h3 className="text-base font-semibold text-white mb-2">{title}</h3>
        <p className="text-sm text-text-muted leading-relaxed">{desc}</p>
    </div>
);

/* ── Step card ── */
const StepCard: React.FC<{ num: number; title: string; desc: string; icon: React.ReactNode }> = ({ num, title, desc, icon }) => (
    <div className="flex gap-5">
        <div className="flex flex-col items-center gap-1 flex-shrink-0">
            <div className="w-10 h-10 rounded-xl bg-primary-green/15 border border-primary-green/30 flex items-center justify-center text-primary-green font-bold text-sm">
                {num}
            </div>
            {num < 4 && <div className="w-px flex-1 bg-primary-green/15 my-1 min-h-[40px]" />}
        </div>
        <div className="pb-8">
            <div className="flex items-center gap-2 mb-1.5">
                <span className="text-primary-green">{icon}</span>
                <h3 className="text-base font-semibold text-white">{title}</h3>
            </div>
            <p className="text-sm text-text-muted leading-relaxed">{desc}</p>
        </div>
    </div>
);

/* ── Main component ── */
export const Landing: React.FC = () => {
    const navigate = useNavigate();
    const goToDashboard = () => navigate('/dashboard');

    const features = [
        { icon: <MapPin size={20} />, title: 'Live Issue Map', desc: 'View all reported city issues on an interactive real-time map with status pins and cluster grouping.', color: 'text-primary-green', bg: 'bg-primary-green/15' },
        { icon: <Bell size={20} />, title: 'Instant Notifications', desc: 'Get notified when your reports are reviewed, assigned, or resolved by the city maintenance team.', color: 'text-accent-teal', bg: 'bg-accent-teal/15' },
        { icon: <BarChart3 size={20} />, title: 'Analytics Dashboard', desc: 'Track resolution rates, pending issues, and community progress with real-time KPI metrics.', color: 'text-blue-400', bg: 'bg-blue-400/15' },
        { icon: <Shield size={20} />, title: 'Verified Reports', desc: 'All submissions are reviewed for accuracy, preventing false reports and abuse of the system.', color: 'text-yellow-400', bg: 'bg-yellow-400/15' },
        { icon: <Users size={20} />, title: 'Community Points', desc: 'Earn civic points for every report, upvote, and resolved issue — climb the city leaderboard.', color: 'text-orange-400', bg: 'bg-orange-400/15' },
        { icon: <Zap size={20} />, title: 'Fast Resolution', desc: 'Direct escalation pipeline to the right department ensures issues are resolved up to 3× faster.', color: 'text-accent-lime', bg: 'bg-accent-lime/15' },
    ];

    const categories = [
        { icon: <Construction size={18} />, label: 'Roads & Traffic', count: '1,204 reports', color: 'text-orange-400', bg: 'bg-orange-400/10' },
        { icon: <Lightbulb size={18} />, label: 'Streetlights', count: '312 reports', color: 'text-yellow-400', bg: 'bg-yellow-400/10' },
        { icon: <Droplets size={18} />, label: 'Water & Plumbing', count: '489 reports', color: 'text-blue-400', bg: 'bg-blue-400/10' },
        { icon: <Trash2 size={18} />, label: 'Waste Management', count: '267 reports', color: 'text-red-400', bg: 'bg-red-400/10' },
        { icon: <Trees size={18} />, label: 'Parks & Trees', count: '175 reports', color: 'text-primary-green', bg: 'bg-primary-green/10' },
    ];

    const testimonials = [
        { name: 'Sarah Jenkins', role: 'Resident, Zone A', avatar: 'SJ', text: 'I reported a dangerous pothole and it was fixed within 3 days. Amazing how fast the city team responded!', stars: 5 },
        { name: 'Michael Chen', role: 'Community Leader', avatar: 'MC', text: 'CityResolve has transformed how our neighborhood communicates with the civic authorities. Highly recommended.', stars: 5 },
        { name: 'Priya Gupta', role: 'Local Councillor', avatar: 'PG', text: 'The analytics dashboard gives us a clear picture of what needs attention. Resolution time dropped by 60%.', stars: 5 },
    ];

    return (
        <div className="min-h-screen bg-background overflow-x-hidden">
            <LandingNav onEnter={goToDashboard} />

            {/* ══ HERO ══ */}
            <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
                {/* Background layers */}
                <div className="absolute inset-0 bg-gradient-to-b from-[#031a0a] via-background to-background" />
                <div className="absolute inset-0"
                    style={{
                        backgroundImage: 'linear-gradient(rgba(34,197,94,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(34,197,94,0.04) 1px, transparent 1px)',
                        backgroundSize: '60px 60px',
                    }}
                />
                {/* Glow orbs */}
                <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary-green/8 rounded-full blur-[120px] pointer-events-none" />
                <div className="absolute top-1/3 left-1/4 w-72 h-72 bg-accent-teal/6 rounded-full blur-[80px] pointer-events-none" />
                <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-primary-green/5 rounded-full blur-[90px] pointer-events-none" />

                {/* Floating status pills */}
                <div className="absolute top-32 left-[8%] hidden lg:flex items-center gap-2 px-4 py-2.5 rounded-full bg-white/[0.06] backdrop-blur border border-white/10 text-xs font-medium text-white/80 shadow-lg animate-float">
                    <span className="w-2 h-2 rounded-full bg-status-resolved animate-pulse" />
                    Pothole on MG Road — Resolved
                </div>
                <div className="absolute top-48 right-[8%] hidden lg:flex items-center gap-2 px-4 py-2.5 rounded-full bg-white/[0.06] backdrop-blur border border-white/10 text-xs font-medium text-white/80 shadow-lg animate-float-delayed">
                    <span className="w-2 h-2 rounded-full bg-status-pending animate-pulse" />
                    Streetlight out — Under Review
                </div>
                <div className="absolute bottom-40 left-[12%] hidden lg:flex items-center gap-2 px-4 py-2.5 rounded-full bg-white/[0.06] backdrop-blur border border-white/10 text-xs font-medium text-white/80 shadow-lg" style={{ animation: 'float 14s ease-in-out infinite 1s' }}>
                    <span className="w-2 h-2 rounded-full bg-status-progress animate-pulse" />
                    Water leak — In Progress
                </div>

                {/* Hero content */}
                <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary-green/30 bg-primary-green/10 text-primary-green text-xs font-semibold mb-8 backdrop-blur">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary-green animate-pulse" />
                        Civic Issue Reporting Platform
                        <ChevronRight size={13} />
                    </div>

                    <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white tracking-tight leading-[1.08] mb-6">
                        Report City Issues.{' '}
                        <span className="relative inline-block">
                            <span className="text-primary-green" style={{ textShadow: '0 0 40px rgba(34,197,94,0.4)' }}>
                                Get Them Fixed.
                            </span>
                            {/* Underline accent */}
                            <svg className="absolute -bottom-2 left-0 w-full" height="6" viewBox="0 0 400 6" fill="none" preserveAspectRatio="none">
                                <path d="M0 3 Q100 0 200 3 Q300 6 400 3" stroke="#22C55E" strokeWidth="2.5" strokeLinecap="round" opacity="0.6" />
                            </svg>
                        </span>
                    </h1>

                    <p className="text-lg md:text-xl text-text-muted max-w-2xl mx-auto mb-10 leading-relaxed">
                        CityResolve empowers citizens to report infrastructure issues directly to city authorities — track progress, earn points, and build a better city together.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
                        <button onClick={goToDashboard}
                            className="flex items-center gap-2.5 px-8 py-4 bg-primary-green text-background rounded-2xl text-base font-bold hover:bg-accent-lime transition-all shadow-[0_0_30px_rgba(34,197,94,0.4)] hover:shadow-[0_0_50px_rgba(34,197,94,0.5)] hover:scale-[1.02] active:scale-[0.98]">
                            Open Dashboard <ArrowRight size={18} />
                        </button>
                        <button onClick={goToDashboard}
                            className="flex items-center gap-2.5 px-8 py-4 bg-white/[0.07] backdrop-blur border border-white/15 text-white rounded-2xl text-base font-semibold hover:bg-white/[0.12] transition-all">
                            <Play size={16} className="text-primary-green" />
                            See How It Works
                        </button>
                    </div>

                    {/* Trust stats row */}
                    <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12">
                        <CountStat value="2,451" label="Issues Reported" icon={<AlertTriangle size={12} />} color="text-white" />
                        <div className="w-px h-8 bg-white/10 hidden md:block" />
                        <CountStat value="1,204" label="Resolved This Month" icon={<CheckCircle size={12} />} color="text-status-resolved" />
                        <div className="w-px h-8 bg-white/10 hidden md:block" />
                        <CountStat value="8,300+" label="Active Citizens" icon={<Users size={12} />} color="text-accent-teal" />
                        <div className="w-px h-8 bg-white/10 hidden md:block" />
                        <CountStat value="48 hrs" label="Avg. Resolution Time" icon={<Clock size={12} />} color="text-yellow-400" />
                    </div>
                </div>

                {/* Bottom fade */}
                <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent pointer-events-none" />
            </section>

            {/* ══ CATEGORIES ══ */}
            <section className="py-16 px-6 max-w-7xl mx-auto">
                <div className="flex flex-wrap justify-center gap-3">
                    {categories.map(cat => (
                        <div key={cat.label}
                            className={`flex items-center gap-2.5 px-5 py-2.5 rounded-2xl border border-white/[0.07] ${cat.bg} backdrop-blur cursor-pointer hover:border-white/20 transition-colors group`}>
                            <span className={cat.color}>{cat.icon}</span>
                            <span className="text-sm font-medium text-white/80 group-hover:text-white transition-colors">{cat.label}</span>
                            <span className="text-xs text-text-muted">{cat.count}</span>
                        </div>
                    ))}
                </div>
            </section>

            {/* ══ FEATURES ══ */}
            <section id="features" className="py-24 px-6 max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary-green/20 bg-primary-green/8 text-primary-green text-xs font-semibold mb-4">
                        <Zap size={12} /> Platform Features
                    </div>
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">
                        Everything you need to<br />
                        <span className="text-primary-green">improve your city</span>
                    </h2>
                    <p className="text-text-muted max-w-xl mx-auto text-base">
                        A full-stack civic platform built for speed, transparency, and community engagement.
                    </p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {features.map(f => <FeatureCard key={f.title} {...f} />)}
                </div>
            </section>

            {/* ══ HOW IT WORKS ══ */}
            <section id="how-it-works" className="py-24 px-6 max-w-7xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-accent-teal/20 bg-accent-teal/8 text-accent-teal text-xs font-semibold mb-6">
                            <TrendingUp size={12} /> How It Works
                        </div>
                        <h2 className="text-4xl font-bold text-white mb-4 tracking-tight leading-tight">
                            From report to resolution<br />in four simple steps
                        </h2>
                        <p className="text-text-muted mb-10 leading-relaxed">
                            Our streamlined pipeline ensures every issue gets to the right team, with full transparency at every stage.
                        </p>
                        <div>
                            <StepCard num={1} icon={<AlertTriangle size={16} />} title="Spot & Report" desc="Take a photo, pin the location, and describe the issue. Takes less than 60 seconds to file a report." />
                            <StepCard num={2} icon={<MapPin size={16} />} title="Auto-route to Department" desc="Our system instantly routes the issue to the correct city department based on category and zone." />
                            <StepCard num={3} icon={<Zap size={16} />} title="Track Progress Live" desc="Follow your report's status in real-time — from Pending through In Progress to Resolved." />
                            <StepCard num={4} icon={<Award size={16} />} title="Earn Civic Points" desc="Get rewarded for every contribution. Climb the leaderboard and unlock badges." />
                        </div>
                    </div>

                    {/* Dashboard preview mockup */}
                    <div className="relative">
                        <div className="absolute inset-0 bg-primary-green/10 rounded-3xl blur-3xl" />
                        <div className="relative rounded-2xl border border-white/12 bg-white/[0.04] backdrop-blur-xl overflow-hidden shadow-2xl p-5">
                            {/* Mock header */}
                            <div className="flex items-center justify-between mb-4 pb-4 border-b border-white/[0.06]">
                                <div className="flex items-center gap-2">
                                    <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-primary-green to-accent-teal flex items-center justify-center">
                                        <Leaf size={12} className="text-background" />
                                    </div>
                                    <span className="text-sm font-bold text-white">City<span className="text-primary-green">Resolve</span></span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <span className="w-2 h-2 rounded-full bg-primary-green animate-pulse" />
                                    <span className="text-xs text-primary-green font-mono">LIVE</span>
                                </div>
                            </div>
                            {/* Mock stat row */}
                            <div className="grid grid-cols-2 gap-3 mb-4">
                                {[
                                    { label: 'Total Issues', value: '2,451', color: 'text-primary-green', trend: '+12%' },
                                    { label: 'Resolved', value: '1,204', color: 'text-status-resolved', trend: '+18%' },
                                    { label: 'Pending', value: '432', color: 'text-status-pending', trend: '-5%' },
                                    { label: 'In Progress', value: '89', color: 'text-status-progress', trend: '0%' },
                                ].map(s => (
                                    <div key={s.label} className="p-3 rounded-xl bg-white/[0.04] border border-white/[0.06]">
                                        <p className="text-[11px] text-text-muted mb-1">{s.label}</p>
                                        <p className={`text-xl font-bold ${s.color}`}>{s.value}</p>
                                        <p className="text-[10px] text-text-muted mt-0.5">{s.trend} this month</p>
                                    </div>
                                ))}
                            </div>
                            {/* Mock issue list */}
                            {[
                                { title: 'Pothole on MG Road', status: 'Pending', dot: 'bg-status-pending', cat: 'Roads' },
                                { title: 'Streetlight out — Oakwood', status: 'In Progress', dot: 'bg-status-progress', cat: 'Lights' },
                                { title: 'Water pipe burst', status: 'Resolved', dot: 'bg-status-resolved', cat: 'Water' },
                            ].map((item, i) => (
                                <div key={i} className="flex items-center gap-3 py-2.5 border-b border-white/[0.04] last:border-0">
                                    <span className={`w-2 h-2 rounded-full flex-shrink-0 ${item.dot}`} />
                                    <span className="text-xs text-white flex-1 truncate">{item.title}</span>
                                    <span className="text-[11px] text-text-muted">{item.cat}</span>
                                    <span className={`text-[11px] font-medium ${item.dot === 'bg-status-resolved' ? 'text-status-resolved' : item.dot === 'bg-status-progress' ? 'text-status-progress' : 'text-status-pending'}`}>{item.status}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* ══ STATS BAND ══ */}
            <section id="stats" className="py-16 px-6">
                <div className="max-w-7xl mx-auto rounded-2xl border border-primary-green/15 bg-primary-green/[0.05] backdrop-blur overflow-hidden relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-primary-green/5 via-transparent to-accent-teal/5" />
                    <div className="relative grid grid-cols-2 md:grid-cols-4 divide-x divide-y md:divide-y-0 divide-white/[0.07]">
                        {[
                            { value: '42', label: 'Cities onboard', icon: <MapPin size={16} />, color: 'text-primary-green' },
                            { value: '8,300+', label: 'Active citizens', icon: <Users size={16} />, color: 'text-accent-teal' },
                            { value: '94%', label: 'Resolution rate', icon: <CheckCircle size={16} />, color: 'text-status-resolved' },
                            { value: '48 hrs', label: 'Avg. fix time', icon: <Clock size={16} />, color: 'text-yellow-400' },
                        ].map(s => (
                            <div key={s.label} className="p-10 text-center">
                                <div className={`flex justify-center mb-2 ${s.color}`}>{s.icon}</div>
                                <div className={`text-4xl font-bold ${s.color} mb-1`}>{s.value}</div>
                                <div className="text-sm text-text-muted">{s.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ══ TESTIMONIALS ══ */}
            <section className="py-24 px-6 max-w-7xl mx-auto">
                <div className="text-center mb-14">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-yellow-400/20 bg-yellow-400/8 text-yellow-400 text-xs font-semibold mb-4">
                        <Star size={12} /> Community Voice
                    </div>
                    <h2 className="text-4xl font-bold text-white tracking-tight">
                        Trusted by real citizens
                    </h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    {testimonials.map(t => (
                        <div key={t.name} className="p-6 rounded-2xl border border-white/[0.07] bg-white/[0.03] hover:border-white/15 transition-colors">
                            <div className="flex gap-0.5 mb-4">
                                {Array.from({ length: t.stars }).map((_, i) => (
                                    <Star key={i} size={14} className="text-yellow-400 fill-yellow-400" />
                                ))}
                            </div>
                            <p className="text-sm text-text-muted leading-relaxed mb-5">"{t.text}"</p>
                            <div className="flex items-center gap-3 pt-4 border-t border-white/[0.06]">
                                <div className="w-8 h-8 rounded-full bg-primary-green/20 border border-primary-green/30 flex items-center justify-center text-xs font-bold text-primary-green">
                                    {t.avatar}
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-white">{t.name}</p>
                                    <p className="text-xs text-text-muted">{t.role}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* ══ CTA BANNER ══ */}
            <section className="py-24 px-6 max-w-7xl mx-auto">
                <div className="relative rounded-3xl border border-primary-green/20 overflow-hidden text-center py-20 px-6">
                    {/* BG */}
                    <div className="absolute inset-0 bg-gradient-to-br from-primary-green/10 via-transparent to-accent-teal/10" />
                    <div className="absolute inset-0"
                        style={{
                            backgroundImage: 'linear-gradient(rgba(34,197,94,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(34,197,94,0.05) 1px, transparent 1px)',
                            backgroundSize: '40px 40px',
                        }}
                    />
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-48 bg-primary-green/15 blur-[80px] rounded-full" />

                    <div className="relative z-10">
                        <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">
                            Your city. <span className="text-primary-green">Your voice.</span>
                        </h2>
                        <p className="text-text-muted mb-8 max-w-lg mx-auto text-base">
                            Join thousands of citizens already making a difference. Report your first issue in under 60 seconds.
                        </p>
                        <button onClick={goToDashboard}
                            className="inline-flex items-center gap-3 px-10 py-4 bg-primary-green text-background rounded-2xl text-base font-bold hover:bg-accent-lime transition-all shadow-[0_0_40px_rgba(34,197,94,0.4)] hover:shadow-[0_0_60px_rgba(34,197,94,0.5)] hover:scale-[1.02] active:scale-[0.98]">
                            Get Started Free <ArrowRight size={18} />
                        </button>
                    </div>
                </div>
            </section>

            {/* ══ FOOTER ══ */}
            <footer className="border-t border-white/[0.06] py-10 px-6">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-primary-green to-accent-teal flex items-center justify-center">
                            <Leaf size={13} className="text-background" />
                        </div>
                        <span className="font-bold text-white">City<span className="text-primary-green">Resolve</span></span>
                    </div>
                    <p className="text-xs text-text-muted text-center">
                        © 2026 CityResolve. Building better cities through civic technology.
                    </p>
                    <div className="flex items-center gap-5 text-xs text-text-muted">
                        <a href="#" className="hover:text-white transition-colors">Privacy</a>
                        <a href="#" className="hover:text-white transition-colors">Terms</a>
                        <a href="#" className="hover:text-white transition-colors">Contact</a>
                    </div>
                </div>
            </footer>
        </div>
    );
};
