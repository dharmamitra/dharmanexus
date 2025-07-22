/* eslint-disable @typescript-eslint/no-require-imports,@typescript-eslint/no-var-requires */
const HttpBackend = require("i18next-http-backend/cjs");
const ChainedBackend = require("i18next-chained-backend").default;
const LocalStorageBackend = require("i18next-localstorage-backend").default;

/**
 * ¡¡¡ NOTE !!!
 * i18n constants are duplicated for Node.js compatibility
 * These must match exactly with src/constants/i18n.ts
 */
const SUPPORTED_LOCALES = [
  "en",
  "ja",
  "ko",
  "hi",
  "zh_Hant",
  "zh_Hans",
  "bo",
];
const DEFAULT_LOCALE = "en";
const I18N_NAMESPACES = ["common", "settings", "home"];

const isBrowser = typeof window !== "undefined";
const isDev = process.env.NODE_ENV === "development";

// https://github.com/i18next/next-i18next/blob/master/examples/auto-static-optimize/next-i18next.config.js

/**
 * @type {import('next-i18next').UserConfig}
 */
module.exports = {
  backend: {
    backendOptions: [
      { expirationTime: isDev ? 60 * 1000 : 60 * 60 * 1000 },
      {},
    ], // 1 hour
    backends: isBrowser ? [LocalStorageBackend, HttpBackend] : [],
  },

  debug: isDev,
  i18n: {
    defaultLocale: DEFAULT_LOCALE,
    locales: [...SUPPORTED_LOCALES],
  },

  initImmediate: false,

  /** To avoid issues when deploying to some paas (vercel...) */
  localePath:
    typeof window === "undefined"
      ? require("path").resolve("./public/locales")
      : "/locales",

  reloadOnPrerender: isDev,

  ns: [...I18N_NAMESPACES],
  partialBundledLanguages: isBrowser,
  use: isBrowser ? [ChainedBackend] : [],
};
