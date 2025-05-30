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
  getTagsNames: () => { name: string; color: string }[];
  getCategories: () => Composite;
  getNote: (noteName: string) => Component | null;
  deleteNote: (note: string) => void;
  addNote: (
    note: string,
    category?: string[],
    tags?: { name: string; color?: string }[]
  ) => void;
  updateNote: (note: string, value: Component) => void;
  addTag: (note: string, tag: { name: string; color?: string }) => void;
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
    return new Leaf(value.name || "", value.value || "", value.tags || []);
  }
  return value;
};
const getCategoriesNames = (categories: Composite): string[] => {
  const names: string[] = [];
  const traverse = (node: Component) => {
    if (node.isComposite()) {
      names.push(node.name);
      node.getChildren().forEach(traverse);
    }
  };
  categories.getChildren().forEach(traverse);
  return names;
};
const getTagsNames = (
  categories: Composite
): { name: string; color: string }[] => {
  const tags: { name: string; color: string }[] = [];
  const traverse = (node: Component) => {
    if (!node.isComposite()) {
      console.log("getTagsNames", node);
      node.getTags().forEach((tag) => {
        if (!tags.some((t) => t.name === tag.name)) {
          tags.push(tag);
        }
      });
    } else {
      node.getChildren().forEach(traverse);
    }
  };
  categories.getChildren().forEach(traverse);
  return tags;
};
const getFullCategoryPath = (node: Component): string[] => {
  const path: string[] = [];
  let current: Component | null = node.getParent();
  while (current && current.getParent()) {
    path.unshift(current.name);
    current = current.getParent();
  }
  return path;
};
const getSideBarData = (categories: Composite): SideBarData => {
  // Recursive function to build the sidebar tree
  const buildItems = (
    node: Component,
    parentCategoryName?: string
  ): SideBarItem => {
    const isFolder = node.isComposite();
    const path = getFullCategoryPath(node);
    const url = isFolder
      ? `c/${[...path, node.name].join("/")}`
      : path.length > 0
      ? `c/${path.join("/")}/n/${node.name}`
      : `n/${node.name}`;
    const icon = isFolder ? NotebookTabs : LeafIcon;
    let items: SideBarItem[] = [];
    if (isFolder) {
      items = node.getChildren().map((child) => buildItems(child, node.name));
    }
    return {
      title: node.name,
      isFolder,
      url,
      icon,
      items: items.length > 0 ? items : undefined,
      isActive: false,
      isNew: node.new,
    };
  };
  return categories.getChildren().map((category) => buildItems(category));
};
const randomColor = () =>
  `#${Math.floor(Math.random() * 16777215)
    .toString(16)
    .padStart(6, "0")}`;
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
      addTag: (note: string, tag: { name: string; color?: string }) =>
        set((state) => {
          const noteToUpdate = state.categories.find(note);
          if (noteToUpdate) {
            noteToUpdate.addTag({
              name: tag.name,
              color: tag.color ?? randomColor(),
            });
          }
          return {
            ...state,
            categories: state.categories,
          };
        }),
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
      addNote: (
        note: string,
        category?: string[],
        tags?: { name: string; color?: string }[]
      ) =>
        set((state) => {
          console.log("addNote", note, category, tags);
          const newNote = new Leaf(note);
          if (tags && Array.isArray(tags)) {
            tags.forEach((tag) => {
              newNote.addTag({
                name: tag.name,
                color: tag.color || randomColor(),
              });
            });
          }
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
      deleteNote: (note: string) =>
        set((state) => {
          const noteToDelete = state.categories.find(note);
          console.log("deleteNote", noteToDelete);

          if (noteToDelete) {
            state.categories.remove(noteToDelete);
          }
          return {
            ...state,
            categories: state.categories,
          };
        }),
      getCategoriesNames: () => getCategoriesNames(get().categories),
      getTagsNames: () => {
        return getTagsNames(get().categories);
      },
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
            console.log("replacer", value.toJSON());
            return value.toJSON();
          }
          return value;
        },
        reviver,
      }),
    }
  )
);
