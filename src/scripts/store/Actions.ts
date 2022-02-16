import { Socket } from 'socket.io-client';
import { GetState, SetState } from 'zustand';
import { IStore, localStore, TargetClassMap } from '.';
import * as GHSocket from '../services/GHSocket';
import { SocketStatus } from './InitState';

const MAX_COUNT_EVENTS = 5;

const bindSocketStatus = (set: SetState<IStore>, get: GetState<IStore>, socket: Socket) => {
  socket.on('connect', () => set({ connectionStatus: SocketStatus.Connected }));
  socket.on('connect_error', () => set({ connectionStatus: SocketStatus.Disconnected }));
  socket.on('disconnect', () =>
    set({ connectionStatus: SocketStatus.Disconnected, events: {}, connectedTargetMaps: new Map() })
  );

  socket.on('gh-chat.evented', normalizedEvent => {
    set(s => ({
      events: {
        [normalizedEvent.connectTarget]: [...(s.events[normalizedEvent.connectTarget] || []), normalizedEvent]
      }
    }));
  });
};

export interface IActions {
  setAutoConnect: (autoConnect: boolean) => void;
  connect: (pubSubUri: string) => void;
  disconnect: () => void;
  pubsubRegisterChat: ({ connectTarget, eventCategories }: TargetClassMap) => void;
  pubsubUnregisterChat: (connectTarget: string) => void;
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
      const resp = await GHSocket.pubsubRegisterChat({ connectTarget, eventCategories });

      if (!resp.registered) {
        throw new Error(`Registration Failed for ${connectTarget} on ${eventCategories}`);
      }

      const pubSub = resp.pubsub;

      // Add Connected Target to the list!
      set(state => ({
        connectedTargetMaps: new Map(state.connectedTargetMaps).set(pubSub.connectTarget, pubSub)
      }));
    } catch (err) {
      console.log(err);
    }
  },

  async pubsubUnregisterChat(connectTarget) {
    try {
      const resp = await GHSocket.pubsubUnregisterChat(connectTarget);

      if (!resp.unregistered) {
        throw new Error(`Unregistration Failed for ${connectTarget}`);
      }

      // Add Connected Target to the list!
      set(state => {
        const newMap = new Map(state.connectedTargetMaps);
        newMap.delete(resp.pubsub.connectTarget);

        return {
          connectedTargetMaps: newMap
        };
      });
    } catch (err) {
      console.log(err);
    }
  }
});
