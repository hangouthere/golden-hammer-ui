import {
  PossibleEventClassifications,
  type EventClassification,
  type NormalizedMessagingEvent,
  type PubSubConnectionResponse
} from 'golden-hammer-shared';
import create from 'zustand';
import Actions, { type IActions } from './Actions';
import InitState, { type IState } from './InitState';

export const localStore = (key: string, data: any) => globalThis.localStorage.setItem(key, JSON.stringify(data));
export const localGet = (key: string): any => JSON.parse(globalThis.localStorage.getItem(key) as string);

const useStore = create<IStore>((s, g) => ({
  ...Actions(s, g),
  ...InitState(s, g)
}));

export const GHPubSub_EventTypes = PossibleEventClassifications;

type CustomStats = {
  TotalEvents: number;
  Earnings: number;
};

export type StatMap = Partial<Record<EventClassification, number>> &
  Partial<CustomStats> &
  Record<string, number>;

export type ConnectTargetStatMap = {
  [connectTarget: string]: StatMap;
};

export type UINormalizedMessagingEvent = NormalizedMessagingEvent & {
  isRemoved: boolean;
};

export type ConnectedTarget = PubSubConnectionResponse & {
  hasUpdates?: boolean;
};

export type ConnectTargetEventMap = {
  [connectTarget: string]: UINormalizedMessagingEvent[];
};

export default useStore;
export type IStore = IState & IActions;
