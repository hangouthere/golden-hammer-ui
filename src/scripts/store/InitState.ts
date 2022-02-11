import { GetState, SetState } from 'zustand';
import { IStore, localGet } from '.';

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
  connectedTargets: Set<string>;
}

export default (_set: SetState<IStore>, _get: GetState<IStore>): IState => {
  const shouldAutoConnect = localGet('gh.autoConnect') || false;

  const InitState: IState = {
    autoConnect: shouldAutoConnect,
    connectedTargets: new Set<string>(),
    connectionStatus: SocketStatus.Disconnected,
    connectTarget: 'nfgCodex',
    pubSubUri: localGet('gh.pubSubUri') || process.env.URI_GH_PUBSUB || '//'
  };

  return InitState;
};
