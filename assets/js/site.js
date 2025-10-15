// YouTube button (instead of inline onclick)
document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("ytLink")?.addEventListener("click", (e) => {
    e.preventDefault();
    alert("AIFlow Labs Studio YouTube channel is coming soon!");
  });
});
function isAppsScriptMessage(x) {
  if (typeof x !== "object" || x === null) return false;
  const maybe = x;
  return typeof maybe.ok === "boolean";
}
// --- element refs ---
const openBtn = document.getElementById("openWaitlist");
const modal = document.getElementById("waitlistModal");
const closeX = modal?.querySelector(".close-x") ?? null;
const form = document.getElementById("waitlistForm");
const modalMsg = document.getElementById("modalMsg");
const pageMsg = document.getElementById("feedback");
const iframe = document.querySelector('iframe[name="hidden_iframe"]');
const hpField = form?.querySelector('input[name="company"]'); // honeypot
let inFlight = false;
// Works in both DOM and Node typings
let ackTimer;
// --- UI helpers ---
function setOk(target, text) {
  if (!target) return;
  target.className = "msg ok";
  target.textContent = text;
}
function setErr(target, text) {
  if (!target) return;
  target.className = "msg err";
  target.textContent = text;
}
function setNeutral(target, text = "") {
  if (!target) return;
  target.className = "msg";
  target.textContent = text;
}
function submitBtn() {
  return form?.querySelector('button[type="submit"]') ?? null;
}
function lockSubmit() {
  const btn = submitBtn();
  if (btn) {
    btn.disabled = true;
    btn.textContent = "Sending…";
  }
}
function unlockSubmit() {
  const btn = submitBtn();
  if (btn) {
    btn.disabled = false;
    btn.textContent = "Send";
  }
}
function resetUI() {
  if (ackTimer !== undefined) clearTimeout(ackTimer);
  inFlight = false;
  setNeutral(modalMsg);
  setNeutral(pageMsg);
  unlockSubmit();
}
// --- <dialog> open/close ---
openBtn?.addEventListener("click", () => {
  if (hpField?.value) hpField.value = ""; // safely clear honeypot
  resetUI();
  // native open or fallback attribute
  if (modal?.showModal) modal.showModal();
  else modal?.setAttribute("open", "");
});
function closeModal() {
  if (modal?.close) modal.close();
  else modal?.removeAttribute("open");
}
closeX?.addEventListener("click", closeModal);
// click on backdrop (strictly dialog itself, not .modal-card)
modal?.addEventListener("click", (e) => {
  if (e.target === modal) closeModal();
});
// --- Allowed origins for Apps Script postMessage ---
const TRUSTED_ORIGINS = new Set([
  "https://script.google.com",
  "https://script.googleusercontent.com",
]);
// --- Form validation & submit ---
form?.addEventListener("submit", (e) => {
  if (!form || !iframe) return;
  if (hpField?.value) hpField.value = ""; // never block by honeypot
  // using named controls from <form>
  const name = form.elements.namedItem("name")?.value.trim() ?? "";
  const email = form.elements.namedItem("email")?.value.trim() ?? "";
  setNeutral(modalMsg);
  if (!name) {
    e.preventDefault();
    setErr(modalMsg, "Please enter your name.");
    return;
  }
  if (!/^\S+@\S+\.\S+$/.test(email)) {
    e.preventDefault();
    setErr(modalMsg, "Please enter a valid email.");
    return;
  }
  lockSubmit();
  inFlight = true;
  // Fallback: iframe onload will ack if postMessage didn't arrive
  const onLoadOnce = () => {
    if (!inFlight) return; // already handled by postMessage
    if (ackTimer !== undefined) clearTimeout(ackTimer);
    setOk(modalMsg, "Request received — check your email shortly.");
    setOk(pageMsg, "Request received.");
    unlockSubmit();
    inFlight = false;
  };
  iframe.addEventListener("load", onLoadOnce, { once: true });
  // Safety timer
  if (ackTimer !== undefined) clearTimeout(ackTimer);
  ackTimer = globalThis.setTimeout(() => {
    if (!inFlight) return;
    setErr(
      modalMsg,
      "Still sending… If this hangs, try Incognito (extensions may block the response)."
    );
    unlockSubmit();
    inFlight = false;
  }, 10000);
  // IMPORTANT: do NOT preventDefault — form must submit into the iframe
});
// --- Apps Script postMessage handler ---
globalThis.addEventListener("message", (ev) => {
  // 1) strict origin check
  if (!ev.origin) return;
  const originOk = TRUSTED_ORIGINS.has(ev.origin);
  if (!originOk) return;
  // 2) ensure message came from our hidden iframe
  if (iframe && ev.source !== iframe.contentWindow) return;
  const dataUnknown = ev.data;
  if (!isAppsScriptMessage(dataUnknown)) return;
  const data = dataUnknown; // typed
  if (ackTimer !== undefined) clearTimeout(ackTimer);
  inFlight = false;
  unlockSubmit();
  const handleQuota = () => {
    setOk(
      modalMsg,
      "Request accepted. We will email you later (email quota is temporarily exhausted)."
    );
    setOk(pageMsg, "Accepted; email will be sent later.");
    form?.reset();
  };
  const handleSuccess = (duplicate) => {
    setOk(
      modalMsg,
      duplicate
        ? "You’re already on the list — we’ll keep you posted."
        : "Thanks! You’re on the list."
    );
    setOk(pageMsg, duplicate ? "Already subscribed." : "Subscription confirmed.");
    form?.reset();
  };
  if (data.ok === false) {
    setErr(modalMsg, "Something went wrong. Please try again.");
    return;
  }
  if (data.ok === true && data.reason === "quota_exhausted") {
    handleQuota();
    return;
  }
  if (data.ok === true) {
    handleSuccess(Boolean(data.duplicate));
  }
});
export {};
