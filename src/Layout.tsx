import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { NotificationDrawer } from './components/layout/NotificationDrawer';

// Mock notifications
const MOCK_NOTIFS = [
    { id: '1', title: 'Issue Resolved', description: 'Your report "Pothole on Main St" has been fixed.', timestamp: '2 hours ago', read: false, type: 'resolved' as const },
    { id: '2', title: 'New Level! 🏆', description: 'You reached Level 5. Keep it up!', timestamp: '1 day ago', read: true, type: 'info' as const },
];

export const Layout: React.FC = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [drawerOpen, setDrawerOpen] = useState(false);

    return (
        <div className="min-h-screen flex flex-col relative">
            <Navbar
                onMenuClick={() => setSidebarOpen(true)}
                onNotificationClick={() => setDrawerOpen(true)}
            />

            <div className="flex flex-1 pt-[72px]">
                <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

                <main className="flex-1 w-full lg:ml-[260px] min-h-[calc(100vh-72px)] transition-all duration-300">
                    {/* Animated Orbs Background */}
                    <div className="fixed top-20 left-10 w-96 h-96 bg-primary-green/10 rounded-full blur-[100px] animate-float pointer-events-none" />
                    <div className="fixed bottom-20 right-10 w-80 h-80 bg-accent-teal/10 rounded-full blur-[120px] animate-float-delayed pointer-events-none" />
                    <div className="bg-grid"></div>

                    <div className="relative z-10 p-4 md:p-6 lg:p-8 max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <Outlet />
                    </div>
                </main>
            </div>

            <NotificationDrawer
                isOpen={drawerOpen}
                onClose={() => setDrawerOpen(false)}
                notifications={MOCK_NOTIFS}
            />
        </div>
    );
};
