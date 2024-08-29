// @ts-expect-error: Query params not typed
import MyWorker from "./worker?worker&inline";

export default defineContentScript({
  matches: ["*://*/*"],
  main() {
    console.log("Creating web worker");
    const worker = new MyWorker();
    console.log("Created!");
  },
});
