import create from 'zustand';
import Actions from './Actions.js';
import InitState from './InitState.js';
import type { IStore } from './types.js';

const useStore = create<IStore>((s, g) => ({
  ...Actions(s, g),
  ...InitState(s, g)
}));

export default useStore;
