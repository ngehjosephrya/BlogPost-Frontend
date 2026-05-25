import { useState } from "react";
import { commentsService } from "../service/comments.service";
import { useAuth } from "../hooks/useAuths";
import type { Comment } from "../types";

type CommentSectionprops = {
  postId: string;
  comments: Comment[];
  onCommentAdded: (comment: Comment) => void;
};

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function CommentSection({
  postId,
  comments,
  onCommentAdded,
}: CommentSectionprops) {
  const { isAuthenticated, user } = useAuth();
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!content.trim() || submitting) return;

    try {
      setSubmitting(true);
      setError(null);
      const res = await commentsService.create(postId, {
        content: content.trim(),
      });
      onCommentAdded(res.data);
      setContent("");
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Failed to post comment try again.",
      );
    } finally {
      setSubmitting(false);
    }
  };
  return (
    <div className="mt-12">
      <h2 className="text-base font-medium text-gray-900 dark:text-white mb-6">
        {comments.length} {comments.length === 1 ? "comment" : "comments"}
      </h2>

      {/* Comment input */}
      {isAuthenticated ? (
        <div className="flex gap-3 mb-8">
          <div
            className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800
                          flex items-center justify-center text-xs font-medium
                          text-gray-600 dark:text-gray-400 shrink-0 mt-0.5"
          >
            {getInitials(user?.name ?? "?")}
          </div>
          <div className="flex-1 flex flex-col gap-2">
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Add a comment..."
              rows={3}
              className="w-full px-3 py-2.5 text-sm border border-gray-200
                         dark:border-gray-700 rounded-xl bg-white dark:bg-gray-900
                         text-gray-900 dark:text-white placeholder:text-gray-300
                         dark:placeholder:text-gray-600 outline-none resize-none
                         focus:border-gray-400 dark:focus:border-gray-500
                         transition-colors"
              onKeyDown={(e) => {
                if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
                  handleSubmit();
                }
              }}
            />
            {error && <p className="text-xs text-red-500">{error}</p>}
            <div className="flex items-center justify-between">
              <p className="text-xs text-gray-400 dark:text-gray-600">
                Cmd/Ctrl + Enter to post
              </p>
              <button
                onClick={handleSubmit}
                disabled={!content.trim() || submitting}
                className="text-sm font-medium text-gray-900 dark:text-white
                           border border-gray-200 dark:border-gray-700 px-4 py-1.5
                           rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800
                           disabled:opacity-40 transition-colors"
              >
                {submitting ? "Posting..." : "Post"}
              </button>
            </div>
          </div>
        </div>
      ) : (
        <p className="text-sm text-gray-400 dark:text-gray-600 mb-8">
          <a
            href="/login"
            className="text-gray-900 dark:text-white underline underline-offset-2"
          >
            Sign in
          </a>{" "}
          to leave a comment.
        </p>
      )}

      {/* Comment list */}
      <div className="flex flex-col gap-6">
        {comments.length === 0 && (
          <p className="text-sm text-gray-400 dark:text-gray-600">
            No comments yet. Be the first to comment.
          </p>
        )}
        {comments.map((comment) => (
          <div key={comment.id} className="flex gap-3">
            <div
              className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800
                            flex items-center justify-center text-xs font-medium
                            text-gray-600 dark:text-gray-400 shrink-0 mt-0.5"
            >
              {getInitials(comment.author?.name ?? "?")}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {comment.author?.name ?? "Unknown"}
                </span>
                <span className="text-xs text-gray-400 dark:text-gray-600">
                  {formatDate(comment.createdAt)}
                </span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                {comment.content}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
