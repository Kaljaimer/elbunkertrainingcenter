// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from "@tailwindcss/vite";
import vuetify, { transformAssetUrls } from "vite-plugin-vuetify";

export default defineNuxtConfig({
  devtools: { enabled: true },
  experimental: {
    renderJsonPayloads: false
  },
  vite: {
    plugins: [
      tailwindcss(),
    ],
    vue: {
      template: {
        transformAssetUrls,
      },
    },
    css: {
      preprocessorOptions: {
        scss: {
          sourceMap: true,
        },
      },
    },
  },
  postcss: {
    plugins: {
      "@tailwindcss/postcss": {},
    },
  },
  experimental: { appManifest: false },
  css: [
    "~/assets/css/main.css",
    "bootstrap/dist/css/bootstrap.min.css",
    "/assets/css/remixicon.css",
    "/assets/fonts/flaticon.css",
    "/assets/css/satoshi-font.css",
  ],

  plugins: ["~/plugins/vuetify"],

  build: {
    transpile: ["vuetify"],
  },
  modules: ["@nuxt/content", "nuxt-icon", "@nuxt/image", (
      _options: any,
      nuxt: {
        hooks: {
          hook: (
              arg0: string,
              arg1: (config: { plugins: Plugin<any>[][] }) => void
          ) => void;
        };
      }
  ) => {
    nuxt.hooks.hook(
        "vite:extendConfig",
        (config: { plugins: Plugin<any>[][] }) => {
          config.plugins.push(vuetify({ autoImport: true }));
        }
    );
  }
  ],
  components: true,
  compatibilityDate: "2024-12-18",
});
