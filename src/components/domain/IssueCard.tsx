import React from 'react';
import { GlassCard } from '../ui/GlassCard';
import { StatusBadge, IssueStatus } from '../ui/StatusBadge';
import { MoreHorizontal, MapPin, ThumbsUp, MessageCircle, ArrowRight } from 'lucide-react';

interface IssueCardProps {
  id: string;
  title: string;
  category: { icon: string; bg: string; color: string };
  location: string;
  timeAgo: string;
  description: string;
  status: IssueStatus;
  upvotes: number;
  comments: number;
}

export const IssueCard: React.FC<IssueCardProps> = ({
  title,
  category,
  location,
  timeAgo,
  description,
  status,
  upvotes,
  comments,
}) => {
  return (
    <GlassCard hoverEffect className="p-5 flex flex-col gap-4">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${category.bg} ${category.color} border border-white/10`}>
            {category.icon}
          </div>
          <div>
            <h3 className="font-semibold text-text-primary text-base line-clamp-1">{title}</h3>
            <div className="flex items-center gap-1.5 text-xs text-text-muted mt-0.5">
              <MapPin size={12} />
              <span>{location}</span>
              <span>&middot;</span>
              <span>{timeAgo}</span>
            </div>
          </div>
        </div>
        <button className="text-text-muted hover:text-text-primary p-1 rounded-full hover:bg-white/5 transition-colors">
          <MoreHorizontal size={18} />
        </button>
      </div>

      <div className="h-px w-full bg-white/5"></div>

      {/* Body */}
      <div className="text-sm text-text-secondary line-clamp-2">
        "{description}"
      </div>

      <div className="h-px w-full bg-white/5"></div>

      {/* Footer */}
      <div className="flex justify-between items-center">
        <StatusBadge status={status} />

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3 text-sm text-text-muted">
            <button className="flex items-center gap-1 hover:text-primary-green transition-colors">
              <ThumbsUp size={14} />
              <span>{upvotes}</span>
            </button>
            <button className="flex items-center gap-1 hover:text-accent-teal transition-colors">
              <MessageCircle size={14} />
              <span>{comments}</span>
            </button>
          </div>

          <button className="flex items-center gap-1 text-sm font-medium text-text-secondary hover:text-background hover:bg-primary-green px-3 py-1.5 rounded-lg border border-white/10 hover:border-transparent transition-all">
            View <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </GlassCard>
  );
};
