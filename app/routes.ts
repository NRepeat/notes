import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  route("/", "routes/home.tsx", [
    // Nested categories and notes: support any depth of folders
    route("c/*", "routes/notes.tsx", {
      id: "category-note",
    }),
    // // Global note (no category)
    route("n/:notesId", "routes/singleNotes.tsx", { id: "global-note" }),
    // // Single category (for category page) - must be last
    route("c/:category", "routes/category.tsx"),
  ]),
] satisfies RouteConfig;
