import React from "react";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "./context-menu";
import { Delete, Edit, Plus, Trash } from "lucide-react";

const DeleteCategory = ({ children }: { children: React.ReactNode }) => {
  return (
    <ContextMenu>
      <ContextMenuTrigger className="w-full flex">
        {children}
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuItem>
          <Edit />
          Rename
        </ContextMenuItem>
        <ContextMenuItem>
          <Trash />
          Delete
        </ContextMenuItem>
        <ContextMenuItem>
          <Plus />
          Add folder
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
};

export default DeleteCategory;
