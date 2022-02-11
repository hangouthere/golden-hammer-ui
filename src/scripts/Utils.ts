export const ObjOmit = <T, K extends keyof T>(obj: T, ...keys: K[]): Omit<T, K> => {
  const ret: any = {};
  (Object.keys(obj) as K[]).forEach(key => {
    if (false === keys.includes(key)) {
      ret[key] = obj[key];
    }
  });
  return ret;
};

export const ObjPick = <T, K extends keyof T>(obj: T, ...keys: K[]): Pick<T, K> => {
  const ret: any = {};
  keys.forEach(key => {
    ret[key] = obj[key];
  });
  return ret;
};
