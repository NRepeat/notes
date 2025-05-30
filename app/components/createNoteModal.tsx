import React, { useReducer, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { useBearStore } from "~/store";
import { Form, useNavigate } from "react-router";
import { Input } from "./ui/input";

import { Button } from "./ui/button";

import CategoryFormSearch from "./categorySearch";
import TagFormSearch from "./tagSearch";
import { Plus } from "lucide-react";

const CreateNoteModal = () => {
  const state = useBearStore((state) => state);

  const [formState, setFormState] = useReducer(
    (
      prevState: { title: string; tag: string; category: string[] },
      newState: any
    ) => {
      switch (newState.type) {
        case "addEmptyCategory": {
          const newCategoryList = [...prevState.category, ""];
          return {
            ...prevState,
            category: newCategoryList,
          };
        }
        case "reset": {
          return {
            title: "",
            tag: "",
            category: [""],
          };
        }
        case "addCategory": {
          const newCategoryList = prevState.category.map((category, index) => {
            if (index === newState.index) {
              return newState.category;
            }
            return category;
          });
          return {
            ...prevState,
            category: newCategoryList,
          };
        }
        case "changeCategory": {
          const newCategoryList = prevState.category.map((category, index) => {
            if (index === newState.index) {
              return newState.category;
            }

            return category;
          });
          return {
            ...prevState,
            category: newCategoryList,
          };
        }
        case "clearCategory": {
          if (newState.index === 0) {
            return {
              ...prevState,
              category: ["", ...prevState.category.slice(1)],
            };
          }
          const newCategoryList = prevState.category.filter(
            (category: string, index: number) => index !== newState.index
          );
          return {
            ...prevState,
            category: newCategoryList,
          };
        }
      }

      return { ...prevState, ...newState };
    },
    {
      title: "",
      tag: "",
      category: [""],
    }
  );
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormState({ [e.target.name]: e.target.value });
  };
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (formState.category) {
      state.addNote(formState.title, formState.category);
    } else {
      state.addNote(formState.title);
    }
    state.setCreateNoteModalOpen(false);
    setFormState({
      action: "reset",
    });
  };
  return (
    <Dialog
      onOpenChange={state.setCreateNoteModalOpen}
      open={state.createNoteModalOpen}
      modal={true}
    >
      <DialogContent className="md:min-w-[530px] lg:min-w-[600px] ">
        <DialogHeader>
          <DialogTitle>Create note</DialogTitle>
        </DialogHeader>
        <Form className="flex flex-col gap-2" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="title">Title</label>
            <Input
              id="title"
              name="title"
              required
              value={formState.title}
              onChange={handleInputChange}
            />
          </div>
          <div className="flex  sm:w-full gap-2 md:flex-row lg:flex-row flex-col">
            <div>
              <label htmlFor="category" className="pb-2 block">
                Category
              </label>
              <div className="flex flex-col gap-2">
                {formState.category.map((category: string, index: number) => (
                  <CategoryFormSearch
                    category={category}
                    categories={formState.category}
                    setFormState={setFormState}
                    index={index}
                  />
                ))}
              </div>

              <div className="flex w-full pt-3">
                <Button
                  onClick={() => setFormState({ type: "addEmptyCategory" })}
                  variant={"ghost"}
                  type="button"
                  className="h-6 rounded-sm"
                >
                  <Plus /> Add Category
                </Button>
              </div>
            </div>
            <TagFormSearch formState={formState} setFormState={setFormState} />
          </div>
          <Button type="submit" className="w-full mt-4">
            Create
          </Button>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateNoteModal;
