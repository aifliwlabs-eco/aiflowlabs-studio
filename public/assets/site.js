// public/assets/site.js
// --- YouTube button (neon toast style, single click) ---

function showYouTubeNotice() {
  // Remove any existing toasts
  const old = document.getElementById("yt-toast");
  if (old) old.remove();

  // Create a toast-like message (uses your CSS vars)
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

  // Fade in
  requestAnimationFrame(() => {
    toast.style.opacity = "1";
    toast.style.transform = "translateX(-50%) translateY(-4px)";
  });

  // Fade out and remove
  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateX(-50%) translateY(4px)";
    setTimeout(() => toast.remove(), 350);
  }, 3000);
}

function onYouTubeClick(e) {
  // Only intercept left-click / keyboard activation on the link itself
  const target = e.target instanceof Element ? e.target.closest("#ytLink") : null;
  if (!target) return;
  e.preventDefault();
  showYouTubeNotice();
}

/**
 * Bind once if the element already exists (covers CSR),
 * and also add delegated handler (covers React re-renders/SSR hydration).
 */
(function bindYouTube() {
  const a = document.getElementById("ytLink");
  if (a && !a.dataset.bound) {
    a.addEventListener("click", onYouTubeClick);
    a.dataset.bound = "1";
  }
  // Delegation safety net
  document.addEventListener("click", onYouTubeClick);
})();
