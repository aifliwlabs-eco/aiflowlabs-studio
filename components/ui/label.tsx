"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * Label всегда ассоциирован с контролом.
 * Типы требуют htmlFor, а в dev-режиме есть рантайм-проверка.
 */
export interface LabelProps extends Omit<React.ComponentPropsWithoutRef<"label">, "htmlFor"> {
  htmlFor: string;
}

const Label = React.forwardRef<HTMLLabelElement, LabelProps>(
  ({ className, htmlFor, ...props }, ref) => {
    // Доп. защита в dev: если кто-то забудет htmlFor — сразу бросим ошибку
    if (process.env.NODE_ENV !== "production") {
      if (typeof htmlFor !== "string" || htmlFor.length === 0) {
        throw new Error("[Label] htmlFor is required and must match an existing input id.");
      }
    }

    return (
      // NOSONAR typescript:S6853 — htmlFor обязателен типами и проверен рантаймом
      <label
        ref={ref}
        htmlFor={htmlFor}
        className={cn(
          "tw-text-sm tw-font-medium tw-leading-none",
          "tw-peer-disabled:tw-cursor-not-allowed tw-peer-disabled:tw-opacity-70",
          className
        )}
        {...props}
      />
    );
  }
);
Label.displayName = "Label";

export { Label };
