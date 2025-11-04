/* eslint-env browser */
// public/assets/site.js — v13
(function () {
  // Маркер, что именно этот файл подхватился
  console.log("[site.js] loaded v13");

  // --- КОРОТКИЙ ЗВУК ПРИ КЛИКЕ ПО YOUTUBE -------------------------------
  let audioCtx = null;

  function playClickSound() {
    try {
      if (!audioCtx) {
        // Один AudioContext на весь сайт
        audioCtx = new (globalThis.AudioContext || globalThis.webkitAudioContext)();
      }

      const duration = 0.18; // ~180ms
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.type = "sine";
      osc.frequency.value = 880; // "пик" приятный

      gain.gain.setValueAtTime(0.18, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start();
      osc.stop(audioCtx.currentTime + duration);
    } catch (err) {
      // Если что-то не так с AudioContext — просто молчим и не ломаем клик
      console.warn("[site.js] audio error:", err);
    }
  }

  // --- ТОСТ ДЛЯ YOUTUBE -------------------------------------------------
  function showYouTubeNotice() {
    // Удаляем старый тост, если есть
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

    // Плавное появление
    requestAnimationFrame(() => {
      toast.style.opacity = "1";
      toast.style.transform = "translateX(-50%) translateY(-4px)";
    });

    // И исчезновение
    setTimeout(() => {
      toast.style.opacity = "0";
      toast.style.transform = "translateX(-50%) translateY(4px)";
      setTimeout(() => toast.remove(), 350);
    }, 3000);
  }

  // --- ОБРАБОТЧИК КЛИКА ПО YOUTUBE-КНОПКЕ -------------------------------
  function onYouTubeClick(e) {
    const target =
      e.target instanceof Element ? e.target.closest("#ytLink") : null;
    if (!target) return;

    // 🔒 Всегда блокируем переход по ссылке
    e.preventDefault();

    // Звук + красивый тост
    playClickSound();
    showYouTubeNotice();
  }

  // --- ИНИЦИАЛИЗАЦИЯ ----------------------------------------------------
  globalThis.addEventListener("DOMContentLoaded", () => {
    // Прямая привязка, если элемент уже в DOM
    const a = document.getElementById("ytLink");
    if (a && !a.dataset.bound) {
      a.addEventListener("click", onYouTubeClick); // без passive, чтобы работал preventDefault
      a.dataset.bound = "1";
    }

    // Делегирование на весь документ — на случай ре-рендеров
    document.addEventListener("click", onYouTubeClick);
  });
})();
