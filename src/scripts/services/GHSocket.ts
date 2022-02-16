import { TargetClassMap } from '-/store';
import io, { Socket } from 'socket.io-client';

const SVC_PUBSUB_REGISTER_CHAT = 'gh-pubsub.register';
const SVC_PUBSUB_UNREGISTER_CHAT = 'gh-pubsub.unregister';

export let socket: Socket;

export const connect = (socketUri: string) => {
  if (socket) {
    disconnect();
  }

  socket = io(socketUri, { transports: ['websocket'] });

  return socket;
};

export const disconnect = () => {
  if (!socket.connected) {
    socket.close();
    socket = null;
    return;
  }

  socket.disconnect();
  socket = null;
};

export const pubsubRegisterChat = async ({ connectTarget, eventCategories }: TargetClassMap): Promise<any> =>
  new Promise((resolve, reject) => {
    socket.emit(
      'call',
      SVC_PUBSUB_REGISTER_CHAT,
      {
        platformName: 'twitch',
        connectTarget: connectTarget.toLowerCase(),
        eventCategories
      },
      (err, resp) => {
        if (err) {
          reject(err);
        } else {
          resolve(resp);
        }
      }
    );
  });

export const pubsubUnregisterChat = async (connectTarget: string): Promise<any> =>
  new Promise((resolve, reject) => {
    socket.emit(
      'call',
      SVC_PUBSUB_UNREGISTER_CHAT,
      {
        platformName: 'twitch',
        connectTarget: connectTarget.toLowerCase()
      },
      (err, resp) => {
        if (err) {
          reject(err);
        } else {
          resolve(resp);
        }
      }
    );
  });
