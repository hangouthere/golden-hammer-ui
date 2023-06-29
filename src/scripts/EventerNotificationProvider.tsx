import { useNotifications } from '@mantine/notifications';
import type { PubSubConnectionResponse } from 'golden-hammer-shared';
import { useCallback, useEffect } from 'react';
import { eventer } from './store/EventBus.js';

type Props = { children: JSX.Element | null };

const updateURIWithConnectTarget = (connectTarget: string, isRemoval = false) => {
  // Update the URL params
  const urlParams = new URLSearchParams(globalThis.location.search);
  const currentTargets = urlParams.getAll('connectTargets');

  if (!isRemoval && currentTargets.includes(connectTarget)) {
    return;
  }

  if (isRemoval) {
    urlParams.delete('connectTargets');

    currentTargets.filter(t => t !== connectTarget).forEach(t => urlParams.append('connectTargets', t));
  } else {
    urlParams.append('connectTargets', connectTarget);
  }

  window.history.replaceState({}, '', `${globalThis.location.pathname}?${urlParams.toString()}`);
};

export default function EventerNotificationProvider({ children }: Props) {
  const noti = useNotifications();

  const onError = useCallback(
    event => {
      noti.showNotification({
        message: event.detail,
        color: 'red'
      });
    },
    [noti]
  );

  const onConnect = useCallback(() => {
    noti.showNotification({
      message: 'Successfully Connected!',
      color: 'green'
    });
  }, [noti]);

  const onRegistered = useCallback(
    event => {
      const conn = event.detail as PubSubConnectionResponse;

      updateURIWithConnectTarget(conn.pubsub.connectTarget);

      noti.showNotification({
        message: 'Successfully Registered: ' + conn.pubsub.connectTarget,
        color: 'indigo'
      });
    },
    [noti]
  );

  const onUnregistered = useCallback(
    event => {
      const conn = event.detail as PubSubConnectionResponse;

      updateURIWithConnectTarget(conn.pubsub.connectTarget, true);

      noti.showNotification({
        message: 'Successfully Unregistered: ' + conn.pubsub.connectTarget,
        color: 'indigo'
      });
    },
    [noti]
  );

  const onDisconnect = useCallback(
    event => {
      let msg = event.detail;
      let color = 'yellow';

      if ('io client disconnect' == msg) {
        msg = 'User Disconnected';
      }

      if ('transport close' == msg) {
        msg = `Unable to connect to PubSub server, please check PubSub Config`;
        color = 'red';
      }

      noti.showNotification({
        message: 'Disconnected: ' + msg,
        color
      });
    },
    [noti]
  );

  useEffect(() => {
    eventer.addEventListener('error', onError);
    eventer.addEventListener('connect', onConnect);
    eventer.addEventListener('disconnect', onDisconnect);
    eventer.addEventListener('registered', onRegistered);
    eventer.addEventListener('unregistered', onUnregistered);

    return () => {
      eventer.removeEventListener('error', onError);
      eventer.removeEventListener('connect', onConnect);
      eventer.removeEventListener('disconnect', onDisconnect);
      eventer.removeEventListener('registered', onRegistered);
      eventer.removeEventListener('unregistered', onUnregistered);
    };
  }, []);

  return children;
}
