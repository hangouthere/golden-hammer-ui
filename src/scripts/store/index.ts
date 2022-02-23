import { NormalizedMessagingEvent } from 'golden-hammer-shared';
import create from 'zustand';
import Actions, { IActions } from './Actions';
import InitState, { IState } from './InitState';

export const localStore = (key, data) => globalThis.localStorage.setItem(key, JSON.stringify(data));
export const localGet = key => JSON.parse(globalThis.localStorage.getItem(key));

const useStore = create<IStore>((s, g) => ({
  ...Actions(s, g),
  ...InitState(s, g)
}));

export type ConnectTargetEventMap = {
  [connectTarget: string]: NormalizedMessagingEvent[];
};

export default useStore;
export type IStore = IState & IActions;
