import React from "react";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "./context-menu";
import { Delete, Edit, Plus, Trash } from "lucide-react";
import { useBearStore } from "~/store";

const DeleteCategory = ({
  children,
  categoryName,
  setIsEdit,
}: {
  children: React.ReactNode;
  categoryName: string;
  setIsEdit?: (value: { name: string; edit: boolean }) => void;
}) => {
  const state = useBearStore((state) => state);

  // Rename category
  const handleEditCategory = () => {
    if (setIsEdit) {
      setIsEdit({ name: categoryName, edit: true });
    }
  };

  // Delete category
  const handleDeleteCategory = () => {
    const category = state.categories.find(categoryName);
    if (category) {
      state.categories.remove(category);
    }
  };

  // Add subfolder to category
  const handleAddFolder = () => {
    const category = state.categories.find(categoryName);
    if (category) {
      const newFolderName = prompt("Enter new folder name:", "New Folder");
      if (newFolderName) {
        state.addCategory(newFolderName, categoryName, true);
      }
    }
  };

  return (
    <ContextMenu>
      <ContextMenuTrigger className="w-full flex">
        {children}
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuItem onClick={handleEditCategory}>
          <Edit />
          Rename
        </ContextMenuItem>
        <ContextMenuItem onClick={handleDeleteCategory}>
          <Trash />
          Delete
        </ContextMenuItem>
        <ContextMenuItem onClick={handleAddFolder}>
          <Plus />
          Add folder
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
};

export default DeleteCategory;
