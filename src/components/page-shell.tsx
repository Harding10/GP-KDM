import * as React from 'react';

import { cn } from '@/lib/utils';

interface PageShellProps extends React.HTMLAttributes<HTMLDivElement> {
  as?: React.ElementType;
  variant?: 'default' | 'centered';
}

function PageShell({
  className,
  as: Comp = 'div',
  variant = 'default',
  ...props
}: PageShellProps) {
  return (
    <Comp
      className={cn(
        'container flex-1 animate-fade-in',
        variant === 'centered' && 'flex items-center justify-center',
        className
      )}
      {...props}
    />
  );
}

export { PageShell };
