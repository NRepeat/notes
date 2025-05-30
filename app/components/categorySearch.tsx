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

const CategoryFormSearch = ({
  category,
  setFormState,
  index,
}: {
  category: string;
  categories: string[];
  setFormState: any;
  index: number;
}) => {
  const [open, setOpen] = React.useState(false);
  const state = useBearStore((state) => state);

  const [categoryInputState, setCategoryInputState] = useState({
    canAdd: false,
    value: "",
  });
  const handleCategoryChange = (value: string) => {
    setFormState({ type: "changeCategory", category: value, index: index });
  };
  const clearCategory = () => {
    setFormState({ type: "clearCategory", index: index });
  };
  const handleCategoryAdd = () => {
    state.addCategory(categoryInputState.value);
    setFormState({
      type: "addCategory",
      category: categoryInputState.value,
      index: index,
    });
    setCategoryInputState({
      canAdd: false,
      value: "",
    });
  };
  const handleCategorySearchChange = (value: string) => {
    const categoryIndex = state
      .getCategoriesNames()
      .findIndex((c) => c === value);
    if (categoryIndex === -1) {
      setCategoryInputState({
        canAdd: true,
        value: value,
      });
    } else {
      setCategoryInputState({
        canAdd: false,
        value,
      });
    }
    if (!value) {
      setCategoryInputState({
        canAdd: false,
        value: "",
      });
    }
  };
  return (
    <div className="flex gap-2  flex-col w-full">
      <div className="flex gap-2 items-center sm:w-full md:w-fit lg:w-fit">
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className=" w-[90%] lg:w-[200px] justify-between"
            >
              {category ? category : "Select a category"}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[200px] p-0">
            <Command>
              <CommandInput
                placeholder="Search category..."
                inputState={{
                  canAdd: categoryInputState.canAdd,
                  handleCategoryAdd,
                  handleCategoryChange: handleCategorySearchChange,
                }}
              />
              <CommandList>
                <CommandEmpty>
                  <Button variant={"ghost"} onClick={handleCategoryAdd}>
                    Add new category
                  </Button>
                </CommandEmpty>
                <CommandGroup>
                  {state.getCategoriesNames().map((cat) => (
                    <CommandItem
                      key={cat}
                      value={cat}
                      onSelect={() => {
                        handleCategoryChange(cat);
                        setOpen(false);
                      }}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          category === cat ? "opacity-100" : "opacity-0"
                        )}
                      />
                      {cat}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
        <Button
          type="button"
          variant="destructive"
          onClick={clearCategory}
          disabled={!category}
          className="p-2"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default CategoryFormSearch;
