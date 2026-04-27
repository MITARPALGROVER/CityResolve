import React from 'react';
import { GlassCard } from '../components/ui/GlassCard';
import { useAuth } from '../auth/AuthContext';
import { Shield, User } from 'lucide-react';

export const Settings: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-6 pb-10">
      <header>
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Settings</h1>
        <p className="text-text-muted text-sm mt-1">Account and access information.</p>
      </header>

      <GlassCard elevated className="p-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-primary-green/15 border border-primary-green/30 flex items-center justify-center">
            <User size={18} className="text-primary-green" />
          </div>
          <div className="flex-1">
            <p className="text-sm text-text-muted">Signed in as</p>
            <p className="text-lg font-bold text-gray-900">{user?.name}</p>
            <p className="text-sm text-text-muted">{user?.email}</p>
          </div>
        </div>

        <div className="h-px bg-gray-100 my-6" />

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gray-50 border border-gray-200 flex items-center justify-center">
            <Shield size={16} className="text-text-muted" />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900">Role</p>
            <p className="text-sm text-text-muted">{user?.role === 'admin' ? 'Admin (City Staff)' : 'Citizen'}</p>
          </div>
        </div>
      </GlassCard>
    </div>
  );
};
