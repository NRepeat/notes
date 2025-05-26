import React from "react";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "./context-menu";
import { Delete, Edit, Plus, Trash } from "lucide-react";
import type { Component } from "~/types";
import { useBearStore } from "~/store";

const DeleteNote = ({
  children,
  note,
  setIsEdit,
}: {
  children: React.ReactNode;
  note: string;
  setIsEdit: (value: { name: string; edit: boolean }) => void;
}) => {
  const state = useBearStore((state) => state);
  const handleEditNote = () => {
    // Find the note in the store
    const c = state.getNote(note);
    if (!c) {
      throw new Error("Note not found");
    }
    setIsEdit({ edit: true, name: note });
  };
  return (
    <ContextMenu>
      <ContextMenuTrigger className="w-full flex">
        {children}
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuItem onClick={() => handleEditNote()}>
          <Edit />
          Rename
        </ContextMenuItem>
        <ContextMenuItem onClick={() => state.deleteNote(note)}>
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

export default DeleteNote;
