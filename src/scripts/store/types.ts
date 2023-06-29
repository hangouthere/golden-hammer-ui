import {
  PossibleEventClassifications,
  type ConnectTargetClassificationsAssociation,
  type EventClassification,
  type NormalizedMessagingEvent,
  type PubSubConnectionResponse
} from 'golden-hammer-shared';

type CustomStats = {
  TotalEvents: number;
  Earnings: number;
};

export enum SocketStatus {
  Disconnected,
  Connecting,
  Connected
}

export const GHPubSub_EventTypes = PossibleEventClassifications;

export type StatMap = Partial<Record<EventClassification, number>> & Partial<CustomStats> & Record<string, number>;

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

export interface IActions {
  setAutoConnect: (autoConnect: boolean) => void;
  connect: (pubSubUri: string) => void;
  disconnect: () => void;
  clearEvents: (connectTarget: string) => void;
  pubsubRegisterChat: ({ connectTarget, eventClassifications }: ConnectTargetClassificationsAssociation) => void;
  pubsubUnregisterChat: (connectTarget: string) => void;
  setActivePubSub: (activePubSub: PubSubConnectionResponse) => void;
  simulateSourceEvent: (eventData: object) => void;
}

export interface IState {
  pubSubUri: string;
  connectionStatus: SocketStatus;
  autoConnect: boolean;
  connectTarget: string;
  connectedTargets: Map<string, ConnectedTarget>;
  activeConnectedTarget: ConnectedTarget | null;
  events: ConnectTargetEventMap;
  stats: ConnectTargetStatMap;
}

export type IStore = IState & IActions;
