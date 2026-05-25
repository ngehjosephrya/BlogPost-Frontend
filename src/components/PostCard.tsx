import { Link } from "react-router";
import type { Post } from "../types";
import { ImagePlaceholder } from "./ui";
import { Avatar } from "./ui/Avatar";

type PostCardProps = {
  post: Post;
};

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, "").trim();
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function PostCard({ post }: PostCardProps) {
  return (
    <div className="flex flex-col gap-3 h-full">

      <ImagePlaceholder title={post.p_title} imageUrl={post.imageUrl} />

      <div className="flex items-center gap-2">
        <Avatar name={post.author?.name ?? "?"} />
        <span className="text-sm font-medium text-gray-900 dark:text-white">
          {post.author?.name ?? "Unknown"}
        </span>
        <span className="text-xs text-gray-400 dark:text-gray-500">
          {formatDate(post.createdAt)}
        </span>
      </div>

      <h2 className="text-base font-medium text-gray-900 dark:text-white
                     leading-snug line-clamp-2">
        {post.p_title}
      </h2>

      <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed
                    line-clamp-3 flex-1">
        {stripHtml(post.p_body)}
      </p>

      <div className="flex items-center justify-between mt-auto">

        <Link
          to={`/posts/${post.id}`}
          className="inline-flex items-center gap-1.5 text-xs font-medium
                     tracking-wide text-gray-900 dark:text-white border
                     border-gray-200 dark:border-gray-700 px-3.5 py-2
                     rounded-md hover:bg-gray-50 dark:hover:bg-gray-800
                     transition-colors"
        >
          READ MORE
          <ChevronRightIcon />
        </Link>

        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1 text-xs text-gray-400
                           dark:text-gray-600">
            <HeartIcon />
            {post._count?.likes ?? 0}
          </span>
          <span className="flex items-center gap-1 text-xs text-gray-400
                           dark:text-gray-600">
            <CommentIcon />
            {post._count?.comments ?? 0}
          </span>
        </div>
      </div>
    </div>
  );
}


function ChevronRightIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
         stroke="currentColor" strokeWidth="2" strokeLinecap="round"
         strokeLinejoin="round" aria-hidden="true">
      <path d="M9 18l6-6-6-6" />
    </svg>
  );
}

function HeartIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
         stroke="currentColor" strokeWidth="2" strokeLinecap="round"
         aria-hidden="true">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  );
}

function CommentIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
         stroke="currentColor" strokeWidth="2" strokeLinecap="round"
         aria-hidden="true">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  );
}
