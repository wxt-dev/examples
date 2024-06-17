import { storage } from "wxt/storage";

export const sessionStartTime =
  storage.defineItem<number>("session:start-time");
