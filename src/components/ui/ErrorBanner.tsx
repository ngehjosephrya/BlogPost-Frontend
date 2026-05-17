type ErrorBannerProps = {
    message: string;
};

export function ErrorBanner({message} : ErrorBannerProps) {
    return(
        <div className="mb-5 px-4 py-3 rounded-lg border bg-red-50 border-red-100">
            <p className="text-sm text-red-300">{message}</p>
        </div>
    );
}