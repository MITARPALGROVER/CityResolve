import React from 'react';

export type IssueStatus = 'pending' | 'inprogress' | 'resolved' | 'rejected';

interface StatusBadgeProps {
  status: IssueStatus;
  className?: string;
  showIcon?: boolean;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className = '', showIcon = true }) => {
  const config = {
    pending: { color: 'text-status-pending', bg: 'bg-status-pending/10', border: 'border-status-pending/20', label: 'Pending', icon: '🟡' },
    inprogress: { color: 'text-status-progress', bg: 'bg-status-progress/10', border: 'border-status-progress/20', label: 'In Progress', icon: '🔵' },
    resolved: { color: 'text-status-resolved', bg: 'bg-status-resolved/10', border: 'border-status-resolved/20', label: 'Resolved', icon: '🟢' },
    rejected: { color: 'text-status-rejected', bg: 'bg-status-rejected/10', border: 'border-status-rejected/20', label: 'Rejected', icon: '🔴' }
  };

  const { color, bg, border, label, icon } = config[status];

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${bg} ${color} ${border} ${className}`}>
      {showIcon && <span>{icon}</span>}
      {label}
    </span>
  );
};
