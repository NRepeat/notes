import React from "react";
import g from "~/store/global";
import { Button } from "./ui/button";
import { useBearStore } from "~/store";

const CreateFolder = () => {
  const global = g((state) => state);
  console.log("global", global);
  const state = useBearStore((state) => state);
  const handleCreateFolder = () => {
    state.addCategory("New Category", global.openedFolder.title, true);
  };
  return <Button onClick={handleCreateFolder}>CreateFolder</Button>;
};

export default CreateFolder;
