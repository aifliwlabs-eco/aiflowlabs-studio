export default {
  "{app,src,components,pages,assets/js,scripts}/**/*.{ts,tsx,js,jsx,mjs,cjs}": [
    "prettier --write",
    "eslint --fix --max-warnings=0 --no-warn-ignored"
  ],
  "**/*.{json,css,md}": [
    "prettier --write"
  ]
};
