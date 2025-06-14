import { Link, Outlet } from "react-router";
import type { Route } from "../+types/root";
import { useBearStore } from "~/store";
import { useState } from "react";
import { Button } from "~/components/ui/button";
import { Leaf } from "~/entity/Leaf";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function Home() {
  return (
    <>
      <Outlet />
    </>
  );
}
