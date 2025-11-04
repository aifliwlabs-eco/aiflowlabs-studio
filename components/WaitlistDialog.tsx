// components/WaitlistDialog.tsx
"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { GradientButton } from "@/components/GradientButton";

type MsgState = { type: "ok" | "err" | "neutral"; text: string };

export function WaitlistDialog() {
  const formRef = React.useRef<HTMLFormElement | null>(null);
  const submittingRef = React.useRef(false);

  const [msg, setMsg] = React.useState<MsgState>({
    type: "neutral",
    text: "",
  });
  const [busy, setBusy] = React.useState(false);

  // управляем показом диалога внешней кнопкой (#openWaitlist)
  const [open, setOpen] = React.useState(false);

  // скрытый iframe (как в legacy)
  const iframeName = "hidden_iframe";

  // привязка к внешней кнопке в Card
  React.useEffect(() => {
    const btn = document.getElementById("openWaitlist");
    const onClick = (e: Event) => {
      e.preventDefault();
      setMsg({ type: "neutral", text: "" });
      setBusy(false);
      setOpen(true);
    };
    btn?.addEventListener("click", onClick);
    return () => btn?.removeEventListener("click", onClick);
  }, []);

  // обработчик загрузки iframe — сигнал, что запрос в Apps Script завершён
  const handleIframeLoad = React.useCallback(() => {
    // Чтобы не реагировать на первую/случайную загрузку
    if (!submittingRef.current) {
      return;
    }

    // Это как раз ответ на наш submit
    submittingRef.current = false;
    setBusy(false);

    setMsg({
      type: "ok",
      text: "Thanks! Check your inbox, we’ve just sent you a message.",
    });

    formRef.current?.reset();
    setTimeout(() => setOpen(false), 900);
  }, []);

  // класс статуса без вложенных тернарников
  let msgClass = "";
  if (msg.type === "ok") msgClass = "tw-text-[#7cff96]";
  else if (msg.type === "err") msgClass = "tw-text-[#ff7a7a]";

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        className="
          tw-fixed tw-z-50 tw-left-1/2 tw-top-1/2 -tw-translate-x-1/2 -tw-translate-y-1/2
          tw-w-full tw-max-w-[460px]
          tw-rounded-[16px] tw-p-[22px]
          tw-bg-[rgba(255,255,255,0.07)]
          tw-shadow-[0_10px_40px_rgba(0,0,0,0.45),inset_0_0_0_1px_var(--ring)]
          tw-backdrop-blur-[14px] tw-saturate-[1.2]
          tw-text-[rgba(233,238,245,0.98)]
        "
      >
        {/* ✕ — как .close-x (без рамки и бордера) */}
        <button
          type="button"
          aria-label="Close"
          onClick={() => setOpen(false)}
          style={{
            all: "unset",
            position: "absolute",
            right: 14,
            top: 14,
            cursor: "pointer",
            color: "#cbd5e1",
            lineHeight: 1,
            padding: 2,
            borderRadius: 6,
          }}
          className="tw-text-[18px] hover:tw-text-white focus-visible:tw-ring-2 focus-visible:tw-ring-offset-2"
        >
          ✕
        </button>

        <DialogHeader>
          <DialogTitle className="tw-mt-[4px] tw-mb-[6px] tw-text-[22px] tw-font-bold tw-text-[rgba(233,238,245,0.98)]">
            Join the waitlist
          </DialogTitle>
          <DialogDescription className="tw-text-[15px] tw-text-[#93a0b3]">
            Leave your name and email — we’ll notify you when early access opens.
          </DialogDescription>
        </DialogHeader>

        <form
          ref={formRef}
          id="waitlistForm"
          action="https://script.google.com/macros/s/AKfycbwU7mucM9BCJqf76CIEDQH8UQZUBPIoXBYyntlbwrIAH2ie4eEci67iZvo31c_j9Irk/exec"
          method="POST"
          target={iframeName}
          onSubmit={(e) => {
            const form = e.currentTarget;
            const name =
              (form.elements.namedItem("name") as HTMLInputElement | null)
                ?.value.trim() ?? "";
            const email =
              (form.elements.namedItem("email") as HTMLInputElement | null)
                ?.value.trim() ?? "";

            setMsg({ type: "neutral", text: "" });

            if (!name) {
              e.preventDefault();
              setMsg({ type: "err", text: "Please enter your name." });
              return;
            }
            if (!/^\S+@\S+\.\S+$/.test(email)) {
              e.preventDefault();
              setMsg({ type: "err", text: "Please enter a valid email." });
              return;
            }

            // Форма реально отправляется в iframe
            submittingRef.current = true;
            setBusy(true);
          }}
        >
          {/* honeypot */}
          <input
            type="text"
            name="company"
            tabIndex={-1}
            autoComplete="off"
            style={{ position: "absolute", left: -9999, opacity: 0 }}
            aria-hidden="true"
          />

          <div className="tw-flex tw-flex-wrap tw-items-center tw-gap-[10px] tw-mт-[14px]">
            <div className="tw-flex-1 min-[380px]:tw-flex-initial min-[380px]:tw-basis-[45%]">
              <Label htmlFor="wl-name" className="tw-sr-only">
                Your name
              </Label>
              <Input
                id="wl-name"
                name="name"
                placeholder="Your name"
                required
                className="
                  tw-rounded-[12px]
                  tw-border tw-border-[var(--ring)]
                  tw-bg-[rgba(255,255,255,0.06)]
                  tw-text-[var(--text)]
                  placeholder:tw-text-[#b6c2d4]
                "
              />
            </div>

            <div className="tw-flex-1 min-[380px]:tw-flex-initial min-[380px]:tw-basis-[45%]">
              <Label htmlFor="wl-email" className="tw-sr-only">
                Email
              </Label>
              <Input
                id="wl-email"
                name="email"
                type="email"
                placeholder="you@example.com"
                required
                className="
                  tw-rounded-[12px]
                  tw-border tw-border-[var(--ring)]
                  tw-bg-[rgba(255,255,255,0.06)]
                  tw-text-[var(--text)]
                  placeholder:tw-text-[#b6c2d4]
                "
              />
            </div>

            <GradientButton type="submit" disabled={busy}>
              {busy ? "Sending…" : "Send"}
            </GradientButton>
          </div>

          {/* строка статуса */}
          <output
            id="modalMsg"
            aria-live="polite"
            className={`tw-text-[14px] tw-mt-[12px] block ${msgClass}`}
          >
            {msg.text}
          </output>

          {/* скрытый iframe — приём ответа, только по onLoad */}
          <iframe
            name={iframeName}
            style={{ display: "none" }}
            title="Hidden waitlist form target"
            onLoad={handleIframeLoad}
          />
        </form>
      </DialogContent>
    </Dialog>
  );
}
