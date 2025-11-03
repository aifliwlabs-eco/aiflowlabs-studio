// eslint.config.mjs — ESLint v9 flat config (App Router + TS + JS)
import js from "@eslint/js";
import tseslint from "typescript-eslint";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import eslintConfigPrettier from "eslint-config-prettier";
import globals from "globals";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default [
  // ── Игноры (заменяют .eslintignore) ──────────────────────────────────────────
  {
    ignores: [
      "node_modules",
      ".next",
      "dist",
      "out",
      "coverage",
      "project_tree.txt",
      "next-env.d.ts", // не линтим автогенерируемый файл Next
      "public/assets/img/**", // изображения
      "public/assets/**/*.map", // карты исходников
    ],
  },

  // ── JS: только .js/.jsx/.mjs/.cjs — без TS-парсера ──────────────────────────
  {
    files: ["**/*.{js,jsx,mjs,cjs}"],
    ...js.configs.recommended,
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      // глобалы задаём ниже по зонам (browser/node)
    },
  },

  // ── Браузерные скрипты (legacy site.js) ─────────────────────────────────────
  {
    files: ["public/assets/site.js"],
    languageOptions: {
      globals: globals.browser, // document, window, setTimeout и т.д.
      sourceType: "script",
    },
  },

  // ── Node/CommonJS конфиги и скрипты ─────────────────────────────────────────
  {
    files: [
      "postcss.config.js",
      "tailwind.config.js",
      "scripts/**/*.{js,cjs}",
    ],
    languageOptions: {
      globals: globals.node, // module, require, __dirname …
      sourceType: "commonjs",
    },
  },

  // ── TS: .ts/.tsx с type-aware правилами ─────────────────────────────────────
  ...tseslint.configs.recommendedTypeChecked.map((cfg) => ({
    ...cfg,
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      ...cfg.languageOptions,
      parserOptions: {
        ...cfg.languageOptions?.parserOptions,
        project: ["./tsconfig.json"],
        tsconfigRootDir: __dirname,
      },
    },
    // Без лишних {} — SonarLint не ругается
    plugins: { ...cfg.plugins, react, "react-hooks": reactHooks },
    rules: {
      ...cfg.rules,
      "react/jsx-uses-react": "off",
      "react/react-in-jsx-scope": "off",
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",

      // Ослабления для postMessage и прочих runtime-типов
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-unsafe-member-access": "off",
    },
    settings: { react: { version: "detect" } },
  })),

  // ── Совместимость с Prettier ────────────────────────────────────────────────
  eslintConfigPrettier,
];
