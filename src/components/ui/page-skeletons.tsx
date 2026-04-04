import { Skeleton } from "@/components/ui/skeleton";

/** App shell: sidebar + header + scroll area (matches AppLayout). */
export function AppShellSkeleton() {
  return (
    <div className="h-screen flex w-full bg-background overflow-hidden">
      <div className="hidden md:flex w-64 flex-col border-r border-border p-4 gap-4 shrink-0">
        <Skeleton className="h-10 w-full rounded-lg" shimmer />
        <div className="space-y-2 flex-1">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-9 w-full rounded-md" shimmer />
          ))}
        </div>
      </div>
      <div className="flex-1 flex flex-col min-w-0">
        <div className="h-14 border-b border-border px-4 flex items-center gap-3">
          <Skeleton className="h-9 w-9 rounded-full" shimmer />
          <Skeleton className="h-4 flex-1 max-w-xs rounded-md" shimmer />
        </div>
        <div className="flex-1 p-4 lg:p-6 space-y-4 overflow-hidden">
          <Skeleton className="h-8 w-48 rounded-md" shimmer />
          <Skeleton className="h-4 w-full max-w-lg rounded-md" shimmer />
          <div className="grid gap-4 md:grid-cols-3 pt-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-28 rounded-xl" shimmer />
            ))}
          </div>
          <Skeleton className="h-64 rounded-xl w-full" shimmer />
        </div>
      </div>
    </div>
  );
}

/** Masomo: header + stat cards + tab bar + grid of class cards */
export function MasomoPageSkeleton() {
  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-2">
          <Skeleton className="h-9 w-40 rounded-lg" shimmer />
          <Skeleton className="h-4 w-72 max-w-full rounded-md" shimmer />
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-10 w-32 rounded-md" shimmer />
          <Skeleton className="h-10 w-28 rounded-md" shimmer />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-24 rounded-xl" shimmer />
        ))}
      </div>
      <Skeleton className="h-11 w-full max-w-md rounded-lg" shimmer />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-44 rounded-xl" shimmer />
        ))}
      </div>
    </div>
  );
}

/** Dashboard card: title row + list rows */
export function DashboardCardListSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-3 pt-2">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center gap-3 p-3 rounded-lg border bg-card/50">
          <Skeleton className="h-10 w-10 rounded-full shrink-0" shimmer />
          <div className="flex-1 space-y-2 min-w-0">
            <Skeleton className="h-4 w-2/3 max-w-[200px] rounded-md" shimmer />
            <Skeleton className="h-3 w-1/2 max-w-[140px] rounded-md" shimmer />
          </div>
          <Skeleton className="h-8 w-12 rounded-md shrink-0" shimmer />
        </div>
      ))}
    </div>
  );
}

/** Inbox: sidebar + message pane */
export function InboxPageSkeleton() {
  return (
    <div className="h-[calc(100vh-4rem)] flex animate-in fade-in duration-200">
      <div className="w-full md:w-80 border-r flex flex-col p-4 gap-4">
        <Skeleton className="h-7 w-32 rounded-md" shimmer />
        <Skeleton className="h-10 w-full rounded-md" shimmer />
        <div className="space-y-2 flex-1">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full rounded-lg" shimmer />
          ))}
        </div>
      </div>
      <div className="hidden md:flex flex-1 flex-col p-6 gap-4 bg-muted/30">
        <Skeleton className="h-12 w-48 rounded-lg" shimmer />
        <div className="flex-1 space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton
              key={i}
              className={`h-12 rounded-lg max-w-[70%] ${i % 2 ? "ml-auto" : ""}`}
              shimmer
            />
          ))}
        </div>
        <Skeleton className="h-12 w-full rounded-xl" shimmer />
      </div>
    </div>
  );
}

/** Generic centered page block */
export function PageBlockSkeleton() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[40vh] gap-4 animate-in fade-in duration-200">
      <Skeleton className="h-12 w-12 rounded-full" shimmer />
      <Skeleton className="h-4 w-48 rounded-md" shimmer />
      <Skeleton className="h-3 w-32 rounded-md" shimmer />
    </div>
  );
}

/** Events / feed-style pages */
export function FeedPageSkeleton() {
  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="space-y-2">
          <Skeleton className="h-9 w-48 rounded-lg" shimmer />
          <Skeleton className="h-4 w-full max-w-md rounded-md" shimmer />
        </div>
        <Skeleton className="h-10 w-36 rounded-md shrink-0" shimmer />
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="min-h-[12rem] rounded-xl" shimmer />
        ))}
      </div>
    </div>
  );
}

/** Unit page: back row + title + tab bar + panel */
export function UnitPageSkeleton() {
  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in duration-200">
      <Skeleton className="h-9 w-32 rounded-md" shimmer />
      <div className="space-y-2">
        <Skeleton className="h-10 w-2/3 max-w-lg rounded-lg" shimmer />
        <Skeleton className="h-4 w-full max-w-xl rounded-md" shimmer />
      </div>
      <Skeleton className="h-11 w-full max-w-lg rounded-lg" shimmer />
      <Skeleton className="min-h-[280px] w-full rounded-xl" shimmer />
    </div>
  );
}

/** Campus chat (Ukumbi-style): header + scroll area */
export function ChatRoomPageSkeleton() {
  return (
    <div className="flex-1 flex flex-col min-h-[60vh] animate-in fade-in duration-200">
      <div className="flex items-center gap-4 p-6 border-b">
        <div className="space-y-2 flex-1">
          <Skeleton className="h-8 w-40 rounded-lg" shimmer />
          <Skeleton className="h-4 w-56 rounded-md" shimmer />
        </div>
        <Skeleton className="h-9 w-28 rounded-md" shimmer />
      </div>
      <div className="flex-1 p-4 space-y-3">
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton
            key={i}
            className={`h-14 rounded-xl max-w-[85%] ${i % 3 === 0 ? "ml-auto" : ""}`}
            shimmer
          />
        ))}
      </div>
      <div className="p-4 border-t flex gap-2">
        <Skeleton className="h-11 flex-1 rounded-xl" shimmer />
        <Skeleton className="h-11 w-24 rounded-xl" shimmer />
      </div>
    </div>
  );
}

/** Profile / info: header + two columns */
export function ProfilePageSkeleton() {
  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row gap-6 items-start">
        <Skeleton className="h-28 w-28 rounded-full shrink-0" shimmer />
        <div className="flex-1 space-y-3 w-full">
          <Skeleton className="h-8 w-48 rounded-md" shimmer />
          <Skeleton className="h-4 w-full max-w-sm rounded-md" shimmer />
          <Skeleton className="h-10 w-full max-w-xs rounded-md" shimmer />
        </div>
      </div>
      <Skeleton className="h-64 w-full rounded-xl" shimmer />
    </div>
  );
}

/** Landing: minimal hero placeholder while auth resolves */
export function LandingAuthSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white flex flex-col items-center justify-center gap-6 px-4 animate-in fade-in duration-300">
      <Skeleton className="h-16 w-16 rounded-2xl" shimmer />
      <Skeleton className="h-10 w-48 rounded-lg" shimmer />
      <Skeleton className="h-4 w-64 max-w-full rounded-md" shimmer />
    </div>
  );
}
