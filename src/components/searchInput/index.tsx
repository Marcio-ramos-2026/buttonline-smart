import { Input } from "@/components/ui/input/input";
import { useState } from "react";
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
//   const [value, setValue] = useState("");

  const debounced = useDebounceCallback((val: string) => {
    // setValue(val);
    onValueChange(val); // Atualiza o valor externamente
  }, debounceTime);

  return (
    <Input
      className="h-8 text-gray-200 focus-visible:ring-0 focus-visible:ring-offset-0"
      icon={<Search />}
      onChange={(e) => debounced(e.target.value)}
    />
  );
};
