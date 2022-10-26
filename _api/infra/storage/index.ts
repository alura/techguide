const db = new Map();

export const storage = {
  async get<T>(key: string): Promise<T> {
    return db.get(key);
  },
  async set<T>(key: string, value: T): Promise<void> {
    db.set(key, value);
  },
};
