import type { PubSubConnectionResponse, TargetClassMap } from 'golden-hammer-shared';
import { Socket } from 'socket.io-client';
import type { GetState, SetState } from 'zustand';
import { localStore, type IStore } from '.';
import * as GHSocket from '../services/GHSocket';
import { SocketStatus } from './InitState';
import { processSocketEvent, registerPubSub, unregisterPubSub } from './SocketActions';

export const eventer = document.createElement('div');

const bindSocketStatus = (set: SetState<IStore>, get: GetState<IStore>, socket: Socket) => {
  socket.on('connect', () => {
    set({ connectionStatus: SocketStatus.Connected });
    eventer.dispatchEvent(new CustomEvent('connect'));
  });

  socket.on('connect_error', err => {
    set({ connectionStatus: SocketStatus.Disconnected });
    eventer.dispatchEvent(new CustomEvent('error', { detail: err.message }));
  });

  socket.on('disconnect', reason => {
    set({ connectionStatus: SocketStatus.Disconnected, events: {}, connectedPubSubs: new Map() });
    eventer.dispatchEvent(new CustomEvent('disconnect', { detail: reason }));
  });

  socket.on('gh-chat.evented', normalizedEvent => set(state => processSocketEvent(state, normalizedEvent)));
};

export interface IActions {
  setAutoConnect: (autoConnect: boolean) => void;
  connect: (pubSubUri: string) => void;
  disconnect: () => void;
  clearEvents: (connectTarget: string) => void;
  pubsubRegisterChat: ({ connectTarget, eventCategories }: TargetClassMap) => void;
  pubsubUnregisterChat: (connectTarget: string) => void;
  setActivePubSub: (activePubSub: PubSubConnectionResponse) => void;
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

      const socket = GHSocket.connect(pubSubUri);

      bindSocketStatus(set, get, socket);
    } catch (err) {
      this.disconnect();
      set({ connectionStatus: SocketStatus.Disconnected, autoConnect: false });
    }
  },

  disconnect() {
    try {
      GHSocket.disconnect();
    } catch (err) {
      set({ connectionStatus: SocketStatus.Disconnected, autoConnect: false });
    }
  },

  async pubsubRegisterChat({ connectTarget, eventCategories }) {
    try {
      const pubSubConnection = await GHSocket.pubsubRegisterChat({ connectTarget, eventCategories });

      if (!pubSubConnection.registered) {
        throw new Error(`Registration Failed for ${connectTarget}`);
      }

      // Add Connected Target to the list!
      set(state => registerPubSub(state, pubSubConnection));

      eventer.dispatchEvent(new CustomEvent('registered', { detail: pubSubConnection }));
    } catch (err: any) {
      console.log(err);
      eventer.dispatchEvent(new CustomEvent('error', { detail: err.message }));
    }
  },

  async pubsubUnregisterChat(connectTarget) {
    try {
      const pubSubConnection = await GHSocket.pubsubUnregisterChat(connectTarget);

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

  setActivePubSub(activePubSub: PubSubConnectionResponse) {
    activePubSub.pubsub.connectTarget = activePubSub.pubsub.connectTarget.toLowerCase();

    set(s => ({ ...s, activePubSub }));
  }
});
