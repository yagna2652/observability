let stopFn = null;
let rrwebEvents = [];
let actionEvents = [];

function generateSelector(el) {
  if (!el || !el.tagName || typeof el.tagName.toLowerCase !== 'function') return '';
  if (el.id) return `#${el.id}`;
  return el.tagName.toLowerCase() + (el.className ? '.' + el.className.split(' ').join('.') : '');
}

function recordAction(type, el, extra = {}) {
  try {
    if (!el || !el.tagName || typeof el.tagName !== 'string') return;
    const selector = generateSelector(el);
    actionEvents.push({ type, selector, timestamp: Date.now(), ...extra });
  } catch (err) {
    console.warn('[Recorder] Error recording action:', err);
  }
}

window.addEventListener("START_RECORDING", () => {
  console.log("[Recorder] Starting dual recording...");
  rrwebEvents = [];
  actionEvents = [];

  stopFn = rrweb.record({
    emit(event) {
      rrwebEvents.push(event);
    },
  });

  document.addEventListener("click", (e) => recordAction("click", e.target), true);
  document.addEventListener("input", (e) => {
    if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") {
      recordAction("input", e.target, { value: e.target.value });
    }
  }, true);
  document.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      recordAction("enterKeyPress", e.target);
    }
  }, true);
  document.addEventListener("scroll", (e) => {
    recordAction("scroll", e.target, {
      scrollTop: e.target.scrollTop,
      scrollLeft: e.target.scrollLeft
    });
  }, true);
});

window.addEventListener("STOP_RECORDING", () => {
  console.log("[Recorder] Stopping recording...");
  if (stopFn) stopFn();

  console.log("[Recorder] rrweb session:", rrwebEvents);
  console.log("[Recorder] action events:", actionEvents);

  const recording = {
    rrwebEvents,
    actionEvents,
    metadata: {
      url: window.location.href,
      timestamp: Date.now(),
      userAgent: navigator.userAgent
    }
  };

  console.log("[Recorder] Sending SAVE_RECORDING message to background", recording);
  chrome.runtime.sendMessage({
    type: "SAVE_RECORDING",
    data: recording
  });
}); 