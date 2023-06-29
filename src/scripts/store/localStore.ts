export const localStore = <T>(key: string, data: Jsonify<T>) => globalThis.localStorage.setItem(key, JSON.stringify(data));
export const localGet = <T>(key: string): T => JSON.parse(globalThis.localStorage.getItem(key) as string);
