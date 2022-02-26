import type { PubSubConnectionResponse, TargetClassMap } from 'golden-hammer-shared';
import io, { Socket } from 'socket.io-client';

const SVC_PUBSUB_REGISTER_CHAT = 'gh-pubsub.register';
const SVC_PUBSUB_UNREGISTER_CHAT = 'gh-pubsub.unregister';

export let socket: Socket | null;

export const connect = (socketUri: string) => {
  if (socket) {
    disconnect();
  }

  socket = io(socketUri, { transports: ['websocket'] });

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
  eventCategories
}: TargetClassMap): Promise<PubSubConnectionResponse> =>
  new Promise((resolve, reject) => {
    socket?.emit(
      'call',
      SVC_PUBSUB_REGISTER_CHAT,
      {
        platformName: 'twitch',
        connectTarget: connectTarget.toLowerCase(),
        eventCategories
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
