import {Link} from "react-router";

export default function NotFound() {
    return (
         <div className="min-h-screen bg-white dark:bg-gray-950 flex flex-col
                    items-center justify-center px-6 text-center">

      <p className="text-[120px] md:text-[160px] font-bold leading-none
                    text-gray-100 dark:text-gray-800 select-none">
        404
      </p>

      <div className="mt-6 flex flex-col items-center gap-2">
        <h1 className="text-xl font-medium text-gray-900 dark:text-white">
          Page not found
        </h1>
        <p className="text-sm text-gray-400 dark:text-gray-600 max-w-xs leading-relaxed">
          The page you're looking for doesn't exist or has been moved.
        </p>
      </div>

      <div className="flex items-center gap-3 mt-8">
        <Link
          to="/"
          className="flex items-center gap-1.5 text-sm font-medium
                     text-gray-900 dark:text-white border border-gray-200
                     dark:border-gray-700 px-4 py-2 rounded-lg
                     hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
        >
          <HomeIcon />
          Go home
        </Link>
        <button
          onClick={() => window.history.back()}
          className="text-sm text-gray-500 dark:text-gray-400
                     hover:text-gray-900 dark:hover:text-white
                     transition-colors"
        >
          Go back
        </button>
      </div>
    </div>
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

function HomeIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
         stroke="currentColor" strokeWidth="2" strokeLinecap="round"
         strokeLinejoin="round" aria-hidden="true">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  );
}
