import { storage } from "wxt/utils/storage";

export const sessionStartTime =
  storage.defineItem<number>("session:start-time");
