chrome.runtime.onMessage.addListener((message, sender) => {
  console.log("[Background] Received message:", message);
  if (message.type === "SAVE_RECORDING") {
    const blob = new Blob([JSON.stringify(message.data, null, 2)], { type: "application/json" });
    const reader = new FileReader();
    reader.onload = function () {
      const dataUrl = reader.result;
      console.log("[Background] Created data URL");
      chrome.downloads.download({
        url: dataUrl,
        filename: `recordings/recording-${new Date().toISOString().slice(0,19).replace(/:/g, '-')}.json`,
        saveAs: false
      }, (downloadId) => {
        console.log("[Background] Download started, id:", downloadId);
      });
    };
    reader.readAsDataURL(blob);
  }
}); 