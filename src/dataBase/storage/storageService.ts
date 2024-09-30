export interface StorageService {
    getItem: <T>(key: string) => Promise<T | null>;
    setItem: <T>(key: string, value: T) => Promise<void>;
    removeItem: <T>(key: string) => Promise<void>;
}

export let storageService: StorageService;
export function initializeStorage(storage: StorageService) {
    storage = storage;
}
