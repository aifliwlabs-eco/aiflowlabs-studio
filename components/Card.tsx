// components/Card.tsx
import * as React from "react";
import { GradientButton } from "@/components/GradientButton";

export default function Card() {
  return (
    /**
     * Keep legacy `card` for prod visual parity (width/glass/etc).
     * Tailwind augments spacing/blur/shadow.
     */
    <main className="card tw-relative tw-text-center tw-rounded-[20px] tw-pt-[48px] tw-pb-[48px] tw-pl-[28px] tw-pr-[28px] tw-backdrop-blur-[14px] tw-saturate-[1.2] tw-shadow-[0_10px_40px_rgba(0,0,0,0.35),inset_0_0_0_1px_var(--ring)] tw-text-[rgba(233,238,245,0.98)] dark:tw-text-[rgba(233,238,245,0.98)]">
      {/* Legacy logo pill with gradient text */}
      <span className="logo" id="logo-pill">
        <b>AIFlow</b> Labs Studio
      </span>

      {/* Title — tiny inner padding to avoid collisions */}
      <h1 className="tw-leading-[1.16] tw-pb-[4px] tw-mb-0">We’re launching soon</h1>

      {/* Subtitle — explicit spacing/width to match prod rhythm */}
      <p className="lead tw-mt-[16px] tw-mb-0 tw-max-w-[60ch] tw-mx-auto tw-text-center">
        <span className="typing">AI agents • creative tools • applied research</span>
      </p>

      {/* Actions row — Tailwind layout */}
      <div className="row tw-flex tw-flex-wrap tw-justify-center tw-gap-[12px] tw-mt-[18px]">
        {/* Notify button that opens the shadcn dialog (WaitlistDialog listens to #openWaitlist) */}
        <GradientButton id="openWaitlist" type="button">
          Notify me
        </GradientButton>

        {/* YouTube link styled as a gradient button (no nested interactive elements) */}
        <a
          id="ytLink"
          href="https://www.youtube.com/"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="AIFlow Labs Studio YouTube"
          // same look as GradientButton (gradient + elevation + motion)
          className="
            tw-inline-flex tw-items-center tw-justify-center
            tw-rounded-[12px] tw-pl-[18px] tw-pr-[16px] tw-py-[12px]
            tw-font-semibold tw-leading-[1.1] tw-no-underline
            tw-transform tw-transition-[transform,filter,box-shadow] tw-duration-150 tw-ease-out
            hover:tw--translate-y-[1px] hover:tw-brightness-[1.05]
          "
          style={{
            color: "rgb(11, 15, 20)",
            backgroundImage: "linear-gradient(90deg,var(--grad-a),var(--grad-b))",
            boxShadow: "0 6px 18px rgba(0,212,255,0.25)",
            cursor: "pointer",
          }}
        >
          {/* Play icon via SVG (replaces legacy ::before triangle) */}
          <svg
            aria-hidden="true"
            width="10"
            height="12"
            viewBox="0 0 10 12"
            className="tw-mr-[8px] tw-translate-y-[1px] tw-shrink-0"
            fill="currentColor"
            focusable="false"
          >
            <path d="M0 0 L10 6 L0 12 Z" />
          </svg>
          YouTube
        </a>
      </div>

      {/* Page-level feedback (used by site.js; harmless if unused) */}
      <output id="feedback" className="msg" aria-live="polite" />
    </main>
  );
}
