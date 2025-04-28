import React from "react";
import { Links, Meta, Scripts, ScrollRestoration } from "react-router";

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <main className="pt-16 p-4 container mx-auto">{children}</main>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
};

export default MainLayout;
