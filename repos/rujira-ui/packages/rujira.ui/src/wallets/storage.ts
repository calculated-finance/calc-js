import { Provider } from "./providers";
const KEY_SELECTED = "rujira-accounts-selected";
const KEY_CONNECTED = "rujira-accounts-connected";

const store = {
  getItem: (key: string): string | null =>
    typeof localStorage !== "undefined" ? localStorage.getItem(key) : null,
  setItem: (key: string, value: string): void => {
    if (typeof localStorage !== "undefined") localStorage.setItem(key, value);
  },
  removeItem: (key: string): void => {
    if (typeof localStorage !== "undefined") localStorage.removeItem(key);
  },
};

export const loadSelected = (): { address?: string } | undefined => {
  const stored = store.getItem(KEY_SELECTED);
  if (!stored) return undefined;
  const parsed = JSON.parse(stored);

  if (typeof parsed == "object") {
    return parsed;
  } else {
    throw new Error(`Invalid store ${stored}`);
  }
};

export const saveSelected = (address?: string): void => {
  store.setItem(KEY_SELECTED, JSON.stringify({ address }));
};

export const clearSelected = (): void => {
  store.removeItem(KEY_SELECTED);
};

export const loadProviderKeys = (): Provider.Key[] => {
  const stored: Record<Provider.Key, boolean> = JSON.parse(
    store.getItem(KEY_CONNECTED) || "{}"
  );

  return Object.entries(stored)
    .filter(([_, v]) => v)
    .map(([k]) => k)
    .filter((k): k is Provider.Key =>
      (Provider.keys as string[]).includes(k)
    );
};

export const addProviderKey = (p: Provider.Key): void => {
  const stored: Record<Provider.Key, boolean> = JSON.parse(
    store.getItem(KEY_CONNECTED) || "{}"
  );
  store.setItem(KEY_CONNECTED, JSON.stringify({ ...stored, [p]: true }));
};

export const removeProviderKey = (p: Provider.Key): void => {
  const stored: Record<Provider.Key, boolean> = JSON.parse(
    store.getItem(KEY_CONNECTED) || "{}"
  );
  const { [p]: _d, ...rest } = stored;
  store.setItem(KEY_CONNECTED, JSON.stringify(rest));
};

export const clearProviderKeys = (): void => {
  store.removeItem(KEY_CONNECTED);
};
