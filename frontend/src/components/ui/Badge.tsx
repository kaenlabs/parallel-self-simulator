import React from 'react';
import { cn } from '@/lib/utils/cn';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'success' | 'danger' | 'warning' | 'info';
}

export function Badge({ children, variant = 'default', className, ...props }: BadgeProps) {
  const variantStyles = {
    default: 'bg-gray-100 text-gray-800',
    success: 'bg-success-50 text-success-700',
    danger: 'bg-danger-50 text-danger-700',
    warning: 'bg-warning-50 text-warning-700',
    info: 'bg-blue-50 text-blue-700',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
        variantStyles[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
