import React, { useEffect, useState } from "react";
import { Links, Meta, Scripts, ScrollRestoration } from "react-router";
import { SidebarProvider, SidebarTrigger } from "../ui/sidebar";
import { Button } from "../ui/button";
import { AppSidebar } from "../app-sidebar";
import { Leaf } from "~/entity/Leaf";
import { Composite } from "~/entity/Composite";
import { useBearStore } from "~/store";

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  const state = useBearStore((state) => state);
  console.log("state", state);
  const [count, setCount] = useState(0);
  const handleAddCategory = (tree: Composite) => {
    console.log("add category");
    const category = new Composite("Category" + count);
    setCount(count + 1);
    state.categories.add(category);
    state.addCategory(state.categories);
  };
  const handleAddLeaf = (tree: Composite) => {
    console.log("add leaf");
    const leaf = new Leaf("Leaf" + count);
    setCount(count + 1);
    tree.add(leaf);
    state.addCategory(tree);
  };
  const [findedLeaf, setFindedLeaf] = useState<Leaf | Composite | null>(null);
  const handleFindLeaf = (name: string) => {
    const foundLeaf = state.categories.find("Leaf1");
    if (foundLeaf) {
      setFindedLeaf(foundLeaf as Leaf);
    } else {
      setFindedLeaf(null);
    }
  };
  const handleFindCategory = (name: string) => {
    console.log("name", name);
    const foundCategory = state.categories.find(name);
    console.log("foundCategory", foundCategory);

    if (foundCategory) {
      foundCategory?.add(new Leaf("LeafInner" + count));
      state.addCategory(state.categories);
      setFindedLeaf(foundCategory as Composite);
    } else {
      setFindedLeaf(null);
    }
  };
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="dark">
        <SidebarProvider>
          <AppSidebar />
          <main>
            <SidebarTrigger />
            {children}
            <Button
              onClick={() => handleAddCategory(state.categories)}
              variant={"outline"}
            >
              hiiiC
            </Button>
            <Button
              onClick={() => handleAddLeaf(state.categories)}
              variant={"outline"}
            >
              hiiiLLLLLL
            </Button>
            <Button
              onClick={() => handleFindLeaf("Leaf" + count)}
              variant={"outline"}
            >
              Find Leaf
            </Button>
            <Button
              onClick={() => handleFindCategory("Category2")}
              variant={"outline"}
            >
              Find Category
            </Button>
            <div className="flex max-w-[300px] text-wrap break-keep">
              {state.categories.isComposite()
                ? state.categories.operation()
                : ""}
            </div>
            {count}
            {findedLeaf?.operation()}
          </main>
        </SidebarProvider>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
};

export default MainLayout;
