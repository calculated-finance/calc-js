// The draft store persists through localStorage at module load; give node a
// minimal in-memory implementation.
const backing = new Map<string, string>();

globalThis.localStorage = {
  getItem: (key: string) => backing.get(key) ?? null,
  setItem: (key: string, value: string) => {
    backing.set(key, value);
  },
  removeItem: (key: string) => {
    backing.delete(key);
  },
  clear: () => {
    backing.clear();
  },
  key: (index: number) => [...backing.keys()][index] ?? null,
  get length() {
    return backing.size;
  },
};
