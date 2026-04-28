import React from 'react';
import { Bell, ChevronDown, Menu, Search } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../../auth/AuthContext';

interface NavbarProps {
    onMenuClick?: () => void;
    onNotificationClick?: () => void;
    unreadCount?: number;
    onProfileClick?: () => void;
}

const PAGE_META: Record<string, { title: string; subtitle?: string }> = {
    '/dashboard': { title: 'City Overview' },
    '/report': { title: 'Report an Issue' },
    '/issues': { title: 'Open Issues' },
    '/map': { title: 'Map View' },
    '/rewards': { title: 'Rewards & Leaderboard' },
    '/settings': { title: 'Settings' },
    '/logout': { title: 'Sign Out' },
};

export const Navbar: React.FC<NavbarProps> = ({ onMenuClick, onNotificationClick, unreadCount = 0, onProfileClick }) => {
    const location = useLocation();
    const { user } = useAuth();
    const page = PAGE_META[location.pathname] || { title: 'CityResolve' };
    const initials = user?.name
        ?.split(' ')
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0]?.toUpperCase())
        .join('') || 'CR';

    return (
        <header className="fixed inset-x-0 top-0 z-50 h-16 border-b border-black/5 bg-[rgba(255,255,255,0.88)] backdrop-blur-xl">
            <div className="flex h-full items-center px-4 md:px-6 lg:pl-[284px] lg:pr-8">
                <button
                    className="mr-3 inline-flex h-10 w-10 items-center justify-center rounded-xl border border-black/5 bg-white text-[var(--color-text-secondary)] lg:hidden"
                    onClick={onMenuClick}
                    aria-label="Open menu"
                >
                    <Menu size={20} />
                </button>

                <div>
                    <p className="text-xl font-bold tracking-tight">{page.title}</p>
                    <p className="hidden text-xs text-[var(--color-text-muted)] md:block">
                        Professional civic operations dashboard
                    </p>
                </div>

                <div className="ml-auto flex items-center gap-2 md:gap-3">
                    <label className="hidden items-center gap-2 rounded-full border border-black/5 bg-[var(--color-bg-card-alt)] px-4 py-2 text-sm text-[var(--color-text-secondary)] shadow-sm md:flex">
                        <Search size={16} className="text-[var(--color-text-muted)]" />
                        <input
                            aria-label="Search issues"
                            placeholder="Search issues..."
                            className="w-48 border-none bg-transparent p-0 text-sm shadow-none focus:shadow-none"
                        />
                    </label>

                    <button
                        onClick={onNotificationClick}
                        className="relative inline-flex h-10 w-10 items-center justify-center rounded-full border border-black/5 bg-white text-[var(--color-text-secondary)] shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                        aria-label="Open notifications"
                    >
                        <Bell size={18} />
                        {unreadCount > 0 && (
                            <span className="absolute right-2 top-2 h-2.5 w-2.5 rounded-full bg-[var(--color-green-light)] ring-2 ring-white" />
                        )}
                    </button>

                    <button
                        onClick={onProfileClick}
                        className="flex items-center gap-3 rounded-full border border-black/5 bg-white px-2 py-1.5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                    >
                        {user?.avatarUrl ? (
                            <img src={user.avatarUrl} alt={user.name} className="h-8 w-8 rounded-full object-cover" />
                        ) : (
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--color-sidebar-bg)] text-xs font-bold text-white">
                                {initials}
                            </div>
                        )}
                        <div className="hidden text-left md:block">
                            <p className="text-sm font-bold leading-none">{user?.name || 'Citizen User'}</p>
                            <p className="mt-1 text-[11px] text-[var(--color-text-muted)]">
                                {user?.role === 'admin' ? 'City Operations' : 'Community Member'}
                            </p>
                        </div>
                        <ChevronDown size={16} className="hidden text-[var(--color-text-muted)] md:block" />
                    </button>
                </div>
            </div>
        </header>
    );
};
