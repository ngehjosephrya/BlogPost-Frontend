import {useState, useEffect} from "react";
import {Link, useNavigate} from "react-router";
import {useAuth} from "../../src/hooks/useAuths";
import {postService} from "../../src/service/post.service";
import {StatCard, ConfirmModal} from "../../src/components/ui";
import type {Post} from "../../src/types";

type Filter = "all" | "published" | "drafts";

function formatDate(dateString: string) {
    return new Date(dateString).toLocaleDateString("en-US",{
        month: "short",
        day: "numeric",
        year: "numeric",
    });
}

export default function Dashboard() {
    const {user} = useAuth();
    const navigate = useNavigate();

    const [posts, setPosts] = useState<Post[]>([]);
    const [filter, setFilter] = useState<Filter>("all");
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [deleteTarget, setDeleteTarget] = useState<Post | null>(null);
    const [deleting, setDeleting] = useState(false);

    useEffect(() => {
        if (!user?.id) return;

        const fetchPosts = async () => {
            try {
                setIsLoading(true);
                const res = await postService.getByUserId(user.id);
                setPosts(res.data);
            }catch{
                setError("Failed to fetch posts");
            } finally {
                setIsLoading(false);
            }
        };
        fetchPosts();
    }, [user?.id]);

    const totalLikes = posts.reduce((acc, p) => acc + (p._count?.likes || 0), 0);
    const totalComments = posts.reduce((acc, p) => acc + (p._count?.comments || 0), 0);
    const publishedPosts = posts.filter(p => p.published).length;

    const filtered = posts.filter((p) =>{
        if(filter === "published") return p.published;
        if(filter === "drafts") return !p.published;
        return true;
    });

    const handleDelete = async () => {
        if (!deleteTarget) return;

        try{
            setDeleting(true);
            await postService.delete(deleteTarget.id);
            setPosts((prev) => prev.filter((p) => p.id !== deleteTarget.id));
            setDeleteTarget(null);
        }catch{

        }finally {
            setDeleting(false);
        }
    };

    return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      <div className="max-w-4xl mx-auto px-4 md:px-6 py-8 md:py-10">

        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="text-xl font-medium text-gray-900 dark:text-white">
              Dashboard
            </h1>
            <p className="text-sm text-gray-400 dark:text-gray-600 mt-0.5">
              Welcome back, {user?.name}
            </p>
          </div>
          <Link
            to="/posts/new"
            className="flex items-center gap-1.5 text-sm font-medium
                       text-gray-900 dark:text-white border border-gray-200
                       dark:border-gray-700 px-3.5 py-1.5 rounded-lg
                       hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            <PlusIcon />
            New post
          </Link>
        </div>

        {!isLoading && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
            <StatCard
              label="Total posts"
              value={posts.length}
              icon={<PostIcon />}
            />
            <StatCard
              label="Published"
              value={publishedPosts}
              icon={<EyeIcon />}
            />
            <StatCard
              label="Total likes"
              value={totalLikes}
              icon={<HeartIcon />}
            />
            <StatCard
              label="Total comments"
              value={totalComments}
              icon={<CommentIcon />}
            />
          </div>
        )}

        <div>

          <div className="flex items-center justify-between mb-3">
            <div className="flex gap-1 bg-gray-100 dark:bg-gray-800
                            rounded-lg p-1">
              {(["all", "published", "drafts"] as Filter[]).map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md
                              transition-colors capitalize
                              ${filter === f
                                ? "bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                                : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                              }`}
                >
                  {f}
                </button>
              ))}
            </div>
            <p className="text-xs text-gray-400 dark:text-gray-600">
              {filtered.length} {filtered.length === 1 ? "post" : "posts"}
            </p>
          </div>

          {isLoading && (
            <div className="border border-gray-100 dark:border-gray-800
                            rounded-xl overflow-hidden">
              {Array.from({ length: 3 }).map((_, i) => (
                <PostRowSkeleton key={i} />
              ))}
            </div>
          )}

          {error && !isLoading && (
            <div className="text-center py-16">
              <p className="text-sm text-red-500">{error}</p>
            </div>
          )}

          {!isLoading && !error && filtered.length === 0 && (
            <div className="border border-gray-100 dark:border-gray-800
                            rounded-xl py-16 text-center">
              <p className="text-sm text-gray-400 dark:text-gray-600 mb-4">
                {filter === "all"
                  ? "You haven't written any posts yet."
                  : `No ${filter} posts.`}
              </p>
              {filter === "all" && (
                <Link
                  to="/posts/new"
                  className="text-sm font-medium text-gray-900 dark:text-white
                             underline underline-offset-2"
                >
                  Write your first post
                </Link>
              )}
            </div>
          )}

          {!isLoading && !error && filtered.length > 0 && (
            <div className="border border-gray-100 dark:border-gray-800
                            rounded-xl overflow-hidden">
              {filtered.map((post, index) => (
                <div
                  key={post.id}
                  className={`flex items-center gap-3 px-4 py-3.5
                              ${index < filtered.length - 1
                                ? "border-b border-gray-50 dark:border-gray-800"
                                : ""
                              }`}
                >
                  <div className="w-11 h-11 rounded-lg bg-gray-100 dark:bg-gray-800
                                  shrink-0 overflow-hidden">
                    {post.imageUrl ? (
                      <img
                        src={post.imageUrl}
                        alt={post.p_title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center
                                      text-sm font-medium text-gray-400 dark:text-gray-600">
                        {post.p_title.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white
                                  truncate">
                      {post.p_title}
                    </p>
                    <p className="text-xs text-gray-400 dark:text-gray-600 mt-0.5">
                      {formatDate(post.createdAt)}
                      {" · "}
                      {post._count?.likes ?? 0} likes
                      {" · "}
                      {post._count?.comments ?? 0} comments
                    </p>
                  </div>

                  <span
                    className={`text-[11px] font-medium px-2.5 py-1 rounded-full
                                shrink-0 hidden sm:inline-flex
                                ${post.published
                                  ? "bg-green-50 dark:bg-green-950 text-green-600 dark:text-green-400 border border-green-100 dark:border-green-900"
                                  : "bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-gray-700"
                                }`}
                  >
                    {post.published ? "Published" : "Draft"}
                  </span>

                  <div className="flex items-center gap-1 shrink-0">
                    {post.published && (
                      <ActionButton
                        title="View post"
                        onClick={() => navigate(`/posts/${post.id}`)}
                      >
                        <EyeIcon />
                      </ActionButton>
                    )}

                    {/* Edit */}
                    <ActionButton
                      title="Edit post"
                      onClick={() => navigate(`/posts/${post.id}/edit`)}
                    >
                      <EditIcon />
                    </ActionButton>

                    {/* Delete */}
                    <ActionButton
                      title="Delete post"
                      danger
                      onClick={() => setDeleteTarget(post)}
                    >
                      <TrashIcon />
                    </ActionButton>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {deleteTarget && (
        <ConfirmModal
          title="Delete post"
          message={`"${deleteTarget.p_title}" will be permanently deleted. This cannot be undone.`}
          confirmLabel="Delete"
          loading={deleting}
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </div>
  );
}


function ActionButton({
  title,
  onClick,
  danger = false,
  children,
}: {
  title: string;
  onClick: () => void;
  danger?: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      title={title}
      onClick={onClick}
      className={`w-7 h-7 rounded-md flex items-center justify-center
                  transition-colors border-none bg-none
                  ${danger
                    ? "text-gray-400 dark:text-gray-600 hover:bg-red-50 dark:hover:bg-red-950 hover:text-red-500 dark:hover:text-red-400"
                    : "text-gray-400 dark:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-700 dark:hover:text-gray-300"
                  }`}
    >
      {children}
    </button>
  );
}

function PostRowSkeleton() {
  return (
    <div className="flex items-center gap-3 px-4 py-3.5 border-b
                    border-gray-50 dark:border-gray-800 animate-pulse">
      <div className="w-11 h-11 rounded-lg bg-gray-100 dark:bg-gray-800 shrink-0" />
      <div className="flex-1 flex flex-col gap-2">
        <div className="h-3.5 w-48 bg-gray-100 dark:bg-gray-800 rounded" />
        <div className="h-3 w-32 bg-gray-100 dark:bg-gray-800 rounded" />
      </div>
      <div className="h-5 w-16 bg-gray-100 dark:bg-gray-800 rounded-full hidden sm:block" />
      <div className="flex gap-1">
        <div className="w-7 h-7 bg-gray-100 dark:bg-gray-800 rounded-md" />
        <div className="w-7 h-7 bg-gray-100 dark:bg-gray-800 rounded-md" />
      </div>
    </div>
  );
}


function PlusIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
         stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );
}

function PostIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
         stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M12 5H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-7" />
      <path d="M18.375 2.625a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4z" />
    </svg>
  );
}

function EyeIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
         stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function HeartIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
         stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  );
}

function CommentIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
         stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  );
}

function EditIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
         stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M12 5H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-7" />
      <path d="M18.375 2.625a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4z" />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
         stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
      <path d="M10 11v6M14 11v6" />
      <path d="M9 6V4h6v2" />
    </svg>
  );
}