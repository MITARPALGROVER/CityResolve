import React, { HTMLAttributes } from 'react';

interface GlassCardProps extends HTMLAttributes<HTMLDivElement> {
    elevated?: boolean;
    hoverEffect?: boolean;
    children: React.ReactNode;
}

export const GlassCard: React.FC<GlassCardProps> = ({
    elevated = false,
    hoverEffect = false,
    className = '',
    children,
    ...props
}) => {
    const baseClass = elevated ? 'glass-card-elevated' : 'glass-card';
    const hoverClass = hoverEffect ? 'glass-hover' : '';

    return (
        <div className={`${baseClass} ${hoverClass} ${className}`} {...props}>
            {children}
        </div>
    );
};
