import { GetState, SetState } from 'zustand';
import { IStore, localGet, TargetClassMap } from '.';

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
  connectedTargetMaps: Map<string, TargetClassMap>;
  events: {
    [connectTarget: string]: any[];
  };
}

export default (_set: SetState<IStore>, _get: GetState<IStore>): IState => {
  const shouldAutoConnect = localGet('gh.autoConnect') || false;

  const InitState: IState = {
    autoConnect: shouldAutoConnect,
    connectedTargetMaps: new Map(),
    connectionStatus: SocketStatus.Disconnected,
    connectTarget: 'nfgCodex',
    pubSubUri: localGet('gh.pubSubUri') || process.env.URI_GH_PUBSUB || '//',
    events: {}
  };

  return InitState;
};
