import { cn } from "@/lib/utils";

type ProgressiveRevealProps = {
  children: React.ReactNode;
  className?: string;
  /** Stagger index for list children (50ms steps, capped) */
  staggerIndex?: number;
};

/**
 * Fast enter animation so the UI feels responsive; pairs with skeleton → content swaps.
 */
export function ProgressiveReveal({ children, className, staggerIndex = 0 }: ProgressiveRevealProps) {
  const delay = Math.min(staggerIndex * 45, 360);
  return (
    <div
      className={cn(
        "animate-in fade-in slide-in-from-bottom-1 duration-200",
        className
      )}
      style={{ animationDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}
