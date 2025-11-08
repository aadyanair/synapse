import * as React from 'react';
import { cn } from '../../utils/cn.ts';

export interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'destructive' | 'success' | 'warning';
}

export const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  ({ className, variant = 'default', ...props }, ref) => (
    <div
      ref={ref}
      role="alert"
      className={cn(
        'relative w-full rounded-lg border p-4 text-sm',
        variant === 'default' && 'bg-background text-foreground border-border',
        variant === 'destructive' && 'border-red-300/50 bg-red-50 text-red-900 dark:bg-red-900/20 dark:text-red-100',
        variant === 'success' && 'border-green-300/50 bg-green-50 text-green-900 dark:bg-green-900/20 dark:text-green-100',
        variant === 'warning' && 'border-yellow-300/50 bg-yellow-50 text-yellow-900 dark:bg-yellow-900/20 dark:text-yellow-100',
        className,
      )}
      {...props}
    />
  ),
);
Alert.displayName = 'Alert';

export const AlertDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('text-sm [&_p]:leading-relaxed', className)} {...props} />
  ),
);
AlertDescription.displayName = 'AlertDescription';
