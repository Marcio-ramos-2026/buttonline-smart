import { Input } from "@/components/ui/input";
import { useDebounceCallback } from "@/hooks/useDebounceCallback";
import { Search } from "lucide-react";

interface SearchInputProps {
  onValueChange: (value: string) => void;
  debounceTime?: number;
}

export const SearchInput = ({
  onValueChange,
  debounceTime = 500,
}: SearchInputProps) => {
  const debounced = useDebounceCallback((val: string) => {
    onValueChange(val);
  }, debounceTime);

  return (
    <Input
      className="h-8 focus-visible:ring-0 focus-visible:ring-offset-0"
      icon={<Search />}
      onChange={(e) => debounced(e.target.value)}
      color='primaryForeground'
    />
  );
};
