import * as React from 'react';

import { cn } from '@/lib/utils';

type Option<T extends string> = {
  value: T;
  label: React.ReactNode;
  'aria-label'?: string;
};

/**
 * The grid/list switch from chaicode.com's toolbar.
 * The active segment is the one place a warm brown fill is allowed:
 * orange-100 on light, orange-900/40 on dark.
 */
function Segmented<T extends string>({
  options,
  value,
  onChange,
  label,
  className,
}: {
  options: readonly Option<T>[];
  value: T;
  onChange: (value: T) => void;
  label: string;
  className?: string;
}) {
  return (
    <div
      role="group"
      aria-label={label}
      data-slot="segmented"
      className={cn(
        'flex max-w-full overflow-x-auto rounded-xl border-2 border-neutral-300 bg-white [scrollbar-width:none] dark:border-neutral-800 dark:bg-black/50 shadow-xs',
        className,
      )}
    >
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          aria-pressed={value === o.value}
          aria-label={o['aria-label']}
          onClick={() => onChange(o.value)}
          className={cn(
            "inline-flex h-11 min-w-10 shrink-0 cursor-pointer items-center justify-center gap-2 px-4 text-sm sm:text-base font-bold whitespace-nowrap transition-colors duration-150 outline-none focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:ring-inset [&_svg:not([class*='size-'])]:size-4",
            value === o.value
              ? 'bg-amber-100 text-amber-950 dark:bg-amber-950/50 dark:text-amber-200'
              : 'text-neutral-800 hover:bg-amber-50 hover:text-amber-900 dark:text-neutral-300 dark:hover:bg-neutral-800/50 dark:hover:text-white',
          )}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

export { Segmented };
