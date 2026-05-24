import { useNavigate } from "react-router";

type SuccessModalProps = {
  title: string;
  message: string;
  onClose: () => void;
};

export function SuccessModal({ title, message, onClose }: SuccessModalProps) {
  const navigate = useNavigate();

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center
                 bg-black/40 dark:bg-black/60"
    >
      <div
        className="bg-white dark:bg-gray-900 border border-gray-100
                   dark:border-gray-800 rounded-2xl px-10 py-8 max-w-sm w-full
                   mx-4 flex flex-col items-center gap-4 text-center"
        role="dialog"
        aria-labelledby="success-modal-title"
      >
        <div className="w-16 h-16 rounded-full bg-green-50 dark:bg-green-950
                        flex items-center justify-center">
          <ThumbsUpIcon />
        </div>

        <div className="flex flex-col gap-1.5">
          <h2
            id="success-modal-title"
            className="text-base font-medium text-gray-900 dark:text-white"
          >
            {title}
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
            {message}
          </p>
        </div>

        <button
          onClick={() => navigate("/")}
          className="w-full flex items-center justify-center gap-2 text-sm
                     font-medium text-gray-900 dark:text-white border
                     border-gray-200 dark:border-gray-700 px-4 py-2.5
                     rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800
                     transition-colors mt-1"
        >
          <HomeIcon />
          Return to home page
        </button>
      </div>
    </div>
  );
}

function ThumbsUpIcon() {
  return (
    <svg
      width="28" height="28" viewBox="0 0 24 24"
      fill="none" stroke="currentColor"
      strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
      className="text-green-500 dark:text-green-400"
      aria-hidden="true"
    >
      <path d="M7 10v12" />
      <path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2h0a3.13 3.13 0 0 1 3 3.88Z" />
    </svg>
  );
}

function HomeIcon() {
  return (
    <svg
      width="15" height="15" viewBox="0 0 24 24"
      fill="none" stroke="currentColor"
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  );
}