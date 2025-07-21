import { Effect } from "effect"

export class StorageService extends Effect.Service<StorageService>()("StorageService", {
    succeed: {
        get: (key: string) => Effect.sync(() => localStorage.getItem(key)),
        set: (key: string, value: string) => Effect.sync(() => localStorage.setItem(key, value)),
        remove: (key: string) => Effect.sync(() => localStorage.removeItem(key))
    }
}) {}
