import useStore from '-/store';
import { StyledEventViewer } from '-/styles/eventViewer';
import { useMantineTheme } from '@mantine/core';
import React, { useMemo, useState } from 'react';
import { EventEntryFactory } from './EventEntryFactory';
import { EntryHeader } from './Header';

export const EventEntryPanel = () => {
  const colors = useMantineTheme().other.Platforms.default;

  const { activePubSub, events } = useStore(s => s);
  const { classes: cssClasses } = StyledEventViewer(colors);

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
      <EntryHeader className={cssClasses.PanelHeader} {...{ desiredEventTypes, setDesiredEventTypes }} />

      <EventEntryFactory pubSubConnection={activePubSub} events={filteredEvents} />
    </>
  );
};
