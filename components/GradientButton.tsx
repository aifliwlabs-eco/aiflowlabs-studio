// components/GradientButton.tsx
"use client";

import * as React from "react";
import clsx from "clsx";

/**
 * GradientButton — визуально идентична YouTube-ссылке:
 * одинаковый градиент, тень, отступы и без нативных стилей браузера.
 */
export function GradientButton({
  children,
  className,
  style,
  ...props
}: Readonly<React.ButtonHTMLAttributes<HTMLButtonElement>>) {
  return (
    <button
      {...props}
      className={clsx(
        // сбрасываем ВСЁ системное оформление
        "tw-appearance-none tw-outline-none tw-border-none tw-bg-transparent tw-select-none",
        // базовая форма и типографика
        "tw-inline-flex tw-items-center tw-justify-center tw-rounded-[12px]",
        "tw-pl-[18px] tw-pr-[16px] tw-py-[12px]",
        "tw-font-semibold tw-leading-[1.1] tw-text-[rgb(11,15,20)]",
        "tw-transition-[transform,filter,box-shadow] tw-duration-150 tw-ease-out",
        "hover:tw--translate-y-[1px] hover:tw-brightness-[1.05]",
        "focus-visible:tw-outline-none",
        className
      )}
      // inline-стиль гарантирует визуальное совпадение
      style={{
        backgroundImage: "linear-gradient(90deg, var(--grad-a), var(--grad-b))",
        boxShadow: "0 6px 18px rgba(0,212,255,0.25)",
        border: "none",
        outline: "none",
        WebkitAppearance: "none",
        MozAppearance: "none",
        cursor: "pointer",
        ...style,
      }}
    >
      {children}
    </button>
  );
}
