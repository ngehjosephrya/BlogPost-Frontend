export function PostCardSkeleton() {
    return (
    <div className="flex flex-col gap-3 animate-pulse">
      <div className="w-full aspect-4/3 rounded-xl bg-gray-100 dark:bg-gray-800" />
      <div className="flex items-center gap-2">
        <div className="w-7 h-7 rounded-full bg-gray-100 dark:bg-gray-800" />
        <div className="h-3 w-24 bg-gray-100 dark:bg-gray-800 rounded" />
        <div className="h-3 w-16 bg-gray-100 dark:bg-gray-800 rounded" />
      </div>
      <div className="h-4 w-3/4 bg-gray-100 dark:bg-gray-800 rounded" />
      <div className="flex flex-col gap-2">
        <div className="h-3 w-full bg-gray-100 dark:bg-gray-800 rounded" />
        <div className="h-3 w-5/6 bg-gray-100 dark:bg-gray-800 rounded" />
        <div className="h-3 w-4/6 bg-gray-100 dark:bg-gray-800 rounded" />
      </div>
      <div className="h-8 w-28 bg-gray-100 dark:bg-gray-800 rounded-md" />
    </div>
  );
    
}