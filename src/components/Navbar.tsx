import { useState, useRef, useEffect, useCallback } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { useAuth } from "../hooks/useAuths";
import { postService } from "../service/post.service";
import type { Post } from "../types";
import { useClickOutside } from "../hooks/useClickOutside";

export function Navbar() {
  const [menuOpen, setMenuOpen]       = useState(false);
  const [searchOpen, setSearchOpen]   = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Post[]>([]);
  const [searching, setSearching]     = useState(false);

  const menuRef   = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef  = useRef<HTMLInputElement>(null);

  const { isAuthenticated, user, signOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // close everything on route change
  useEffect(() => {
    setMenuOpen(false);
    setSearchOpen(false);
    setSearchQuery("");
    setSearchResults([]);
  }, [location.pathname]);

  useClickOutside(menuRef, () => setMenuOpen(false));

  useClickOutside(searchRef, () => {
    setSearchOpen(false);
    setSearchQuery("");
    setSearchResults([]);
  })
  useEffect(() => {
    if (searchOpen) inputRef.current?.focus();
  }, [searchOpen]);

  const handleSearchChange = useCallback(async (value: string) => {
    setSearchQuery(value);
    if (!value.trim()) {
      setSearchResults([]);
      return;
    }
    try {
      setSearching(true);
      const res = await postService.getAll(1, 5, value);
      setSearchResults(res.data);
    } catch {
      setSearchResults([]);
    } finally {
      setSearching(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery) handleSearchChange(searchQuery);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleSignOut = async () => {
    await signOut();
    navigate("/login");
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="w-full border-b border-gray-100 dark:border-gray-800
                    bg-white dark:bg-gray-950 px-7 h-14 flex items-center
                    justify-between gap-3 sticky top-0 z-50">

      <Link
        to="/"
        className="flex items-center gap-2 text-sm font-medium
                   text-gray-900 dark:text-white shrink-0"
      >
        <LogoMark />
        VIBELY
      </Link>

      <div className="flex items-center gap-2">

        {isAuthenticated && (
          <Link
            to="/posts/new"
            className="flex items-center gap-1.5 text-xs font-medium shrink-0
                       text-gray-900 dark:text-white border border-gray-200
                       dark:border-gray-700 px-3.5 py-1.5 rounded-md
                       hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            <WriteIcon />
            Write
          </Link>
        )}

        <div className="relative" ref={searchRef}>
          <div className="flex items-center">
            <input
              ref={inputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search posts..."
              className={`h-8 text-sm border border-gray-200 dark:border-gray-700
                         rounded-md bg-gray-50 dark:bg-gray-800 text-gray-900
                         dark:text-white placeholder:text-gray-400 outline-none
                         pl-3 pr-8 transition-all duration-200 ease-in-out
                         ${searchOpen
                           ? "w-48 opacity-100"
                           : "w-0 opacity-0 pointer-events-none border-transparent"
                         }`}
            />
            <button
              onClick={() => setSearchOpen((p) => !p)}
              aria-label="Toggle search"
              className={`flex items-center justify-center w-8 h-8 rounded-md
                         text-gray-500 dark:text-gray-400 hover:text-gray-900
                         dark:hover:text-white hover:bg-gray-100
                         dark:hover:bg-gray-800 transition-colors shrink-0
                         ${searchOpen ? "-ml-8 relative z-10" : ""}`}
            >
              <SearchIcon />
            </button>
          </div>

          {searchOpen && searchQuery && (
            <div className="absolute top-[calc(100%+6px)] right-0 w-72
                            bg-white dark:bg-gray-900 border border-gray-100
                            dark:border-gray-800 rounded-xl overflow-hidden z-50">
              {searching && (
                <div className="px-4 py-3 text-sm text-gray-400 dark:text-gray-500">
                  Searching...
                </div>
              )}

              {!searching && searchResults.length === 0 && (
                <div className="px-4 py-3 text-sm text-gray-400 dark:text-gray-500">
                  No posts found for "{searchQuery}"
                </div>
              )}

              {!searching && searchResults.map((post) => (
                <Link
                  key={post.id}
                  to={`/posts/${post.id}`}
                  className="flex flex-col px-4 py-3 hover:bg-gray-50
                             dark:hover:bg-gray-800 transition-colors border-b
                             border-gray-50 dark:border-gray-800 last:border-0"
                >
                  <span className="text-sm font-medium text-gray-900
                                   dark:text-white line-clamp-1">
                    {post.p_title}
                  </span>
                  <span className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                    {post.author?.name}
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>

        <div className="w-px h-4 bg-gray-100 dark:bg-gray-800 shrink-0" />

        {!isAuthenticated && (
          <>
            <Link
              to="/login"
              className="text-sm text-gray-500 dark:text-gray-400
                         hover:text-gray-900 dark:hover:text-white
                         hover:bg-gray-50 dark:hover:bg-gray-800
                         px-3 py-1.5 rounded-md transition-colors"
            >
              Sign in
            </Link>
            <Link
              to="/register"
              className="text-sm text-gray-900 dark:text-white border
                         border-gray-200 dark:border-gray-700 px-3.5 py-1.5
                         rounded-md hover:bg-gray-50 dark:hover:bg-gray-800
                         transition-colors"
            >
              Sign up
            </Link>
          </>
        )}


        {isAuthenticated && (
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setMenuOpen((p) => !p)}
              className="flex items-center gap-1.5 pl-1 pr-2 py-1 rounded-md
                         hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              <UserAvatar name={user?.name ?? "?"} />
              <span className="text-sm text-gray-900 dark:text-white">
                {user?.name.split(" ")[0]}
              </span>
              <ChevronIcon open={menuOpen} />
            </button>

            {menuOpen && (
              <div className="absolute top-[calc(100%+6px)] right-0 bg-white
                              dark:bg-gray-900 border border-gray-100
                              dark:border-gray-800 rounded-xl p-1.5
                              min-w-[188px] z-50">

                <p className="text-[10px] font-medium tracking-widest
                               text-gray-400 dark:text-gray-600 px-2.5 pt-1 pb-2">
                  MY ACCOUNT
                </p>

                <MenuItem to={`/profile/${user?.id}`} icon={<ProfileIcon />}>
                  My profile
                </MenuItem>

                <MenuItem to="/dashboard" icon={<DashboardIcon />}>
                  Dashboard
                </MenuItem>

                <MenuItem to="/posts/new" icon={<WriteIcon />}>
                  New post
                </MenuItem>

                <div className="h-px bg-gray-100 dark:bg-gray-800 my-1" />

                <button
                  onClick={handleSignOut}
                  className="flex items-center gap-2 w-full text-left px-2.5 py-2
                             text-sm text-gray-500 dark:text-gray-400 rounded-lg
                             hover:bg-red-50 dark:hover:bg-red-950
                             hover:text-red-600 dark:hover:text-red-400
                             transition-colors"
                >
                  <SignOutIcon />
                  Sign out
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}


function NavLink({ to, active, children }: {
  to: string; active: boolean; children: React.ReactNode;
}) {
  return (
    <Link
      to={to}
      className={`text-sm px-3 py-1.5 rounded-md transition-colors
        ${active
          ? "text-gray-900 dark:text-white font-medium bg-gray-50 dark:bg-gray-800"
          : "text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800"
        }`}
    >
      {children}
    </Link>
  );
}

function MenuItem({ to, icon, children }: {
  to: string; icon: React.ReactNode; children: React.ReactNode;
}) {
  return (
    <Link
      to={to}
      className="flex items-center gap-2 px-2.5 py-2 text-sm text-gray-500
                 dark:text-gray-400 rounded-lg hover:bg-gray-50
                 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white
                 transition-colors"
    >
      {icon}
      {children}
    </Link>
  );
}

function UserAvatar({ name }: { name: string }) {
  const initials = name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
  return (
    <div className="w-7 h-7 rounded-full bg-gray-100 dark:bg-gray-700 flex
                    items-center justify-center text-[11px] font-medium
                    text-gray-600 dark:text-gray-300">
      {initials}
    </div>
  );
}

function LogoMark() {
  return (
    <div className="flex flex-col gap-[3px] justify-center w-5">
      <span className="block h-[2.5px] w-full bg-gray-900 dark:bg-white rounded-sm" />
      <span className="block h-[2.5px] w-[65%] bg-gray-900 dark:bg-white rounded-sm" />
    </div>
  );
}

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
         stroke="currentColor" strokeWidth="2"
         className={`text-gray-400 transition-transform duration-200 ${open ? "rotate-180" : ""}`}>
      <path d="M6 9l6 6 6-6" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
         stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <circle cx="11" cy="11" r="8" />
      <path d="M21 21l-4.35-4.35" />
    </svg>
  );
}

function WriteIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
         stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M12 5H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-7" />
      <path d="M18.375 2.625a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4z" />
    </svg>
  );
}

function ProfileIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
         stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
    </svg>
  );
}

function DashboardIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
         stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
    </svg>
  );
}

function SignOutIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
         stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  );
}