import { useState, useEffect } from "react";
import { postService } from "../../src/service/post.service";
import { PostCard } from "../../src/components/PostCard";
import { PostCardSkeleton } from "../../src/components/PostCardSkeleton";
import { Footer } from "../../src/components/Footer";
import type { Post } from "../../src/types";
import { Spinner } from "../../src/components/ui";

const LIMIT = 6;

export default function Home() {
  const [post, setPosts] = useState<Post[]>([]);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [error, setError] = useState<string | null>(null);

  //Initial API Fetch
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setIsLoading(true);
        const res = await postService.getAll(1, LIMIT);
        setPosts(res.data);
        setHasNextPage(res.pagination.hasNextPage);
        setPage(1);
      } catch {
        setError("Failed to load posts. Please try again.") 
      }finally{
        setIsLoading(false);
      }
    };
    fetchPosts();
  }, []);

  //Load more - appends card to existing grids

  const handleLoadMore = async () => {
    if(isLoading) return;
    try {
      setIsLoadingMore(true);
      const nextPage = page + 1;
      const res = await postService.getAll(nextPage, LIMIT);
      setPosts((prev) => [...prev, ...res.data]);
      setHasNextPage(res.pagination.hasNextPage);
      setPage(nextPage);
    } catch {
      setError("Failed to load more posts.")
    }finally{
      setIsLoadingMore(false);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      <section className="text-center px-6 pt-14 pb-10">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-3">
          Exploring New Articles
        </h1>
        <p className="text-base text-gray-400 dark:text-gray-500">
          Ideas, trends, and Inspiratoin for a brighter future
        </p>
      </section>

      <section className="px-12 pb-12">

        {/* Loading skeleton */}
        {isLoading && (
          <div className="grid grid-cols-3 gap-8">
            {Array.from({ length: LIMIT }).map((_, i) => (
              <PostCardSkeleton key={i} />
            ))}
          </div>
        )}

        {/* Error */}
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

        {/* Empty */}
        {!isLoading && !error && post.length === 0 && (
          <div className="text-center py-20">
            <p className="text-sm text-gray-400 dark:text-gray-500">
              No posts published yet.
            </p>
          </div>
        )}

        {/* Posts */}
        {!isLoading && post.length > 0 && (
          <div className="grid grid-cols-3 gap-8">
            {post.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </section>


      {hasNextPage && !isLoading && (
        <div className="flex justify-center pb-16">
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
                <Spinner />
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
  )
}
