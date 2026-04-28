import React from 'react';
import { Bell, X } from 'lucide-react';
import { IssueStatus } from '../ui/StatusBadge';

interface Notification {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  read: boolean;
  type: IssueStatus | 'info';
}

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: Notification[];
  onNotificationClick?: (id: string) => void;
  onMarkAllRead?: () => void;
}

export const NotificationDrawer: React.FC<NotificationDrawerProps> = ({ isOpen, onClose, notifications, onNotificationClick, onMarkAllRead }) => {
  const unread = notifications.filter((notification) => !notification.read).length;

  const getColor = (type: Notification['type']) => {
    switch (type) {
      case 'resolved':
        return 'bg-[var(--color-resolved)]';
      case 'pending':
        return 'bg-[var(--color-pending)]';
      case 'inprogress':
        return 'bg-[var(--color-in-progress)]';
      default:
        return 'bg-[var(--color-green-primary)]';
    }
  };

  return (
    <>
      {isOpen && <button className="fixed inset-0 z-50 bg-black/20 backdrop-blur-sm" onClick={onClose} aria-label="Close notifications overlay" />}

      <aside
        className={`fixed inset-y-0 right-0 z-[60] flex w-full max-w-[400px] flex-col border-l border-black/5 bg-[rgba(255,255,255,0.94)] backdrop-blur-2xl transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="border-b border-black/5 px-6 py-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xl font-bold">Notifications</p>
              <p className="mt-1 text-sm text-[var(--color-text-muted)]">{unread} unread updates from your city feed</p>
            </div>
            <button onClick={onClose} className="rounded-full p-2 text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-card-alt)]" aria-label="Close notifications">
              <X size={18} />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-3 py-3">
          {notifications.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center text-[var(--color-text-muted)]">
              <Bell size={42} className="mb-3 opacity-30" />
              <p className="font-medium">You&apos;re all caught up.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {notifications.map((notification) => (
                <button
                  key={notification.id}
                  onClick={() => onNotificationClick?.(notification.id)}
                  className={`w-full rounded-2xl border px-4 py-4 text-left transition ${
                    notification.read
                      ? 'border-transparent bg-white text-[var(--color-text-secondary)]'
                      : 'border-[rgba(45,122,79,0.12)] bg-[var(--color-green-pale)] text-[var(--color-text-primary)]'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <span className={`mt-1 h-2.5 w-2.5 rounded-full ${getColor(notification.type)}`} />
                    <div className="min-w-0">
                      <p className={`text-sm ${notification.read ? 'font-medium' : 'font-bold'}`}>{notification.title}</p>
                      <p className="mt-1 text-xs leading-5 text-[var(--color-text-secondary)]">{notification.description}</p>
                      <p className="mt-2 text-[11px] uppercase tracking-[0.18em] text-[var(--color-text-muted)]">{notification.timestamp}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {notifications.length > 0 && (
          <div className="border-t border-black/5 px-6 py-4">
            <button onClick={onMarkAllRead} className="secondary-button w-full px-4 py-3 text-sm font-semibold">
              Mark all as read
            </button>
          </div>
        )}
      </aside>
    </>
  );
};
