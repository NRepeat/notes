import type { Config } from "@react-router/dev/config";

export default {
  // Config options...
  // Server-side render by default, to enable SPA mode set this to `false`
  ssr: false,

  // SPA fallback will be written to build/client/__spa-fallback.html
  // prerender: ["/", "/about"],
} satisfies Config;
