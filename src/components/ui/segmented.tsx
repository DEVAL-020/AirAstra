'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export type SegmentedOption<T extends string> = {
  value: T;
  label: React.ReactNode;
  icon?: React.ComponentType<{ className?: string }>;
  badge?: string;
  'aria-label'?: string;
};

interface SegmentedProps<T extends string> {
  options: readonly SegmentedOption<T>[];
  value: T;
  onChange: (value: T) => void;
  label: string;
  className?: string;
}

export function Segmented<T extends string>({
  options,
  value,
  onChange,
  label,
  className,
}: SegmentedProps<T>) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const activeTabRef = React.useRef<HTMLButtonElement>(null);
  const [canScrollLeft, setCanScrollLeft] = React.useState(false);
  const [canScrollRight, setCanScrollRight] = React.useState(false);

  // Check scroll overflow
  const checkScroll = React.useCallback(() => {
    const el = containerRef.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    setCanScrollLeft(scrollLeft > 6);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 6);
  }, []);

  React.useEffect(() => {
    checkScroll();
    const el = containerRef.current;
    if (!el) return;

    el.addEventListener('scroll', checkScroll, { passive: true });
    window.addEventListener('resize', checkScroll);
    return () => {
      el.removeEventListener('scroll', checkScroll);
      window.removeEventListener('resize', checkScroll);
    };
  }, [checkScroll]);

  // Smoothly scroll active tab into view strictly within the container
  React.useEffect(() => {
    const container = containerRef.current;
    const activeTab = activeTabRef.current;
    if (!container || !activeTab) return;

    const containerWidth = container.clientWidth;
    const tabOffsetLeft = activeTab.offsetLeft;
    const tabWidth = activeTab.clientWidth;
    const targetScrollLeft = tabOffsetLeft - containerWidth / 2 + tabWidth / 2;

    container.scrollTo({
      left: Math.max(0, targetScrollLeft),
      behavior: 'smooth',
    });
  }, [value]);

  const scroll = (direction: 'left' | 'right') => {
    if (!containerRef.current) return;
    const delta = direction === 'left' ? -220 : 220;
    containerRef.current.scrollBy({ left: delta, behavior: 'smooth' });
  };

  return (
    <div className="relative w-full max-w-full flex items-center justify-center">
      {/* Scroll Left Button (for desktop/tablet overflow) */}
      <AnimatePresence>
        {canScrollLeft && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            type="button"
            onClick={() => scroll('left')}
            aria-label="Scroll navigation left"
            className="absolute left-0 z-30 hidden sm:flex size-8 -translate-x-3 items-center justify-center rounded-full border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-800 dark:text-neutral-200 shadow-md hover:bg-neutral-100 dark:hover:bg-neutral-800 cursor-pointer transition-colors"
          >
            <ChevronLeft className="size-4" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Fade Gradients for visual overflow cue */}
      {canScrollLeft && (
        <div className="pointer-events-none absolute left-0 top-0 bottom-0 z-10 w-8 bg-gradient-to-r from-background to-transparent rounded-l-2xl" />
      )}
      {canScrollRight && (
        <div className="pointer-events-none absolute right-0 top-0 bottom-0 z-10 w-8 bg-gradient-to-l from-background to-transparent rounded-r-2xl" />
      )}

      {/* Main Floating Glass Segmented Dock */}
      <div
        ref={containerRef}
        role="tablist"
        aria-label={label}
        data-slot="segmented"
        className={cn(
          'flex max-w-full overflow-x-auto p-1.5 gap-1 rounded-2xl border-2 border-neutral-200 dark:border-neutral-800/90 bg-white/95 dark:bg-neutral-950/85 backdrop-blur-xl [scrollbar-width:none] [&::-webkit-scrollbar]:hidden shadow-sm touch-pan-x',
          className,
        )}
      >
        {options.map((o) => {
          const isSelected = value === o.value;
          const Icon = o.icon;

          return (
            <motion.button
              key={o.value}
              ref={isSelected ? activeTabRef : null}
              type="button"
              role="tab"
              aria-selected={isSelected}
              aria-label={o['aria-label']}
              onClick={() => onChange(o.value)}
              whileTap={{ scale: 0.96 }}
              className={cn(
                'relative inline-flex h-10 shrink-0 cursor-pointer items-center justify-center gap-2 rounded-xl px-3.5 sm:px-4 text-xs sm:text-sm font-bold whitespace-nowrap transition-colors duration-150 outline-none focus-visible:ring-2 focus-visible:ring-brand/60 focus-visible:ring-offset-1',
                isSelected
                  ? 'text-amber-950 dark:text-amber-200'
                  : 'text-neutral-700 hover:text-neutral-950 dark:text-neutral-400 dark:hover:text-neutral-100 hover:bg-neutral-100/70 dark:hover:bg-neutral-900/60',
              )}
            >
              {/* Framer Motion Active Pill Glow and Background */}
              {isSelected && (
                <motion.div
                  layoutId="activeSegmentPill"
                  className="absolute inset-0 rounded-xl bg-gradient-to-r from-amber-500/15 via-amber-400/20 to-amber-500/15 border-2 border-amber-500/40 dark:from-amber-500/20 dark:via-amber-400/25 dark:to-amber-500/20 dark:border-amber-400/50 shadow-xs"
                  transition={{
                    type: 'spring',
                    stiffness: 450,
                    damping: 32,
                  }}
                />
              )}

              {/* Icon */}
              {Icon && (
                <span
                  className={cn(
                    'relative z-10 transition-colors duration-150',
                    isSelected
                      ? 'text-amber-600 dark:text-amber-400'
                      : 'text-neutral-500 dark:text-neutral-400',
                  )}
                >
                  <Icon className="size-4 shrink-0" />
                </span>
              )}

              {/* Text Label */}
              <span className="relative z-10 font-bold tracking-tight">
                {o.label}
              </span>

              {/* Optional Chip/Badge */}
              {o.badge && (
                <span
                  className={cn(
                    'relative z-10 text-[9px] font-extrabold uppercase tracking-wider px-1.5 py-0.5 rounded-full border',
                    isSelected
                      ? 'bg-amber-200/90 text-amber-950 border-amber-300 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-700'
                      : 'bg-neutral-200 text-neutral-700 border-neutral-300 dark:bg-neutral-800 dark:text-neutral-400 dark:border-neutral-700',
                  )}
                >
                  {o.badge}
                </span>
              )}
            </motion.button>
          );
        })}
      </div>

      {/* Scroll Right Button */}
      <AnimatePresence>
        {canScrollRight && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            type="button"
            onClick={() => scroll('right')}
            aria-label="Scroll navigation right"
            className="absolute right-0 z-30 hidden sm:flex size-8 translate-x-3 items-center justify-center rounded-full border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-800 dark:text-neutral-200 shadow-md hover:bg-neutral-100 dark:hover:bg-neutral-800 cursor-pointer transition-colors"
          >
            <ChevronRight className="size-4" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
