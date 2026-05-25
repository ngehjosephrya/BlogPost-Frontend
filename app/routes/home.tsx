import { useState, useEffect } from "react";
import { postService } from "../../src/service/post.service";
import { PostCard } from "../../src/components/PostCard";
import { PostCardSkeleton } from "../../src/components/PostCardSkeleton";
import { Footer } from "../../src/components/Footer";
import type { Post } from "../../src/types";
import { Spinner } from "../../src/components/ui";
const LIMIT = 6;

export default function Home() {
  const [posts, setPosts]                 = useState<Post[]>([]);
  const [page, setPage]                   = useState(1);
  const [isLoading, setIsLoading]         = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasNextPage, setHasNextPage]     = useState(false);
  const [error, setError]                 = useState<string | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setIsLoading(true);
        const res = await postService.getAll(1, LIMIT);
        setPosts(res.data);
        setHasNextPage(res.pagination.hasNextPage);
        setPage(1);
      } catch {
        setError("Failed to load posts. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchPosts();
  }, []);

  const handleLoadMore = async () => {
    if (isLoadingMore) return;
    try {
      setIsLoadingMore(true);
      const nextPage = page + 1;
      const res = await postService.getAll(nextPage, LIMIT);
      setPosts((prev) => [...prev, ...res.data]);
      setHasNextPage(res.pagination.hasNextPage);
      setPage(nextPage);
    } catch {
      setError("Failed to load more posts.");
    } finally {
      setIsLoadingMore(false);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">

      <section className="text-center px-4 pt-10 pb-8 md:pt-14 md:pb-10">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-3">
          Exploring New Articles
        </h1>
        <p className="text-sm md:text-base text-gray-400 dark:text-gray-500">
          Ideas, trends, and inspiration for a brighter future
        </p>
      </section>

      <section className="px-4 md:px-8 lg:px-12 pb-12">

        {isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 items-stretch">
            {Array.from({ length: LIMIT }).map((_, i) => (
              <PostCardSkeleton key={i} />
            ))}
          </div>
        )}

        {error && !isLoading && (
          <div className="text-center py-20">
            <p className="text-sm text-red-500">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 text-sm text-gray-500 underline underline-offset-2
                         hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              Try again
            </button>
          </div>
        )}

        {!isLoading && !error && posts.length === 0 && (
          <div className="text-center py-20">
            <p className="text-sm text-gray-400 dark:text-gray-500">
              No posts published yet.
            </p>
          </div>
        )}

        {!isLoading && posts.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3
                          gap-6 md:gap-8 items-stretch">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </section>

      {hasNextPage && !isLoading && (
        <div className="flex justify-center pb-16 px-4">
          <button
            onClick={handleLoadMore}
            disabled={isLoadingMore}
            className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300
                       border border-gray-200 dark:border-gray-700 px-7 py-2.5
                       rounded-md hover:bg-gray-50 dark:hover:bg-gray-800
                       disabled:opacity-50 transition-colors"
          >
            {isLoadingMore ? (
              <>
                <SpinnerIcon />
                Loading...
              </>
            ) : (
              "Load More"
            )}
          </button>
        </div>
      )}

      <Footer />
    </div>
  );
}

function SpinnerIcon() {
  return (
    <svg className="animate-spin" width="14" height="14" viewBox="0 0 24 24"
         fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
    </svg>
  );
}