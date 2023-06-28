import useStore, { GHPubSub_EventTypes, type ConnectedTarget } from '-/scripts/store/index.js';
import { StyledEventViewer } from '-/scripts/styles/eventViewer.js';
import { useMantineTheme } from '@mantine/core';
import { useEffect, useState } from 'react';
import shallow from 'zustand/shallow';
import { EventEntryFactory } from './EventEntryFactory.js';
import { EntryHeader } from './Header/index.js';

export const EventEntryPanel = () => {
  const theme = useMantineTheme();
  const activePubSub = useStore(s => s.activeConnectedTarget, shallow);

  const pubSubInfo = (activePubSub as ConnectedTarget).pubsub;
  const [desiredEventTypes, setDesiredEventTypes] = useState(pubSubInfo?.eventClassifications);
  const [searchTerm, setSearchTerm] = useState('');

  const {
    classes: { PanelScrollContainer }
  } = StyledEventViewer(
    theme.other.Platforms[activePubSub?.pubsub.platformName as string] || theme.other.Platforms.default
  );

  useEffect(() => setDesiredEventTypes(pubSubInfo?.eventClassifications), [...GHPubSub_EventTypes]);

  return (
    <>
      <EntryHeader {...{ searchTerm, setSearchTerm, desiredEventTypes, setDesiredEventTypes }} />

      <div className={PanelScrollContainer}>
        <EventEntryFactory
          pubSubConnection={activePubSub}
          desiredEventTypes={desiredEventTypes}
          searchTerm={searchTerm}
        />
      </div>
    </>
  );
};
