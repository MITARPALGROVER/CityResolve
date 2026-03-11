import React from 'react';
import { GlassCard } from '../ui/GlassCard';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface StatCardProps {
    title: string;
    value: string | number;
    icon: React.ReactNode;
    iconBgColor: string;
    trend?: {
        value: number; // percentage
        isPositive: boolean;
    };
}

export const StatCard: React.FC<StatCardProps> = ({ title, value, icon, iconBgColor, trend }) => {
    return (
        <GlassCard hoverEffect className="p-6 relative group">
            <div className="flex items-start justify-between">
                <div className="space-y-4">
                    <p className="text-sm font-medium text-text-muted">{title}</p>
                    <div className="flex items-end gap-3">
                        <h4 className="text-4xl font-bold text-text-primary tracking-tight">{value}</h4>
                        {trend && (
                            <div className={`flex items-center gap-1 text-sm pb-1 font-medium ${trend.isPositive ? 'text-primary-green' : 'text-status-rejected'}`}>
                                {trend.isPositive ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                                <span>{trend.value}%</span>
                            </div>
                        )}
                        {!trend && (
                            <div className="flex items-center gap-1 text-sm pb-1 font-medium text-text-muted">
                                <Minus size={14} />
                                <span>0%</span>
                            </div>
                        )}
                    </div>
                </div>
                <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white ${iconBgColor} shadow-lg shadow-black/20 group-hover:scale-110 transition-transform`}>
                    {icon}
                </div>
            </div>

            {/* Decorative gradient blur that appears on hover */}
            <div className="absolute inset-0 bg-primary-green/5 blur-xl rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
        </GlassCard>
    );
};
