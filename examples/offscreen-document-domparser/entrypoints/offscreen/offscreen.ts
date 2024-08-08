import { MESSAGE_TARGET, OFFSCREEN_KEYS } from "@/utils/constants.js";

console.log("hello offscreen");

browser.runtime.onMessage.addListener(handleMessages);

async function handleMessages(message: any) {
  if (message?.target !== MESSAGE_TARGET.OFFSCREEN || !message?.type) {
    return;
  }

  switch (message.type as OFFSCREEN_KEYS) {
    case OFFSCREEN_KEYS.SCRIPT_COUNTS:
      console.log(window);

      scriptCounts(message.data);
      break;
    default:
      console.warn(`Unexpected message received: '${message.type}'.`);
      return;
  }
}

function scriptCounts(htmlString: string) {
  const parser = new DOMParser();
  const document = parser.parseFromString(htmlString, "text/html");

  const count = document.querySelectorAll("script").length;

  sendToBackground(OFFSCREEN_KEYS.SCRIPT_COUNTS, count.toString());
}

function sendToBackground(type: string, data: string) {
  chrome.runtime.sendMessage({
    type,
    target: MESSAGE_TARGET.BACKGROUND,
    data,
  });
}
