// YouTube button (вместо inline onclick)
document.addEventListener('DOMContentLoaded', () => {
  const yt = document.getElementById('ytLink');
  yt?.addEventListener('click', (e) => {
    e.preventDefault();
    alert('AIFlow Labs Studio YouTube channel is coming soon!');
  });
});

// --- Modal open/close ---
const openBtn = document.getElementById('openWaitlist');
const modal   = document.getElementById('waitlistModal');
const closeX  = modal.querySelector('.close-x');

// --- Form + hidden iframe + robust feedback ---
const form     = document.getElementById('waitlistForm');
const modalMsg = document.getElementById('modalMsg');
const pageMsg  = document.getElementById('feedback');
const iframe   = document.querySelector('iframe[name="hidden_iframe"]');
const hpField  = form.querySelector('input[name="company"]'); // honeypot

let inFlight = false;
let ackTimer = null;

function resetUI() {
  clearTimeout(ackTimer);
  inFlight = false;
  modalMsg.className = 'msg';
  modalMsg.textContent = '';
  if (pageMsg) { pageMsg.className = 'msg'; pageMsg.textContent = ''; }
  const btn = form.querySelector('button[type="submit"]');
  if (btn) { btn.disabled = false; btn.textContent = 'Send'; }
}

openBtn.addEventListener('click', () => {
  if (hpField) hpField.value = ''; // clear honeypot on open
  resetUI();
  modal.classList.add('open');
});

closeX.addEventListener('click', () => modal.classList.remove('open'));
modal.addEventListener('click', e => { if (e.target === modal) modal.classList.remove('open'); });

// Allowed origins for Apps Script postMessage
const TRUSTED_ORIGINS = [
  'https://script.google.com',
  'https://script.googleusercontent.com',
];

// Validation and submit start
form.addEventListener('submit', (e) => {
  // Never block on honeypot — just clear it (some extensions may autofill it)
  if (hpField && hpField.value) hpField.value = '';

  const name  = form.name.value.trim();
  const email = form.email.value.trim();

  modalMsg.className = 'msg';
  modalMsg.textContent = '';

  if (!name) {
    e.preventDefault();
    modalMsg.classList.add('err');
    modalMsg.textContent = 'Please enter your name.';
    return;
  }
  if (!/^\S+@\S+\.\S+$/.test(email)) {
    e.preventDefault();
    modalMsg.classList.add('err');
    modalMsg.textContent = 'Please enter a valid email.';
    return;
  }

  // UI state: lock button and set waiting flags
  const btn = form.querySelector('button[type="submit"]');
  if (btn) { btn.disabled = true; btn.textContent = 'Sending…'; }
  inFlight = true;

  // Single-use onload fallback
  const onLoadOnce = () => {
    if (!inFlight) return; // already handled by postMessage
    clearTimeout(ackTimer);

    modalMsg.className = 'msg ok';
    modalMsg.textContent = 'Request received — check your email shortly.';
    if (pageMsg) { pageMsg.className = 'msg ok'; pageMsg.textContent = 'Request received.'; }

    if (btn) { btn.disabled = false; btn.textContent = 'Send'; }
    inFlight = false;
  };
  iframe.addEventListener('load', onLoadOnce, { once: true });

  // Safety timeout
  clearTimeout(ackTimer);
  ackTimer = setTimeout(() => {
    if (!inFlight) return;
    modalMsg.className = 'msg err';
    modalMsg.textContent = 'Still sending… If this hangs, try Incognito (extensions may block the response).';
    if (btn) { btn.disabled = false; btn.textContent = 'Send'; }
    inFlight = false;
  }, 10000);
  // do NOT preventDefault — we need the form to submit to the iframe
});

// Receive response from Apps Script via postMessage
window.addEventListener('message', (ev) => {
  if (!TRUSTED_ORIGINS.some(o => ev.origin && ev.origin.startsWith(o))) return;

  const data = ev?.data;
  if (!data || typeof data !== 'object') return;

  clearTimeout(ackTimer);
  inFlight = false;

  const btn = form.querySelector('button[type="submit"]');
  if (btn) { btn.disabled = false; btn.textContent = 'Send'; }

  if (data.ok === false) {
    modalMsg.className = 'msg err';
    modalMsg.textContent = 'Something went wrong. Please try again.';
    return;
  }

  if (data.ok === true && data.reason === 'quota_exhausted') {
    modalMsg.className = 'msg ok';
    modalMsg.textContent = 'Request accepted. We will email you later (email quota is temporarily exhausted).';
    if (pageMsg) { pageMsg.className = 'msg ok'; pageMsg.textContent = 'Accepted; email will be sent later.'; }
    form.reset();
    return;
  }

  if (data.ok === true) {
    if (data.duplicate) {
      modalMsg.className = 'msg ok';
      modalMsg.textContent = 'You’re already on the list — we’ll keep you posted.';
      if (pageMsg) { pageMsg.className = 'msg ok'; pageMsg.textContent = 'Already subscribed.'; }
    } else {
      modalMsg.className = 'msg ok';
      modalMsg.textContent = 'Thanks! You’re on the list.';
      if (pageMsg) { pageMsg.className = 'msg ok'; pageMsg.textContent = 'Subscription confirmed.'; }
    }
    form.reset();
  }
});
