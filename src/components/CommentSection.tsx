import { useState } from "react";
import { commentsService } from "../service/comments.service";
import { useAuth } from "../hooks/useAuths";
import { Avatar } from "../components/ui/Avatar";
import type { Comment } from "../types";

type CommentSectionProps = {
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

export function CommentSection({
  postId,
  comments: initialComments,
  onCommentAdded,
}: CommentSectionProps) {
  const { isAuthenticated, user } = useAuth();

  const [comments, setComments]     = useState<Comment[]>(initialComments);
  const [content, setContent]       = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError]           = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!content.trim() || submitting) return;
    try {
      setSubmitting(true);
      setError(null);
      const res = await commentsService.create(postId, {
        content: content.trim(),
      });
      const newComment = res.data;
      setComments((prev) => [newComment, ...prev]);
      onCommentAdded(newComment);
      setContent("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to post comment.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdated = (updated: Comment) => {
    setComments((prev) =>
      prev.map((c) => (c.id === updated.id ? updated : c))
    );
  };

  const handleDeleted = (id: string) => {
    setComments((prev) => prev.filter((c) => c.id !== id));
  };

  return (
    <div className="mt-12">
      <h2 className="text-base font-medium text-gray-900 dark:text-white mb-6">
        {comments.length} {comments.length === 1 ? "comment" : "comments"}
      </h2>

      {isAuthenticated ? (
        <div className="flex gap-3 mb-8">
          <Avatar
            name={user?.name ?? "?"}
            imageUrl={user?.avatarUrl}
            size="sm"
          />
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
          
            <a href="/login"
            className="text-gray-900 dark:text-white underline underline-offset-2"
          >
            Sign in
          </a>{" "}
          to leave a comment.
        </p>
      )}

      <div className="flex flex-col gap-6">
        {comments.length === 0 && (
          <p className="text-sm text-gray-400 dark:text-gray-600">
            No comments yet. Be the first to comment.
          </p>
        )}
        {comments.map((comment) => (
          <CommentItem
            key={comment.id}
            comment={comment}
            currentUserId={user?.id}
            onUpdated={handleUpdated}
            onDeleted={handleDeleted}
          />
        ))}
      </div>
    </div>
  );
}


type CommentItemProps = {
  comment: Comment;
  currentUserId?: string;
  onUpdated: (comment: Comment) => void;
  onDeleted: (id: string) => void;
};

function CommentItem({
  comment,
  currentUserId,
  onUpdated,
  onDeleted,
}: CommentItemProps) {
  const isOwner = comment.author?.id === currentUserId;

  const [editing, setEditing]     = useState(false);
  const [editContent, setEditContent] = useState(comment.content);
  const [saving, setSaving]       = useState(false);
  const [deleting, setDeleting]   = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [error, setError]         = useState<string | null>(null);

  const handleSaveEdit = async () => {
    if (!editContent.trim() || saving) return;
    if (editContent.trim() === comment.content) {
      setEditing(false);
      return;
    }

    try {
      setSaving(true);
      setError(null);
      const res = await commentsService.update(comment.id, {
        content: editContent.trim(),
      });
      onUpdated(res.data);
      setEditing(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update comment.");
    } finally {
      setSaving(false);
    }
  };

  const handleCancelEdit = () => {
    setEditContent(comment.content);
    setEditing(false);
    setError(null);
  };

  const handleDelete = async () => {
    try {
      setDeleting(true);
      await commentsService.delete(comment.id);
      onDeleted(comment.id);
    } catch {
      setConfirmDelete(false);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="flex gap-3">
      <Avatar
        name={comment.author?.name ?? "?"}
        imageUrl={comment.author?.avatarUrl}
        size="sm"
      />

      <div className="flex-1 min-w-0">

        <div className="flex items-center justify-between gap-2 mb-1">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-900 dark:text-white">
              {comment.author?.name ?? "Unknown"}
            </span>
            <span className="text-xs text-gray-400 dark:text-gray-600">
              {formatDate(comment.createdAt)}
            </span>
          </div>

          {isOwner && !editing && (
            <div className="flex items-center gap-1 shrink-0">
              <button
                onClick={() => setEditing(true)}
                className="w-6 h-6 flex items-center justify-center rounded-md
                           text-gray-400 dark:text-gray-600 hover:text-gray-700
                           dark:hover:text-gray-300 hover:bg-gray-100
                           dark:hover:bg-gray-800 transition-colors"
                title="Edit comment"
              >
                <EditIcon />
              </button>
              <button
                onClick={() => setConfirmDelete(true)}
                className="w-6 h-6 flex items-center justify-center rounded-md
                           text-gray-400 dark:text-gray-600 hover:text-red-500
                           dark:hover:text-red-400 hover:bg-red-50
                           dark:hover:bg-red-950 transition-colors"
                title="Delete comment"
              >
                <TrashIcon />
              </button>
            </div>
          )}
        </div>

        {editing ? (
          <div className="flex flex-col gap-2">
            <textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              rows={3}
              autoFocus
              className="w-full px-3 py-2 text-sm border border-gray-200
                         dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900
                         text-gray-900 dark:text-white outline-none resize-none
                         focus:border-gray-400 dark:focus:border-gray-500
                         transition-colors"
            />
            {error && <p className="text-xs text-red-500">{error}</p>}
            <div className="flex items-center gap-2">
              <button
                onClick={handleSaveEdit}
                disabled={!editContent.trim() || saving}
                className="text-xs font-medium text-gray-900 dark:text-white
                           border border-gray-200 dark:border-gray-700 px-3 py-1.5
                           rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800
                           disabled:opacity-40 transition-colors"
              >
                {saving ? "Saving..." : "Save"}
              </button>
              <button
                onClick={handleCancelEdit}
                disabled={saving}
                className="text-xs text-gray-500 dark:text-gray-400
                           hover:text-gray-900 dark:hover:text-white
                           transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
            {comment.content}
          </p>
        )}

        {confirmDelete && (
          <div className="mt-2 flex items-center gap-3 p-3 bg-red-50
                          dark:bg-red-950 border border-red-100
                          dark:border-red-900 rounded-lg">
            <p className="text-xs text-red-600 dark:text-red-400 flex-1">
              Delete this comment?
            </p>
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="text-xs font-medium text-white bg-red-500
                         hover:bg-red-600 px-3 py-1.5 rounded-md
                         disabled:opacity-50 transition-colors"
            >
              {deleting ? "Deleting..." : "Delete"}
            </button>
            <button
              onClick={() => setConfirmDelete(false)}
              disabled={deleting}
              className="text-xs text-red-500 dark:text-red-400
                         hover:text-red-700 transition-colors"
            >
              Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  );
}


function EditIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
         stroke="currentColor" strokeWidth="2" strokeLinecap="round"
         aria-hidden="true">
      <path d="M12 5H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-7" />
      <path d="M18.375 2.625a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4z" />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
         stroke="currentColor" strokeWidth="2" strokeLinecap="round"
         aria-hidden="true">
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
      <path d="M10 11v6M14 11v6" />
      <path d="M9 6V4h6v2" />
    </svg>
  );
}