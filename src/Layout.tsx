import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { NotificationDrawer } from './components/layout/NotificationDrawer';
import { useNavigate } from 'react-router-dom';
import { apiListNotifications, apiMarkNotificationRead, Notification } from './lib/api';
import { timeAgo } from './lib/time';

export const Layout: React.FC = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const navigate = useNavigate();

    React.useEffect(() => {
        let cancelled = false;
        async function load() {
            try {
                const res = await apiListNotifications();
                if (!cancelled) setNotifications(res.notifications);
            } catch {
                // ignore; drawer will show empty state
            }
        }
        load();
        return () => {
            cancelled = true;
        };
    }, []);

    const unreadCount = notifications.filter(n => !n.read).length;

    async function onNotificationClick(id: string) {
        const n = notifications.find(x => x._id === id);
        if (n && !n.read) {
            try {
                await apiMarkNotificationRead(id);
                setNotifications(prev => prev.map(x => x._id === id ? { ...x, read: true } : x));
            } catch {
                // ignore
            }
        }
    }

    async function onMarkAllRead() {
        const unread = notifications.filter(n => !n.read);
        if (unread.length === 0) return;
        await Promise.allSettled(unread.map(n => apiMarkNotificationRead(n._id)));
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    }

    return (
        <div className="min-h-screen flex flex-col relative">
            <Navbar
                onMenuClick={() => setSidebarOpen(true)}
                onNotificationClick={() => setDrawerOpen(true)}
                unreadCount={unreadCount}
                onProfileClick={() => navigate('/settings')}
            />

            <div className="flex flex-1 pt-[60px]">
                <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

                <main className="flex-1 w-full lg:ml-[260px] min-h-[calc(100vh-60px)] transition-all duration-300">
                    {/* Background Elements */}
                    <div className="fixed inset-0 bg-background -z-10" />

                    <div className="relative z-10 p-4 md:p-6 lg:px-8 lg:pt-2 lg:pb-8 max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <Outlet />
                    </div>
                </main>
            </div>

            <NotificationDrawer
                isOpen={drawerOpen}
                onClose={() => setDrawerOpen(false)}
                notifications={notifications.map(n => ({
                    id: n._id,
                    title: n.title,
                    description: n.description,
                    timestamp: timeAgo(n.createdAt),
                    read: n.read,
                    type: (n.type === 'resolved' ? 'resolved' : 'info'),
                }))}
                onNotificationClick={onNotificationClick}
                onMarkAllRead={onMarkAllRead}
            />
        </div>
    );
};
