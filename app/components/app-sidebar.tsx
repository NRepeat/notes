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
import DeleteCategory from "./ui/deleteCategory";
import DeleteNote from "./ui/deleteNote";

// Menu items.

export function AppSidebar() {
  const state = useBearStore((state) => state);
  const data = state.getSideBarData();
  const nav = useNavigate();
  const global = g((state) => state);
  const [isNoteEdit, setIsNoteEdit] = useState({ name: "", edit: false });
  console.log(isNoteEdit);
  // const [openedFolder, setOpenedFolder] = useState<string | null>(null);
  const handleFolderClock = (item: SideBarItem) => {
    global.setOpenedFolder(item.title, item.url || "");
    item.items && item.items.length === 0 ? nav(item.url || "") : undefined;
  };
  const [inputValue, setInputValue] = useState<string>("New Category");
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
  };
  const handleFocusEnd = () => {
    if (isNoteEdit.edit && isNoteEdit.name) {
      // Editing a note
      const note = state.categories.find(isNoteEdit.name);
      if (note) {
        note.updateName?.(inputValue);
        state.updateNote(isNoteEdit.name, note);
        setIsNoteEdit({ name: "", edit: false });
        // After renaming, reload and open the edited note
        const parent = note.getParent();
        console.log(note, "parent");
        const parentName = parent ? parent.getName() : "";
        console.log(parentName, "parent_name");
        setTimeout(() => {
          window.location.href = `/c/${parentName}/n/${inputValue}`;
        }, 100);
      }
    } else {
      // Editing a category
      const category = state.categories.find(global.openedFolder.title);
      if (category) {
        category.updateName(inputValue);
        category.setNew(false);
      }
    }
  };

  // Recursive render function for nested sidebar items
  const renderSidebarItems = (items: SideBarItem[] = [], level: number = 0) => {
    return items.map((item, index) => {
      console.log(item, "item");
      const hasChildren =
        item.isFolder || (item.items && item.items.length > 0);
      const isCategory = hasChildren;
      const key = item.title + level + index;
      if (isCategory) {
        return (
          <Collapsible
            key={key}
            asChild
            defaultOpen={item.isActive}
            className="group/collapsible"
          >
            <SidebarMenuItem>
              <CollapsibleTrigger asChild>
                <SidebarMenuButton
                  className={`$ {
                    global.openedFolder.title === item.title ? "bg-muted" : ""
                  }`}
                  tooltip={item.title}
                  onClick={() => handleFolderClock(item)}
                >
                  <DeleteCategory
                    categoryName={item.title}
                    setIsEdit={setIsNoteEdit}
                  >
                    <div className="flex items-center gap-2">
                      {item.icon && <item.icon />}
                      <span>{item.title}</span>
                    </div>
                    {hasChildren && (
                      <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                    )}
                  </DeleteCategory>
                </SidebarMenuButton>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <SidebarMenuSub>
                  {renderSidebarItems(item.items, level + 1)}
                </SidebarMenuSub>
              </CollapsibleContent>
            </SidebarMenuItem>
          </Collapsible>
        );
      } else {
        // Leaf/note
        return (
          <SidebarMenuSubItem key={key}>
            <SidebarMenuSubButton>
              {item.isNew ||
              (isNoteEdit.name === item.title && isNoteEdit.edit) ? (
                <Input
                  value={inputValue || item.title}
                  onChange={handleInputChange}
                  onBlur={handleFocusEnd}
                />
              ) : (
                <DeleteNote note={item.title} setIsEdit={setIsNoteEdit}>
                  <Link
                    to={item.url || ""}
                    className="w-full flex items-center gap-2"
                  >
                    {item.icon && <item.icon />}
                    <span>{item.title}</span>
                  </Link>
                </DeleteNote>
              )}
            </SidebarMenuSubButton>
          </SidebarMenuSubItem>
        );
      }
    });
  };

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>{renderSidebarItems(data)}</SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
