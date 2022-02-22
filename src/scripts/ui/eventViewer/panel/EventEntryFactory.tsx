import { EventClassifications, NormalizedMessagingEvent, PubSubConnectionResponse } from '-/store/PubSubMessaging';
import { StyledEventViewer } from '-/styles/eventViewer';
import { useMantineTheme } from '@mantine/core';
import React from 'react';
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
  events: NormalizedMessagingEvent[];
};

export const EventEntryFactory = ({ pubSubConnection, events }: EventEntryFactoryProps) => {
  const theme = useMantineTheme();
  const { cx, classes: cssClasses } = StyledEventViewer(
    theme.other.Platforms[pubSubConnection.pubsub.platformName] || theme.other.Platforms.default
  );

  const createDecoratedEventEntry = ({ rowData: nEvent }) => {
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
  };

  //!FIXME Make this a knob
  events.reverse();

  const ScrollArea = ({ width, height }) => (
    <BaseTable
      headerHeight={0}
      data={events}
      rowKey="pubSubMsgId"
      rowRenderer={createDecoratedEventEntry}
      estimatedRowHeight={50}
      className={cssClasses.PanelScrollArea}
      sortBy={{ key: 'timestamp', order: 'desc' }}
      {...{ width, height }}
    >
      <Column key="col0" width={0} flexGrow={1} />
    </BaseTable>
  );

  return <AutoResizer>{ScrollArea}</AutoResizer>;
};
