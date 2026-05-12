import { Link } from "react-router";
import { ChevronRight } from "lucide-react";
import type { Post } from "../types";
import { ImagePlaceholder } from "./ui";
import { Avatar } from "./ui/Avatar";

type PostCardProps = {
  post: Post;
};

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("en-Us", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function PostCard({ post }: PostCardProps) {
  return (
    <div className="flex flex-col gap-3">
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

      <h2 className="text-base font-medium text-gray-900 dark:text-white leading-snug line-clamp-2">
        {post.p_title}
      </h2>

      <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed line-clamp-3">
        {post.p_body}
      </p>

      <Link
        to={`/posts/${post.id}`}
        className="inline-flex items-center gap-1.5 text-xs font-medium tracking-wide
                   text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700
                   px-3.5 py-2 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800
                   transition-colors w-fit"
      >
        READ MORE
        <ChevronRight />
      </Link>
    </div>
  );
}
