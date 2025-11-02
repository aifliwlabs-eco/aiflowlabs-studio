"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => setMounted(true), []);

  const isDark = mounted ? resolvedTheme === "dark" : false;

  // ✅ устраняем S3358: выносим тернарные выражения
  let icon: React.ReactNode;
  if (!mounted) {
    icon = <span aria-hidden className="tw-inline-block tw-w-[16px] tw-h-[16px]" />;
  } else if (isDark) {
    icon = <Sun size={16} />;
  } else {
    icon = <Moon size={16} />;
  }

  let label = "Dark";
  if (mounted) {
    label = isDark ? "Light" : "Dark";
  }

  return (
    <button
      type="button"
      aria-label="Toggle theme"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="
        tw-fixed tw-right-4 tw-top-4
        tw-inline-flex tw-items-center tw-rounded-xl tw-px-3 tw-py-2
        tw-text-sm tw-font-medium
        tw-bg-white tw-text-neutral-900 dark:tw-bg-neutral-900 dark:tw-text-neutral-100
        tw-shadow-[0_6px_18px_rgba(0,0,0,0.15)]
        tw-transition tw-duration-150 hover:tw--translate-y-[1px]
      "
    >
      {icon}
      <span className="tw-ml-2 tw-text-xs" suppressHydrationWarning>
        {label}
      </span>
    </button>
  );
}
