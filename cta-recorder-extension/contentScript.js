let stopFn = null;
let rrwebEvents = [];
let actionEvents = [];

function generateSelector(el) {
  if (!el || !el.tagName) return '';
  if (el.id) return `#${el.id}`;
  return el.tagName.toLowerCase() + (el.className ? '.' + el.className.split(' ').join('.') : '');
}

function recordAction(type, el, extra = {}) {
  if (!el || !el.tagName) return; // Only record if el is a valid element
  const selector = generateSelector(el);
  actionEvents.push({
    type,
    selector,
    timestamp: Date.now(),
    ...extra
  });
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

  // Save recording as a downloadable file
  const recording = {
    rrwebEvents,
    actionEvents,
    metadata: {
      url: window.location.href,
      timestamp: Date.now(),
      userAgent: navigator.userAgent
    }
  };

  const blob = new Blob([JSON.stringify(recording, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `recording-${new Date().toISOString().slice(0,19).replace(/:/g, '-')}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}); 