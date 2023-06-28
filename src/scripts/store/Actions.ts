import type { ConnectTargetClassificationsAssociation, PubSubConnectionResponse } from 'golden-hammer-shared';
import type { GetState, SetState } from 'zustand';
import { connect, disconnect, pubsubRegisterChat, pubsubUnregisterChat, simulateEvent } from '../services/GHSocket.js';
import { SocketStatus } from './InitState.js';
import { bindSocketStatus, registerPubSub, unregisterPubSub } from './SocketActions.js';
import { localStore, type ConnectedTarget, type IStore } from './index.js';

export const eventer = document.createElement('div');

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

export default (set: SetState<IStore>, get: GetState<IStore>): IActions => ({
  setAutoConnect: (autoConnect: boolean) => {
    set(_state => ({ autoConnect }));

    localStore('gh.autoConnect', autoConnect);
  },

  connect(pubSubUri: string) {
    try {
      localStore('gh.pubSubUri', pubSubUri);

      set({ pubSubUri, connectionStatus: SocketStatus.Connecting });

      const socket = connect(pubSubUri);

      bindSocketStatus(set, get, socket);
    } catch (err) {
      this.disconnect();
      set({ connectionStatus: SocketStatus.Disconnected, autoConnect: false });
    }
  },

  disconnect() {
    try {
      disconnect();
    } catch (err) {
      set({ connectionStatus: SocketStatus.Disconnected, autoConnect: false });
    }
  },

  async pubsubRegisterChat({ connectTarget, eventClassifications }) {
    try {
      const pubSubConnection = await pubsubRegisterChat({ connectTarget, eventClassifications });

      if (!pubSubConnection.registered) {
        throw new Error(`Registration Failed for ${connectTarget}`);
      }

      // Add Connected Target to the list!
      set(state => registerPubSub(state, pubSubConnection));

      eventer.dispatchEvent(new CustomEvent('registered', { detail: pubSubConnection }));
    } catch (err) {
      console.log(err);
      if (err instanceof Error) {
        eventer.dispatchEvent(new CustomEvent('error', { detail: err.message }));
      }
    }
  },

  async pubsubUnregisterChat(connectTarget) {
    try {
      const pubSubConnection = await pubsubUnregisterChat(connectTarget);

      if (!pubSubConnection.unregistered) {
        throw new Error(`Unregistration Failed for ${connectTarget}`);
      }

      // Add Connected Target to the list!
      set(state => unregisterPubSub(state, pubSubConnection));

      eventer.dispatchEvent(new CustomEvent('unregistered', { detail: pubSubConnection }));
    } catch (err) {
      console.log(err);
    }
  },

  clearEvents(connectTarget) {
    set(s => ({
      stats: {
        ...s.stats,
        [connectTarget]: {}
      },
      events: {
        ...s.events,
        [connectTarget]: []
      }
    }));
  },

  setActivePubSub(activeConnectedTarget: ConnectedTarget) {
    activeConnectedTarget.pubsub.connectTarget = activeConnectedTarget.pubsub.connectTarget.toLowerCase();
    activeConnectedTarget.hasUpdates = false;

    set(s => ({ ...s, activeConnectedTarget }));
  },

  simulateSourceEvent(eventData: object) {
    const activePubSub = get().activeConnectedTarget;

    if (!activePubSub) {
      eventer.dispatchEvent(new CustomEvent('error', { detail: 'No Active PubSub!' }));

      return;
    }

    return simulateEvent(activePubSub.pubsub.connectTarget, eventData);
  }
});
