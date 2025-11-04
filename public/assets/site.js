/* eslint-env browser */
// public/assets/site.js — v14 (toast + animation + click sound, БЕЗ перехода на YouTube)

(function () {
  console.log("[site.js] loaded v14");

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

      // лёгкий "ping"
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
      // молча игнорируем, если браузер ругнётся
    }
  }

  // ---- toast ----
  function showYouTubeNotice() {
    const old = document.getElementById("yt-toast");
    if (old) old.remove();

    const toast = document.createElement("div");
    toast.id = "yt-toast";
    toast.textContent = "AIFlow Labs Studio YouTube channel is coming soon!";
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

  // ---- button micro animation ----
  function buttonClickFeedback(btn) {
    if (!btn.animate) return;
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

  // ---- main binding ----
  function bindYouTubeToast() {
    /** @type {HTMLAnchorElement | null} */
    const btn = document.getElementById("ytLink");
    if (!btn || btn.dataset.bound === "1") return;

    btn.addEventListener("click", (e) => {
      // только обычный левый клик, без модификаторов
      if (e.button !== 0) return;
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;

      // КЛЮЧЕВОЕ: не даём ссылке перейти
      e.preventDefault();

      buttonClickFeedback(btn);
      playClickSound();
      showYouTubeNotice();

      // НИКАКИХ window.open / переходов
    });

    btn.dataset.bound = "1";
  }

  if (document.readyState === "loading") {
    globalThis.addEventListener("DOMContentLoaded", bindYouTubeToast);
  } else {
    bindYouTubeToast();
  }
})();
