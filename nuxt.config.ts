// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-04-03",
  devtools: { enabled: false },
  app: {
    head: {
      link: [
        {
          rel: "icon",
          type: "image/png",
          href: "/favicon.png",
        },
        {
          rel: "stylesheet",
          href: "https://kit.fontawesome.com/d2a58765e0.css",
          crossorigin: "anonymous",
        },
        {
          href: "/bootstrap.rtl.min.css",
          rel: "stylesheet",
        },
      ],
      script: [
        {
          src: "/bootstrap.bundle.min.js",
          type: "text/javascript",
        },
      ],
    },
  },

  modules: ["@nuxt/image"],

  css: ["@/assets/scss/style.scss", "bootstrap/dist/css/bootstrap.min.css"],
});
