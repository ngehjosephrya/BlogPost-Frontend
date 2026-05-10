import type { ButtonHTMLAttributes } from "react";
import { Spinner } from "./Spinner";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
    loading?: boolean;
    variant?: "primary" | "ghost";
    fullwidth?: boolean;
};

export function Button({
    loading, 
    variant = "primary",
    fullwidth = false, 
    children,
    disabled,
    ...props
}: ButtonProps) {
    const base = "h-10 px-4 text-sm font-meduim rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed";
    const primary = "bg-gray-900 text-white hover:bg-gray-700";
    const ghost = "bg-transparent text-gray-600 border border-gray-200 hover: bg-gray-50";

    return(
        <button
        disabled={disabled || loading}
        className={`${base} ${variant === "primary" ? primary : ghost} ${fullwidth ? "w-full" : ""}`}
        {...props}
        >
            {loading ? <Spinner/> : children}
        </button>
    );
}