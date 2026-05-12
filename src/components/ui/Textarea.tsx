type TextarearProps = React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
    error?: boolean;
};

export function Textarea({error, ...props}: TextarearProps){
    const base = "w-full px-3 py-2.5 text-sm rounded-lg border outline-none transition-colors text-gray-900 dark:text-white bg-white dark:bg-gray-900 placeholder:text-gray-300 dark:placeholder:text-gray-600 resize-none";
    const normal = "border-gray-200 dark:border-gray-700 focus:border-gray-400 dark:focus:border-gray-500";
    const errored = "border-red-300 dark:border-red-800 focus:border-red-400";

    return (
        <textarea className={`${base} ${error ? errored : normal}`}
        {...props}
        />
    );
}