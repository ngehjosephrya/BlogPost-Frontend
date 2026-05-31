// src/components/MobileHeader.tsx
import { Link } from "react-router";

export function MobileHeader() {
  return (
    <header className="lg:hidden flex items-center px-4 h-12 border-b
                       border-gray-100 dark:border-gray-800 bg-white
                       dark:bg-gray-950 sticky top-0 z-40">
      <Link
        to="/"
        className="flex items-center gap-2 text-sm font-medium
                   text-gray-900 dark:text-white"
      >
        <LogoMark />
        VIBELY
      </Link>
    </header>
  );
}

function LogoMark() {
  return (
    <div className="flex flex-col gap-0.75 justify-center w-5">
      <span className="block h-[2.5px] w-full bg-gray-900 dark:bg-white rounded-sm" />
      <span className="block h-[2.5px] w-[65%] bg-gray-900 dark:bg-white rounded-sm" />
    </div>
  );
}