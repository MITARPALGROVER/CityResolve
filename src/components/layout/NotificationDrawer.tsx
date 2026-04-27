import React from 'react';
import { X, Bell } from 'lucide-react';
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


  const getColor = (type: Notification['type']) => {
    switch (type) {
      case 'resolved': return 'bg-status-resolved';
      case 'rejected': return 'bg-status-rejected';
      case 'pending': return 'bg-status-pending';
      case 'inprogress': return 'bg-status-progress';
      default: return 'bg-primary-green';
    }
  };

  return (
    <>
      {isOpen && (
         <div className="fixed inset-0 bg-gray-900/20 backdrop-blur-sm z-50 transition-opacity" onClick={onClose} />
      )}
      
      <div 
        className={`fixed inset-y-0 right-0 w-full sm:w-[380px] bg-white/95 backdrop-blur-[32px] border-l border-gray-200 z-50 shadow-2xl transform transition-transform duration-350 ease-[cubic-bezier(0.175,0.885,0.32,1.275)] flex flex-col
          ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div>
            <h2 className="text-xl font-bold text-text-primary">Notifications</h2>
            <p className="text-sm text-text-muted mt-1">You have {notifications.filter(n => !n.read).length} unread messages</p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 text-text-muted hover:text-gray-900 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-2">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center p-6 text-text-muted">
              <Bell size={48} className="mb-4 opacity-20" />
              <p>You're all caught up!</p>
            </div>
          ) : (
            <div className="space-y-2">
              {notifications.map((notif) => (
                <div 
                  key={notif.id}
                  onClick={() => onNotificationClick?.(notif.id)}
                  className={`relative p-4 rounded-xl transition-colors hover:bg-gray-50 flex gap-4 cursor-pointer
                    ${!notif.read ? 'bg-primary-light/30' : 'opacity-80'}
                  `}
                >
                  {/* Unread indicator */}
                  {!notif.read && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-primary-green rounded-r-full" />
                  )}
                  
                  <div className="flex-shrink-0 mt-1">
                    <div className={`w-2.5 h-2.5 rounded-full ${getColor(notif.type)} shadow-[0_0_10px_currentColor] opacity-80`} />
                  </div>
                  
                  <div className="flex-1">
                    <h4 className={`text-sm ${!notif.read ? 'text-gray-900 font-bold' : 'text-text-secondary font-medium'}`}>
                      {notif.title}
                    </h4>
                    <p className="text-xs text-text-muted mt-1 leading-relaxed">
                      {notif.description}
                    </p>
                    <p className="text-[10px] text-text-muted/60 mt-2 font-mono uppercase tracking-wider">
                      {notif.timestamp}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* Footer */}
        {notifications.length > 0 && (
          <div className="p-4 border-t border-gray-100">
            <button
              onClick={onMarkAllRead}
              className="w-full text-sm font-medium text-primary-dark hover:text-primary-green transition-colors py-2"
            >
              Mark all as read
            </button>
          </div>
        )}
      </div>
    </>
  );
};
