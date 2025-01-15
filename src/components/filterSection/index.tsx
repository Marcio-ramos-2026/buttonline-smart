"use client";

import { ReactElement, useState } from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useTranslations } from "next-intl";

type FilterOption = {
  key: string;
  label: string;
  type: "input" | "select";
  icon?: ReactElement;
  options?: { value: string; label: string }[]; // For 'select' type
};

type FiltersSectionProps = {
  filtersConfig: FilterOption[];
  onApply: (filters: Record<string, string>) => void;
};

export function FiltersSection({
  filtersConfig,
  onApply,
}: FiltersSectionProps) {
  const [filters, setFilters] = useState<Record<string, string>>({});
  const t = useTranslations("pages.admin.filter");

  // Update a specific filter dynamically
  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => {
      const copy = { ...prev };
      if (!value) {
        delete copy[key];
      } else {
        copy[key] = value;
      }
      return copy;
    });
  };

  const handleReset = () => {
    const resetFilters: Record<string, string> = {};
    filtersConfig.forEach((filter) => (resetFilters[filter.key] = ""));
    setFilters(resetFilters);
  };

  return (
    <div className="flex flex-col gap-4 p-4 bg-gray-50 rounded-lg shadow w-full max-w-full overflow-x-auto">
      <p className="text-xl font-semibold">{t("title")}</p>
      <div className="flex flex-col md:flex-row gap-5 items-center justify-between flex-wrap">
        <div className="flex items-center gap-4 flex-wrap w-full">
          {filtersConfig.map((filter) => (
            <div key={filter.key} className="min-w-40 flex-shrink-0">
              <Label htmlFor={filter.key}>{filter.label}</Label>
              {filter.type === "input" ? (
                <Input
                  id={filter.key}
                  placeholder={filter.label.toLowerCase()}
                  value={filters[filter.key] || ""}
                  onChange={(e) =>
                    handleFilterChange(filter.key, e.target.value)
                  }
                  icon={filter.icon}
                  iconPlacement="end"
                />
              ) : filter.type === "select" && filter.options ? (
                <Select
                  onValueChange={(value) =>
                    handleFilterChange(filter.key, value)
                  }
                  defaultValue={filters[filter.key]}
                >
                  <SelectTrigger id={filter.key}>
                    <SelectValue
                      placeholder={`Select ${filter.label.toLowerCase()}`}
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {filter.options.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : null}
            </div>
          ))}
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-4 self-end mt-4 md:mt-0 flex-1">
          <Button variant="outline" onClick={handleReset}>
            {t("clean")}
          </Button>
          <Button onClick={() => onApply(filters)}>{t("apply")}</Button>
        </div>
      </div>
    </div>
  );
}
