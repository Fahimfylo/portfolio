import React from 'react';

export type GlassVariant = 'light' | 'dark' | 'elevated' | 'ghost-panel' | 'circle';

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: GlassVariant;
  children?: React.ReactNode;
  className?: string;
  onClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
}

export const GlassCard: React.FC<GlassCardProps> = ({
  variant = 'light',
  children,
  className = '',
  onClick,
  ...props
}) => {
  const variantClasses: Record<GlassVariant, string> = {
    light: 'glass-light',
    dark: 'glass-dark',
    elevated: 'glass-elevated',
    'ghost-panel': 'glass-ghost',
    circle: 'glass-circle',
  };

  return (
    <div
      className={`${variantClasses[variant]} ${onClick ? 'cursor-pointer' : ''} ${className}`}
      onClick={onClick}
      {...props}
    >
      {children}
    </div>
  );
};
