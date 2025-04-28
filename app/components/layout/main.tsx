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
          </main>
        </SidebarProvider>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
};

export default MainLayout;
