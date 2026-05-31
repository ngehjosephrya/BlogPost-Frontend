import { useState, useEffect } from "react";
import { Link, useParams } from "react-router";
import { postService } from "../../../src/service/post.service";
import { likesService } from "../../../src/service/likes.service";
import { useAuth } from "../../../src/hooks/useAuths";
import { PostContent } from "../../../src/components/PostContent";
import { CommentSection } from "../../../src/components/CommentSection";
import type { Post, Comment, Like } from "../../../src/types";
import { Avatar } from "../../../src/components/ui/Avatar";

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function readingTime(html: string) {
  const words = html.replace(/<[^>]+>/g, "").split(/\s+/).length;
  return `${Math.max(1, Math.ceil(words / 200))} min read`;
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export default function PostDetail() {
  const { postId } = useParams<{ postId: string }>();
  const { isAuthenticated, user } = useAuth();

  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [likes, setLikes] = useState<Like[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [liking, setLiking] = useState(false);
  const [copied, setCopied] = useState(false);

  const hasLiked = likes.some((like) => like.userId === user?.id);

  useEffect(() => {
    if (!postId) return;

    const fetchPost = async () => {
      try {
        setIsLoading(true);
        const [postRes, likesRes] = await Promise.all([
          postService.getById(postId),
          likesService.getByPost(postId).catch(() => ({ data: [] })),
        ]);
        setPost(postRes.data);
        setComments(postRes.data.comments ?? []);
        setLikes(likesRes.data ?? []);
      } catch (error) {
        setError("Post Failed to Load or was deleted By Author.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPost();
  }, [postId]);

  const handleLike = async () => {
    if (!isAuthenticated || !postId || liking) return;

    try {
      setLiking(true);

      if (hasLiked) {
        await likesService.unlike(postId);
        setLikes((prev) => prev.filter((l) => l.userId !== user?.id));
      } else {
        const res = await likesService.like(postId);
        setLikes((prev) => [...prev, res.data]);
      }
    } catch (error) {
    } finally {
      setLiking(false);
    }
  };

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {}
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-950 flex items-center justify-center">
        <PageSpinner />
      </div>
    );
  }

  if (error || !post) {
    return (
      <div
        className="min-h-screen bg-white dark:bg-gray-950 flex flex-col
                      items-center justify-center gap-4"
      >
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {error ?? "Post not found."}
        </p>
        <Link
          to="/"
          className="text-sm text-gray-900 dark:text-white underline underline-offset-2"
        >
          Return to home
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      <div
        className="border-b border-gray-100 dark:border-gray-800 px-6 py-3.5
                      flex items-center justify-between"
      >
        <Link
          to="/"
          className="flex items-center gap-2 text-sm font-medium
                     text-gray-900 dark:text-white"
        >
          <LogoMark />
          VIBELY
        </Link>
        <Link
          to="/"
          className="flex items-center gap-1.5 text-sm text-gray-500
                     dark:text-gray-400 border border-gray-200 dark:border-gray-700
                     px-3.5 py-1.5 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800
                     transition-colors"
        >
          <BackIcon />
          Return to home
        </Link>
      </div>

      <div className="max-w-2xl mx-auto px-6 py-12">
        {post.categories && post.categories.length > 0 && (
          <div className="flex gap-2 flex-wrap mb-4">
            {post.categories.map((cat) => (
              <span
                key={cat.id}
                className="text-xs font-medium text-gray-500 dark:text-gray-400
                           bg-gray-100 dark:bg-gray-800 border border-gray-200
                           dark:border-gray-700 rounded-full px-3 py-1"
              >
                {cat.name}
              </span>
            ))}
          </div>
        )}

        <h1
          className="text-3xl font-medium text-gray-900 dark:text-white
                       leading-snug mb-5"
        >
          {post.p_title}
        </h1>

        <div className="flex items-center gap-2.5 mb-8">
          <Avatar
            name={post.author?.name ?? "?"}
            imageUrl={post.author?.avatarUrl}
            size="md"
          />
          <span className="text-sm font-medium text-gray-900 dark:text-white">
            {post.author?.name ?? "Unknown"}
          </span>
          <span className="text-gray-300 dark:text-gray-700">·</span>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {formatDate(post.createdAt)}
          </span>
          <span className="text-gray-300 dark:text-gray-700">·</span>
          <span className="text-sm text-gray-400 dark:text-gray-600">
            {readingTime(post.p_body)}
          </span>
        </div>

        {post.imageUrl && (
          <div className="w-full rounded-xl overflow-hidden mb-10">
            <img
              src={post.imageUrl}
              alt={post.p_title}
              className="w-full aspect-video object-cover"
            />
          </div>
        )}

        <PostContent html={post.p_body} />

        {post.tags && post.tags.length > 0 && (
          <div className="flex gap-2 flex-wrap mt-8">
            {post.tags.map((tag) => (
              <span
                key={tag.id}
                className="text-xs text-gray-500 dark:text-gray-400
                           bg-gray-100 dark:bg-gray-800 border border-gray-200
                           dark:border-gray-700 rounded-full px-3 py-1"
              >
                {tag.name}
              </span>
            ))}
          </div>
        )}

        <div className="h-px bg-gray-100 dark:bg-gray-800 my-8" />

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={handleLike}
              disabled={!isAuthenticated || liking}
              className={`flex items-center gap-1.5 text-sm px-3.5 py-2
                         border rounded-lg transition-colors
                         disabled:cursor-not-allowed
                         ${
                           hasLiked
                             ? "text-red-500 border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-950"
                             : "text-gray-500 dark:text-gray-400 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
                         }`}
              title={
                isAuthenticated
                  ? hasLiked
                    ? "Unlike"
                    : "Like"
                  : "Sign in to like"
              }
            >
              <HeartIcon filled={hasLiked} />
              {likes.length} {likes.length === 1 ? "like" : "likes"}
            </button>

            <button
              onClick={() =>
                document
                  .getElementById("comments")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
              className="flex items-center gap-1.5 text-sm text-gray-500
                         dark:text-gray-400 border border-gray-200 dark:border-gray-700
                         px-3.5 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800
                         transition-colors"
            >
              <CommentIcon />
              {comments.length} {comments.length === 1 ? "comment" : "comments"}
            </button>
          </div>

          <button
            onClick={handleShare}
            className="flex items-center gap-1.5 text-sm text-gray-500
                       dark:text-gray-400 border border-gray-200 dark:border-gray-700
                       px-3.5 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800
                       transition-colors"
          >
            <ShareIcon />
            {copied ? "Copied!" : "Share"}
          </button>
        </div>

        <div id="comments">
          <CommentSection
            postId={post.id}
            comments={comments}
            onCommentAdded={(comment) =>
              setComments((prev) => [comment, ...prev])
            }
          />
        </div>
      </div>
    </div>
  );
}

function LogoMark() {
  return (
    <div className="flex flex-col gap-0.75 justify-center w-5">
      <span className="block h-[2.5px] w-full bg-gray-900 dark:bg-white rounded-sm" />
      <span className="block h-[2.5px] w-[65%] bg-gray-900 dark:bg-white rounded-sm" />
    </div>
  );
}

function BackIcon() {
  return (
    <svg
      width="13"
      height="13"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    >
      <path d="M19 12H5M12 19l-7-7 7-7" />
    </svg>
  );
}

function HeartIcon({ filled }: { filled: boolean }) {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    >
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  );
}

function CommentIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    >
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  );
}

function ShareIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    >
      <circle cx="18" cy="5" r="3" />
      <circle cx="6" cy="12" r="3" />
      <circle cx="18" cy="19" r="3" />
      <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
      <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
    </svg>
  );
}

function PageSpinner() {
  return (
    <svg
      className="animate-spin"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    >
      <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
    </svg>
  );
}
