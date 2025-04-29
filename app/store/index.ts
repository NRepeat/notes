import { NotebookTabs } from "lucide-react";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { Composite } from "~/entity/Composite";
import { Leaf } from "~/entity/Leaf";
import { Component, type SideBarData, type SideBarItem } from "~/types";

type State = {
  categories: Composite;
  createNoteModalOpen: boolean;
  setCreateNoteModalOpen: (open: boolean) => void;
  getSideBarData: () => SideBarData;
};

type Actions = {
  getCategoriesNames: () => string[];
  getCategories: () => Composite;
  addNote: (note: string, category?: string[]) => void;
  addCategory: (value: string) => void;
};

const reviver = (key: string, value: any): any => {
  if (value.type === "Composite") {
    const composite = new Composite(value.name || "");
    if (value.children && Array.isArray(value.children)) {
      value.children.forEach((childJson: any) => {
        composite.add(childJson);
      });
    }
    return composite;
  }
  if (value.type === "Leaf") {
    return new Leaf(value.name || "");
  }
  return value;
};
const getCategoriesNames = (categories: Composite) => {
  const names = categories
    .getChildren()
    .map((category) => {
      if (category.isComposite()) {
        return category.name;
      }
      return null;
    })
    .filter((name) => name !== null);

  return names;
};
const getSideBarData = (categories: Composite) => {
  const data = categories.getChildren().map((category) => {
    console.log("category", category);
    let subItems: SideBarItem[] | [] = [];
    if (category.isComposite()) {
      subItems = category.getChildren().map((subItem) => ({
        title: subItem.name,
        url: "c/" + category.name + "/n/" + subItem.name,
        icon: NotebookTabs,
        isActive: false,
      }));
    }
    return {
      title: category.name,
      url:
        category instanceof Composite
          ? "c/" + category.name
          : "n/" + category.name,
      icon: NotebookTabs,
      items: subItems,
      isActive: false,
    };
  });
  return data;
};
export const useBearStore = create<Actions & State>()(
  persist(
    (set, get) => ({
      categories: new Composite("root"),
      setCreateNoteModalOpen: (open: boolean) =>
        set((state) => ({
          ...state,
          createNoteModalOpen: open,
        })),
      createNoteModalOpen: false,
      getCategories: () => get().categories,
      getSideBarData: () => getSideBarData(get().categories),
      addCategory: (value: string) =>
        set((state) => {
          console.log("value", value);
          const newCategories = new Composite(value);
          state.categories.add(newCategories);
          console.log("state.categories", state.categories);
          return {
            ...state,
            categories: state.categories,
          };
        }),
      addNote: (note: string, category?: string[]) =>
        set((state) => {
          const newNote = new Leaf(note);
          if (category && category.length > 0) {
            category.forEach((cat) => {
              const c = state.categories.find(cat);
              if (c) {
                c.add(newNote);
              }
            });
          } else {
            state.categories.add(newNote);
          }
          return {
            ...state,
            categories: state.categories,
          };
        }),
      getCategoriesNames: () => getCategoriesNames(get().categories),
    }),
    {
      name: "notes-storage",
      storage: createJSONStorage(() => localStorage, {
        replacer: (key, value, seen = new WeakSet()) => {
          if (value && typeof value === "object" && !Array.isArray(value)) {
            if (seen.has(value)) {
              return undefined;
            }
            seen.add(value);
          }

          if (value instanceof Component) {
            return value.toJSON();
          }
          return value;
        },
        reviver,
      }),
    }
  )
);
