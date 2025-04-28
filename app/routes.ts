import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  route("/", "routes/home.tsx", [
    route("c/:categoryId/", "routes/category.tsx"),
    route("c/:categoryId/n/:notesId", "routes/notes.tsx", {
      id: "category-note",
    }),
    route("n/:notesId", "routes/notes.tsx", { id: "global-note" }),
  ]),
] satisfies RouteConfig;
