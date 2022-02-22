import useStore from '-/store';
import React, { useMemo, useState } from 'react';
import { EventEntryFactory } from './EventEntryFactory';
import EntryHeader from './Header';

export const EventEntryPanel = () => {
  const { activePubSub, events } = useStore(s => s);

  const chatInfo = activePubSub.pubsub;
  const { connectTarget } = chatInfo;
  const activeEvents = events[connectTarget];

  const [desiredEventTypes, setDesiredEventTypes] = useState(chatInfo.eventCategories);

  const filteredEvents = useMemo(
    () => activeEvents.filter(aE => desiredEventTypes.includes(aE.eventClassification.category)),
    [activeEvents, desiredEventTypes]
  );

  return (
    <>
      <EntryHeader {...{ desiredEventTypes, setDesiredEventTypes }} />

      <EventEntryFactory pubSubConnection={activePubSub} events={filteredEvents} />
    </>
  );
};
