import { NotebookTabs } from "lucide-react";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { Composite } from "~/entity/Composite";
import { Leaf } from "~/entity/Leaf";
import { Component, type SideBarData, type SideBarItem } from "~/types";

type State = {
  categories: Composite;
  getSideBarData: () => SideBarData;
};

type Actions = {
  getCategories: () => Composite;
  addCategory: (tree: Composite) => void;
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
    immer((set, get) => ({
      getSideBarData: () => getSideBarData(get().categories),
      categories: new Composite(),
      getCategories: () => get().categories,
      addCategory: (tree: Composite) =>
        set((state) => {
          state.categories = tree; // Обновляем categories
        }),
      addNote: (note: Leaf) =>
        set((draft) => {
          // Создаем новый Composite для иммутабельности
          const newCategories = new Composite(draft.categories.name);
          // Копируем существующие дочерние элементы
          draft.categories.getChildren().forEach((child) => {
            newCategories.add(child);
          });
          // Добавляем новую заметку
          newCategories.add(note);
          // Обновляем черновик стейта
          draft.categories = newCategories;
        }),
    })),
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
