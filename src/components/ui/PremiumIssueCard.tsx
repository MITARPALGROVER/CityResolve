import React from 'react';
import { MapPin, Clock, MessageSquare, ThumbsUp } from 'lucide-react';
import { PremiumStatusBadge } from './PremiumStatusBadge';

interface PremiumIssueCardProps {
  id: string;
  title: string;
  description: string;
  category: {
    icon: React.ReactNode;
    name: string;
    color: string;
  };
  location: string;
  timeAgo: string;
  status: 'pending' | 'in_progress' | 'resolved' | 'rejected';
  upvotes: number;
  comments: number;
  className?: string;
}

export const PremiumIssueCard: React.FC<PremiumIssueCardProps> = ({
  title,
  description,
  category,
  location,
  timeAgo,
  status,
  upvotes,
  comments,
  className = '',
}) => {
  return (
    <div
      className={`
        group relative overflow-hidden rounded-2xl
        bg-white/70 backdrop-blur-md border border-white/50
        shadow-glass-sm hover:shadow-glass-lg
        transition-all duration-300 hover:-translate-y-1
        ${className}
      `}
    >
      {/* Decorative gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/50 via-transparent to-teal-50/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <div className="relative p-6 space-y-4">
        {/* Header */}
        <div className="flex items-start gap-4">
          <div className={`
            w-14 h-14 rounded-2xl flex items-center justify-center
            bg-white shadow-sm border border-white/50
            group-hover:scale-110 transition-transform duration-300
          `}>
            <div className={category.color}>{category.icon}</div>
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-bold text-neutral-900 mb-1 line-clamp-1 group-hover:text-primary-emerald-700 transition-colors">
              {title}
            </h3>
            <div className="flex items-center gap-2 text-sm text-neutral-500">
              <MapPin size={14} className="flex-shrink-0" />
              <span className="truncate">{location}</span>
            </div>
          </div>
        </div>

        {/* Description */}
        <p className="text-sm text-neutral-600 leading-relaxed line-clamp-2">
          {description}
        </p>

        {/* Footer */}
        <div className="flex items-center justify-between pt-2">
          <PremiumStatusBadge status={status} size="sm" />

          <div className="flex items-center gap-4 text-xs text-neutral-500">
            <div className="flex items-center gap-1.5">
              <Clock size={14} />
              <span>{timeAgo}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <ThumbsUp size={14} />
              <span>{upvotes}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <MessageSquare size={14} />
              <span>{comments}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Hover effect border */}
      <div className="absolute inset-0 rounded-2xl border-2 border-primary-emerald-200 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
    </div>
  );
};