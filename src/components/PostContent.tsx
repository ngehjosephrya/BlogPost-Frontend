type PostContentProps = {
    html: string;
};

export function PostContent({ html }: PostContentProps) {
    return (
        <div className="
        prose-content text-[15px] leading-relaxed text-gray-600 dark:text-gray-400
        [&_h1]:text-2xl [&_h1]:font-medium [&_h1]:text-gray-900 [&_h1]:dark:text-white [&_h1]:mt-8 [&_h1]:mb-3
        [&_h2]:text-xl [&_h2]:font-medium [&_h2]:text-gray-900 [&_h2]:dark:text-white [&_h2]:mt-8 [&_h2]:mb-3
        [&_h3]:text-lg [&_h3]:font-medium [&_h3]:text-gray-900 [&_h3]:dark:text-white [&_h3]:mt-6 [&_h3]:mb-2
        [&_p]:mb-4 [&_p]:leading-relaxed
        [&_strong]:font-medium [&_strong]:text-gray-900 [&_strong]:dark:text-white
        [&_em]:italic
        [&_u]:underline [&_u]:underline-offset-2
        [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:mb-4 [&_ul]:space-y-1
        [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:mb-4 [&_ol]:space-y-1
        [&_li]:text-gray-600 [&_li]:dark:text-gray-400
        [&_blockquote]:border-l-[3px] [&_blockquote]:border-gray-200 [&_blockquote]:dark:border-gray-700
        [&_blockquote]:pl-4 [&_blockquote]:text-gray-500 [&_blockquote]:dark:text-gray-500
        [&_blockquote]:italic [&_blockquote]:my-6
        [&_code]:bg-gray-100 [&_code]:dark:bg-gray-800 [&_code]:px-1.5 [&_code]:py-0.5
        [&_code]:rounded [&_code]:text-[0.85em] [&_code]:font-mono
        [&_pre]:bg-gray-900 [&_pre]:dark:bg-gray-800 [&_pre]:text-gray-100
        [&_pre]:p-4 [&_pre]:rounded-xl [&_pre]:overflow-x-auto [&_pre]:my-4
        [&_pre_code]:bg-transparent [&_pre_code]:p-0 [&_pre_code]:text-sm
        [&_a]:text-blue-600 [&_a]:dark:text-blue-400 [&_a]:underline [&_a]:underline-offset-2"
        
        dangerouslySetInnerHTML={{__html: html}}/>
    );
}