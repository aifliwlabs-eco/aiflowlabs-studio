"use client";

import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { cn } from "@/lib/utils";

export const Dialog = DialogPrimitive.Root;
export const DialogTrigger = DialogPrimitive.Trigger;
export const DialogPortal = DialogPrimitive.Portal;

export const DialogOverlay = React.forwardRef<
  React.ComponentRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      // было без префикса — из-за этого оверлей не фиксировался
      "tw-fixed tw-inset-0 tw-z-50 tw-bg-black/50 tw-backdrop-blur-[6px] tw-data-[state=open]:tw-animate-in tw-data-[state=closed]:tw-animate-out tw-data-[state=closed]:tw-fade-out-0 tw-data-[state=open]:tw-fade-in-0",
      className
    )}
    {...props}
  />
));
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName;

export const DialogContent = React.forwardRef<
  React.ComponentRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <DialogPortal>
    <DialogOverlay />
    <DialogPrimitive.Content
      ref={ref}
      // ключевые фикс-позиции были без префикса — отсюда «съехало»
      className={cn(
        "tw-fixed tw-z-50 tw-left-1/2 tw-top-1/2 -tw-translate-x-1/2 -tw-translate-y-1/2",
        // базовый центрированный бокс
        "tw-w-full tw-max-w-[460px] tw-rounded-[16px] tw-bg-[rgba(255,255,255,0.07)]",
        "tw-shadow-[0_10px_40px_rgba(0,0,0,0.45),inset_0_0_0_1px_var(--ring)] tw-backdrop-blur-[14px] tw-saturate-[1.2]",
        // внутренние отступы
        "tw-p-[22px]",
        // анимации (опционально, если нет tailwindcss-animate, просто останутся без эффекта)
        "tw-data-[state=open]:tw-animate-in tw-data-[state=closed]:tw-animate-out",
        "tw-data-[state=closed]:tw-fade-out-0 tw-data-[state=open]:tw-fade-in-0",
        "tw-data-[state=open]:tw-zoom-in-95 tw-data-[state=closed]:tw-zoom-out-95",
        className
      )}
      {...props}
    >
      {children}
    </DialogPrimitive.Content>
  </DialogPortal>
));
DialogContent.displayName = DialogPrimitive.Content.displayName;

export const DialogHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn("tw-flex tw-flex-col tw-space-y-1.5 tw-text-center sm:tw-text-left", className)}
    {...props}
  />
);
DialogHeader.displayName = "DialogHeader";

export const DialogTitle = React.forwardRef<
  React.ComponentRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn("tw-text-xl tw-font-semibold tw-leading-none tw-tracking-tight", className)}
    {...props}
  />
));
DialogTitle.displayName = DialogPrimitive.Title.displayName;

export const DialogDescription = React.forwardRef<
  React.ComponentRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={cn("tw-text-sm tw-text-neutral-400", className)}
    {...props}
  />
));
DialogDescription.displayName = DialogPrimitive.Description.displayName;
