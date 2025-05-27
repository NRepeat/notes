import React, { useEffect, useState } from "react";
import type { Route } from "./+types/notes";
import MDEditor, { selectWord } from "@uiw/react-md-editor";
import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";
import { useBearStore } from "~/store";
import type { Component as NoteComponent } from "~/types";
const mkdStr = `
# Markdown Editor

---

**Hello world!!!**


`;
export default function Component({ params }: Route.ComponentProps) {
  console.log("params", params);
  // Получаем путь до категории как массив (для вложенных папок)
  const categoryPath = Array.isArray(params.category)
    ? params.category
    : params.category
    ? params.category.split("/")
    : [];
  console.log("categoryPath", categoryPath);
  const noteName = params.notesId;
  const getNote = useBearStore((state) => state.getNote);
  const updateNote = useBearStore((state) => state.updateNote);

  // Находим заметку по вложенному пути
  let note: NoteComponent | null = null;
  if (categoryPath.length > 0) {
    const state = useBearStore.getState();
    let current: any = state.categories;
    for (const cat of categoryPath) {
      const found = current
        .getChildren()
        .find(
          (c: any) => c.name === decodeURIComponent(cat) && c.isComposite()
        );
      if (!found) {
        note = null;
        break;
      }
      current = found;
    }
    if (current && noteName) {
      note =
        current
          .getChildren()
          .find((n: any) => n.name === decodeURIComponent(noteName)) || null;
    }
  } else {
    note = getNote(noteName);
  }

  const [noteState, setNote] = useState<NoteComponent | null>(note);
  const [value, setValue] = React.useState(note?.getValue() || mkdStr);
  if (!noteName) {
    throw new Error("Note name not found ");
  }

  useEffect(() => {
    setNote(note);
    setValue(note?.getValue() || "");
  }, [params.category, noteName]);

  const handleSaveNoteValue = (value: string) => {
    if (!noteState) {
      throw new Error("Note  not found ");
    }
    noteState.updateValue(value);
    updateNote(noteName, noteState);
  };

  useEffect(() => {
    const onBeforeUnload = () => {
      return "";
    };
    if (noteState?.getValue() !== value) {
      window.addEventListener("beforeunload", onBeforeUnload);
    }
    return () => {
      window.removeEventListener("beforeunload", onBeforeUnload);
    };
  }, [noteState, value]);
  useEffect(() => {
    handleSaveNoteValue(value);
  }, [value]);
  return (
    <div className="h-full">
      <MDEditor
        height={"100%"}
        value={value}
        onChange={(e) => setValue(e || "")}
      />
    </div>
  );
}
