import { cn } from '@/lib/utils';

/**
 * The chaicode.com page background: one SVG with a warm glow and faint
 * hexagons, centred at the top, behind everything.
 */
export function Backdrop({ src = '/chaiui/background.svg', className }: { src?: string; className?: string }) {
  return (
    <div className="pointer-events-none absolute inset-x-0 top-0 overflow-hidden h-[1200px] -z-10 select-none">
      <img
        data-chai-backdrop=""
        src={src}
        alt=""
        aria-hidden="true"
        width={2842}
        height={1200}
        fetchPriority="high"
        decoding="async"
        className={cn(
          'relative left-1/2 w-[2842px] max-w-none -translate-x-1/2 select-none',
          '[mask-image:linear-gradient(to_bottom,#000_55%,transparent)]',
          'invert hue-rotate-180 dark:invert-0 dark:hue-rotate-0',
          className,
        )}
      />
    </div>
  );
}
