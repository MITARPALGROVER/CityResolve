import React from 'react';
import { IssueStatus } from '../ui/StatusBadge';
import { MapPin } from 'lucide-react';

interface IssueCardProps {
  id: string;
  title: string;
  category: { icon: React.ReactNode; bg: string; color: string };
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
  description,
  status,
}) => {
  return (
    <div className="bg-white rounded-[24px] p-6 shadow-sm border border-gray-100 flex flex-col gap-4 hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="w-[56px] h-[56px] rounded-2xl flex items-center justify-center bg-[#A7F3D0] text-[#059669] flex-shrink-0">
          {category.icon}
        </div>
        <div className="flex flex-col min-w-0">
          <h3 className="font-bold text-gray-900 text-lg leading-tight mb-1 truncate">{title}</h3>
          <div className="flex items-center gap-1.5 text-[13px] text-gray-500 font-medium truncate tracking-wide">
            <MapPin size={14} className="text-gray-400 flex-shrink-0" />
            <span className="truncate">{location}</span>
          </div>
        </div>
      </div>

      {/* Body */}
      <p className="text-[15px] text-gray-800 leading-relaxed font-medium line-clamp-2">
        {description}
      </p>

      {/* Footer */}
      <div className="flex items-center mt-2">
        <span className="px-3 py-1.5 bg-[#A7F3D0] text-[#064E3B] text-[13px] font-bold rounded-lg tracking-wide">
          Status: {status === 'pending' ? 'Pending' : status === 'inprogress' ? 'In Progress' : status === 'resolved' ? 'Resolved' : status}
        </span>
      </div>
    </div>
  );
};
