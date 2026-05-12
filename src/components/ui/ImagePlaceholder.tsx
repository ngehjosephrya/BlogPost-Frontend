type ImagePlaceholderProps = {
  title: string;
  imageUrl?: string;
};

export function ImagePlaceholder({ title, imageUrl }: ImagePlaceholderProps) {
  return (
    <div className="w-full aspect-4/3 rounded-xl bg-gray-100 dark:bggr-800 overflow-hidden">
      {imageUrl ? (
        <img
          src={imageUrl}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-300
                hover:scale-105"
          onError={(e) => {
            e.currentTarget.style.display = "none";
          }}
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center">
            <span className="text-2xl font-medium text-gray-300 dark:text-gray-600">
                {title.charAt(0).toUpperCase()}
            </span>
        </div>
      )}
    </div>
  );
}
