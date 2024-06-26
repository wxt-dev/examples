declare const sendHelloMessageBtn: HTMLButtonElement;
declare const helloResponsePre: HTMLPreElement;
declare const sendUnknownMessageBtn: HTMLButtonElement;
declare const unknownResponsePre: HTMLPreElement;
declare const longLivedMessageList: HTMLUListElement;

sendHelloMessageBtn.onclick = async () => {
  try {
    const response = await browser.runtime.sendMessage({
      type: "hello",
      name: "Aaron",
    });
    helloResponsePre.textContent = JSON.stringify(response);
  } catch (err: any) {
    helloResponsePre.textContent = "ERROR: " + err.message;
  }
};

sendUnknownMessageBtn.onclick = async () => {
  try {
    const response = await browser.runtime.sendMessage({ type: "unknown" });
    console.log({ response });
    unknownResponsePre.textContent = JSON.stringify(response);
  } catch (err: any) {
    unknownResponsePre.textContent = "ERROR: " + err.message;
  }
};

const port = browser.runtime.connect();
port.onMessage.addListener((message) => {
  const li = document.createElement("li");
  li.textContent = JSON.stringify(message);
  longLivedMessageList.append(li);
});
