import React from "react";
import type { Route } from "./+types/category";

export default function Component({ params }: Route.ComponentProps) {
  return (
    <div>
      <h1>Notes</h1>
      <p>CAtegory ID: {params.categoryId}</p>
    </div>
  );
}
