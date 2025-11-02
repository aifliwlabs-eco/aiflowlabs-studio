// components/theme-provider.tsx
"use client";

import * as React from "react";
import {
  ThemeProvider as NextThemesProvider,
  type ThemeProviderProps as NextThemesProviderProps,
} from "next-themes";

// Разрешаем ровно те пропсы, которые передаёшь из layout
export type ThemeProviderProps = Readonly<{
  children: React.ReactNode;
}> &
  Pick<NextThemesProviderProps, "attribute" | "defaultTheme" | "enableSystem">;

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
