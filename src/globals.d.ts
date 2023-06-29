declare module '*.jpeg';
declare module '*.jpg';
declare module '*.png';

declare type Jsonify<T> = T extends Date
  ? string
  : T extends object
  ? {
      [k in keyof T]: Jsonify<T[k]>;
    }
  : T;
