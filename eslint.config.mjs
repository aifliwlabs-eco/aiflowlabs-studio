// eslint.config.mjs — ESLint v9 flat config (App Router + TS + JS, без Next-пресета)
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
  // Игноры (заменяют .eslintignore)
  { ignores: ["node_modules", ".next", "dist", "out", "coverage", "eslint.config.mjs"] },

  // ===== JS: только .js/.jsx/.mjs/.cjs — без TS-парсера =====
  {
    files: ["**/*.{js,jsx,mjs,cjs}"],
    ...js.configs.recommended,
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {}, // по умолчанию нет глобалов; ниже задаём по папкам
    },
  },

  // JS в браузере (assets/js/**): document/window/setTimeout и т.п.
  {
    files: ["assets/js/**/*.{js,jsx}"],
    languageOptions: {
      globals: globals.browser,
      sourceType: "module",
    },
  },

  // Node-скрипты (scripts/**): require, __dirname и т.п. (CommonJS)
  {
    files: ["scripts/**/*.{js,cjs}"],
    languageOptions: {
      globals: globals.node,
      sourceType: "commonjs",
    },
  },

  // ===== TS: только .ts/.tsx — c type-aware правилами =====
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
    plugins: { ...(cfg.plugins ?? {}), react, "react-hooks": reactHooks },
    rules: {
      ...(cfg.rules ?? {}),
      "react/jsx-uses-react": "off",
      "react/react-in-jsx-scope": "off",
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",
    },
    settings: { react: { version: "detect" } },
  })),

  // Пресеты Next специально не подключаем, чтобы не получать мусорные ошибки под pages/
  // Если захочешь выборочно включить отдельные next-правила — добавим точечно.

  // Совместимость с Prettier (выключает конфликтующие правила форматирования)
  eslintConfigPrettier,
];
