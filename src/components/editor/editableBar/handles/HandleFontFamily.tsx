'use client'

import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { useState } from "react";

const fontFamilys = ["Font 1", "Font 2", "Font 3"];

export const HandleFontFamily = () => {
    const [fontFamily, setFontFamily] = useState("");
    
  return (
    <Select
      onValueChange={(e: string) => {
        setFontFamily(e);
      }}
    >
      <SelectTrigger className="w-fit h-full py-1 md:py-2 focus:ring-0 focus:ring-offset-0 border border-solid border-gray-300">
        <SelectValue placeholder={fontFamilys[0]} />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {fontFamilys.map((font) => {
            return (
              <SelectItem
                key={font}
                value={font.toString()}
                checked={font === fontFamily}
                className={cn(
                  font === fontFamily
                    ? "bg-gray-500/35 text-gray-900 font-semibold focus:bg-gray-500/35"
                    : "focus:bg-gray-300/50"
                )}
              >
                {font}
              </SelectItem>
            );
          })}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};
