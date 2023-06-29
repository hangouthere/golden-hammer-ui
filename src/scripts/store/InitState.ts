import type { GetState, SetState } from 'zustand';
import { localGet } from './localStore.js';
import { SocketStatus, type IState, type IStore } from './types.js';

export default (_set: SetState<IStore>, _get: GetState<IStore>): IState => {
  const shouldAutoConnect = localGet<boolean>('gh.autoConnect') || false;

  const InitState: IState = {
    autoConnect: shouldAutoConnect,
    connectedTargets: new Map(),
    connectionStatus: SocketStatus.Disconnected,
    connectTarget: '',
    activeConnectedTarget: null,
    pubSubUri: localGet('gh.pubSubUri') || process.env.URI_GH_PUBSUB || '//',
    events: {},
    stats: {}
  };

  return InitState;
};
