import useStore from '-/store';
import { StyledEventViewer } from '-/styles/eventViewer';
import { useMantineTheme } from '@mantine/core';
import { EventClassifications, NormalizedMessagingEvent, PubSubConnectionResponse } from 'golden-hammer-shared';
import React, { useCallback, useMemo } from 'react';
import BaseTable, { AutoResizer, Column } from 'react-base-table';
import AdministrativeEventEntry from '../entries/AdministrativeEventEntry';
import MonetizationEventEntry from '../entries/MonetizationEventEntry';
import UserChatEventEntry from '../entries/UserChatEventEntry';

////////////////////////////////////////////////////////////////////////////////////////////
// Entry View Mapping for Factory

export type EntryViewProps = {
  normalizedEvent: NormalizedMessagingEvent;
};

type EventClassEntryViewMapType = {
  [eventClass in EventClassifications]?: (props: EntryViewProps) => JSX.Element;
};

const EventClassEntryViewMap: EventClassEntryViewMapType = {
  UserChat: UserChatEventEntry,
  Administration: AdministrativeEventEntry,
  Monetization: MonetizationEventEntry
};

////////////////////////////////////////////////////////////////////////////////////////////
// EventEntryFactory

type EventEntryFactoryProps = {
  pubSubConnection: PubSubConnectionResponse;
  desiredEventTypes: string[];
};

export const EventEntryFactory = ({ pubSubConnection, desiredEventTypes }: EventEntryFactoryProps) => {
  const connectTarget = pubSubConnection.pubsub.connectTarget;
  const activeEvents = useStore(s => s.events[connectTarget]);

  const theme = useMantineTheme();

  const { cx, classes: cssClasses } = StyledEventViewer(
    theme.other.Platforms[pubSubConnection.pubsub.platformName] || theme.other.Platforms.default
  );

  const createDecoratedEventEntry = useCallback(
    ({ rowData: nEvent }) => {
      const EntryContent = EventClassEntryViewMap[nEvent.eventClassification.category];
      const key = nEvent.pubSubMsgId;

      const eventEntryClassNames = [
        cssClasses.EventLogEntry,
        cssClasses[`${nEvent.eventClassification.category}-${nEvent.eventClassification.subCategory}`]
      ];

      return (
        <div key={key} className={cx.apply(null, eventEntryClassNames)}>
          <EntryContent normalizedEvent={nEvent} />
        </div>
      );
    },
    [activeEvents]
  );

  const filteredEvents = useMemo(
    //!FIXME Make reversing this a "knob"
    () => activeEvents.filter(aE => desiredEventTypes.includes(aE.eventClassification.category)).reverse(),
    [activeEvents, desiredEventTypes]
  );

  const ScrollArea = ({ width, height }) => (
    <BaseTable
      headerHeight={0}
      data={filteredEvents}
      rowKey="pubSubMsgId"
      rowRenderer={createDecoratedEventEntry}
      estimatedRowHeight={50}
      sortBy={{ key: 'timestamp', order: 'desc' }}
      {...{ width, height }}
    >
      <Column key="col0" width={0} flexGrow={1} />
    </BaseTable>
  );

  return <AutoResizer>{ScrollArea}</AutoResizer>;
};
