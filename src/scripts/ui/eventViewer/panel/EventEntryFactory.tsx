import useStore, { type UINormalizedMessagingEvent } from '-/scripts/store';
import { StyledEventViewer } from '-/scripts/styles/eventViewer';
import { useMantineTheme } from '@mantine/core';
import type { EventClassifications, PubSubConnectionResponse } from 'golden-hammer-shared';
import React, { useCallback, useMemo } from 'react';
import BaseTable, { AutoResizer, Column } from 'react-base-table';
import AdministrativeEventEntry from '../entries/AdministrativeEventEntry';
import MonetizationEventEntry from '../entries/MonetizationEventEntry';
import UserChatEventEntry from '../entries/UserChatEventEntry';

const SKIPPED_EVENTS = ['submysterygift'];

////////////////////////////////////////////////////////////////////////////////////////////
// Entry View Mapping for Factory

export type EntryViewProps = {
  normalizedEvent: UINormalizedMessagingEvent;
};

type Dims = { width: number; height: number };

type EntryViewComponent = (props: EntryViewProps) => JSX.Element | null;

type EventClassEntryViewMapType = {
  [eventClass in EventClassifications]?: EntryViewComponent;
};

const EventClassEntryViewMap: EventClassEntryViewMapType = {
  UserChat: UserChatEventEntry,
  Administration: AdministrativeEventEntry,
  Monetization: MonetizationEventEntry
};

////////////////////////////////////////////////////////////////////////////////////////////
// EventEntryFactory

type EventEntryFactoryProps = {
  pubSubConnection: PubSubConnectionResponse | null;
  desiredEventTypes?: string[];
};

export const EventEntryFactory = ({ pubSubConnection, desiredEventTypes }: EventEntryFactoryProps) => {
  const connectTarget = pubSubConnection?.pubsub.connectTarget as string;
  const activeEvents = useStore(s => s.events[connectTarget]);

  const theme = useMantineTheme();

  const { cx, classes: cssClasses } = StyledEventViewer(
    theme.other.Platforms[pubSubConnection?.pubsub.platformName as string] || theme.other.Platforms.default
  );

  const createDecoratedEventEntry = useCallback(
    ({ rowData }: { rowData: UINormalizedMessagingEvent }) => {
      const fqcn = `${rowData.eventClassification.category}-${rowData.eventClassification.subCategory}`;
      const EntryContent = EventClassEntryViewMap[rowData.eventClassification.category] as EntryViewComponent;
      const key = rowData.pubSubMsgId;

      const eventEntryClassNames = [
        cssClasses.EventLogEntry,
        (cssClasses as any)[rowData.eventClassification.category],
        (cssClasses as any)[fqcn]
      ];

      return (
        <div key={key} className={cx.apply(null, eventEntryClassNames)}>
          <EntryContent normalizedEvent={rowData} />
        </div>
      );
    },
    [activeEvents]
  );

  const filteredEvents = useMemo(
    () =>
      activeEvents
        .filter(aE => {
          const shouldSkip =
            SKIPPED_EVENTS.includes(aE.eventClassification.category) || SKIPPED_EVENTS.includes(aE.platform.eventName);
          return !shouldSkip && desiredEventTypes?.includes(aE.eventClassification.category);
        })
        .reverse(),
    [activeEvents, desiredEventTypes]
  );

  const ScrollArea = useCallback(
    ({ width, height }: Dims) => (
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
    ),
    [filteredEvents]
  );

  return <AutoResizer>{ScrollArea}</AutoResizer>;
};
