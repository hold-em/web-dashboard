import * as React from 'react';

import { cn } from '@/lib/utils';
import { Button } from './ui/button';
import { Icons } from './icons';

const Section = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'mt-3 rounded-xl border bg-card px-4 py-6 text-card-foreground shadow',
      className
    )}
    {...props}
  />
));
Section.displayName = 'Section';

const SectionTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      'text-2xl font-semibold leading-none tracking-tight',
      className
    )}
    {...props}
  />
));
SectionTitle.displayName = 'SectionTitle';

const SectionContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('mt-8 w-full space-y-4', className)}
    {...props}
  />
));
SectionContent.displayName = 'SectionContent';

const SectionTopToolbar = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('flex items-center', className)} {...props} />
));
SectionTopToolbar.displayName = 'SectionTopToolbar';

const SectionTopButtonArea = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('ml-auto flex items-center gap-2', className)}
    {...props}
  />
));
SectionTopButtonArea.displayName = 'SectionTopButtonArea';

const BackButton = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, children, ...props }, ref) => (
  <Button ref={ref} variant='ghost' className={className} {...props}>
    <Icons.chevronLeft />
    {children}
  </Button>
));
BackButton.displayName = 'BackButton';

export {
  Section,
  SectionTitle,
  SectionContent,
  SectionTopToolbar,
  SectionTopButtonArea,
  BackButton
};
