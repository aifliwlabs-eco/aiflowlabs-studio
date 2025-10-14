export default {
  "**/*.{ts,tsx,js,jsx,mjs,cjs}": [
    "prettier --write",
    "eslint --fix --max-warnings=0 --no-warn-ignored",
  ],
  "**/*.{json,css,md}": ["prettier --write"],
};
