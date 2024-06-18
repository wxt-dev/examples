import { DBSchema, IDBPDatabase, openDB } from "idb";
import { FaviconInfo } from "./types";

interface ExtensionDatabaseSchema extends DBSchema {
  favicons: {
    key: string;
    value: FaviconInfo;
  };
}

export type ExtensionDatabase = IDBPDatabase<ExtensionDatabaseSchema>;

export function openExtensionDatabase(): Promise<ExtensionDatabase> {
  return openDB<ExtensionDatabaseSchema>("favicon-tracker", 1, {
    upgrade(database) {
      database.createObjectStore("favicons", { keyPath: "hostname" });
    },
  });
}
