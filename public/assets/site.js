/* eslint-env browser */
// public/assets/site.js — v12 (toast + micro-anim + soft click sound)

(function () {
  console.log("[site.js] loaded v12");

  // ---- tiny click sound via Web Audio API ----
  /** @type {AudioContext | null} */
  let clickAudioCtx = null;

  function playClickSound() {
    try {
      const AudioCtxCtor =
        globalThis.AudioContext || globalThis.webkitAudioContext;
      if (!AudioCtxCtor) return;

      if (!clickAudioCtx) {
        clickAudioCtx = new AudioCtxCtor();
      }
      const ctx = clickAudioCtx;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      const now = ctx.currentTime;
      osc.type = "sine";
      osc.frequency.setValueAtTime(660, now);
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.12);

      gain.gain.setValueAtTime(0.04, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.16);
    } catch {
      // если что-то пошло не так — просто без звука
    }
  }

  // ---- generic toast helper ----
  function showToast(id, text) {
    // удаляем предыдущий тост с тем же id
    const old = document.getElementById(id);
    if (old) old.remove();

    const toast = document.createElement("div");
    toast.id = id;
    toast.textContent = text;

    Object.assign(toast.style, {
      position: "fixed",
      bottom: "28px",
      left: "50%",
      transform: "translateX(-50%)",
      background: "linear-gradient(90deg, var(--grad-a), var(--grad-b))",
      color: "#0b0f14",
      padding: "12px 22px",
      borderRadius: "12px",
      fontSize: "15px",
      fontWeight: "600",
      textAlign: "center",
      boxShadow: "0 6px 18px rgba(0,212,255,0.25)",
      backdropFilter: "blur(8px) saturate(1.2)",
      zIndex: "9999",
      opacity: "0",
      pointerEvents: "none",
      transition: "opacity 0.3s ease, transform 0.3s ease",
    });

    document.body.appendChild(toast);

    // fade in
    requestAnimationFrame(() => {
      toast.style.opacity = "1";
      toast.style.transform = "translateX(-50%) translateY(-4px)";
    });

    // fade out
    setTimeout(() => {
      toast.style.opacity = "0";
      toast.style.transform = "translateX(-50%) translateY(4px)";
      setTimeout(() => toast.remove(), 350);
    }, 3000);
  }

  // специализированные сообщения
  function showYouTubeNotice() {
    showToast("yt-toast", "AIFlow Labs Studio YouTube channel is coming soon!");
  }

  function showNotifyNotice() {
    showToast("wl-toast", "Opening waitlist…");
  }

  // ---- button micro animation ----
  function buttonClickFeedback(btn) {
    if (!btn || !btn.animate) return;

    btn.animate(
      [
        { transform: "scale(1)", filter: "brightness(1)" },
        { transform: "scale(0.94)", filter: "brightness(1.1)" },
        { transform: "scale(1)", filter: "brightness(1)" },
      ],
      {
        duration: 200,
        easing: "ease-out",
      }
    );
  }

  // ---- YouTube button binding (#ytLink) ----
  function bindYouTubeButton() {
    const btn = document.getElementById("ytLink");
    if (!btn || btn.dataset.bound === "1") return;

    btn.addEventListener("click", (e) => {
      const target =
        e.target instanceof Element ? e.target.closest("#ytLink") : null;
      if (!target) return;

      // только обычный левый клик без модификаторов
      if (e.button !== 0) return;
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;

      // блокируем открытие YouTube — как в старом проде (только тост)
      e.preventDefault();

      buttonClickFeedback(btn);
      playClickSound();
      showYouTubeNotice();
    });

    btn.dataset.bound = "1";
  }

  // ---- Notify button binding (#openWaitlist) ----
  function bindNotifyButton() {
    const btn = document.getElementById("openWaitlist");
    if (!btn || btn.dataset.notifyBound === "1") return;

    btn.addEventListener("click", () => {
      // здесь НИЧЕГО не предотвращаем — let React do its thing
      buttonClickFeedback(btn);
      playClickSound();
      showNotifyNotice();
      // дальше WaitlistDialog сам откроет модалку по своему listener'у
    });

    btn.dataset.notifyBound = "1";
  }

  // ---- init ----
  function init() {
    bindYouTubeButton();
    bindNotifyButton();
  }

  if (document.readyState === "loading") {
    globalThis.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
