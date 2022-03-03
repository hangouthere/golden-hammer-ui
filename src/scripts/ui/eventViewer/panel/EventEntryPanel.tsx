import useStore, { GHPubSub_EventTypes } from '-/scripts/store';
import { StyledEventViewer } from '-/scripts/styles/eventViewer';
import { useMantineTheme } from '@mantine/core';
import React, { useEffect, useState } from 'react';
import shallow from 'zustand/shallow';
import { EventEntryFactory } from './EventEntryFactory';
import EntryHeader from './Header';

export const EventEntryPanel = () => {
  const theme = useMantineTheme();
  const activePubSub = useStore(s => s.activePubSub, shallow);

  const pubSubInfo = activePubSub!.pubsub;
  const [desiredEventTypes, setDesiredEventTypes] = useState(pubSubInfo?.eventCategories);
  const [searchTerm, setSearchTerm] = useState('');

  const {
    classes: { PanelScrollContainer }
  } = StyledEventViewer(
    theme.other.Platforms[activePubSub?.pubsub.platformName as string] || theme.other.Platforms.default
  );

  useEffect(() => setDesiredEventTypes(pubSubInfo?.eventCategories), [...GHPubSub_EventTypes]);

  return (
    <>
      <EntryHeader {...{ searchTerm, setSearchTerm, desiredEventTypes, setDesiredEventTypes }} />

      <div className={PanelScrollContainer}>
        <EventEntryFactory pubSubConnection={activePubSub} desiredEventTypes={desiredEventTypes} searchTerm={searchTerm} />
      </div>
    </>
  );
};
