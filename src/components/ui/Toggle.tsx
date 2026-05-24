type ToggleProps = {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
};

export function Toggle({ checked, onChange, label }: ToggleProps) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-gray-600 dark:text-gray-400">{label}</span>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative w-9 h-5 rounded-full border-none transition-colors
            shrink-0 ${
              checked
                ? "bg-gray-900 dark:bg-white"
                : "bg-gray-200 dark:bg-gray-700"
            }`}
      >
        <span className={`absolite top-0.5 w-4 h-4 rounded-full transition-all
            ${checked ? "left-[calc(100%-18px)] bg-white dark:bg-gray-900"
                : "left-0.5 bg-white dark:bg-gray-400"
            }`} 
        />
      </button>
    </div>
  );
}
