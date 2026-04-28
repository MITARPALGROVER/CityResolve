import React, { ButtonHTMLAttributes } from 'react';

interface PremiumButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  children: React.ReactNode;
}

export const PremiumButton: React.FC<PremiumButtonProps> = ({
  variant = 'primary',
  size = 'md',
  loading = false,
  children,
  className = '',
  disabled,
  ...props
}) => {
  const baseClasses = 'font-semibold rounded-xl transition-all duration-300 relative overflow-hidden';

  const sizeClasses = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  };

  const variantClasses = {
    primary: `
      bg-gradient-to-r from-primary-emerald-500 to-primary-teal-500
      text-white shadow-brand-soft
      hover:shadow-brand-medium hover:-translate-y-0.5
      active:translate-y-0 active:shadow-brand-soft
      disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none
    `,
    secondary: `
      bg-white/80 text-primary-emerald-700 border border-primary-emerald-200
      hover:bg-white hover:border-primary-emerald-300 hover:shadow-glass-sm
      active:translate-y-0
      disabled:opacity-50 disabled:cursor-not-allowed
    `,
    ghost: `
      bg-transparent text-primary-emerald-600
      hover:bg-primary-emerald-50
      active:bg-primary-emerald-100
      disabled:opacity-50 disabled:cursor-not-allowed
    `,
    outline: `
      bg-transparent text-primary-emerald-600 border-2 border-primary-emerald-300
      hover:bg-primary-emerald-50 hover:border-primary-emerald-400
      active:bg-primary-emerald-100
      disabled:opacity-50 disabled:cursor-not-allowed
    `,
  };

  return (
    <button
      className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <svg
          className="animate-spin -ml-1 mr-2 h-4 w-4"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      )}
      {children}
    </button>
  );
};