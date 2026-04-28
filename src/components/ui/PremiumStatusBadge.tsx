import React from 'react';

interface PremiumStatusBadgeProps {
  status: 'pending' | 'in_progress' | 'resolved' | 'rejected';
  size?: 'sm' | 'md' | 'lg';
  showDot?: boolean;
  className?: string;
}

export const PremiumStatusBadge: React.FC<PremiumStatusBadgeProps> = ({
  status,
  size = 'md',
  showDot = true,
  className = '',
}) => {
  const statusConfig = {
    pending: {
      label: 'Pending',
      background: 'bg-amber-50',
      color: 'text-amber-700',
      border: 'border-amber-200',
      dot: 'bg-amber-500',
    },
    in_progress: {
      label: 'In Progress',
      background: 'bg-blue-50',
      color: 'text-blue-700',
      border: 'border-blue-200',
      dot: 'bg-blue-500',
    },
    resolved: {
      label: 'Resolved',
      background: 'bg-emerald-50',
      color: 'text-emerald-700',
      border: 'border-emerald-200',
      dot: 'bg-emerald-500',
    },
    rejected: {
      label: 'Rejected',
      background: 'bg-red-50',
      color: 'text-red-700',
      border: 'border-red-200',
      dot: 'bg-red-500',
    },
  };

  const config = statusConfig[status];

  const sizeClasses = {
    sm: 'px-2.5 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
    lg: 'px-4 py-2 text-base',
  };

  const dotSizeClasses = {
    sm: 'w-1.5 h-1.5',
    md: 'w-2 h-2',
    lg: 'w-2.5 h-2.5',
  };

  return (
    <div
      className={`
        inline-flex items-center gap-2 rounded-full border
        ${config.background} ${config.color} ${config.border}
        ${sizeClasses[size]} ${className}
      `}
    >
      {showDot && (
        <span className={`rounded-full ${config.dot} ${dotSizeClasses[size]} animate-pulse`} />
      )}
      <span className="font-medium">{config.label}</span>
    </div>
  );
};