type FieldProps = {
    label: string;
    children: React.ReactNode;
};

export function Field({ label, children }: FieldProps) {
  return (
    <div className="mb-4">
      <label className="block text-xs text-gray-400 dark:text-gray-500 mb-1.5 tracking-wide">
        {label}
      </label>
      {children}
    </div>
  );
}