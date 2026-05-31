type StatCardProps = {
  label: string;
  value: number;
  icon: React.ReactNode;
};

export function StatCard({ label, value, icon }: StatCardProps) {
    return (
    <div className="bg-white dark:bg-gray-900 border border-gray-100
                    dark:border-gray-800 rounded-xl p-4 flex flex-col gap-2">
      <div className="w-7 h-7 rounded-md bg-gray-100 dark:bg-gray-800
                      flex items-center justify-center text-gray-500
                      dark:text-gray-400">
        {icon}
      </div>
      <p className="text-2xl font-medium text-gray-900 dark:text-white">
        {value}
      </p>
      <p className="text-xs text-gray-500 dark:text-gray-400">{label}</p>
    </div>
  );
}
