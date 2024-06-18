import { defineProxyService } from "@webext-core/proxy-service";
import type { FaviconInfo } from "./types";
import type { ExtensionDatabase } from "./database";

export interface FaviconService {
  getAll(): Promise<FaviconInfo[]>;
  upsert(info: FaviconInfo): Promise<void>;
}

function createFaviconService(_db: Promise<ExtensionDatabase>): FaviconService {
  return {
    async getAll() {
      // Can't await promises inside the background's main function, so instead
      // we await the promise inside the service:
      const db = await _db;
      return await db.getAll("favicons");
    },
    async upsert(info) {
      const db = await _db;
      await db.put("favicons", info);
    },
  };
}

export const [registerFaviconService, getFaviconService] = defineProxyService(
  "favicon-service",
  createFaviconService,
);
