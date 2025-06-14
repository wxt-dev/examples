import { Browser } from "wxt/browser";

export default defineBackground(() => {
  // Setup listener for one-time messages
  browser.runtime.onMessage.addListener((message, _, sendResponse) => {
    // Only respond to hello messages
    if (message.type === "hello") {
      sendResponse(`Hello ${message.name}, this is the background!`);
      return true;
    }
  });

  // Setup broadcast channel to send messages to all connected ports
  let ports: Browser.runtime.Port[] = [];
  setInterval(() => {
    const message = { date: Date.now(), value: Math.random() };
    ports.forEach((port) => port.postMessage(message));
  }, 1e3);
  browser.runtime.onConnect.addListener((port) => {
    ports.push(port);
    port.onDisconnect.addListener(() => {
      ports.splice(ports.indexOf(port), 1);
    });
  });
});
