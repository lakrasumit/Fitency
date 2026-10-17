import type { ElementType, HTMLAttributes, ReactNode } from 'react';

import { cn } from '../../lib/utils/cn';

export interface CardProps extends HTMLAttributes<HTMLElement> {
  as?: ElementType;
  padding?: 'sm' | 'md' | 'lg';
  children: ReactNode;
}

const PADDING_CLASSES = {
  sm: 'p-3',
  md: 'p-4',
  lg: 'p-5',
} as const;

export function Card({ as: Tag = 'div', padding = 'md', className, children, ...rest }: CardProps) {
  return (
    <Tag
      {...rest}
      className={cn(
        'rounded-lg border border-line bg-surface shadow-card',
        PADDING_CLASSES[padding],
        className,
      )}
    >
      {children}
    </Tag>
  );
}
