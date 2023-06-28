import type { AdministrationEventData, MonetizationEventData, PubSubConnectionResponse } from 'golden-hammer-shared';
import type { Socket } from 'socket.io-client';
import type { GetState, SetState } from 'zustand';
import { eventer } from './Actions.js';
import { SocketStatus } from './InitState.js';
import type { ConnectedTarget, IStore, StatMap, UINormalizedMessagingEvent } from './index.js';

const MAX_CONNECT_FAILS = 5;
const MAX_COUNT_EVENTS = 1000;

let CurrentFailures = 0;

export const bindSocketStatus = (set: SetState<IStore>, get: GetState<IStore>, socket: Socket) => {
  socket.on('gh-messaging.evented', normalizedEvent => set(state => processSocketEvent(state, normalizedEvent)));

  socket.on('connect', () => {
    CurrentFailures = 0;
    set({ connectionStatus: SocketStatus.Connected });
    eventer.dispatchEvent(new CustomEvent('connect'));
  });

  socket.on('connect_error', err => {
    set({ connectionStatus: SocketStatus.Disconnected });
    eventer.dispatchEvent(new CustomEvent('error', { detail: err.message }));
  });

  socket.on('disconnect', reason => {
    set({ connectionStatus: SocketStatus.Disconnected, events: {}, connectedTargets: new Map() });
    eventer.dispatchEvent(new CustomEvent('disconnect', { detail: reason }));

    if (++CurrentFailures >= MAX_CONNECT_FAILS) {
      CurrentFailures = 0;
      eventer.dispatchEvent(new CustomEvent('error', { detail: 'Too many attempts, giving up!' }));
      socket.disconnect();
    }
  });

  socket.on('gh-pubsub.rejected', ({ reason }) => {
    eventer.dispatchEvent(new CustomEvent('error', { detail: reason }));
  });
};

export const registerPubSub = (state: IStore, pubSubConnection: ConnectedTarget) => {
  //Enforce lowercase name for store
  pubSubConnection.pubsub.connectTarget = pubSubConnection.pubsub.connectTarget.toLowerCase();

  const {
    pubsub: { connectTarget }
  } = pubSubConnection;

  return {
    activeConnectedTarget: pubSubConnection,
    connectedTargets: new Map(state.connectedTargets).set(connectTarget, pubSubConnection),
    stats: {
      ...state.stats,
      [connectTarget]: state.stats[connectTarget] || {}
    },
    events: {
      ...state.events,
      [connectTarget]: state.events[connectTarget] || []
    }
  };
};

export const unregisterPubSub = (state: IStore, pubSubConnection: PubSubConnectionResponse) => {
  //Enforce lowercase name for store
  pubSubConnection.pubsub.connectTarget = pubSubConnection.pubsub.connectTarget.toLowerCase();

  const newMap = new Map(state.connectedTargets);
  newMap.delete(pubSubConnection.pubsub.connectTarget);

  return {
    ...state,
    connectedTargets: newMap,
    activeConnectedTarget: null
  };
};

export function processSocketEvent(state: IStore, normalizedEvent: UINormalizedMessagingEvent) {
  let newEventMap = ringBufferEvents(state.events, normalizedEvent);
  newEventMap = filterAdminEvents(newEventMap, normalizedEvent);

  const newConnectedTargets = markUpdateIfInactive(
    state.activeConnectedTarget,
    state.connectedTargets,
    normalizedEvent
  );

  const newStatsMap = addStats(state.stats, normalizedEvent);

  return {
    ...state,

    connectedTargets: newConnectedTargets,

    stats: newStatsMap,
    events: newEventMap
  };
}

function addStats(state: IStore['stats'], normalizedEvent: UINormalizedMessagingEvent) {
  const [category] = normalizedEvent.eventClassification.split('.');

  const connectTarget = normalizedEvent.connectTarget.toLowerCase();
  const prevStats = state[connectTarget];

  const statMap: StatMap = {
    ...prevStats,
    TotalEvents: Number(prevStats['TotalEvents'] || 0) + 1,
    [category]: Number(prevStats[category] || 0) + 1,
    [normalizedEvent.eventClassification]: Number(prevStats[normalizedEvent.eventClassification] || 0) + 1
  };

  // Track monetization totals for UI display purposes
  if ('Monetization' === category && 'submysterygift' !== normalizedEvent.platform.eventName) {
    statMap['Earnings'] =
      Number(statMap['Earnings'] || 0) + ((normalizedEvent.eventData as MonetizationEventData)?.estimatedValue ?? 0);
  }

  return {
    ...state,
    [connectTarget]: statMap
  };
}

function ringBufferEvents(state: IStore['events'], normalizedEvent: UINormalizedMessagingEvent) {
  const newEventList = [...state[normalizedEvent.connectTarget], normalizedEvent];

  if (newEventList.length > MAX_COUNT_EVENTS) {
    newEventList.shift();
  }

  return {
    ...state,
    [normalizedEvent.connectTarget]: newEventList
  };
}

function filterAdminEvents(eventMap: IStore['events'], normalizedEvent: UINormalizedMessagingEvent) {
  if (!normalizedEvent.eventClassification.startsWith('Administration')) {
    return eventMap;
  }

  const filteredEvents = eventMap[normalizedEvent.connectTarget].map(prevEvent => {
    const data = normalizedEvent.eventData as AdministrationEventData;

    if ('UserChat.Message' !== prevEvent.eventClassification) {
      return prevEvent;
    }

    // Determines if the target type is a user, if we're not trying to remove a specific message
    const targetTypeUser = 'Administration.MessageRemoval' !== normalizedEvent.eventClassification;
    // Note the different array access (1 v 0), as well as sub-member ID
    const testTargetId = targetTypeUser
      ? // FIXME: Need to have proper types at some point!!!!
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (prevEvent.platform.eventData as any)[0]['user-id']
      : // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (prevEvent.platform.eventData as any)[0]['id'];

    prevEvent.isRemoved = testTargetId === data.targetId;
    return prevEvent;
  });

  return {
    ...eventMap,
    [normalizedEvent.connectTarget]: filteredEvents
  };
}

function markUpdateIfInactive(
  activePubSub: ConnectedTarget | null,
  connectedTargets: IStore['connectedTargets'],
  normalizedEvent: UINormalizedMessagingEvent
) {
  const oldConnect = connectedTargets.get(normalizedEvent.connectTarget);

  // Active, no need to mark updated!
  if (!activePubSub || !oldConnect || activePubSub.pubsub.connectTarget === normalizedEvent.connectTarget) {
    return connectedTargets;
  }

  if (oldConnect.hasUpdates === true) {
    return connectedTargets;
  }

  oldConnect.hasUpdates = true;

  return new Map(connectedTargets).set(normalizedEvent.connectTarget, oldConnect);
}
