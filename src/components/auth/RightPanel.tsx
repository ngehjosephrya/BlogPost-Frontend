type RightPanelProps = {
  quote: string;
  author: string;
};

export function RightPanel({ quote, author }: RightPanelProps) {
  return (
    <div className="hidden lg:flex relative bg-[#f5f4f0] dark:bg-gray-800
                    items-center justify-center px-16 overflow-hidden">
      {/* Decorative circles */}
      <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full
                      border border-[#d3d1c7] dark:border-gray-700" />
      <div className="absolute -bottom-10 -left-10 w-48 h-48 rounded-full
                      border border-[#d3d1c7] dark:border-gray-700" />

      {/* Quote */}
      <div className="relative text-center">
        <p className="font-serif text-xl text-[#2c2c2a] dark:text-gray-100
                      leading-relaxed mb-4 max-w-xs">
          "{quote}"
        </p>
        <p className="text-sm text-[#5f5e5a] dark:text-gray-400">
          — {author}
        </p>
      </div>
    </div>
  );
}