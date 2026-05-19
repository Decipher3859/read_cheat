document
  .getElementById("start-bionic-reading")
  .addEventListener("click", handleDownloadClick);

async function handleDownloadClick() {
  const [tab] = await browser.tabs.query({ active: true, currentWindow: true });

  if (!tab?.id) {
    return;
  }

  try {
    await browser.tabs.sendMessage(tab.id, { type: "download-text-content" });
  } catch (error) {
    console.error("Failed to trigger content download", error);
  }
}
