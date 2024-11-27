
export const SelectableContent = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className="h-full">
      <div className="pt-4 h-full">{children}</div>
    </div>
  );
};
