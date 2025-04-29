import React, { useReducer, useState } from "react";

import { Button } from "./ui/button";
import { Check, ChevronsUpDown, X } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "./ui/command";
import { cn } from "~/lib/utils";
import { useBearStore } from "~/store";

const TagFormSearch = ({
  formState,
  setFormState,
}: {
  formState: any;
  setFormState: any;
}) => {
  const [open, setOpen] = React.useState(false);
  const state = useBearStore((state) => state);

  const [tagInputState, setTagInputState] = useState({
    canAdd: false,
    value: "",
  });
  const handleTagChange = (value: string) => {
    setFormState({ tag: value });
  };
  const clearTag = () => {
    setFormState({ tag: "" });
  };
  const handleTagAdd = () => {
    // state.addTag(tagInputState.value);
    setFormState({ tag: tagInputState.value });
    setTagInputState({
      canAdd: false,
      value: "",
    });
  };
  const handleTagSearchChange = (value: string) => {
    const tagIndex = state.getCategoriesNames().findIndex((c) => c === value);
    if (tagIndex === -1) {
      setTagInputState({
        canAdd: true,
        value: value,
      });
    } else {
      setTagInputState({
        canAdd: false,
        value,
      });
    }
    if (!value) {
      setTagInputState({
        canAdd: false,
        value: "",
      });
    }
  };
  return (
    <div className="flex gap-2  flex-col">
      <label htmlFor="tag">Tag</label>
      <div className="flex gap-2 items-center">
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className=" w-[90%] lg:w-[200px] justify-between"
            >
              {formState.tag ? formState.tag : "Select a tag"}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[200px] p-0">
            <Command>
              <CommandInput
                placeholder="Search tag..."
                inputState={{
                  canAdd: tagInputState.canAdd,
                  handleCategoryAdd: handleTagAdd,
                  handleCategoryChange: handleTagSearchChange,
                }}
              />
              <CommandList>
                <CommandEmpty>
                  <Button variant={"ghost"}>Add new tag</Button>
                </CommandEmpty>
                <CommandGroup>
                  {state.getCategoriesNames().map((framework) => (
                    <CommandItem
                      key={framework}
                      value={framework}
                      onSelect={(currentValue) => {
                        handleTagChange(
                          currentValue === formState.tag ? "" : currentValue
                        );
                        setOpen(false);
                      }}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          formState.tag === framework
                            ? "opacity-100"
                            : "opacity-0"
                        )}
                      />
                      {framework}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
        <Button
          type="button"
          variant="ghost"
          onClick={clearTag}
          className="p-2"
          disabled={!formState.tag}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default TagFormSearch;
