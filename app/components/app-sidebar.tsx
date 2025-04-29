import {
  AudioWaveform,
  BookOpen,
  Bot,
  Calendar,
  ChevronRight,
  Command,
  GalleryVerticalEnd,
  Home,
  Inbox,
  Plus,
  Search,
  Settings,
  Settings2,
  SquareTerminal,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "./ui/sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "./ui/collapsible";
import { useBearStore } from "~/store";
import { Component, type SideBarItem } from "~/types";
import { Link, useNavigate } from "react-router";
import { useState } from "react";
import g from "~/store/global";
import { Input } from "./ui/input";

// Menu items.

export function AppSidebar() {
  const state = useBearStore((state) => state);
  const data = state.getSideBarData();
  const nav = useNavigate();
  const global = g((state) => state);

  // const [openedFolder, setOpenedFolder] = useState<string | null>(null);
  const handleFolderClock = (item: SideBarItem) => {
    global.setOpenedFolder(item.title, item.url || "");
    item.items && item.items.length === 0 ? nav(item.url || "") : undefined;
  };
  console.log("state", state);
  const [inputValue, setInputValue] = useState<string>("New Category");
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
  };
  const handleFocusEnd = () => {
    console.log("inputValue", inputValue);
    const category = state.categories.find(global.openedFolder.title);
    if (category) {
      category.updateName(inputValue);
      category.setNew(false);
    }
  };
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {data.map((item, index) => (
                <Collapsible
                  key={item.title + index}
                  asChild
                  defaultOpen={item.isActive}
                  className="group/collapsible"
                >
                  <SidebarMenuItem>
                    <CollapsibleTrigger asChild>
                      <SidebarMenuButton
                        className={`${
                          global.openedFolder.title === item.title
                            ? "bg-muted"
                            : ""
                        }`}
                        tooltip={item.title}
                        onClick={() => handleFolderClock(item)}
                      >
                        {item.icon && <item.icon />}
                        <span>{item.title}</span>

                        <Plus />
                        {item.items && item.items.length > 0 && (
                          <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                        )}
                      </SidebarMenuButton>
                    </CollapsibleTrigger>
                    {item.items && item.items.length > 0 && (
                      <CollapsibleContent>
                        <SidebarMenuSub>
                          {item.items?.map((subItem) => (
                            <SidebarMenuSubItem key={subItem.title}>
                              <SidebarMenuSubButton asChild>
                                {subItem.isNew ? (
                                  <Input
                                    value={inputValue || subItem.title}
                                    onChange={handleInputChange}
                                    onBlur={handleFocusEnd}
                                  />
                                ) : (
                                  <Link to={subItem.url || ""}>
                                    {subItem.icon && <subItem.icon />}
                                    <span>{subItem.title}</span>
                                  </Link>
                                )}
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          ))}
                        </SidebarMenuSub>
                      </CollapsibleContent>
                    )}
                  </SidebarMenuItem>
                </Collapsible>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
