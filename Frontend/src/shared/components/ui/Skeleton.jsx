export function Skeleton({ className = '' }) {
  return (
    <div
      className={`rounded-lg bg-linear-to-r from-ink via-dusk to-ink
        bg-size-[200%_100%] animate-shimmer ${className}`}
    />
  );
}

// Pre-built memory card skeleton
export function MemoryCardSkeleton() {
  return (
    <div className="bg-ink border border-divide rounded-lg p-5 space-y-3">
      <div className="flex gap-2">
        <Skeleton className="h-5 w-14" />
        <Skeleton className="h-5 w-20" />
      </div>
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-4/5" />
      <Skeleton className="h-4 w-3/5" />
      <div className="flex gap-2 pt-1">
        <Skeleton className="h-4 w-10 rounded-full" />
        <Skeleton className="h-4 w-14 rounded-full" />
      </div>
    </div>
  );
}
