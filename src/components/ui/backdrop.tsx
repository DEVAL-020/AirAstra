import { cn } from '@/lib/utils';

/**
 * The chaicode.com page background: one SVG with a warm glow and faint
 * hexagons, centred at the top, behind everything.
 */
export function Backdrop({ src = '/chaiui/background.svg', className }: { src?: string; className?: string }) {
  return (
    <img
      data-chai-backdrop=""
      src={src}
      alt=""
      aria-hidden="true"
      fetchPriority="high"
      decoding="async"
      className={cn(
        'pointer-events-none absolute top-0 left-1/2 -z-10 w-[2842px] max-w-none -translate-x-1/2 select-none',
        '[mask-image:linear-gradient(to_bottom,#000_55%,transparent)]',
        'invert hue-rotate-180 dark:invert-0 dark:hue-rotate-0',
        className,
      )}
    />
  );
}
