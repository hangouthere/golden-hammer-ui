import { Socket } from 'socket.io-client';
import { GetState, SetState } from 'zustand';
import { IStore, localStore } from '.';
import * as GHSocket from '../services/GHSocket';
import { SocketStatus } from './InitState';

const bindSocketStatus = (set: SetState<IStore>, socket: Socket) => {
  socket.on('connect', () => set({ connectionStatus: SocketStatus.Connected }));
  socket.on('connect_error', () => set({ connectionStatus: SocketStatus.Disconnected }));
  socket.on('disconnect', () => set({ connectionStatus: SocketStatus.Disconnected }));
};

export interface IActions {
  setAutoConnect: (autoConnect: boolean) => void;
  connect: () => void;
  disconnect: () => void;
  pubsubRegisterChat: ({ connectTarget, platformEvents }) => void;
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

      bindSocketStatus(set, socket);
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

  pubsubRegisterChat({ connectTarget, platformEvents }) {
    try {
      GHSocket.pubsubRegisterChat({ connectTarget, platformEvents });

      // Add Connected Target to the list!
      set(state => ({
        connectedTargets: new Set([...state.connectedTargets]).add(connectTarget)
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
