declare const sendMessageBtn: HTMLButtonElement;
declare const responseDisplay: HTMLPreElement;

sendMessageBtn.onclick = async () => {
  const response = await browser.runtime.sendMessage({ hello: "world" });
  console.log("popup", { response });
  responseDisplay.textContent = JSON.stringify(response, null, 2);
};
