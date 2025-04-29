import React, { useEffect, useState } from "react";
import { Links, Meta, Scripts, ScrollRestoration } from "react-router";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "../ui/sidebar";
import { Button } from "../ui/button";
import { AppSidebar } from "../app-sidebar";
import { Leaf } from "~/entity/Leaf";
import { Composite } from "~/entity/Composite";
import { useBearStore } from "~/store";
import { Separator } from "../ui/separator";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "../ui/breadcrumb";
import Header from "../ui/header";
import CreateNoteModal from "../createNoteModal";

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  const state = useBearStore((state) => state);

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
          <SidebarInset>
            <Header />
            <div className="flex flex-1 flex-col gap-4 p-4">
              <main className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min">
                {children}
              </main>
              <CreateNoteModal />
            </div>
          </SidebarInset>
        </SidebarProvider>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
};

export default MainLayout;
