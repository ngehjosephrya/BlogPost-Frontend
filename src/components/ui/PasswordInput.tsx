import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import type { InputHTMLAttributes } from "react";
import { Input } from "./Input";

type PasswordInputProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "type"
> & {
  error?: boolean;
};

export function PasswordInput({ error, ...props }: PasswordInputProps) {
  const [show, setShow] = useState(false);

  const base = `w-full h-10 px-3 pr-10 text-sm rounded-lg border outline-none 
                transition-colors text-gray-900 dark:text-white
                bg-white dark:bg-gray-800
                placeholder:text-gray-300 dark:placeholder:text-gray-600`;
  const normal = "border-gray-200 dark:border-gray-700 focus:border-gray-400 dark:focus:border-gray-500";
  const errored = "border-red-300 dark:border-red-800 focus:border-red-400";

  return (
    <div className="relative">
      <input
        type={show ? "text" : "password"}
        className={`${base} ${error ? errored : normal}`}
        {...props}
      />
      <button
        type="button"
        onClick={() => setShow(p => !p)}
        className="absolute right-3 top-1/2 -translate-y-1/2
                   text-gray-400 dark:text-gray-500
                   hover:text-gray-600 dark:hover:text-gray-300
                   transition-colors"
        aria-label={show ? "Hide password" : "Show password"}
      >
        {show ? <EyeOff size={15} /> : <Eye size={15} />}
      </button>
    </div>
  );
}