import type { NormalizedMessagingEvent } from 'golden-hammer-shared';
import create from 'zustand';
import Actions, { type IActions } from './Actions';
import InitState, { type IState } from './InitState';

export const localStore = (key: string, data: any) => globalThis.localStorage.setItem(key, JSON.stringify(data));
export const localGet = (key: string): any => JSON.parse(globalThis.localStorage.getItem(key) as string);

const useStore = create<IStore>((s, g) => ({
  ...Actions(s, g),
  ...InitState(s, g)
}));

export const GHPubSub_EventTypes = ['UserChat', 'Monetization', 'Administration', 'System', 'PlatformSpecific'];

export type ConnectTargetEventMap = {
  [connectTarget: string]: NormalizedMessagingEvent[];
};

export default useStore;
export type IStore = IState & IActions;
