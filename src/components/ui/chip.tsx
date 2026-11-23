import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';

import { cn } from '@/lib/utils';

/**
 * An outlined meta chip. Grey by default; special is purple.
 * Tones are text and a thin stroke, never a fill.
 */
const chipVariants = cva('inline-flex items-center gap-1.5 rounded-md border px-2.5 py-0.5 text-xs sm:text-[13px] font-semibold leading-relaxed whitespace-nowrap', {
  variants: {
    tone: {
      default: 'border-gray-300 text-gray-700 dark:border-gray-700 dark:text-gray-300',
      success: 'border-green-600/40 text-green-800 dark:border-green-400/40 dark:text-green-300 font-bold',
      danger: 'border-red-600/40 text-red-800 dark:border-red-400/40 dark:text-red-300 font-bold',
      special: 'border-purple-600/40 text-purple-800 dark:border-purple-400/40 dark:text-purple-300 font-bold',
    },
  },
  defaultVariants: { tone: 'default' },
});

function Chip({ className, tone, ...props }: React.ComponentProps<'span'> & VariantProps<typeof chipVariants>) {
  return <span data-slot="chip" className={cn(chipVariants({ tone }), className)} {...props} />;
}

export { Chip, chipVariants };
