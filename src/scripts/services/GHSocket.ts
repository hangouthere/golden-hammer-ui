import type { ConnectTargetClassificationsAssociation, PubSubConnectionResponse } from 'golden-hammer-shared';
import io, { Socket } from 'socket.io-client';

const SVC_PUBSUB_REGISTER_CHAT = 'gh-pubsub.register';
const SVC_PUBSUB_UNREGISTER_CHAT = 'gh-pubsub.unregister';
const SVC_PUBSUB_SIMULATE = 'gh-pubsub.simulate';

export let socket: Socket | null;

export const connect = (socketUri: string) => {
  if (socket) {
    disconnect();
  }

  socket = io(socketUri, {
    transports: ['websocket'],
    reconnectionDelay: 5000
  });

  return socket;
};

export const disconnect = () => {
  if (!socket) {
    return;
  }

  if (!socket.connected) {
    socket.close();
    socket = null;
    return;
  }

  socket.disconnect();
  socket = null;
};

export const pubsubRegisterChat = async ({
  connectTarget,
  eventClassifications
}: ConnectTargetClassificationsAssociation): Promise<PubSubConnectionResponse> =>
  new Promise((resolve, reject) => {
    socket?.emit(
      'call',
      SVC_PUBSUB_REGISTER_CHAT,
      {
        platformName: 'twitch',
        connectTarget: connectTarget.toLowerCase(),
        eventClassifications
      },
      (err: Error, resp: PubSubConnectionResponse) => {
        if (err) {
          reject(err);
        } else {
          resolve(resp);
        }
      }
    );
  });

export const pubsubUnregisterChat = async (connectTarget: string): Promise<PubSubConnectionResponse> =>
  new Promise((resolve, reject) => {
    socket?.emit(
      'call',
      SVC_PUBSUB_UNREGISTER_CHAT,
      {
        platformName: 'twitch',
        connectTarget: connectTarget.toLowerCase()
      },
      (err: Error, resp: PubSubConnectionResponse) => {
        if (err) {
          reject(err);
        } else {
          resolve(resp);
        }
      }
    );
  });

export const simulateEvent = async (connectTarget: string, eventData: object) =>
  new Promise((resolve, reject) => {
    socket?.emit(
      'call',
      SVC_PUBSUB_SIMULATE,
      {
        platformName: 'twitch',
        connectTarget: connectTarget.toLowerCase(),
        ...eventData
      },
      (err: Error, resp: unknown) => {
        if (err) {
          reject(err);
        } else {
          resolve(resp);
        }
      }
    );
  });
