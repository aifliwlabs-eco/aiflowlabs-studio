/* eslint-env browser */
// public/assets/site.js — v9 (simple toast on YouTube button)

(function () {
  // Маркер, что файл реально загрузился
  console.log("[site.js] loaded v9");

  function showYouTubeNotice() {
    // убрать старый тост, если вдруг висит
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

  function bindYouTubeToast() {
    const btn = document.getElementById("ytLink");
    if (!btn) return;
    if (btn.dataset.bound === "1") return;

    btn.addEventListener("click", () => {
      showYouTubeNotice();
    });

    btn.dataset.bound = "1";
  }

  // если DOM уже готов — вешаем сразу
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", bindYouTubeToast);
  } else {
    bindYouTubeToast();
  }
})();
