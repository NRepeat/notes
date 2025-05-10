import React, { useEffect, useState } from "react";
import type { Route } from "./+types/notes";
import MDEditor, { selectWord } from "@uiw/react-md-editor";
import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";
import { useBearStore } from "~/store";
import type { Component as NoteComponent  } from "~/types";
const mkdStr = `
# Markdown Editor

---

**Hello world!!!**


`;
export default function Component({ params }: Route.ComponentProps) {
  const noteName = params.notesId;
  const getNote = useBearStore((state) => state.getNote);
  const updateNote = useBearStore((state) => state.updateNote);
  const [note,setNote] = useState<NoteComponent  | null>(getNote(noteName))
  const [value, setValue] = React.useState(note?.value || mkdStr);
  if (!noteName) {
    throw new Error("Note name not found ");
  }

  useEffect(()=>{
    const v = getNote(noteName)
    setNote(v )
    setValue(v?.getValue() || '')
  },[noteName])

  const handleSaveNoteValue = (value: string) => {
    if (!note) {
      throw new Error("Note  not found ");
    }
    note.updateValue(value);
    updateNote(noteName,note);
  };

  useEffect(() => {
    const onBeforeUnload = () => {
      return "";
    };
    if(note?.getValue() !== value){
      window.addEventListener("beforeunload", onBeforeUnload);
    }
    return () => {
      window.removeEventListener("beforeunload", onBeforeUnload);
    };
  }, []);
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
