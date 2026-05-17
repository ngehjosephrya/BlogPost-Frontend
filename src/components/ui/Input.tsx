import type { InputHTMLAttributes} from "react";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
    error?: boolean;
};

export function Input({ error, className, ...props }: InputProps) {
  const base = `w-full h-10 px-3 text-sm rounded-lg border outline-none 
                transition-colors text-gray-900 dark:text-white 
                bg-white dark:bg-gray-800
                placeholder:text-gray-300 dark:placeholder:text-gray-600`;
  const normal = "border-gray-200 dark:border-gray-700 focus:border-gray-400 dark:focus:border-gray-500";
  const errored = "border-red-300 dark:border-red-800 focus:border-red-400";

  return (
    <input
      className={`${base} ${error ? errored : normal} ${className ?? ""}`}
      {...props}
    />
  );
}