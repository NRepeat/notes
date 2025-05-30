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
  const path = params["*"] || "";
  const parts = path.split("/");
  const nIndex = parts.lastIndexOf("n");
  let categoryPath: string[] = [];
  let noteName: string | undefined;
  if (nIndex !== -1) {
    categoryPath = parts.slice(0, nIndex);
    noteName = parts.slice(nIndex + 1).join("/");
  }
  const getNote = useBearStore((state) => state.getNote);
  const updateNote = useBearStore((state) => state.updateNote);

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
  } else if (noteName) {
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
  }, [params["*"], noteName]);

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
  console.log(note, "note");
  const getTagsWithCollor = () => {
    if (note) {
      return note?.getTags().length > 0
        ? note.getTags().map((tag) => {
            return (
              <span
                key={tag.name}
                className={`inline-block px-2 py-1 mr-2 text-xs font-semibold text-white rounded-full`}
                style={{ backgroundColor: tag.color || "gray" }}
              >
                {tag.name}
              </span>
            );
          })
        : null;
    }
  };
  return (
    <div className="h-full">
      <div className="flex items-center justify-between p-2 border-b">
        {getTagsWithCollor()}
      </div>
      <MDEditor
        height={"100%"}
        value={value}
        onChange={(e) => setValue(e || "")}
      />
    </div>
  );
}
