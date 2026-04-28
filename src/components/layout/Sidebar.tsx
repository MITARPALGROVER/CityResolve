import React from 'react';
import { NavLink } from 'react-router-dom';
import {
    AlertCircle,
    Home,
    Leaf,
    LogOut,
    Map,
    PlusCircle,
    Settings,
    Trophy,
    X,
} from 'lucide-react';
import { useAuth } from '../../auth/AuthContext';

interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

const mainItems = [
    { name: 'Dashboard', path: '/dashboard', icon: Home },
    { name: 'Report Issue', path: '/report', icon: PlusCircle },
    { name: 'Open Issues', path: '/issues', icon: AlertCircle },
    { name: 'Map View', path: '/map', icon: Map },
    { name: 'Leaderboard', path: '/rewards', icon: Trophy },
];

const accountItems = [
    { name: 'Settings', path: '/settings', icon: Settings },
    { name: 'Logout', path: '/logout', icon: LogOut },
];

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
    const { user } = useAuth();
    const initials = user?.name
        ?.split(' ')
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0]?.toUpperCase())
        .join('') || 'CR';

    return (
        <>
            {isOpen && (
                <button
                    className="fixed inset-0 z-40 bg-black/25 backdrop-blur-sm lg:hidden"
                    onClick={onClose}
                    aria-label="Close sidebar overlay"
                />
            )}

            <aside
                className={`fixed inset-y-0 left-0 z-50 flex w-[240px] flex-col overflow-hidden border-r border-[var(--color-sidebar-border)] bg-[var(--color-sidebar-bg)] text-[var(--color-text-sidebar)] transition-transform duration-300 lg:translate-x-0 ${
                    isOpen ? 'translate-x-0' : '-translate-x-full'
                }`}
            >
                <div className="flex h-16 items-center justify-between border-b border-[var(--color-sidebar-border)] px-5">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[rgba(76,175,125,0.15)] text-[var(--color-green-glow)]">
                            <Leaf size={20} />
                        </div>
                        <div>
                            <p className="text-sm font-extrabold tracking-wide text-white">CITYRESOLVE</p>
                            <p className="text-[11px] uppercase tracking-[0.22em] text-[rgba(200,221,208,0.7)]">Civic hub</p>
                        </div>
                    </div>
                    <button className="rounded-xl p-2 text-[var(--color-text-sidebar)] lg:hidden" onClick={onClose} aria-label="Close sidebar">
                        <X size={18} />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto px-4 py-5">
                    <p className="px-2 text-[10px] font-bold uppercase tracking-[0.3em] text-[rgba(200,221,208,0.55)]">Main</p>
                    <nav className="mt-3 space-y-1.5">
                        {mainItems.map((item) => {
                            const Icon = item.icon;
                            return (
                                <NavLink
                                    key={item.path}
                                    to={item.path}
                                    onClick={onClose}
                                    className={({ isActive }) =>
                                        `group flex items-center gap-3 rounded-xl border-l-4 px-4 py-3 text-sm font-medium transition ${
                                            isActive
                                                ? 'border-[var(--color-green-light)] bg-[var(--color-sidebar-active)] text-[var(--color-text-sidebar-active)]'
                                                : 'border-transparent text-[var(--color-text-sidebar)] hover:bg-[var(--color-sidebar-hover)] hover:text-white'
                                        }`
                                    }
                                >
                                    <Icon size={18} />
                                    <span>{item.name}</span>
                                </NavLink>
                            );
                        })}
                    </nav>

                    <div className="mt-6 rounded-2xl border border-[rgba(255,255,255,0.05)] bg-[rgba(255,255,255,0.04)] px-4 py-3">
                        <div className="flex items-center justify-between text-xs">
                            <span className="inline-flex items-center gap-2">
                                <span className="h-2 w-2 rounded-full bg-[var(--color-green-light)]" />
                                Issues Near You
                            </span>
                            <strong className="text-white">2</strong>
                        </div>
                        <div className="mt-2 flex items-center justify-between text-xs">
                            <span className="inline-flex items-center gap-2">
                                <span className="h-2 w-2 rounded-full bg-[var(--color-green-glow)]" />
                                Resolved Today
                            </span>
                            <strong className="text-white">0</strong>
                        </div>
                    </div>

                    <div className="my-6 h-px bg-[var(--color-sidebar-border)]" />

                    <p className="px-2 text-[10px] font-bold uppercase tracking-[0.3em] text-[rgba(200,221,208,0.55)]">Account</p>
                    <nav className="mt-3 space-y-1.5">
                        {accountItems.map((item) => {
                            const Icon = item.icon;
                            return (
                                <NavLink
                                    key={item.path}
                                    to={item.path}
                                    onClick={onClose}
                                    className={({ isActive }) =>
                                        `flex items-center gap-3 rounded-xl border-l-4 px-4 py-3 text-sm font-medium transition ${
                                            isActive
                                                ? 'border-[var(--color-green-light)] bg-[var(--color-sidebar-active)] text-white'
                                                : 'border-transparent hover:bg-[var(--color-sidebar-hover)] hover:text-white'
                                        }`
                                    }
                                >
                                    <Icon size={18} />
                                    <span>{item.name}</span>
                                </NavLink>
                            );
                        })}
                    </nav>
                </div>

                <div className="border-t border-[var(--color-sidebar-border)] bg-[rgba(255,255,255,0.03)] px-4 py-4">
                    <div className="rounded-2xl bg-[var(--color-sidebar-hover)] p-4">
                        <div className="flex items-center gap-3">
                            {user?.avatarUrl ? (
                                <img src={user.avatarUrl} alt={user.name} className="h-12 w-12 rounded-full object-cover" />
                            ) : (
                                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[rgba(255,255,255,0.08)] text-sm font-bold text-white">
                                    {initials}
                                </div>
                            )}
                            <div>
                                <p className="text-sm font-bold text-white">{user?.name || 'Citizen User'}</p>
                                <span className="mt-1 inline-flex rounded-full bg-[rgba(168,230,192,0.12)] px-2.5 py-1 text-[11px] font-medium text-[var(--color-green-glow)]">
                                    {user?.role === 'admin' ? 'Operations Admin' : 'Resident Reporter'}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </aside>
        </>
    );
};
