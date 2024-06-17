export default defineContentScript({
  matches: ["*://*/*"],

  async main() {
    const startTime = await sessionStartTime.getValue();
    if (startTime == null) {
      console.log("No start time, reload tab");
    } else {
      console.log("Session start time:", new Date(startTime).toISOString());
    }
  },
});
