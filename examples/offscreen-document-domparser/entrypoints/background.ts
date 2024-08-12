// REF: https://github.com/microsoft/TypeScript/issues/14877
declare const self: ServiceWorkerGlobalScope;

import {
  OFFSCREEN_DOCUMENT_PATH,
  OFFSCREEN_KEYS,
  MESSAGE_TARGET,
} from "@/utils/constants.js";

export default defineBackground({
  type: "module",
  main() {
    console.log("Hello background");

    browser.action.onClicked.addListener(async (tab) => {
      await closeOffscreenDocument();

      if (tab.id) {
        const [{ result }] = await browser.scripting.executeScript({
          target: { tabId: tab.id },
          func: () => {
            return document.documentElement.outerHTML;
          },
        });
        if (result) {
          await sendMessageToOffscreenDocument(
            OFFSCREEN_KEYS.SCRIPT_COUNTS,
            result,
          );
        }
      }
    });

    browser.runtime.onMessage.addListener(handleOffscreenMessages);
  },
});

async function sendMessageToOffscreenDocument(type: string, data: string) {
  if (!(await hasOffscreenDocument())) {
    await createOffscreenDocument();
  }

  await browser.runtime.sendMessage({
    type,
    target: MESSAGE_TARGET.OFFSCREEN,
    data,
  });
}

async function handleOffscreenMessages(message: any) {
  if (message.target !== MESSAGE_TARGET.BACKGROUND) {
    return;
  }

  switch (message.type as OFFSCREEN_KEYS) {
    case OFFSCREEN_KEYS.SCRIPT_COUNTS:
      console.log(OFFSCREEN_KEYS.SCRIPT_COUNTS, message.data);
      break;
    default:
      console.warn(`Unexpected message received: '${message.type}'.`);
  }
}

async function createOffscreenDocument() {
  if (await hasOffscreenDocument()) {
    return;
  }

  await browser.offscreen.createDocument({
    url: browser.runtime.getURL(OFFSCREEN_DOCUMENT_PATH),
    reasons: [browser.offscreen.Reason.DOM_PARSER],
    justification: "Parse DOM",
  });
}

async function closeOffscreenDocument() {
  if (!(await hasOffscreenDocument())) {
    return;
  }
  await browser.offscreen.closeDocument();
}

async function hasOffscreenDocument() {
  const contexts = await browser.runtime?.getContexts({
    contextTypes: [browser.runtime.ContextType.OFFSCREEN_DOCUMENT],
    documentUrls: [browser.runtime.getURL(OFFSCREEN_DOCUMENT_PATH)],
  });

  if (contexts != null) {
    return contexts.length > 0;
  } else {
    const matchedClients = await self.clients.matchAll();
    return matchedClients.some((client) =>
      client.url.includes(browser.runtime.id),
    );
  }
}
