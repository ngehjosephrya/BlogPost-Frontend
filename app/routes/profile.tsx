import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../../src//hooks/useAuths";
import { usersService } from "../../src//service/users.service";
import { postService } from "../../src//service/post.service";
import { ErrorBanner } from "../../src//components/ui";
import { PostCard } from "../../src//components/PostCard";
import { PostCardSkeleton } from "../../src//components/PostCardSkeleton";
import type { Post } from "../../src//types";

type Tab = "posts" | "edit";

export default function Profile() {
  const { user, updateUser, isLoading: authLoading, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<Tab>("posts");

  const [posts, setPosts]           = useState<Post[]>([]);
  const [postsLoading, setPostsLoading] = useState(true);

  const [avatarUrl, setAvatarUrl]     = useState<string | null>(null);
  const [avatarUploading, setAvatarUploading] = useState(false);
  const avatarInputRef = useRef<HTMLInputElement>(null);

  const [name, setName]             = useState("");
  const [email, setEmail]           = useState("");
  const [password, setPassword]     = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [saving, setSaving]         = useState(false);
  const [saveError, setSaveError]   = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate("/login", { replace: true });
    }
  }, [authLoading, isAuthenticated, navigate]);

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
      setAvatarUrl(user.avatarUrl ?? null);
    }
  }, [user]);

  useEffect(() => {
    if (!user?.id || authLoading) return;

    const fetchPosts = async () => {
      try {
        setPostsLoading(true);
        const res = await postService.getByUserId(user.id);
        setPosts(res.data.filter((p) => p.published));
      } catch {
      } finally {
        setPostsLoading(false);
      }
    };

    fetchPosts();
  }, [user?.id, authLoading]);

  // ── Avatar upload ──────────────────────────────────────────────────────────
  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    try {
      setAvatarUploading(true);
      const url = await usersService.uploadAvatar(file);
      const res = await usersService.update(user.id, { avatarUrl: url });

      setAvatarUrl(url);
      updateUser(res.data);

      const stored = localStorage.getItem("user");
      if (stored) {
        const parsed = JSON.parse(stored);
        localStorage.setItem("user", JSON.stringify({ ...parsed, avatarUrl: url }));
      }
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : "Avatar upload failed");
    } finally {
      setAvatarUploading(false);
      e.target.value = "";
    }
  };

  const handleSave = async () => {
    if (!user) return;

    setSaveError(null);
    setSaveSuccess(false);

    // Validate
    if (!name.trim()) {
      setSaveError("Name cannot be empty.");
      return;
    }
    if (!email.trim()) {
      setSaveError("Email cannot be empty.");
      return;
    }
    if (password && password.length < 6) {
      setSaveError("Password must be at least 6 characters.");
      return;
    }
    if (password && password !== confirmPassword) {
      setSaveError("Passwords do not match.");
      return;
    }

    try {
      setSaving(true);

      const payload: { name?: string; email?: string; password?: string } = {};
      if (name  !== user.name)  payload.name  = name.trim();
      if (email !== user.email) payload.email = email.trim();
      if (password)             payload.password = password;

      if (Object.keys(payload).length === 0) {
        setSaveError("No changes to save.");
        return;
      }

      await usersService.update(user.id, payload);
      updateUser(payload);
      setSaveSuccess(true);
      setPassword("");
      setConfirmPassword("");

      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : "Failed to save changes.");
    } finally {
      setSaving(false);
    }
  };

  // ── Loading ────────────────────────────────────────────────────────────────
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center
                      bg-white dark:bg-gray-950">
        <PageSpinner />
      </div>
    );
  }

  const initials = user?.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2) ?? "?";

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      <div className="max-w-3xl mx-auto px-4 md:px-6 py-8 md:py-10">

        <div className="flex flex-col sm:flex-row items-start sm:items-center
                        gap-5 mb-8">

          <div className="relative shrink-0">
            <div className="w-20 h-20 rounded-full bg-gray-100 dark:bg-gray-800
                            overflow-hidden flex items-center justify-center">
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt={user?.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-2xl font-medium text-gray-500
                                 dark:text-gray-400">
                  {initials}
                </span>
              )}
            </div>

            <button
              onClick={() => avatarInputRef.current?.click()}
              disabled={avatarUploading}
              className="absolute bottom-0 right-0 w-6 h-6 rounded-full
                         bg-gray-900 dark:bg-white flex items-center text-white dark:text-gray-900
                         justify-center hover:bg-gray-700 dark:hover:bg-gray-100
                         transition-colors disabled:opacity-50"
              aria-label="Change avatar"
            >
              {avatarUploading ? (
                <MiniSpinner />
              ) : (
                <CameraIcon />
              )}
            </button>

            <input
              ref={avatarInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleAvatarChange}
              className="hidden"
            />
          </div>

          <div className="flex flex-col gap-1">
            <h1 className="text-xl font-medium text-gray-900 dark:text-white">
              {user?.name}
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {user?.email}
            </p>
            <p className="text-xs text-gray-400 dark:text-gray-600 mt-1">
              Member since{" "}
              {user?.createdAt
                ? new Date(user.createdAt).toLocaleDateString("en-US", {
                    month: "long",
                    year:  "numeric",
                  })
                : "—"}
            </p>
          </div>
        </div>

        <div className="flex border-b border-gray-100 dark:border-gray-800 mb-6">
          <TabButton
            active={activeTab === "posts"}
            onClick={() => setActiveTab("posts")}
          >
            My posts
            <span className="ml-1.5 text-xs text-gray-400 dark:text-gray-600">
              {posts.length}
            </span>
          </TabButton>
          <TabButton
            active={activeTab === "edit"}
            onClick={() => setActiveTab("edit")}
          >
            Edit profile
          </TabButton>
        </div>

        {activeTab === "posts" && (
          <div>
            {postsLoading && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {Array.from({ length: 4 }).map((_, i) => (
                  <PostCardSkeleton key={i} />
                ))}
              </div>
            )}

            {!postsLoading && posts.length === 0 && (
              <div className="text-center py-16">
                <p className="text-sm text-gray-400 dark:text-gray-600 mb-4">
                  You haven't published any posts yet.
                </p>
                <a href="/posts/new" className="text-sm font-medium text-gray-900 dark:text-white
                             underline underline-offset-2">
                
                  Write your first post
                </a>
              </div>
            )}

            {!postsLoading && posts.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-stretch">
                {posts.map((post) => (
                  <PostCard key={post.id} post={post} />
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "edit" && (
          <div className="max-w-md flex flex-col gap-5">

            {saveError && <ErrorBanner message={saveError} />}

            {saveSuccess && (
              <div className="px-4 py-3 rounded-lg bg-green-50 dark:bg-green-950
                              border border-green-100 dark:border-green-900">
                <p className="text-sm text-green-600 dark:text-green-400">
                  Profile updated successfully.
                </p>
              </div>
            )}

            <EditField label="Full name">
              <input
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setSaveError(null);
                }}
                className="w-full h-10 px-3 text-sm border border-gray-200
                           dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900
                           text-gray-900 dark:text-white outline-none
                           focus:border-gray-400 dark:focus:border-gray-500
                           transition-colors"
              />
            </EditField>

            <EditField label="Email address">
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setSaveError(null);
                }}
                className="w-full h-10 px-3 text-sm border border-gray-200
                           dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900
                           text-gray-900 dark:text-white outline-none
                           focus:border-gray-400 dark:focus:border-gray-500
                           transition-colors"
              />
            </EditField>

            <div className="h-px bg-gray-100 dark:bg-gray-800" />
            <p className="text-xs text-gray-400 dark:text-gray-600 -mt-2">
              Leave password fields empty to keep your current password.
            </p>

            <EditField label="New password">
              <input
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setSaveError(null);
                }}
                placeholder="••••••••"
                autoComplete="new-password"
                className="w-full h-10 px-3 text-sm border border-gray-200
                           dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900
                           text-gray-900 dark:text-white placeholder:text-gray-300
                           dark:placeholder:text-gray-600 outline-none
                           focus:border-gray-400 dark:focus:border-gray-500
                           transition-colors"
              />
            </EditField>

            <EditField label="Confirm new password">
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  setSaveError(null);
                }}
                placeholder="••••••••"
                autoComplete="new-password"
                className="w-full h-10 px-3 text-sm border border-gray-200
                           dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900
                           text-gray-900 dark:text-white placeholder:text-gray-300
                           dark:placeholder:text-gray-600 outline-none
                           focus:border-gray-400 dark:focus:border-gray-500
                           transition-colors"
              />
            </EditField>

            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="w-full h-10 text-sm font-medium text-white bg-gray-900
                         dark:bg-white dark:text-gray-900 rounded-lg
                         hover:bg-gray-700 dark:hover:bg-gray-100
                         disabled:opacity-50 transition-colors"
            >
              {saving ? "Saving..." : "Save changes"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}


function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-4 py-2.5 text-sm font-medium transition-colors border-b-2
                  flex items-center
                  ${active
                    ? "text-gray-900 dark:text-white border-gray-900 dark:border-white"
                    : "text-gray-500 dark:text-gray-400 border-transparent hover:text-gray-700 dark:hover:text-gray-300"
                  }`}
    >
      {children}
    </button>
  );
}

function EditField({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs text-gray-500 dark:text-gray-400 font-medium">
        {label}
      </label>
      {children}
    </div>
  );
}


function CameraIcon() {
  return (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none"
         stroke="currentColor" strokeWidth="2" strokeLinecap="round"
         aria-hidden="true">
      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
      <circle cx="12" cy="13" r="4"/>
    </svg>
  );
}

function MiniSpinner() {
  return (
    <svg className="animate-spin" width="11" height="11" viewBox="0 0 24 24"
         fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
    </svg>
  );
}

function PageSpinner() {
  return (
    <svg className="animate-spin" width="20" height="20" viewBox="0 0 24 24"
         fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
    </svg>
  );
}