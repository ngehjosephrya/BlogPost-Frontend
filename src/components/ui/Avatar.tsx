type AvatarProps = {
  name: string;
  size?: "sm" | "md";
};

export function Avatar({ name, size = "sm" }: AvatarProps) {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
     const dimensions = size === "sm" ? "w-7 h-7 text-[11px]" : "w-10 h-10 text-sm";

    return (
        <div className={`${dimensions} rounded-full bg-gray-100 dark:bg-gray-700
        flex items-center justify-center font-meduim text-gray-300 shrink-0`}>
            {initials}
        </div>
    );
}
