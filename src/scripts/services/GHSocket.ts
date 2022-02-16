import io, { Socket } from 'socket.io-client';

const SVC_PUBSUB_REGISTER_CHAT = 'gh-pubsub.register';

export let socket: Socket;

export const connect = (socketUri: string) => {
  if (socket && socket.connected) {
    disconnect();
  }

  socket = io(socketUri, { transports: ['websocket'] });

  return socket;
};

export const disconnect = () => {
  if (!socket.connected) {
    socket = null;
    return;
  }

  socket.disconnect();
  socket = null;
};

export const pubsubRegisterChat = async ({ connectTarget, eventCategories }): Promise<any> =>
  new Promise((resolve, reject) => {
    socket.emit(
      'call',
      SVC_PUBSUB_REGISTER_CHAT,
      {
        platformName: 'twitch',
        connectTarget,
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
