// YouTube button (вместо inline onclick)
document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("ytLink")?.addEventListener("click", (e) => {
    e.preventDefault();
    alert("AIFlow Labs Studio YouTube channel is coming soon!");
  });
});

// --- Ссылки на элементы ---
const openBtn = document.getElementById("openWaitlist");
/** @type {HTMLDialogElement|null} */
const modal = document.getElementById("waitlistModal");
const closeX = modal?.querySelector(".close-x");

const form = document.getElementById("waitlistForm");
/** @type {HTMLOutputElement|null} */
const modalMsg = document.getElementById("modalMsg");
/** @type {HTMLOutputElement|null} */
const pageMsg = document.getElementById("feedback");
const iframe = document.querySelector('iframe[name="hidden_iframe"]');
const hpField = form?.querySelector('input[name="company"]'); // honeypot

let inFlight = false;
let ackTimer = null;

// --- утилиты сообщения UI ---
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
  return form?.querySelector('button[type="submit"]');
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
  clearTimeout(ackTimer);
  inFlight = false;
  setNeutral(modalMsg);
  setNeutral(pageMsg);
  unlockSubmit();
}

// --- Открытие/закрытие диалога (<dialog>) ---
openBtn?.addEventListener("click", () => {
  // чистим honeypot безопасно (optional chaining)
  if (hpField?.value) hpField.value = "";
  resetUI();

  // нативно открыть диалог, иначе фолбэк на атрибут
  modal?.showModal?.() ?? modal?.setAttribute("open", "");
});

function closeModal() {
  // нативно закрыть диалог, иначе снять атрибут
  modal?.close?.() ?? modal?.removeAttribute("open");
}

closeX?.addEventListener("click", closeModal);

// Закрытие по клику на backdrop (клик строго по самому <dialog>, а не по .modal-card)
modal?.addEventListener("click", (e) => {
  if (e.target === modal) closeModal();
});

// --- Allowed origins for Apps Script postMessage ---
const TRUSTED_ORIGINS = ["https://script.google.com", "https://script.googleusercontent.com"];

// --- Валидация и отправка формы ---
form?.addEventListener("submit", (e) => {
  if (!form || !iframe) return;

  // Никогда не блокируем по honeypot — просто очищаем (расширения могут авто-заполнить)
  if (hpField?.value) hpField.value = "";

  const name = form.name.value.trim();
  const email = form.email.value.trim();

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

  // Fallback: если postMessage не придёт, onload iframe снимет «ожидание»
  const onLoadOnce = () => {
    if (!inFlight) return; // уже обработано postMessage
    clearTimeout(ackTimer);
    setOk(modalMsg, "Request received — check your email shortly.");
    setOk(pageMsg, "Request received.");
    unlockSubmit();
    inFlight = false;
  };
  iframe.addEventListener("load", onLoadOnce, { once: true });

  // Safety-таймер
  clearTimeout(ackTimer);
  ackTimer = setTimeout(() => {
    if (!inFlight) return;
    setErr(
      modalMsg,
      "Still sending… If this hangs, try Incognito (extensions may block the response)."
    );
    unlockSubmit();
    inFlight = false;
  }, 10000);

  // ВАЖНО: не preventDefault — форма должна отправиться в iframe
});

// --- Ответ от Apps Script через postMessage ---
window.addEventListener("message", (ev) => {
  // 1) Жёстко валидируем origin (строгое совпадение)
  if (!ev.origin) return;
  const originOk = TRUSTED_ORIGINS.includes(ev.origin);
  if (!originOk) return;

  // 2) Проверяем, что сообщение пришло именно из нашего hidden iframe
  if (iframe && ev.source !== iframe.contentWindow) return;

  const data = ev?.data;
  if (!data || typeof data !== "object") return;

  clearTimeout(ackTimer);
  inFlight = false;
  unlockSubmit();

  // Ветвление вынесено в маленькие функции, чтобы снизить сложность
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
