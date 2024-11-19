import React, { ReactNode } from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "../ui/sidebar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { NavUser } from "../nav-user";
import { Bell } from "lucide-react";
import { NavMobile } from "./mobile";
import { SelectableContent } from "./selectableContent";

export type NavBarItemsType = {
  id: string;
  icon: typeof Bell;
  title: string;
  content: ({ content }: { content: string }) => JSX.Element;
  active?: boolean;
};

interface AppSideBarProps extends React.ComponentProps<typeof Sidebar> {
  items: NavBarItemsType[];
  user: {
    name: string;
    email: string;
  };
}

export function AppSidebar({ items, user, ...props }: AppSideBarProps) {
  const [activeItem, setActiveItem] = React.useState(items[0]);
  const { setOpen } = useSidebar();

  return (
    <>
      <div className="block md:hidden fixed bottom-0 w-full h-14 bg-sidebar text-textForefround border-t border-t-gray-600/15 border-t-solid z-50 ">
        <NavMobile items={items} />
      </div>
      {/*SIDEBAR DESKTOP */}
      <Sidebar
        collapsible="icon"
        className="hidden md:block overflow-hidden [&>[data-sidebar=sidebar]>.tabs]:flex-row [&>[data-sidebar=sidebar]>.tabs]:flex"
        {...props}
      >
        <Tabs defaultValue={items[0].id} className="tabs flex-1">
          <Sidebar
            collapsible="none"
            className="!w-[calc(var(--sidebar-width-icon)_+_1px)] border-r border-r-gray-500"
          >
            <SidebarContent>
              <SidebarGroup>
                <SidebarGroupContent className="px-1.5 md:px-0">
                  <SidebarMenu>
                    <TabsList className="flex-col gap-1 h-auto bg-transparent text-textForefround">
                      {items.map((item) => (
                        <SidebarMenuItem key={item.title}>
                          <SidebarMenuButton
                            tooltip={{
                              children: item.title,
                              hidden: false,
                            }}
                            isActive={activeItem.title === item.title}
                            onClick={() => {
                              setOpen(true);
                              setActiveItem(item);
                            }}
                            className="px-2.5 md:px-2"
                            asChild
                          >
                            <TabsTrigger
                              value={item.id}
                              className="text-textForefround"
                            >
                              <item.icon />
                            </TabsTrigger>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      ))}
                    </TabsList>
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            </SidebarContent>
            <SidebarFooter>
              <NavUser user={user} />
            </SidebarFooter>
          </Sidebar>

          {/* This is the second sidebar */}
          {/* We disable collapsible and let it fill remaining space */}
          <Sidebar
            collapsible="none"
            className="hidden flex-1 md:flex bg-primary-dark"
          >
            <SidebarContent className="px-4">
              {items.map((nav) => {
                return (
                  <TabsContent key={nav.id} value={nav.id}>
                    <SidebarGroup className="px-0">
                      <SidebarGroupContent>
                        <SelectableContent>
                          <nav.content content={nav.title} />
                        </SelectableContent>
                      </SidebarGroupContent>
                    </SidebarGroup>
                  </TabsContent>
                );
              })}
            </SidebarContent>
          </Sidebar>
        </Tabs>
      </Sidebar>
    </>
  );
}
