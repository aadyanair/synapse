import { cn } from '../../utils/cn.ts';
import { Slot } from '@radix-ui/react-slot';
import { forwardRef } from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
  variant?: 'default' | 'secondary' | 'destructive' | 'outline' | 'ghost';
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    const variantClass =
      variant === 'secondary'
        ? 'btn btn-secondary'
        : variant === 'destructive'
        ? 'btn btn-danger'
        : variant === 'outline' || variant === 'ghost'
        ? 'btn btn-outline'
        : 'btn btn-primary';
    return <Comp ref={ref as any} className={cn(variantClass, className)} {...props} />;
  },
);
Button.displayName = 'Button';
