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
      <div
        className={cn(
          "flex flex-col px-4 divide-y-2 divide-gray-600",
          className
        )}
      >
        <div className="pb-4">
          <Input
            className="h-8 text-gray-900 focus-visible:ring-0 focus-visible:ring-offset-0"
            icon={<Search />}
          />
        </div>
        <div className="pt-4">{children}</div>
      </div>
    );
  };