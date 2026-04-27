import React from 'react';
import { ArrowUpRight } from 'lucide-react';

interface StatCardProps {
    title: string;
    value: string | number;
    icon: React.ReactNode;
    bgClass: string;
    iconBgClass?: string;
    trend?: {
        value: number; // percentage
        isPositive: boolean;
    };
}

export const StatCard: React.FC<StatCardProps> = ({ title, value, icon, bgClass, iconBgClass, trend }) => {
    return (
        <div className={`p-6 rounded-[24px] transition-all duration-300 hover:-translate-y-1 hover:shadow-md flex items-center gap-5 ${bgClass}`}>
            <div className={`w-[60px] h-[60px] rounded-[18px] flex items-center justify-center flex-shrink-0 text-white shadow-sm ${iconBgClass || 'bg-white/40'}`}>
                {icon}
            </div>
            <div className="flex flex-col flex-1">
                <h4 className="text-[32px] font-bold tracking-tight text-gray-900 leading-none mb-1">{value}</h4>
                <p className="text-[15px] font-medium text-gray-700 leading-tight w-24">{title}</p>
                {trend && (
                    <div className="flex items-center gap-2 mt-3">
                        <svg width="48" height="12" viewBox="0 0 48 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M2 10C5.5 10 7.5 4 12 4C16.5 4 19.5 8 24 8C28.5 8 32 2 37 2C42 2 44.5 6 46 6" stroke={trend.isPositive ? "#10B981" : "#F59E0B"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        <div className={`flex items-center gap-0.5 text-xs font-bold ${trend.isPositive ? 'text-green-600' : 'text-orange-500'}`}>
                           <ArrowUpRight size={14} strokeWidth={3} />
                           {trend.value}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
