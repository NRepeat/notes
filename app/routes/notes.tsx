import React, { useEffect, useState } from "react";
import type { Route } from "./+types/notes";
import MDEditor, { selectWord } from "@uiw/react-md-editor";
import "@uiw/react-md-editor/markdown-editor.css";
// No import is required in the WebPack.
import "@uiw/react-markdown-preview/markdown.css";
import { useBearStore } from "~/store";
import { Button } from "~/components/ui/button";
import type { Component as NoteComponent } from "~/types";
const mkdStr = `
# Markdown Editor

---

**Hello world!!!**


`;
export default function Component({ params }: Route.ComponentProps) {
  const noteName = params.notesId;
  const getNote = useBearStore((state) => state.getNote);
  const updateNote = useBearStore((state) => state.updateNote);
  const note = getNote(noteName);
  if (!noteName) {
    throw new Error("Note name not found ");
  }
  if (!note) {
    throw new Error("Note  not found ");
  }
  const handleGetNote = () => {
    return note.getValue();
  };
  const handleSaveNoteValue = (value: string) => {
    note.updateValue(value);
  };
  const [value, setValue] = React.useState(handleGetNote() || mkdStr);

  const handleUpdateState = () => {
    note.updateValue(value);
    updateNote(noteName,note);
  };
  // useEffect(() => {
  //   console.log("value", value);
  //   handleSaveNoteValue(value);
  // }, [value]);
  return (
    <div className="h-fit">
      <h1>Notes</h1>
      <p>CAtegory ID: {params.categoryId}</p>
      <p>Product ID: {params.notesId}</p>
      <Button onClick={() => handleUpdateState()}>Save</Button>
      <MDEditor
        height={"100%"}
        value={value}
        onChange={(e) => setValue(e || "")}
      />
    </div>
  );
}
