import React from "react";
import { SidebarTrigger } from "./sidebar";
import { Separator } from "./separator";
import { Button } from "./button";
import { useBearStore } from "~/store";
import CreateFolder from "../createFolder";

const Header = () => {
  const state = useBearStore((state) => state);
  return (
    <header className="flex h-16 shrink-0 items-center gap-2 border-b justify-between px-3">
      <div className="flex items-center gap-2 ">
        <SidebarTrigger />
        <Separator orientation="vertical" className="mr-2 h-4" />
      </div>
      {/* <CreateFolder /> */}
      <Button
        onClick={() => state.setCreateNoteModalOpen(!state.createNoteModalOpen)}
      >
        Add note
      </Button>
    </header>
  );
};

export default Header;
