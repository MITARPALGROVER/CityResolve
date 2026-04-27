import React, { useState, useEffect } from 'react';
import { Bell, User, Menu } from 'lucide-react';

interface NavbarProps {
    onMenuClick?: () => void;
    onNotificationClick?: () => void;
    unreadCount?: number;
    onProfileClick?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onMenuClick, onNotificationClick, unreadCount = 0, onProfileClick }) => {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 10);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled
                ? 'bg-surface/90 backdrop-blur-md border-b border-gray-200 py-3 shadow-sm'
                : 'bg-background py-3'
            }`}>
            <div className="container mx-auto px-4 md:px-6 flex items-center justify-between">

                {/* Logo area */}
                <div className="flex items-center gap-3">
                    <button className="lg:hidden text-text-primary p-1" onClick={onMenuClick}>
                        <Menu size={24} />
                    </button>

                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-primary-light flex items-center justify-center">
                                <span className="text-primary-green font-bold text-lg">🌿</span>
                        </div>
                        <span className="text-xl font-bold tracking-tight text-text-primary hidden sm:block">
                            City<span className="text-primary-green">Resolve</span>
                        </span>
                    </div>
                </div>



                {/* Right side actions */}
                <div className="flex items-center gap-4">
                    <button
                        onClick={onNotificationClick}
                        className="relative p-2 rounded-full bg-gray-100 border border-gray-200 hover:bg-gray-200 transition-colors"
                    >
                        <Bell size={20} className="text-text-secondary" />
                        {unreadCount > 0 && (
                            <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-status-rejected rounded-full border-2 border-surface animate-pulse" />
                        )}
                    </button>

                    <button
                        onClick={onProfileClick}
                        className="w-10 h-10 rounded-full bg-surface border border-gray-200 hover:border-primary-green transition-colors overflow-hidden flex items-center justify-center relative group"
                    >
                        <User size={20} className="text-text-secondary group-hover:text-primary-green transition-colors" />
                        {/* If we had an avatar image: <img src="..." className="w-full h-full object-cover" /> */}
                    </button>
                </div>

            </div>
        </nav>
    );
};
