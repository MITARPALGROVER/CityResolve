import React from 'react';

export type IssueStatus = 'pending' | 'inprogress' | 'resolved' | 'rejected';

interface StatusBadgeProps {
  status: IssueStatus;
  className?: string;
  showIcon?: boolean;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className = '', showIcon = true }) => {
  const config = {
    pending: { color: 'text-orange-900', bg: 'bg-pastel-orange', label: 'Pending', icon: '🟡' },
    inprogress: { color: 'text-blue-900', bg: 'bg-pastel-blue', label: 'In Progress', icon: '🔵' },
    resolved: { color: 'text-primary-dark', bg: 'bg-pastel-green', label: 'Resolved', icon: '🟢' },
    rejected: { color: 'text-red-900', bg: 'bg-red-100', label: 'Rejected', icon: '🔴' }
  };

  const { color, bg, label, icon } = config[status];

  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold shadow-sm ${bg} ${color} ${className}`}>
      {showIcon && <span>{icon}</span>}
      {label}
    </span>
  );
};
