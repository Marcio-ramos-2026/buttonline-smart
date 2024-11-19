'use client'

import { useState } from "react";
import { NavBarItemsType } from ".";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";
import { SelectableContent } from "./selectableContent";

export const NavMobile = ({ items }: { items: NavBarItemsType[] }) => {
    const [open, setOpen] = useState(false);
    const [activeItem, setActiveItem] = useState<NavBarItemsType>();
    return (
      <Tabs className="w-full h-full">
        <TabsList className="flex justify-start flex-nowrap h-full overflow-x-auto scrollBar relative z-50 bg-primary text-textForefround p-0 rounded-none">
          {items.map((item) => (
            <TabsTrigger
              key={item.title}
              value={item.id}
              onClick={() => {
                setOpen(true);
                //@ts-ignore
                setActiveItem(item);
              }}
              className={cn(
                "p-0.5 flex flex-col flex-1 h-full min-w-28 rounded-none data-[state=active]:bg-gray-50/80 data-[state=active]:font-medium"
              )}
            >
              <item.icon className="w-5 h-5" />
              <p className="text-xs">{item.title}</p>
            </TabsTrigger>
          ))}
        </TabsList>
        {open && (
          <>
            {items.map((item) => {
              return (
                <TabsContent
                  key={item.id}
                  value={item.id}
                  className="absolute bottom-[52px] z-10 w-full h-96 px-4 pt-6 border-t border-t-gray-300 rounded-t-lg bg-primary-dark text-textForefround data-[state=active]:animate-fade-in-up data-[state=inactive]:animate-fade-out-down"
                >
                  <SelectableContent
                    key={item.id}
                    className="px-0 pt-4"
                  >
                    <button
                      type="button"
                      onClick={() => setOpen(false)}
                      className="absolute top-3 right-3"
                    >
                      <X className="w-5 h-5" />
                    </button>
                    <div>
                      <item.content content={item.title} />
                    </div>
                  </SelectableContent>
                </TabsContent>
              );
            })}
          </>
        )}
      </Tabs>
    );
  };