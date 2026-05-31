type AvatarProps = {
  name:      string;
  imageUrl?: string | null;   // ← add this
  size?:     "sm" | "md";
};

export function Avatar({ name, imageUrl, size = "sm" }: AvatarProps) {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const dimensions = size === "sm"
    ? "w-7 h-7 text-[11px]"
    : "w-10 h-10 text-sm";

  return (
    <div
      className={`${dimensions} rounded-full bg-gray-100 dark:bg-gray-700
                  overflow-hidden flex items-center justify-center font-medium
                  text-gray-600 dark:text-gray-300 shrink-0`}
    >
      {imageUrl ? (
        <img
          src={imageUrl}
          alt={name}
          className="w-full h-full object-cover"
        />
      ) : (
        initials
      )}
    </div>
  );
}