import useStore, { type ConnectedTarget, type IStore, type UINormalizedMessagingEvent } from '-/scripts/store/index.js';
import { StyledEventViewer } from '-/scripts/styles/eventViewer.js';
import { Button, Transition, useMantineTheme } from '@mantine/core';
import { type EventClassifications, type PubSubConnectionResponse } from 'golden-hammer-shared';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import BaseTable, { AutoResizer, Column } from 'react-base-table';
import shallow from 'zustand/shallow';
import AdministrativeEventEntry from './entries/AdministrativeEventEntry.js';
import MonetizationEventEntry from './entries/MonetizationEventEntry.js';
import PlatformSpecificEventEntry from './entries/PlatformSpecificEventEntry.js';
import UnknownEventEntry from './entries/UnknownEventEntry.js';
import UserChatEventEntry from './entries/UserChatEventEntry.js';

const SKIPPED_EVENTS: string[] = [];

////////////////////////////////////////////////////////////////////////////////////////////
// Entry View Mapping for Factory

export type EntryViewProps = {
  normalizedEvent: UINormalizedMessagingEvent;
};

type Dims = { width: number; height: number };

type EntryViewComponent = (props: EntryViewProps) => JSX.Element | null;

const EventClassEntryViewMap = {
  Unknown: UnknownEventEntry,
  UserChat: UserChatEventEntry,
  Administration: AdministrativeEventEntry,
  Monetization: MonetizationEventEntry,
  PlatformSpecific: PlatformSpecificEventEntry
};

type FrozenOverlayProps = {
  show: boolean;
  eventCount: number;
  frozenEventCount: number;
  resumeEvents: () => void;
};

const FrozenOverlay = ({ show, resumeEvents, eventCount, frozenEventCount }: FrozenOverlayProps) => {
  const theme = useMantineTheme();
  const missing = eventCount - frozenEventCount;
  const {
    classes: { FrozenEventsOverlay }
  } = StyledEventViewer(theme.other.Platforms.default);

  return (
    <Transition transition="slide-down" mounted={show && missing > 0}>
      {transitionStyles => {
        transitionStyles.transform += ' translateX(-50%)';
        return (
          <Button
            variant="outline"
            size="lg"
            compact
            style={transitionStyles}
            className={FrozenEventsOverlay}
            onClick={resumeEvents}
          >
            More Events: {missing}
          </Button>
        );
      }}
    </Transition>
  );
};

////////////////////////////////////////////////////////////////////////////////////////////
// EventEntryFactory

const getState = (s: IStore) => {
  const connectedTarget = s.activeConnectedTarget as ConnectedTarget;
  return ({
    activeEvents: s.events[connectedTarget.pubsub.connectTarget],
    activeStats: s.stats[connectedTarget.pubsub.connectTarget]
  });
};

type EventEntryFactoryProps = {
  pubSubConnection: PubSubConnectionResponse | null;
  desiredEventTypes?: EventClassifications;
  searchTerm: string;
};

export const EventEntryFactory = ({ pubSubConnection, desiredEventTypes, searchTerm }: EventEntryFactoryProps) => {
  const theme = useMantineTheme();
  const connectTarget = pubSubConnection?.pubsub.connectTarget as string;
  const { activeEvents, activeStats } = useStore(getState, shallow);

  const [frozenEventCount, setFrozenEventCount] = useState(0);
  const [isFrozen, setIsFrozen] = useState(false);
  const tableRef = useRef<BaseTable<UINormalizedMessagingEvent>>();
  const setTableRef = useCallback(r => (tableRef.current = r), []);
  const resumeEvents = useCallback(
    () => tableRef.current?.scrollToPosition({ scrollTop: 0, scrollLeft: 0 }),
    [connectTarget]
  );

  const onScroll = useCallback(
    ({ scrollTop }) => {
      const shouldFreeze = scrollTop > 1;
      setIsFrozen(shouldFreeze);
      setFrozenEventCount(Number(activeStats.TotalEvents) || 0);
    },
    [activeStats]
  );

  const { cx, classes: cssClasses } = StyledEventViewer(
    theme.other.Platforms[pubSubConnection?.pubsub.platformName as string] || theme.other.Platforms.default
  );

  const createDecoratedEventEntry = useCallback(
    ({ rowData }: { rowData: UINormalizedMessagingEvent }) => {
      const [category] = rowData.eventClassification.split('.');
      const fqcn = rowData.eventClassification.replace('.', '-');
      const platformCn = `${rowData.platform.name}-${rowData.platform.eventName}`;

      const chosenViewComponent: EntryViewComponent =
        EventClassEntryViewMap[category as keyof EntryViewComponent] || EventClassEntryViewMap['Unknown'];
      const EntryContent = chosenViewComponent;
      const key = rowData.pubSubMsgId;

      const eventEntryClassNames = [
        cssClasses.EventLogEntry,
        cssClasses[category as keyof typeof cssClasses],
        cssClasses[fqcn as keyof typeof cssClasses],
        cssClasses[platformCn as keyof typeof cssClasses],
        fqcn,
        platformCn
      ];

      return (
        <div key={key} className={cx(eventEntryClassNames)}>
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
            SKIPPED_EVENTS.includes(aE.eventClassification) ||
            SKIPPED_EVENTS.includes(aE.platform.eventName) ||
            !JSON.stringify(aE.eventData || '').includes(searchTerm);
          return !shouldSkip && desiredEventTypes?.includes(aE.eventClassification);
        })
        .reverse(),
    [activeEvents, desiredEventTypes, searchTerm, isFrozen]
  );

  const [possiblyFrozenEvents, setPossiblyFrozenEvents] = useState(filteredEvents);

  useEffect(() => {
    if (isFrozen) return;
    setPossiblyFrozenEvents(filteredEvents);
  }, [filteredEvents]);

  useEffect(() => {
    // Update events to current filtered from activeEvents
    setPossiblyFrozenEvents(filteredEvents);
    // Scroll to top
    resumeEvents();
  }, [connectTarget]);

  const ScrollArea = useCallback(
    ({ width, height }: Dims) => (
      <BaseTable
        ref={setTableRef}
        headerHeight={0}
        data={possiblyFrozenEvents}
        rowKey="pubSubMsgId"
        rowRenderer={createDecoratedEventEntry}
        estimatedRowHeight={50}
        sortBy={{ key: 'timestamp', order: 'desc' }}
        onScroll={onScroll}
        {...{ width, height }}
      >
        <Column key="col0" width={0} flexGrow={1} />
      </BaseTable>
    ),
    [possiblyFrozenEvents]
  );

  return (
    <>
      <FrozenOverlay
        show={isFrozen}
        resumeEvents={resumeEvents}
        eventCount={Number(activeStats.TotalEvents)}
        frozenEventCount={frozenEventCount}
      />
      <AutoResizer>{ScrollArea}</AutoResizer>
    </>
  );
};
