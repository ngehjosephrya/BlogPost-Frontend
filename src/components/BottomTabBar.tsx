import { useState, useRef, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { useAuth } from "../hooks/useAuths";

export function BottomTabBar() {
  const location  = useLocation();
  const navigate  = useNavigate();
  const { isAuthenticated, user, signOut } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const isActive = (path: string) => location.pathname === path;

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  const handleSignOut = async () => {
    await signOut();
    setMenuOpen(false);
    navigate("/login");
  };

  const hiddenOn = ["/login", "/register"];
  if (
    hiddenOn.includes(location.pathname) ||
    location.pathname.startsWith("/posts/")
  ) {
    return null;
  }

  return (
    <>
      {menuOpen && isAuthenticated && (
        <div
          className="fixed inset-0 z-40 bg-black/30"
          onClick={() => setMenuOpen(false)}
        />
      )}

      {menuOpen && isAuthenticated && (
        <div
          ref={menuRef}
          className="fixed bottom-16 right-3 z-50 bg-white dark:bg-gray-900
                     border border-gray-100 dark:border-gray-800 rounded-2xl
                     p-2 min-w-45 shadow-lg"
        >
          {/* User info */}
          <div className="px-3 py-2 border-b border-gray-100 dark:border-gray-800 mb-1">
            <p className="text-xs font-medium text-gray-900 dark:text-white truncate">
              {user?.name}
            </p>
            <p className="text-xs text-gray-400 dark:text-gray-600 truncate">
              {user?.email}
            </p>
          </div>

          {/* Profile link */}
          <Link
            to={`/profile/${user?.id}`}
            className="flex items-center gap-2.5 px-3 py-2.5 text-sm
                       text-gray-600 dark:text-gray-400 hover:text-gray-900
                       dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800
                       rounded-xl transition-colors"
          >
            <ProfileIcon />
            My profile
          </Link>

          {/* Dashboard link */}
          <Link
            to="/dashboard"
            className="flex items-center gap-2.5 px-3 py-2.5 text-sm
                       text-gray-600 dark:text-gray-400 hover:text-gray-900
                       dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800
                       rounded-xl transition-colors"
          >
            <DashboardIcon />
            Dashboard
          </Link>

          {/* Divider */}
          <div className="h-px bg-gray-100 dark:bg-gray-800 my-1" />

          {/* Sign out */}
          <button
            onClick={handleSignOut}
            className="flex items-center gap-2.5 w-full px-3 py-2.5 text-sm
                       text-red-500 hover:bg-red-50 dark:hover:bg-red-950
                       rounded-xl transition-colors"
          >
            <SignOutIcon />
            Sign out
          </button>
        </div>
      )}

      {/* Bottom tab bar */}
      <nav
        className="fixed bottom-0 left-0 right-0 z-50 lg:hidden
                   bg-white dark:bg-gray-950 border-t border-gray-100
                   dark:border-gray-800 flex items-center pb-safe"
        aria-label="Mobile navigation"
      >
        {/* Home */}
        <TabItem
          to="/"
          active={isActive("/")}
          label="Home"
          icon={<HomeIcon />}
        />

        {/* Write — logged in only */}
        {isAuthenticated ? (
          <div className="flex-1 flex items-center justify-center py-2">
            <Link
              to="/posts/new"
              className="flex flex-col items-center gap-1"
              aria-label="Write a post"
            >
              <div className="w-8 h-8 rounded-xl bg-gray-900 dark:bg-white
                              flex items-center justify-center">
                <WriteIcon />
              </div>
              <span className="text-[10px] text-gray-500 dark:text-gray-400">
                Write
              </span>
            </Link>
          </div>
        ) : (
          <TabItem
            to="/login"
            active={isActive("/login")}
            label="Sign in"
            icon={<SignInIcon />}
          />
        )}

        {/* Avatar menu button — logged in only */}
        {isAuthenticated ? (
          <button
            onClick={() => setMenuOpen((p) => !p)}
            className="flex-1 flex flex-col items-center justify-center
                       gap-1 py-2 transition-colors"
            aria-label="Account menu"
          >
            {user?.avatarUrl ? (
              <img
                src={user.avatarUrl}
                alt={user.name}
                className={`w-7 h-7 rounded-full object-cover ring-2
                            ${menuOpen
                              ? "ring-gray-900 dark:ring-white"
                              : "ring-transparent"
                            }`}
              />
            ) : (
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center
                            text-[10px] font-medium transition-colors
                            ${menuOpen
                              ? "bg-gray-900 dark:bg-white text-white dark:text-gray-900"
                              : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400"
                            }`}
              >
                {user?.name.charAt(0).toUpperCase()}
              </div>
            )}
            <span className="text-[10px] text-gray-500 dark:text-gray-400">
              Account
            </span>
          </button>
        ) : (
          <TabItem
            to="/register"
            active={isActive("/register")}
            label="Sign up"
            icon={<UserPlusIcon />}
          />
        )}
      </nav>
    </>
  );
}

// ─── Tab item ─────────────────────────────────────────────────────────────────

function TabItem({
  to,
  active,
  label,
  icon,
}: {
  to: string;
  active: boolean;
  label: string;
  icon: React.ReactNode;
}) {
  return (
    <Link
      to={to}
      className={`flex-1 flex flex-col items-center justify-center gap-1
                  py-2 transition-colors
                  ${active
                    ? "text-gray-900 dark:text-white"
                    : "text-gray-400 dark:text-gray-600"
                  }`}
      aria-current={active ? "page" : undefined}
    >
      {icon}
      <span className="text-[10px] font-medium">{label}</span>
    </Link>
  );
}

// ─── Icons ────────────────────────────────────────────────────────────────────

function HomeIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
         stroke="currentColor" strokeWidth="2" strokeLinecap="round"
         strokeLinejoin="round" aria-hidden="true">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  );
}

function WriteIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
         stroke="white" strokeWidth="2" strokeLinecap="round"
         strokeLinejoin="round" aria-hidden="true"
         className="dark:stroke-gray-900">
      <path d="M12 5H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-7" />
      <path d="M18.375 2.625a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4z" />
    </svg>
  );
}

function ProfileIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
         stroke="currentColor" strokeWidth="2" strokeLinecap="round"
         aria-hidden="true">
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
    </svg>
  );
}

function DashboardIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
         stroke="currentColor" strokeWidth="2" strokeLinecap="round"
         aria-hidden="true">
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
    </svg>
  );
}

function SignOutIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
         stroke="currentColor" strokeWidth="2" strokeLinecap="round"
         aria-hidden="true">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  );
}

function SignInIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
         stroke="currentColor" strokeWidth="2" strokeLinecap="round"
         aria-hidden="true">
      <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
      <polyline points="10 17 15 12 10 7" />
      <line x1="15" y1="12" x2="3" y2="12" />
    </svg>
  );
}

function UserPlusIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
         stroke="currentColor" strokeWidth="2" strokeLinecap="round"
         aria-hidden="true">
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <line x1="19" y1="8" x2="19" y2="14" />
      <line x1="22" y1="11" x2="16" y2="11" />
    </svg>
  );
}