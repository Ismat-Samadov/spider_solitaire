'use client';
import { ButtonHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/utils/cn';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', children, ...props }, ref) => {
    const variantClasses = {
      primary: 'bg-neon text-felt hover:bg-neon-dim shadow-lg shadow-neon/20',
      secondary:
        'bg-felt-light text-white border border-neon/20 hover:border-neon/40 hover:bg-felt',
      ghost: 'text-white/70 hover:text-white hover:bg-white/5',
      danger: 'bg-red-600 text-white hover:bg-red-700',
    };

    const sizeClasses = {
      sm: 'text-xs px-2 py-1 gap-1',
      md: 'text-sm px-3 py-2 gap-2',
      lg: 'text-base px-5 py-3 gap-2',
    };

    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center font-semibold rounded-lg transition-all duration-150 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-neon/50',
          variantClasses[variant],
          sizeClasses[size],
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);
Button.displayName = 'Button';
