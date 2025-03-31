export default defineBackground(() => {
  // Modify the storage item in the background to demonstrate that the composable works
  setInterval(async () => {
    const oldValue = await storage.getItem<number>("session:count");
    const newValue = (oldValue ?? 0) + 1;
    await storage.setItem("session:count", newValue);
  }, 1000);
});
