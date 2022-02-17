import useStore from '-/store';
import React, { useMemo, useState } from 'react';
import { EventEntryFactory } from './EventEntryFactory';
import { EntryHeader } from './Header';

export const EventEntryPanel = () => {
  const { activeTargetClassMap, events } = useStore(s => s);

  const [desiredEventTypes, setDesiredEventTypes] = useState(activeTargetClassMap.eventCategories);

  const { connectTarget } = activeTargetClassMap;
  const activeEvents = events[connectTarget];

  const filteredEvents = useMemo(
    () => activeEvents.filter(aE => desiredEventTypes.includes(aE.eventClassification.category)),
    [activeEvents, desiredEventTypes]
  );

  return (
    <>
      <EntryHeader {...{ desiredEventTypes, setDesiredEventTypes }} />

      <EventEntryFactory events={filteredEvents} />
    </>
  );
};
