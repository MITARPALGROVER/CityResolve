import React, { InputHTMLAttributes, forwardRef } from 'react';

interface PremiumInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  icon?: React.ReactNode;
}

export const PremiumInput = forwardRef<HTMLInputElement, PremiumInputProps>(
  ({ label, error, helperText, icon, className = '', ...props }, ref) => {
    const baseInputClasses = `
      w-full px-4 py-3 rounded-xl border
      bg-white/80 backdrop-blur-sm
      transition-all duration-200
      focus:outline-none focus:ring-2 focus:ring-primary-emerald-500/20
      placeholder:text-neutral-400
    `;

    const stateClasses = error
      ? 'border-red-300 focus:border-red-500 text-red-900'
      : 'border-neutral-200 focus:border-primary-emerald-400 text-neutral-900';

    const iconClasses = icon ? 'pl-11' : '';

    return (
      <div className="space-y-1.5">
        {label && (
          <label className="block text-sm font-medium text-neutral-700">
            {label}
          </label>
        )}

        <div className="relative">
          {icon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400">
              {icon}
            </div>
          )}

          <input
            ref={ref}
            className={`${baseInputClasses} ${stateClasses} ${iconClasses} ${className}`}
            {...props}
          />
        </div>

        {error && (
          <p className="text-sm text-red-600 flex items-center gap-1">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            {error}
          </p>
        )}

        {helperText && !error && (
          <p className="text-sm text-neutral-500">{helperText}</p>
        )}
      </div>
    );
  }
);

PremiumInput.displayName = 'PremiumInput';