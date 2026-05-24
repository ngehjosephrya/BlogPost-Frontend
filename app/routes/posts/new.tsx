import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Placeholder from "@tiptap/extension-placeholder";
import { useAuth } from "../../../src/hooks/useAuths";
import { postService } from "../../../src/service/post.service";
import { ErrorBanner, Toggle, TagInput } from "../../../src/components/ui";
import { Toolbar } from "../../../src/components/editor/Toolbar";
import { ImageUploadZone } from "../../../src/components/editor/ImageUploadZone";
import { SuccessModal } from "../../../src/components/ui/SuccesModal";

export default function NewPost() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();

  const [title, setTitle]           = useState("");
  const [imageUrl, setImageUrl]     = useState<string | null>(null);
  const [categories, setCategories] = useState<string[]>([]);
  const [tags, setTags]             = useState<string[]>([]);
  const [published, setPublished]   = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const [submitting, setSubmitting]   = useState(false);
  const [error, setError]             = useState<string | null>(null);
  const [categorySuggestions, setCategorySuggestions] = useState<string[]>([]);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate("/login", { replace: true });
    }
  }, [isLoading, isAuthenticated, navigate]);

  useEffect(() => {
    const fetchSuggestions = async () => {
      try {
        const res = await postService.getAll(1, 100);
        const cats = res.data
          .flatMap((p) => p.categories?.map((c) => c.name) ?? [])
          .filter((v, i, arr) => arr.indexOf(v) === i);
        setCategorySuggestions(cats);
      } catch {
        // non-critical
      }
    };
    fetchSuggestions();
  }, []);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Placeholder.configure({
        placeholder: "Write your post here...",
      }),
    ],
    editorProps: {
      attributes: {
        class:
          "min-h-[360px] outline-none text-sm leading-relaxed text-gray-900 dark:text-white prose prose-sm max-w-none",
      },
    },
  });

  const validate = (): string | null => {
    if (!title.trim())
      return "Please add a title before saving.";
    if (title.trim().length < 5)
      return "Title must be at least 5 characters.";
    const body = editor?.getHTML() ?? "";
    if (!body || body === "<p></p>")
      return "Please write some content before saving.";
    return null;
  };

  const handleSubmit = async (asDraft: boolean) => {
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      console.log("Submitting with imageUrl:", imageUrl);

      await postService.create({
        p_title:    title.trim(),
        p_body:     editor!.getHTML(),
        imageUrl:   imageUrl ?? undefined,
        published:  asDraft ? false : published,
        categories,
        tags,
      });

      setShowSuccess(true);
      navigate(`/`);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to create post."
      );
      window.scrollTo({ top: 0, behavior: "smooth" });
    } finally {
      setSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-950">
        <PageSpinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      {showSuccess && (
      <SuccessModal
        title="Post published successfully"
        message="Your post is now live and visible to everyone."
        onClose={() => setShowSuccess(false)}
      />
    )}
      <div className="max-w-5xl mx-auto px-6 py-8">

        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Link
              to="/"
              className="flex items-center gap-1.5 text-sm text-gray-500
                         dark:text-gray-400 hover:text-gray-900
                         dark:hover:text-white transition-colors"
            >
              <BackIcon />
              Back
            </Link>
            <div className="w-px h-3.5 bg-gray-200 dark:bg-gray-700" />
            <span className="text-sm font-medium text-gray-900 dark:text-white">
              New post
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => handleSubmit(true)}
              disabled={submitting}
              className="text-sm text-gray-600 dark:text-gray-400 border
                         border-gray-200 dark:border-gray-700 px-4 py-1.5
                         rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800
                         disabled:opacity-50 transition-colors"
            >
              {submitting ? "Saving..." : "Save draft"}
            </button>
            <button
              type="button"
              onClick={() => handleSubmit(false)}
              disabled={submitting}
              className="text-sm font-medium text-white bg-gray-900
                         dark:bg-white dark:text-gray-900 px-4 py-1.5
                         rounded-lg hover:bg-gray-700 dark:hover:bg-gray-100
                         disabled:opacity-50 transition-colors"
            >
              {submitting ? "Publishing..." : "Publish"}
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-6">
            <ErrorBanner message={error} />
          </div>
        )}

        <div className="grid grid-cols-[1fr_272px] gap-6 items-start">

          <div className="bg-white dark:bg-gray-900 border border-gray-100
                          dark:border-gray-800 rounded-xl p-6 flex flex-col gap-4">

            <div>
              <textarea
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  if (error) setError(null);
                }}
                placeholder="Post title..."
                rows={2}
                maxLength={200}
                className="w-full text-2xl font-medium text-gray-900
                           dark:text-white placeholder:text-gray-300
                           dark:placeholder:text-gray-700 bg-transparent
                           border-none outline-none resize-none leading-snug"
              />
              <p className="text-xs text-gray-300 dark:text-gray-700 text-right mt-1">
                {title.length} / 200
              </p>
            </div>

            <div className="h-px bg-gray-100 dark:bg-gray-800" />

            <Toolbar editor={editor} />

            <div className="h-px bg-gray-100 dark:bg-gray-800" />

            <EditorContent editor={editor} />
          </div>

          <div className="flex flex-col gap-4">

            <SidebarCard label="COVER IMAGE">
              <ImageUploadZone
                imageUrl={imageUrl}
                onUpload={(url) => {
                  console.log("Image uploaded, URL:", url);
                  setImageUrl(url)
                }}
                onRemove={() => setImageUrl(null)}
              />
              {imageUrl && (
                <p className="text-xs text-green-500 mt-2 truncate">
                  ✓ Image ready
                </p>
              )}
            </SidebarCard>

            <SidebarCard label="CATEGORIES">
              <TagInput
                tags={categories}
                suggestions={categorySuggestions}
                placeholder="Search or add category..."
                onAdd={(c) =>
                  setCategories((prev) =>
                    prev.includes(c) ? prev : [...prev, c]
                  )
                }
                onRemove={(c) =>
                  setCategories((prev) => prev.filter((x) => x !== c))
                }
              />
            </SidebarCard>

            <SidebarCard label="TAGS">
              <TagInput
                tags={tags}
                placeholder="Type and press Enter..."
                onAdd={(t) =>
                  setTags((prev) =>
                    prev.includes(t) ? prev : [...prev, t]
                  )
                }
                onRemove={(t) =>
                  setTags((prev) => prev.filter((x) => x !== t))
                }
              />
            </SidebarCard>

            <SidebarCard label="SETTINGS">
              <Toggle
                checked={published}
                onChange={setPublished}
                label="Publish immediately"
              />
              <p className="text-xs text-gray-400 dark:text-gray-600 mt-2 leading-relaxed">
                {published
                  ? "Post will be visible to everyone once submitted."
                  : "Post will be saved as a private draft."}
              </p>
            </SidebarCard>

            <SidebarCard label="AUTHOR">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800
                                flex items-center justify-center text-xs font-medium
                                text-gray-600 dark:text-gray-400 shrink-0">
                  {user?.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {user?.name}
                  </p>
                  <p className="text-xs text-gray-400 dark:text-gray-600">
                    {user?.email}
                  </p>
                </div>
              </div>
            </SidebarCard>
          </div>
        </div>
      </div>

      <style>{`
        .tiptap p.is-editor-empty:first-child::before {
          content: attr(data-placeholder);
          float: left;
          color: #9ca3af;
          pointer-events: none;
          height: 0;
        }
        .dark .tiptap p.is-editor-empty:first-child::before {
          color: #4b5563;
        }
        .tiptap h1 { font-size: 1.5rem; font-weight: 600; margin: 1rem 0 0.5rem; }
        .tiptap h2 { font-size: 1.25rem; font-weight: 600; margin: 1rem 0 0.5rem; }
        .tiptap h3 { font-size: 1.1rem; font-weight: 600; margin: 0.75rem 0 0.5rem; }
        .tiptap ul { list-style: disc; padding-left: 1.25rem; margin: 0.5rem 0; }
        .tiptap ol { list-style: decimal; padding-left: 1.25rem; margin: 0.5rem 0; }
        .tiptap li { margin: 0.25rem 0; }
        .tiptap blockquote {
          border-left: 3px solid #e5e7eb;
          padding-left: 1rem;
          color: #6b7280;
          margin: 0.75rem 0;
          font-style: italic;
        }
        .tiptap code {
          background: #f3f4f6;
          padding: 0.15rem 0.35rem;
          border-radius: 4px;
          font-size: 0.85em;
          font-family: monospace;
        }
        .tiptap pre {
          background: #1f2937;
          color: #f9fafb;
          padding: 1rem;
          border-radius: 8px;
          overflow-x: auto;
          margin: 0.75rem 0;
        }
        .tiptap pre code {
          background: none;
          padding: 0;
          color: inherit;
          font-size: 0.875rem;
        }
        .tiptap a { color: #2563eb; text-decoration: underline; }
        .tiptap p { margin: 0.5rem 0; }
        .dark .tiptap blockquote { border-left-color: #374151; color: #9ca3af; }
        .dark .tiptap code { background: #1f2937; color: #f9fafb; }
        .dark .tiptap a { color: #60a5fa; }
      `}</style>
    </div>
  );
}

function SidebarCard({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-100
                    dark:border-gray-800 rounded-xl p-4">
      <p className="text-[11px] font-medium tracking-widest
                    text-gray-400 dark:text-gray-600 mb-3">
        {label}
      </p>
      {children}
    </div>
  );
}

function BackIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
         stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M19 12H5M12 19l-7-7 7-7" />
    </svg>
  );
}

function PageSpinner() {
  return (
    <svg className="animate-spin" width="20" height="20" viewBox="0 0 24 24"
         fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
         aria-label="Loading">
      <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
    </svg>
  );
}