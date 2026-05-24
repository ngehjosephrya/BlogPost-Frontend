import type { Editor } from "@tiptap/core";

type ToolbarProps = {
  editor: Editor | null;
};

type ToolItem = {
  label: React.ReactNode;
  action: () => void;
  active: boolean;
  title: string;
};

type ToolGroup = {
  group: ToolItem[];
};

export function Toolbar({ editor }: ToolbarProps) {
  if (!editor) return null;

  const tools: ToolGroup[] = [
    {
      group: [
        {
          label: <BoldIcon />,
          action: () => editor.chain().focus().toggleMark("bold").run(),
          active: editor.isActive("bold"),
          title: "Bold",
        },
        {
          label: <ItalicIcon />,
          action: () => editor.chain().focus().toggleMark("italic").run(),
          active: editor.isActive("italic"),
          title: "Italic",
        },
        {
          label: <UnderlineIcon />,
          action: () => editor.chain().focus().toggleMark("underline").run(),
          active: editor.isActive("underline"),
          title: "Underline",
        },
      ],
    },
    {
      group: [
        {
          label: <span className="text-[11px] font-semibold">H1</span>,
          action: () =>
            editor.chain().focus().toggleNode("heading", "paragraph", { level: 1 }).run(),
          active: editor.isActive("heading", { level: 1 }),
          title: "Heading 1",
        },
        {
          label: <span className="text-[11px] font-semibold">H2</span>,
          action: () =>
            editor.chain().focus().toggleNode("heading", "paragraph", { level: 2 }).run(),
          active: editor.isActive("heading", { level: 2 }),
          title: "Heading 2",
        },
        {
          label: <span className="text-[11px] font-semibold">H3</span>,
          action: () =>
            editor.chain().focus().toggleNode("heading", "paragraph", { level: 3 }).run(),
          active: editor.isActive("heading", { level: 3 }),
          title: "Heading 3",
        },
      ],
    },
    {
      group: [
        {
          label: <BulletListIcon />,
          action: () =>
            editor.chain().focus().toggleList("bulletList", "listItem").run(),
          active: editor.isActive("bulletList"),
          title: "Bullet list",
        },
        {
          label: <OrderedListIcon />,
          action: () =>
            editor.chain().focus().toggleList("orderedList", "listItem").run(),
          active: editor.isActive("orderedList"),
          title: "Ordered list",
        },
      ],
    },
    {
      group: [
        {
          label: <CodeIcon />,
          action: () => editor.chain().focus().toggleMark("code").run(),
          active: editor.isActive("code"),
          title: "Inline code",
        },
        {
          label: <CodeBlockIcon />,
          action: () =>
            editor.chain().focus().toggleNode("codeBlock", "paragraph").run(),
          active: editor.isActive("codeBlock"),
          title: "Code block",
        },
      ],
    },
    {
      group: [
        {
          label: <BlockquoteIcon />,
          action: () =>
            editor.chain().focus().toggleNode("blockquote", "paragraph").run(),
          active: editor.isActive("blockquote"),
          title: "Blockquote",
        },
      ],
    },
  ];

  return (
    <div className="flex items-center gap-1 flex-wrap py-1.5">
      {tools.map((group, gi) => (
        <div key={gi} className="flex items-center gap-0.5">
          {gi > 0 && (
            <div className="w-px h-4 bg-gray-200 dark:bg-gray-700 mx-1" />
          )}
          {group.group.map((tool, ti) => (
            <button
              key={ti}
              type="button"
              title={tool.title}
              onClick={tool.action}
              className={`w-7 h-7 flex items-center justify-center rounded-md
                         text-sm transition-colors
                         ${tool.active
                           ? "bg-gray-900 dark:bg-white text-white dark:text-gray-900"
                           : "text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white"
                         }`}
            >
              {tool.label}
            </button>
          ))}
        </div>
      ))}
    </div>
  );
}

// ─── Icons — unchanged ────────────────────────────────────────────────────────

function BoldIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
         stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <path d="M6 4h8a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z"/>
      <path d="M6 12h9a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z"/>
    </svg>
  );
}

function ItalicIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
         stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <line x1="19" y1="4" x2="10" y2="4"/>
      <line x1="14" y1="20" x2="5" y2="20"/>
      <line x1="15" y1="4" x2="9" y2="20"/>
    </svg>
  );
}

function UnderlineIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
         stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M6 3v7a6 6 0 0 0 6 6 6 6 0 0 0 6-6V3"/>
      <line x1="4" y1="21" x2="20" y2="21"/>
    </svg>
  );
}

function BulletListIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
         stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <line x1="9" y1="6" x2="20" y2="6"/>
      <line x1="9" y1="12" x2="20" y2="12"/>
      <line x1="9" y1="18" x2="20" y2="18"/>
      <circle cx="4" cy="6" r="1" fill="currentColor"/>
      <circle cx="4" cy="12" r="1" fill="currentColor"/>
      <circle cx="4" cy="18" r="1" fill="currentColor"/>
    </svg>
  );
}

function OrderedListIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
         stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <line x1="10" y1="6" x2="21" y2="6"/>
      <line x1="10" y1="12" x2="21" y2="12"/>
      <line x1="10" y1="18" x2="21" y2="18"/>
      <path d="M4 6h1v4"/>
      <path d="M4 10h2"/>
      <path d="M6 18H4c0-1 2-2 2-3s-1-1.5-2-1"/>
    </svg>
  );
}

function CodeIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
         stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <polyline points="16 18 22 12 16 6"/>
      <polyline points="8 6 2 12 8 18"/>
    </svg>
  );
}

function CodeBlockIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
         stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <rect x="2" y="3" width="20" height="18" rx="2"/>
      <line x1="2" y1="9" x2="22" y2="9"/>
      <path d="M8 14l-2 2 2 2"/>
      <path d="M14 14l2 2-2 2"/>
    </svg>
  );
}

function BlockquoteIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
         stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z"/>
      <path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z"/>
    </svg>
  );
}