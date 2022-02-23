import { PubSubConnectionResponse, TargetClassMap } from 'golden-hammer-shared';
import { Socket } from 'socket.io-client';
import { GetState, SetState } from 'zustand';
import { IStore, localStore } from '.';
import * as GHSocket from '../services/GHSocket';
import { SocketStatus } from './InitState';

const MAX_COUNT_EVENTS = 500;

const bindSocketStatus = (set: SetState<IStore>, get: GetState<IStore>, socket: Socket) => {
  socket.on('connect', () => set({ connectionStatus: SocketStatus.Connected }));
  socket.on('connect_error', () => set({ connectionStatus: SocketStatus.Disconnected }));
  socket.on('disconnect', () =>
    set({ connectionStatus: SocketStatus.Disconnected, events: {}, connectedPubSubs: new Map() })
  );

  socket.on('gh-chat.evented', normalizedEvent => {
    set(state => {
      const newEventList = [...state.events[normalizedEvent.connectTarget], normalizedEvent];

      if (newEventList.length > MAX_COUNT_EVENTS) {
        newEventList.shift();
      }

      return {
        events: {
          ...state.events,
          [normalizedEvent.connectTarget]: newEventList
        }
      };
    });
  });
};

export interface IActions {
  setAutoConnect: (autoConnect: boolean) => void;
  connect: (pubSubUri: string) => void;
  disconnect: () => void;
  pubsubRegisterChat: ({ connectTarget, eventCategories }: TargetClassMap) => void;
  pubsubUnregisterChat: (connectTarget: string) => void;
  setActivePubSub(activePubSub: PubSubConnectionResponse);
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
        throw new Error(`Registration Failed for ${connectTarget} on ${eventCategories}`);
      }

      const pubSub = pubSubConnection.pubsub;

      // Add Connected Target to the list!
      set(state => ({
        activePubSub: pubSubConnection,
        connectedPubSubs: new Map(state.connectedPubSubs).set(pubSub.connectTarget, pubSubConnection),
        events: {
          ...state.events,
          [pubSub.connectTarget]: state.events[pubSub.connectTarget] || []
        }
      }));
    } catch (err) {
      console.log(err);
    }
  },

  async pubsubUnregisterChat(connectTarget) {
    try {
      const pubSubConnection = await GHSocket.pubsubUnregisterChat(connectTarget);

      if (!pubSubConnection.unregistered) {
        throw new Error(`Unregistration Failed for ${connectTarget}`);
      }

      // Add Connected Target to the list!
      set(state => {
        const newMap = new Map(state.connectedPubSubs);
        newMap.delete(pubSubConnection.pubsub.connectTarget);

        return {
          connectedPubSubs: newMap,
          activePubSub: null
        };
      });
    } catch (err) {
      console.log(err);
    }
  },

  setActivePubSub(activePubSub: PubSubConnectionResponse) {
    set({ activePubSub });
  }
});
