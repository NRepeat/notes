import { LeafIcon, NotebookTabs } from "lucide-react";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
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
  getNote: (noteName: string) => Component | null;
  addNote: (note: string, category?: string[]) => void;
  updateNote: (note: string, value: Component) => void;
  addCategory: (
    value: string,
    subCategory?: string,
    newCategory?: boolean
  ) => void;
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
    return new Leaf(value.name || "", value.value || "");
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
    let subItems: SideBarItem[] | [] = [];
    if (category.isComposite()) {
      subItems = category.getChildren().map((subItem) => ({
        title: subItem.name,
        url: "c/" + category.name + "/n/" + subItem.name,
        icon: subItem.isComposite() ? NotebookTabs : LeafIcon,
        isActive: false,
        isNew: subItem.new,
      }));
    }
    return {
      title: category.name,
      url:
        category instanceof Composite
          ? "c/" + category.name
          : "n/" + category.name,
      icon: category instanceof Composite ? NotebookTabs : LeafIcon,
      items: subItems,
      isActive: false,
      isNew: category.new,
    };
  });
  return data;
};
export const useBearStore = create<Actions & State>()(
  persist(
    (set, get) => ({
      updateNote: (note, value) => {
        set((state) => {
          const oldNote = state.categories.find(note);
          if (oldNote) {
            state.categories.updateChildren(oldNote, value);
            console.log(state.categories, "state.categories");
            return {
              ...state,
              categories: state.categories,
            };
          } else {
            return {
              ...state,
              categories: state.categories,
            };
          }
        });
      },
      getNote: (noteName) => {
        const note = get().categories.find(noteName);
        return note;
      },
      categories: new Composite("root"),
      setCreateNoteModalOpen: (open: boolean) =>
        set((state) => ({
          ...state,
          createNoteModalOpen: open,
        })),
      createNoteModalOpen: false,
      getCategories: () => get().categories,
      getSideBarData: () => getSideBarData(get().categories),
      addCategory: (
        value: string,
        subCategoryValue?: string | undefined,
        newCategory?: boolean
      ) =>
        set((state) => {
          if (subCategoryValue && newCategory) {
            const newCategories = new Composite(value, newCategory);
            const subCategory = state.categories.find(subCategoryValue);
            subCategory?.add(newCategories);
          } else if (!newCategory) {
            const newCategories = new Composite(value);
            state.categories.add(newCategories);
          }
          return {
            ...state,
            categories: state.categories,
          };
        }),
      addNote: (note: string, category?: string[]) =>
        set((state) => {
          const newNote = new Leaf(note);
          if (category && category.length > 0 && category[0] !== "") {
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
