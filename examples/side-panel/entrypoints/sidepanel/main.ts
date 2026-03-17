import { browser } from "wxt/browser";

let windowId: number;
const tabInfoEl = document.getElementById("tab-info")!;
const notesEl = document.getElementById("notes") as HTMLTextAreaElement;
const statusEl = document.getElementById("status")!;

init();

async function init() {
  const win = await browser.windows.getCurrent();
  windowId = win.id!;

  await updateTabInfo();

  document.getElementById("save-btn")!.addEventListener("click", saveNotes);
  notesEl.addEventListener("keydown", (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === "s") {
      e.preventDefault();
      saveNotes();
    }
  });

  browser.tabs.onActivated.addListener(updateTabInfo);
  browser.tabs.onUpdated.addListener((_, info) => {
    if (info.url || info.title) updateTabInfo();
  });
}

async function getActiveTab() {
  const [tab] = await browser.tabs.query({ windowId, active: true });
  return tab;
}

async function updateTabInfo() {
  const tab = await getActiveTab();
  if (tab) {
    tabInfoEl.innerHTML = `
      <p><strong>Title:</strong> ${escape(tab.title || "Untitled")}</p>
      <p><strong>URL:</strong> <span class="url">${escape(tab.url || "N/A")}</span></p>
    `;
    const key = `notes:${tab.url}`;
    const result = await browser.storage.local.get(key);
    notesEl.value = (result[key] as string) || "";
  }
}

async function saveNotes() {
  const tab = await getActiveTab();
  if (tab?.url) {
    await browser.storage.local.set({
      [`notes:${tab.url}`]: notesEl.value,
    });
    statusEl.textContent = "Saved!";
    setTimeout(() => {
      statusEl.textContent = "";
    }, 2000);
  }
}

function escape(text: string): string {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}
