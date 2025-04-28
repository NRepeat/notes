import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  //   index("routes/home.tsx"),
  route("/", "routes/home.tsx", [
    route("c/:categoryId/", "routes/category.tsx"),
    route("c/:categoryId/n/:notesId", "routes/notes.tsx"),
  ]),
] satisfies RouteConfig;
