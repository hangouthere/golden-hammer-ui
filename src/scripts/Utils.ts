export const ObjOmit = <T extends object, K extends keyof T>(obj: T, ...keys: K[]): Omit<T, K> => {
  const ret: Partial<T> = {};

  (Object.keys(obj) as (keyof T)[]).forEach(key => {
    if (false === keys.includes(key as K)) {
      ret[key] = obj[key];
    }
  });

  return ret as Omit<T, K>;
};

export const ObjPick = <T, K extends keyof T>(obj: T, ...keys: K[]): Pick<T, K> => {
  const ret: Partial<T> = {};

  keys.forEach(key => {
    ret[key] = obj[key];
  });

  return ret as Pick<T, K>;
};
