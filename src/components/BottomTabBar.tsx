import { Link, useLocation } from "react-router";
import { useAuth } from "../hooks/useAuths";

export function BottomTabBar() {
  const location  = useLocation();
  const { isAuthenticated, user } = useAuth();

  const isActive = (path: string) => location.pathname === path;

  // Don't show on pages that have their own nav
  const hiddenOn = ["/login", "/register"];
  if (
    hiddenOn.includes(location.pathname) ||
    location.pathname.startsWith("/posts/")
  ) {
    return null;
  }

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 lg:hidden
                 bg-white dark:bg-gray-950 border-t border-gray-100
                 dark:border-gray-800 flex items-center
                 pb-safe" 
      aria-label="Mobile navigation"
    >
      <TabItem
        to="/"
        active={isActive("/")}
        label="Home"
        icon={<HomeIcon />}
      />

      {isAuthenticated ? (
        <div className="flex-1 flex items-center justify-center py-2">
          <Link
            to="/posts/new"
            className="flex flex-col items-center gap-1"
            aria-label="Write a post"
          >
            <div className="w-8 h-8 rounded-xl bg-gray-900 dark:bg-white
                            flex items-center justify-center">
              <WriteIcon light />
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

      {isAuthenticated && (
        <TabItem
          to="/dashboard"
          active={isActive("/dashboard")}
          label="Dashboard"
          icon={<DashboardIcon />}
        />
      )}

      {isAuthenticated ? (
        <div className="flex-1 flex items-center justify-center py-2">
          <Link
            to={`/profile/${user?.id}`}
            className={`flex flex-col items-center gap-1
                        ${isActive(`/profile/${user?.id}`)
                          ? "text-gray-900 dark:text-white"
                          : "text-gray-400 dark:text-gray-600"
                        }`}
            aria-label="Your profile"
          >
            {user?.avatarUrl ? (
              <img
                src={user.avatarUrl}
                alt={user.name}
                className="w-7 h-7 rounded-full object-cover"
              />
            ) : (
              <div className={`w-7 h-7 rounded-full flex items-center
                              justify-center text-[10px] font-medium
                              ${isActive(`/profile/${user?.id}`)
                                ? "bg-gray-900 dark:bg-white text-white dark:text-gray-900"
                                : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400"
                              }`}>
                {user?.name.charAt(0).toUpperCase()}
              </div>
            )}
            <span className="text-[10px]">Profile</span>
          </Link>
        </div>
      ) : (
        <TabItem
          to="/register"
          active={isActive("/register")}
          label="Sign up"
          icon={<UserPlusIcon />}
        />
      )}
    </nav>
  );
}


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
                    : "text-gray-400 dark:text-gray-600 hover:text-gray-600 dark:hover:text-gray-400"
                  }`}
      aria-current={active ? "page" : undefined}
    >
      {icon}
      <span className="text-[10px] font-medium">{label}</span>
    </Link>
  );
}

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

function WriteIcon({ light = false }: { light?: boolean }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
         stroke={light ? "white" : "currentColor"}
         strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
         aria-hidden="true"
         className={light ? "dark:stroke-gray-900" : ""}>
      <path d="M12 5H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-7" />
      <path d="M18.375 2.625a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4z" />
    </svg>
  );
}

function DashboardIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
         stroke="currentColor" strokeWidth="2" strokeLinecap="round"
         aria-hidden="true">
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
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