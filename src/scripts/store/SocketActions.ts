import type {
  EventClassifications,
  MonetizationEventData,
  NormalizedMessagingEvent,
  PubSubConnectionResponse
} from 'golden-hammer-shared';
import type { IStore, StatMap } from '.';

const MAX_COUNT_EVENTS = 500;

export const registerPubSub = (state: IStore, pubSubConnection: PubSubConnectionResponse) => {
  //Enforce lowercase name for store
  pubSubConnection.pubsub.connectTarget = pubSubConnection.pubsub.connectTarget.toLowerCase();

  let {
    pubsub: { connectTarget }
  } = pubSubConnection;

  return {
    activePubSub: pubSubConnection,
    connectedPubSubs: new Map(state.connectedPubSubs).set(connectTarget, pubSubConnection),
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

  const newMap = new Map(state.connectedPubSubs);
  newMap.delete(pubSubConnection.pubsub.connectTarget);

  return {
    ...state,
    connectedPubSubs: newMap,
    activePubSub: null
  };
};

export function processSocketEvent(state: IStore, normalizedEvent: NormalizedMessagingEvent) {
  const newEventMap = ringBufferEvents(state.events, normalizedEvent);
  const newStatsMap = addStats(state.stats, normalizedEvent);

  return {
    ...state,

    stats: {
      ...newStatsMap
    },
    events: {
      ...newEventMap
    }
  };
}

function addStats(state: IStore['stats'], normalizedEvent: NormalizedMessagingEvent) {
  const { category, subCategory } = normalizedEvent.eventClassification;
  const fqcn = `${category}.${subCategory}` as EventClassifications;

  const connectTarget = normalizedEvent.connectTarget.toLowerCase();
  const prevStats = state[connectTarget];

  const statMap: StatMap = {
    ...prevStats,
    TotalEvents: Number(prevStats['TotalEvents'] || 0) + 1,
    [category]: Number(prevStats[category] || 0) + 1,
    [fqcn]: Number(prevStats[fqcn] || 0) + 1
  };

  // Track monetization totals for UI display purposes
  if ('Monetization' === category && 'submysterygift' === normalizedEvent.platform.eventName) {
    statMap['Earnings'] =
      Number(statMap['Earnings'] || 0) + (normalizedEvent.eventData as MonetizationEventData).estimatedValue!;
  }

  return {
    ...state,
    [connectTarget]: statMap
  };
}

function ringBufferEvents(state: IStore['events'], normalizedEvent: NormalizedMessagingEvent) {
  const newEventList = [...state[normalizedEvent.connectTarget], normalizedEvent];

  if (newEventList.length > MAX_COUNT_EVENTS) {
    newEventList.shift();
  }

  return {
    ...state,
    [normalizedEvent.connectTarget]: newEventList
  };
}
