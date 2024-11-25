
export const SelectableContent = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div>
      <div className="pt-4">{children}</div>
    </div>
  );
};
