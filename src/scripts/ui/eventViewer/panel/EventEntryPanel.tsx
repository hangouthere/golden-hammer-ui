import useStore from '-/store';
import { StyledEventViewer } from '-/styles/eventViewer';
import { useMantineTheme } from '@mantine/core';
import React, { useState } from 'react';
import shallow from 'zustand/shallow';
import { EventEntryFactory } from './EventEntryFactory';
import EntryHeader from './Header';

export const EventEntryPanel = () => {
  const theme = useMantineTheme();
  const activePubSub = useStore(s => s.activePubSub, shallow);

  const chatInfo = activePubSub.pubsub;
  const [desiredEventTypes, setDesiredEventTypes] = useState(chatInfo.eventCategories);

  const {
    classes: { PanelScrollContainer }
  } = StyledEventViewer(theme.other.Platforms[activePubSub.pubsub.platformName] || theme.other.Platforms.default);

  return (
    <>
      <EntryHeader {...{ desiredEventTypes, setDesiredEventTypes }} />

      <div className={PanelScrollContainer}>
        <EventEntryFactory pubSubConnection={activePubSub} desiredEventTypes={desiredEventTypes} />
      </div>
    </>
  );
};
