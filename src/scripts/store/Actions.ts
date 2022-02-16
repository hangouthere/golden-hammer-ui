import { Socket } from 'socket.io-client';
import { GetState, SetState } from 'zustand';
import { IStore, localStore, TargetClassMap } from '.';
import * as GHSocket from '../services/GHSocket';
import { SocketStatus } from './InitState';

const MAX_COUNT_EVENTS = 5;

const bindSocketStatus = (set: SetState<IStore>, get: GetState<IStore>, socket: Socket) => {
  socket.on('connect', () => set({ connectionStatus: SocketStatus.Connected }));
  socket.on('connect_error', () => set({ connectionStatus: SocketStatus.Disconnected }));
  socket.on('disconnect', () => set({ connectionStatus: SocketStatus.Disconnected, events: {}, connectedTargetMaps: new Map() }));

  socket.on('gh-chat.evented', normalizedEvent => {
    set({
      events: {
        [normalizedEvent.connectTarget]: [normalizedEvent]
      }
    });
  });
};

export interface IActions {
  setAutoConnect: (autoConnect: boolean) => void;
  connect: () => void;
  disconnect: () => void;
  pubsubRegisterChat: ({ connectTarget, eventCategories }: TargetClassMap) => void;
  updatePubSubUri: (uri: string) => void;
}

export default (set: SetState<IStore>, get: GetState<IStore>): IActions => ({
  setAutoConnect: (autoConnect: boolean) => {
    set(_state => ({ autoConnect }));

    localStore('gh.autoConnect', autoConnect);
  },

  connect() {
    try {
      set({ connectionStatus: SocketStatus.Connecting });

      const socket = GHSocket.connect(get().pubSubUri);

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

      // Add Connected Target to the list!
      set(state => ({
        connectedTargetMaps: new Map(state.connectedTargetMaps).set(connectTarget, { connectTarget, eventCategories })
      }));
    } catch (err) {
      console.log(err);
    }
  },

  updatePubSubUri(pubSubUri: string) {
    set({ pubSubUri });

    localStore('gh.pubSubUri', pubSubUri);
  }
});
