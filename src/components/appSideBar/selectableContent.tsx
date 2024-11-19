import { Search } from "lucide-react";
import { Input } from "../ui/input/input";
import { cn } from "@/lib/utils";

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
