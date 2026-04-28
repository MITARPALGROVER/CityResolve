import React from 'react';

interface PremiumStatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  color?: 'emerald' | 'teal' | 'blue' | 'purple' | 'amber';
  className?: string;
}

export const PremiumStatCard: React.FC<PremiumStatCardProps> = ({
  title,
  value,
  icon,
  trend,
  color = 'emerald',
  className = '',
}) => {
  const colorConfig = {
    emerald: {
      bg: 'bg-emerald-50',
      iconBg: 'bg-emerald-100',
      iconColor: 'text-emerald-600',
      valueColor: 'text-emerald-700',
      trendColor: 'text-emerald-600',
    },
    teal: {
      bg: 'bg-teal-50',
      iconBg: 'bg-teal-100',
      iconColor: 'text-teal-600',
      valueColor: 'text-teal-700',
      trendColor: 'text-teal-600',
    },
    blue: {
      bg: 'bg-blue-50',
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600',
      valueColor: 'text-blue-700',
      trendColor: 'text-blue-600',
    },
    purple: {
      bg: 'bg-purple-50',
      iconBg: 'bg-purple-100',
      iconColor: 'text-purple-600',
      valueColor: 'text-purple-700',
      trendColor: 'text-purple-600',
    },
    amber: {
      bg: 'bg-amber-50',
      iconBg: 'bg-amber-100',
      iconColor: 'text-amber-600',
      valueColor: 'text-amber-700',
      trendColor: 'text-amber-600',
    },
  };

  const config = colorConfig[color];

  return (
    <div
      className={`
        relative overflow-hidden rounded-2xl border border-white/50
        bg-white/70 backdrop-blur-md shadow-glass-sm
        hover:shadow-glass-md hover:-translate-y-1
        transition-all duration-300
        ${config.bg} ${className}
      `}
    >
      {/* Decorative background element */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-white/50 to-transparent rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />

      <div className="relative p-6">
        <div className="flex items-start justify-between mb-4">
          <div className={`
            w-14 h-14 rounded-2xl ${config.iconBg}
            flex items-center justify-center shadow-sm
          `}>
            <div className={config.iconColor}>{icon}</div>
          </div>

          {trend && (
            <div className={`
              flex items-center gap-1 px-2.5 py-1 rounded-full
              ${trend.isPositive ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}
              text-xs font-semibold
            `}>
              {trend.isPositive ? '↑' : '↓'}
              {Math.abs(trend.value)}%
            </div>
          )}
        </div>

        <div className="space-y-1">
          <p className="text-sm font-medium text-neutral-600">{title}</p>
          <p className={`text-3xl font-bold ${config.valueColor}`}>
            {typeof value === 'number' ? value.toLocaleString() : value}
          </p>
        </div>
      </div>
    </div>
  );
};