type ConfirmModalProps = {
  title: string;
  message: string;
  confirmLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
  loading?: boolean;
};

export function ConfirmModal({
  title,
  message,
  confirmLabel = "Delete",
  onConfirm,
  onCancel,
  loading = false,
}: ConfirmModalProps) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center
                    bg-black/40 dark:bg-black/60 px-4">
      <div className="bg-white dark:bg-gray-900 border border-gray-100
                      dark:border-gray-800 rounded-2xl p-6 max-w-sm w-full
                      flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <h2 className="text-base font-medium text-gray-900 dark:text-white">
            {title}
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
            {message}
          </p>
        </div>
        <div className="flex items-center gap-2 justify-end">
          <button
            onClick={onCancel}
            disabled={loading}
            className="text-sm text-gray-600 dark:text-gray-400 border
                       border-gray-200 dark:border-gray-700 px-4 py-2
                       rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800
                       disabled:opacity-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="text-sm font-medium text-white bg-red-500
                       hover:bg-red-600 px-4 py-2 rounded-lg
                       disabled:opacity-50 transition-colors"
          >
            {loading ? "Deleting..." : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
