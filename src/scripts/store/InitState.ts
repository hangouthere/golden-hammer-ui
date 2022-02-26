import type { PubSubConnectionResponse } from 'golden-hammer-shared';
import type { GetState, SetState } from 'zustand';
import { localGet, type ConnectTargetEventMap, type IStore } from '.';

export enum SocketStatus {
  Disconnected,
  Connecting,
  Connected
}

export interface IState {
  pubSubUri: string;
  connectionStatus: SocketStatus;
  autoConnect: any;
  connectTarget: string;
  connectedPubSubs: Map<string, PubSubConnectionResponse>;
  activePubSub: PubSubConnectionResponse | null;
  events: ConnectTargetEventMap;
}

export default (_set: SetState<IStore>, _get: GetState<IStore>): IState => {
  const shouldAutoConnect = localGet('gh.autoConnect') || false;

  const InitState: IState = {
    autoConnect: shouldAutoConnect,
    connectedPubSubs: new Map(),
    connectionStatus: SocketStatus.Disconnected,
    connectTarget: '',
    activePubSub: null,
    pubSubUri: localGet('gh.pubSubUri') || process.env.URI_GH_PUBSUB || '//',
    events: {}
  };

  return InitState;
};
