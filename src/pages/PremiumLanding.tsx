import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowRight, MapPin, CheckCircle, AlertTriangle, Users, Zap,
  Shield, BarChart3, Bell, Star, ChevronRight, Leaf,
  Construction, Droplets, Lightbulb, Trash2, Trees,
  TrendingUp, Clock, Award, Play, Menu, X
} from 'lucide-react';
import { PremiumButton } from '../components/ui/PremiumButton';
import { PremiumGlassCard } from '../components/ui/PremiumGlassCard';
// removed PremiumStatCard

/* ── Premium Floating nav ── */
const PremiumLandingNav: React.FC<{ onEnter: () => void }> = ({ onEnter }) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled
        ? 'bg-white/80 backdrop-blur-xl border-b border-white/50 shadow-glass-sm py-3'
        : 'bg-transparent py-5'
    }`}>
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-emerald-500 to-primary-teal-500 flex items-center justify-center shadow-brand-soft">
            <Leaf size={20} className="text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight text-neutral-900">
            City<span className="text-gradient">Resolve</span>
          </span>
        </div>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-neutral-600">
          {['Features', 'How It Works', 'Stats', 'Leaderboard'].map(link => (
            <a
              key={link}
              href={`#${link.toLowerCase().replace(' ', '-')}`}
              className="hover:text-primary-emerald-600 transition-colors"
            >
              {link}
            </a>
          ))}
        </div>

        {/* CTA */}
        <div className="hidden md:flex items-center gap-3">
          <button
            onClick={onEnter}
            className="text-sm font-medium text-neutral-600 hover:text-neutral-900 transition-colors px-4 py-2"
          >
            Sign In
          </button>
          <PremiumButton onClick={onEnter} size="sm">
            Get Started <ArrowRight size={15} />
          </PremiumButton>
        </div>

        {/* Mobile burger */}
        <button
          className="md:hidden text-neutral-600 hover:text-neutral-900"
          onClick={() => setMobileOpen(v => !v)}
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-white/95 backdrop-blur-xl border-t border-white/50 px-6 py-4 flex flex-col gap-3 animate-in fade-in slide-in-from-top-2 duration-200 shadow-glass-lg">
          {['Features', 'How It Works', 'Stats', 'Leaderboard'].map(link => (
            <a
              key={link}
              href={`#${link.toLowerCase().replace(' ', '-')}`}
              className="text-sm text-neutral-600 hover:text-neutral-900 py-1"
              onClick={() => setMobileOpen(false)}
            >
              {link}
            </a>
          ))}
          <PremiumButton onClick={onEnter} className="mt-2 w-full">
            Open Dashboard
          </PremiumButton>
        </div>
      )}
    </nav>
  );
};

/* ── Premium Stat counter ── */
const PremiumCountStat: React.FC<{ value: string; label: string; icon: React.ReactNode; color: string }> = ({ value, label, icon, color }) => (
  <div className="text-center">
    <div className={`text-4xl md:text-5xl font-bold ${color} mb-2`}>{value}</div>
    <div className="flex items-center justify-center gap-2 text-sm text-neutral-500">
      {icon}
      <span>{label}</span>
    </div>
  </div>
);

/* ── Premium Feature card ── */
const PremiumFeatureCard: React.FC<{ icon: React.ReactNode; title: string; desc: string; color: string; bg: string }> = ({ icon, title, desc, color, bg }) => (
  <PremiumGlassCard className="group p-6 hover:border-primary-emerald-200">
    <div className={`w-12 h-12 rounded-xl ${bg} ${color} border border-white/50 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-sm`}>
      {icon}
    </div>
    <h3 className="text-lg font-semibold text-neutral-900 mb-2">{title}</h3>
    <p className="text-sm text-neutral-600 leading-relaxed">{desc}</p>
  </PremiumGlassCard>
);

/* ── Premium Step card ── */
const PremiumStepCard: React.FC<{ num: number; title: string; desc: string; icon: React.ReactNode }> = ({ num, title, desc, icon }) => (
  <div className="flex gap-5">
    <div className="flex flex-col items-center gap-2 flex-shrink-0">
      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-emerald-100 to-primary-teal-100 border border-primary-emerald-200 flex items-center justify-center text-primary-emerald-700 font-bold text-sm shadow-sm">
        {num}
      </div>
      {num < 4 && <div className="w-px flex-1 bg-gradient-to-b from-primary-emerald-200 to-transparent my-1 min-h-[40px]" />}
    </div>
    <div className="pb-8">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-primary-emerald-600">{icon}</span>
        <h3 className="text-lg font-semibold text-neutral-900">{title}</h3>
      </div>
      <p className="text-sm text-neutral-600 leading-relaxed">{desc}</p>
    </div>
  </div>
);

/* ── Main component ── */
export const PremiumLanding: React.FC = () => {
  const navigate = useNavigate();
  const goToDashboard = () => navigate('/dashboard');

  const features = [
    {
      icon: <MapPin size={24} />,
      title: 'Live Issue Map',
      desc: 'View all reported city issues on an interactive real-time map with status pins and cluster grouping.',
      color: 'text-primary-emerald-600',
      bg: 'bg-emerald-50',
    },
    {
      icon: <Bell size={24} />,
      title: 'Instant Notifications',
      desc: 'Get notified when your reports are reviewed, assigned, or resolved by the city maintenance team.',
      color: 'text-primary-teal-600',
      bg: 'bg-teal-50',
    },
    {
      icon: <BarChart3 size={24} />,
      title: 'Analytics Dashboard',
      desc: 'Track resolution rates, pending issues, and community progress with real-time KPI metrics.',
      color: 'text-blue-600',
      bg: 'bg-blue-50',
    },
    {
      icon: <Shield size={24} />,
      title: 'Verified Reports',
      desc: 'All submissions are reviewed for accuracy, preventing false reports and abuse of the system.',
      color: 'text-amber-600',
      bg: 'bg-amber-50',
    },
    {
      icon: <Users size={24} />,
      title: 'Community Points',
      desc: 'Earn civic points for every report, upvote, and resolved issue — climb the city leaderboard.',
      color: 'text-purple-600',
      bg: 'bg-purple-50',
    },
    {
      icon: <Zap size={24} />,
      title: 'Fast Resolution',
      desc: 'Direct escalation pipeline to the right department ensures issues are resolved up to 3× faster.',
      color: 'text-primary-lime-600',
      bg: 'bg-lime-50',
    },
  ];

  const categories = [
    { icon: <Construction size={20} />, label: 'Roads & Traffic', count: '1,204 reports', color: 'text-amber-600', bg: 'bg-amber-50' },
    { icon: <Lightbulb size={20} />, label: 'Streetlights', count: '312 reports', color: 'text-yellow-600', bg: 'bg-yellow-50' },
    { icon: <Droplets size={20} />, label: 'Water & Plumbing', count: '489 reports', color: 'text-blue-600', bg: 'bg-blue-50' },
    { icon: <Trash2 size={20} />, label: 'Waste Management', count: '267 reports', color: 'text-red-600', bg: 'bg-red-50' },
    { icon: <Trees size={20} />, label: 'Parks & Trees', count: '175 reports', color: 'text-primary-emerald-600', bg: 'bg-emerald-50' },
  ];

  const testimonials = [
    { name: 'Sarah Jenkins', role: 'Resident, Zone A', avatar: 'SJ', text: 'I reported a dangerous pothole and it was fixed within 3 days. Amazing how fast the city team responded!', stars: 5 },
    { name: 'Michael Chen', role: 'Community Leader', avatar: 'MC', text: 'CityResolve has transformed how our neighborhood communicates with the civic authorities. Highly recommended.', stars: 5 },
    { name: 'Priya Gupta', role: 'Local Councillor', avatar: 'PG', text: 'The analytics dashboard gives us a clear picture of what needs attention. Resolution time dropped by 60%.', stars: 5 },
  ];

  return (
    <div className="min-h-screen bg-premium-gradient overflow-x-hidden">
      <PremiumLandingNav onEnter={goToDashboard} />

      {/* ══ HERO SECTION ══ */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
        {/* Background layers */}
        <div className="absolute inset-0 bg-premium-gradient" />
        <div className="absolute inset-0 bg-premium-grid" />

        {/* Premium glow orbs */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary-emerald-500/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute top-1/3 left-1/4 w-72 h-72 bg-primary-teal-500/8 rounded-full blur-[80px] pointer-events-none" />
        <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-primary-emerald-500/6 rounded-full blur-[90px] pointer-events-none" />

        {/* Floating status pills */}
        <div className="absolute top-32 left-[8%] hidden lg:flex items-center gap-2 px-4 py-2.5 rounded-full bg-white/80 backdrop-blur-md border border-white/50 shadow-glass-sm text-xs font-medium text-neutral-700 animate-float">
          <span className="w-2 h-2 rounded-full bg-primary-emerald-500 animate-pulse" />
          Pothole on MG Road — Resolved
        </div>
        <div className="absolute top-48 right-[8%] hidden lg:flex items-center gap-2 px-4 py-2.5 rounded-full bg-white/80 backdrop-blur-md border border-white/50 shadow-glass-sm text-xs font-medium text-neutral-700 animate-float-delayed">
          <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
          Streetlight out — Under Review
        </div>

        {/* Hero content */}
        <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary-emerald-200 bg-emerald-50/80 backdrop-blur-sm text-primary-emerald-700 text-xs font-semibold mb-8 shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-primary-emerald-500 animate-pulse" />
            Civic Issue Reporting Platform
            <ChevronRight size={13} />
          </div>

          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-neutral-900 tracking-tight leading-[1.08] mb-6">
            Report City Issues.{' '}
            <span className="relative inline-block">
              <span className="text-gradient text-glow">
                Get Them Fixed.
              </span>
              {/* Underline accent */}
              <svg className="absolute -bottom-2 left-0 w-full" height="6" viewBox="0 0 400 6" fill="none" preserveAspectRatio="none">
                <path d="M0 3 Q100 0 200 3 Q300 6 400 3" stroke="#10B981" strokeWidth="2.5" strokeLinecap="round" opacity="0.6" />
              </svg>
            </span>
          </h1>

          <p className="text-lg md:text-xl text-neutral-600 max-w-2xl mx-auto mb-10 leading-relaxed">
            CityResolve empowers citizens to report infrastructure issues directly to city authorities — track progress, earn points, and build a better city together.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <PremiumButton onClick={goToDashboard} size="lg">
              Open Dashboard <ArrowRight size={18} />
            </PremiumButton>
            <button
              onClick={goToDashboard}
              className="flex items-center gap-2.5 px-8 py-4 bg-white/80 backdrop-blur-md border border-white/50 text-neutral-900 rounded-2xl text-base font-semibold hover:bg-white hover:shadow-glass-sm transition-all"
            >
              <Play size={16} className="text-primary-emerald-600" />
              See How It Works
            </button>
          </div>

          {/* Trust stats row */}
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12">
            <PremiumCountStat value="2,451" label="Issues Reported" icon={<AlertTriangle size={14} />} color="text-neutral-900" />
            <div className="w-px h-8 bg-neutral-200 hidden md:block" />
            <PremiumCountStat value="1,204" label="Resolved This Month" icon={<CheckCircle size={14} />} color="text-primary-emerald-600" />
            <div className="w-px h-8 bg-neutral-200 hidden md:block" />
            <PremiumCountStat value="8,300+" label="Active Citizens" icon={<Users size={14} />} color="text-primary-teal-600" />
            <div className="w-px h-8 bg-neutral-200 hidden md:block" />
            <PremiumCountStat value="48 hrs" label="Avg. Resolution Time" icon={<Clock size={14} />} color="text-amber-600" />
          </div>
        </div>

        {/* Bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent pointer-events-none" />
      </section>

      {/* ══ CATEGORIES ══ */}
      <section className="py-16 px-6 max-w-7xl mx-auto">
        <div className="flex flex-wrap justify-center gap-3">
          {categories.map(cat => (
            <div
              key={cat.label}
              className={`
                flex items-center gap-2.5 px-5 py-2.5 rounded-2xl border border-white/50
                bg-white/70 backdrop-blur-sm shadow-glass-sm cursor-pointer
                hover:border-primary-emerald-200 hover:shadow-glass-md hover:-translate-y-0.5
                transition-all duration-300 group
              `}
            >
              <span className={cat.color}>{cat.icon}</span>
              <span className="text-sm font-medium text-neutral-700 group-hover:text-neutral-900 transition-colors">{cat.label}</span>
              <span className="text-xs text-neutral-500">{cat.count}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ══ FEATURES ══ */}
      <section id="features" className="py-24 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary-emerald-200 bg-emerald-50/80 backdrop-blur-sm text-primary-emerald-700 text-xs font-semibold mb-4">
            <Zap size={12} /> Platform Features
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-neutral-900 mb-4 tracking-tight">
            Everything you need to<br />
            <span className="text-gradient">improve your city</span>
          </h2>
          <p className="text-neutral-600 max-w-xl mx-auto text-base">
            A full-stack civic platform built for speed, transparency, and community engagement.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map(f => <PremiumFeatureCard key={f.title} {...f} />)}
        </div>
      </section>

      {/* ══ HOW IT WORKS ══ */}
      <section id="how-it-works" className="py-24 px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary-teal-200 bg-teal-50/80 backdrop-blur-sm text-primary-teal-700 text-xs font-semibold mb-6">
              <TrendingUp size={12} /> How It Works
            </div>
            <h2 className="text-4xl font-bold text-neutral-900 mb-4 tracking-tight leading-tight">
              From report to resolution<br />in four simple steps
            </h2>
            <p className="text-neutral-600 mb-10 leading-relaxed">
              Our streamlined pipeline ensures every issue gets to the right team, with full transparency at every stage.
            </p>
            <div>
              <PremiumStepCard num={1} icon={<AlertTriangle size={18} />} title="Spot & Report" desc="Take a photo, pin the location, and describe the issue. Takes less than 60 seconds to file a report." />
              <PremiumStepCard num={2} icon={<MapPin size={18} />} title="Auto-route to Department" desc="Our system instantly routes the issue to the correct city department based on category and zone." />
              <PremiumStepCard num={3} icon={<Zap size={18} />} title="Track Progress Live" desc="Follow your report's status in real-time — from Pending through In Progress to Resolved." />
              <PremiumStepCard num={4} icon={<Award size={18} />} title="Earn Civic Points" desc="Get rewarded for every contribution. Climb the leaderboard and unlock badges." />
            </div>
          </div>

          {/* Dashboard preview mockup */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-primary-emerald-100/50 to-primary-teal-100/50 rounded-3xl blur-3xl" />
            <div className="relative rounded-2xl border border-white/50 bg-white/80 backdrop-blur-xl overflow-hidden shadow-glass-lg p-5">
              {/* Mock header */}
              <div className="flex items-center justify-between mb-4 pb-4 border-b border-neutral-100">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-primary-emerald-500 to-primary-teal-500 flex items-center justify-center">
                    <Leaf size={12} className="text-white" />
                  </div>
                  <span className="text-sm font-bold text-neutral-900">City<span className="text-gradient">Resolve</span></span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-primary-emerald-500 animate-pulse" />
                  <span className="text-xs text-primary-emerald-600 font-mono">LIVE</span>
                </div>
              </div>

              {/* Mock stat row */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                {[
                  { label: 'Total Issues', value: '2,451', color: 'text-primary-emerald-600', trend: '+12%' },
                  { label: 'Resolved', value: '1,204', color: 'text-primary-emerald-600', trend: '+18%' },
                  { label: 'Pending', value: '432', color: 'text-amber-600', trend: '-5%' },
                  { label: 'In Progress', value: '89', color: 'text-blue-600', trend: '0%' },
                ].map(s => (
                  <div key={s.label} className="p-3 rounded-xl bg-white/60 border border-white/50">
                    <p className="text-[11px] text-neutral-500 mb-1">{s.label}</p>
                    <p className={`text-xl font-bold ${s.color}`}>{s.value}</p>
                    <p className="text-[10px] text-neutral-400 mt-0.5">{s.trend} this month</p>
                  </div>
                ))}
              </div>

              {/* Mock issue list */}
              {[
                { title: 'Pothole on MG Road', status: 'Pending', dot: 'bg-amber-500', cat: 'Roads' },
                { title: 'Streetlight out — Oakwood', status: 'In Progress', dot: 'bg-blue-500', cat: 'Lights' },
                { title: 'Water pipe burst', status: 'Resolved', dot: 'bg-primary-emerald-500', cat: 'Water' },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3 py-2.5 border-b border-neutral-100 last:border-0">
                  <span className={`w-2 h-2 rounded-full flex-shrink-0 ${item.dot}`} />
                  <span className="text-xs text-neutral-900 flex-1 truncate">{item.title}</span>
                  <span className="text-[11px] text-neutral-500">{item.cat}</span>
                  <span className={`text-[11px] font-medium ${
                    item.dot === 'bg-primary-emerald-500' ? 'text-primary-emerald-600' :
                    item.dot === 'bg-blue-500' ? 'text-blue-600' :
                    'text-amber-600'
                  }`}>{item.status}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══ STATS BAND ══ */}
      <section id="stats" className="py-16 px-6">
        <div className="max-w-7xl mx-auto rounded-2xl border border-primary-emerald-100 bg-white/70 backdrop-blur-md shadow-glass-sm overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-r from-primary-emerald-50/50 via-transparent to-primary-teal-50/50" />
          <div className="relative grid grid-cols-2 md:grid-cols-4 divide-x divide-y md:divide-y-0 divide-neutral-100">
            {[
              { value: '42', label: 'Cities onboard', icon: <MapPin size={16} />, color: 'text-primary-emerald-600' },
              { value: '8,300+', label: 'Active citizens', icon: <Users size={16} />, color: 'text-primary-teal-600' },
              { value: '94%', label: 'Resolution rate', icon: <CheckCircle size={16} />, color: 'text-primary-emerald-600' },
              { value: '48 hrs', label: 'Avg. fix time', icon: <Clock size={16} />, color: 'text-amber-600' },
            ].map(s => (
              <div key={s.label} className="p-10 text-center">
                <div className={`flex justify-center mb-2 ${s.color}`}>{s.icon}</div>
                <div className={`text-4xl font-bold ${s.color} mb-1`}>{s.value}</div>
                <div className="text-sm text-neutral-600">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ TESTIMONIALS ══ */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-amber-200 bg-amber-50/80 backdrop-blur-sm text-amber-700 text-xs font-semibold mb-4">
            <Star size={12} /> Community Voice
          </div>
          <h2 className="text-4xl font-bold text-neutral-900 tracking-tight">
            Trusted by real citizens
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map(t => (
            <PremiumGlassCard key={t.name} className="p-6 hover:border-primary-emerald-200">
              <div className="flex gap-0.5 mb-4">
                {Array.from({ length: t.stars }).map((_, i) => (
                  <Star key={i} size={14} className="text-amber-400 fill-amber-400" />
                ))}
              </div>
              <p className="text-sm text-neutral-600 leading-relaxed mb-5">"{t.text}"</p>
              <div className="flex items-center gap-3 pt-4 border-t border-neutral-100">
                <div className="w-10 h-10 rounded-full bg-emerald-50 border border-primary-emerald-200 flex items-center justify-center text-xs font-bold text-primary-emerald-700">
                  {t.avatar}
                </div>
                <div>
                  <p className="text-sm font-semibold text-neutral-900">{t.name}</p>
                  <p className="text-xs text-neutral-500">{t.role}</p>
                </div>
              </div>
            </PremiumGlassCard>
          ))}
        </div>
      </section>

      {/* ══ CTA BANNER ══ */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="relative rounded-3xl border border-primary-emerald-200 overflow-hidden text-center py-20 px-6">
          {/* BG */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary-emerald-50/80 via-transparent to-primary-teal-50/80" />
          <div className="absolute inset-0 bg-premium-grid" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-48 bg-primary-emerald-100/50 blur-[80px] rounded-full" />

          <div className="relative z-10">
            <h2 className="text-4xl md:text-5xl font-bold text-neutral-900 mb-4 tracking-tight">
              Your city. <span className="text-gradient">Your voice.</span>
            </h2>
            <p className="text-neutral-600 mb-8 max-w-lg mx-auto text-base">
              Join thousands of citizens already making a difference. Report your first issue in under 60 seconds.
            </p>
            <PremiumButton onClick={goToDashboard} size="lg">
              Get Started Free <ArrowRight size={18} />
            </PremiumButton>
          </div>
        </div>
      </section>

      {/* ══ FOOTER ══ */}
      <footer className="border-t border-neutral-200 py-10 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-emerald-500 to-primary-teal-500 flex items-center justify-center">
              <Leaf size={14} className="text-white" />
            </div>
            <span className="font-bold text-neutral-900">City<span className="text-gradient">Resolve</span></span>
          </div>
          <p className="text-xs text-neutral-500 text-center">
            © 2026 CityResolve. Building better cities through civic technology.
          </p>
          <div className="flex items-center gap-5 text-xs text-neutral-500">
            <a href="#" className="hover:text-neutral-900 transition-colors">Privacy</a>
            <a href="#" className="hover:text-neutral-900 transition-colors">Terms</a>
            <a href="#" className="hover:text-neutral-900 transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
};
