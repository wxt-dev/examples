import { Runtime } from "wxt/browser";

export default defineBackground(() => {
  // Setup listener for one-time messages
  browser.runtime.onMessage.addListener((message) => {
    // Only respond to hello messages
    if (message.type === "hello")
      // Returning a promise will send a response back to the sender
      return Promise.resolve(`Hello ${message.name}, this is the background!`);

    throw Error("Unknown message");
  });

  // Setup broadcast channel to send messages to all connected ports
  let ports: Runtime.Port[] = [];
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
