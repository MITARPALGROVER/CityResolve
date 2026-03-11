import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, AlertCircle, Map, Trophy, PlusCircle, Settings, LogOut, X } from 'lucide-react';

interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
    const navItems = [
        { name: 'Dashboard', path: '/dashboard', icon: <Home size={20} /> },
        { name: 'Report Issue', path: '/report', icon: <PlusCircle size={20} /> },
        { name: 'Open Issues', path: '/issues', icon: <AlertCircle size={20} /> },
        { name: 'Map View', path: '/map', icon: <Map size={20} /> },
        { name: 'Leaderboard', path: '/rewards', icon: <Trophy size={20} /> },
    ];

    const bottomItems = [
        { name: 'Settings', path: '/settings', icon: <Settings size={20} /> },
        { name: 'Logout', path: '/logout', icon: <LogOut size={20} /> },
    ];

    const sidebarClasses = `
    fixed inset-y-0 left-0 w-[260px] bg-surface/90 backdrop-blur-xl border-r border-primary-green/10
    transform transition-transform duration-300 z-40 ease-in-out flex flex-col pt-24 pb-6
    ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
  `;

    return (
        <>
            {/* Mobile overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-background/80 backdrop-blur-sm z-30 lg:hidden"
                    onClick={onClose}
                />
            )}

            <aside className={sidebarClasses}>
                <div className="px-4 flex justify-end lg:hidden mb-4">
                    <button onClick={onClose} className="p-2 text-text-muted hover:text-white rounded-full bg-white/5">
                        <X size={20} />
                    </button>
                </div>

                <div className="flex-1 px-3 space-y-1 overflow-y-auto custom-scrollbar">
                    <p className="px-4 text-xs font-semibold text-text-muted uppercase tracking-wider mb-4 mt-2">Menu</p>
                    {navItems.map((item) => (
                        <NavLink
                            key={item.name}
                            to={item.path}
                            onClick={onClose}
                            className={({ isActive }) => `
                flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200
                ${isActive
                                    ? 'bg-primary-green/10 text-white border-l-4 border-primary-green font-medium'
                                    : 'text-white/60 hover:text-white hover:bg-primary-green/5 border-l-4 border-transparent'}
              `}
                        >
                            {item.icon}
                            <span>{item.name}</span>
                        </NavLink>
                    ))}
                </div>

                <div className="px-3 mt-auto space-y-1">
                    <div className="h-px bg-white/5 mx-4 my-2" />
                    {bottomItems.map((item) => (
                        <NavLink
                            key={item.name}
                            to={item.path}
                            className="flex items-center gap-3 px-4 py-3 rounded-xl text-white/50 hover:text-white hover:bg-white/5 transition-colors duration-200"
                        >
                            {item.icon}
                            <span>{item.name}</span>
                        </NavLink>
                    ))}
                </div>
            </aside>
        </>
    );
};
