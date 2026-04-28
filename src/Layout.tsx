import React, { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { NotificationDrawer } from './components/layout/NotificationDrawer';
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
                // keep empty state
            }
        }
        load();
        return () => {
            cancelled = true;
        };
    }, []);

    const unreadCount = notifications.filter((notification) => !notification.read).length;

    async function onNotificationClick(id: string) {
        const notification = notifications.find((item) => item._id === id);
        if (!notification || notification.read) return;
        try {
            await apiMarkNotificationRead(id);
            setNotifications((prev) => prev.map((item) => (item._id === id ? { ...item, read: true } : item)));
        } catch {
            // ignore optimistic failure
        }
    }

    async function onMarkAllRead() {
        const unread = notifications.filter((notification) => !notification.read);
        if (unread.length === 0) return;
        await Promise.allSettled(unread.map((notification) => apiMarkNotificationRead(notification._id)));
        setNotifications((prev) => prev.map((notification) => ({ ...notification, read: true })));
    }

    return (
        <div className="page-shell min-h-screen">
            <Navbar
                onMenuClick={() => setSidebarOpen(true)}
                onNotificationClick={() => setDrawerOpen(true)}
                unreadCount={unreadCount}
                onProfileClick={() => navigate('/settings')}
            />

            <div className="flex pt-16">
                <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

                <main className="min-h-[calc(100vh-64px)] flex-1 lg:ml-[240px]">
                    <div className="mx-auto max-w-[1500px] px-4 py-5 md:px-6 lg:px-8">
                        <div className="animate-page-fade">
                            <Outlet />
                        </div>
                    </div>
                </main>
            </div>

            <NotificationDrawer
                isOpen={drawerOpen}
                onClose={() => setDrawerOpen(false)}
                notifications={notifications.map((notification) => ({
                    id: notification._id,
                    title: notification.title,
                    description: notification.description,
                    timestamp: timeAgo(notification.createdAt),
                    read: notification.read,
                    type: notification.type === 'resolved' ? 'resolved' : 'info',
                }))}
                onNotificationClick={onNotificationClick}
                onMarkAllRead={onMarkAllRead}
            />
        </div>
    );
};
