import React, { HTMLAttributes } from 'react';

interface PremiumGlassCardProps extends HTMLAttributes<HTMLDivElement> {
  elevated?: boolean;
  hoverEffect?: boolean;
  children: React.ReactNode;
  variant?: 'default' | 'subtle' | 'strong';
}

export const PremiumGlassCard: React.FC<PremiumGlassCardProps> = ({
  elevated = false,
  hoverEffect = false,
  variant = 'default',
  className = '',
  children,
  ...props
}) => {
  const baseClasses = 'backdrop-blur-md border transition-all duration-300';

  const variantClasses = {
    default: 'bg-glass-surface border-glass-border',
    subtle: 'bg-white/60 border-white/40',
    strong: 'bg-white/80 border-white/60',
  };

  const shadowClasses = elevated
    ? 'shadow-glass-lg'
    : 'shadow-glass-sm';

  const hoverClasses = hoverEffect
    ? 'hover:shadow-glass-lg hover:-translate-y-1 hover:bg-white/85'
    : '';

  return (
    <div
      className={`${baseClasses} ${variantClasses[variant]} ${shadowClasses} ${hoverClasses} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};