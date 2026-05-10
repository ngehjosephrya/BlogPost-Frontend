// src/components/Navbar.tsx
import { useState, useRef, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { ChevronDown, LogOut, User } from "lucide-react";
import { useAuth } from "../globally/hooks/useAuths";

export function Navbar() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { isAuthenticated, user, signOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const isActive = (path: string) => location.pathname === path;

  const handleSignOut = async () => {
    await signOut();
    navigate("/login");
  };

  return (
    <nav className="w-full border-b border-gray-100 bg-white px-8 h-14 flex items-center justify-between">

      {/* Logo */}
      <Link to="/" className="flex items-center gap-2 text-sm font-medium text-gray-900">
        <LogoMark />
        Blog Template
      </Link>

      {/* Nav links */}
      <div className="flex items-center gap-1">
        <NavLink to="/"     active={isActive("/")}>Home</NavLink>
        <NavLink to="/blog" active={isActive("/blog")}>Blog</NavLink>
        <NavLink to="/posts" active={isActive("/posts")}>Single Post</NavLink>

        {/* Other Pages dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen(prev => !prev)}
            className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900
                       hover:bg-gray-50 px-3 py-1.5 rounded-md transition-colors"
          >
            Other Pages
            <ChevronDown
              size={14}
              className={`transition-transform duration-200 ${dropdownOpen ? "rotate-180" : ""}`}
            />
          </button>

          {dropdownOpen && (
            <div className="absolute top-[calc(100%+6px)] right-0 bg-white border
                            border-gray-100 rounded-xl p-1.5 min-w-[160px] z-50">
              <DropdownItem to="/login"    onClick={() => setDropdownOpen(false)}>Login</DropdownItem>
              <DropdownItem to="/register" onClick={() => setDropdownOpen(false)}>Register</DropdownItem>
              {isAuthenticated && (
                <>
                  <DropdownItem to="/dashboard"         onClick={() => setDropdownOpen(false)}>Dashboard</DropdownItem>
                  <DropdownItem to={`/profile/${user?.id}`} onClick={() => setDropdownOpen(false)}>Profile</DropdownItem>
                </>
              )}
            </div>
          )}
        </div>

        {/* Auth section */}
        <div className="flex items-center gap-2 ml-3 pl-3 border-l border-gray-100">
          {isAuthenticated ? (
            <>
              {/* User name with icon */}
              <div className="flex items-center gap-1.5 text-sm text-gray-500">
                <User size={14} />
                {user?.name}
              </div>

              {/* Sign out with icon */}
              <button
                onClick={handleSignOut}
                className="flex items-center gap-1.5 text-sm text-gray-500
                           hover:text-gray-900 hover:bg-gray-50 px-3 py-1.5
                           rounded-md transition-colors"
              >
                <LogOut size={14} />
                Sign out
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="text-sm text-gray-500 hover:text-gray-900
                           hover:bg-gray-50 px-3 py-1.5 rounded-md transition-colors"
              >
                Sign in
              </Link>
              <Link
                to="/register"
                className="text-sm text-gray-900 border border-gray-200
                           hover:bg-gray-50 px-3.5 py-1.5 rounded-md transition-colors"
              >
                Sign up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function NavLink({
  to,
  active,
  children,
}: {
  to: string;
  active: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      to={to}
      className={`text-sm px-3 py-1.5 rounded-md transition-colors
        ${active
          ? "text-gray-900 font-medium"
          : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
        }`}
    >
      {children}
    </Link>
  );
}

function DropdownItem({
  to,
  onClick,
  children,
}: {
  to: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <Link
      to={to}
      onClick={onClick}
      className="block w-full text-left px-3 py-2 text-sm text-gray-500
                 hover:text-gray-900 hover:bg-gray-50 rounded-md transition-colors"
    >
      {children}
    </Link>
  );
}

function LogoMark() {
  return (
    <div className="flex flex-col gap-[3px] justify-center w-5">
      <span className="block h-[3px] w-full bg-gray-900 rounded-sm" />
      <span className="block h-[3px] w-[65%] bg-gray-900 rounded-sm" />
    </div>
  );
}