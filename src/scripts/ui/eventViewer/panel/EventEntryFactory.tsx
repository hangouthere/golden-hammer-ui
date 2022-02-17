import { NormalizedMessagingEvent } from '-/store/PubSubMessaging';
import { StyledEventViewer } from '-/styles/eventViewer';
import { Group } from '@mantine/core';
import React from 'react';
import AdministrativeEventEntry from '../entries/AdministrativeEventEntry';
import MonetizationEventEntry from '../entries/MonetizationEventEntry';
import UserChatEventEntry from '../entries/UserChatEventEntry';

type EntryViewProps = { normalizedEvent: NormalizedMessagingEvent };

type EventClassEntryViewMapType = {
  [eventClass: string]: (props: EntryViewProps) => JSX.Element;
};

const EventClassEntryViewMap: EventClassEntryViewMapType = {
  UserChat: UserChatEventEntry,
  Administration: AdministrativeEventEntry,
  Monetization: MonetizationEventEntry
};

type Props = {
  events: NormalizedMessagingEvent[];
};

export const EventEntryFactory = ({ events }: Props) => {
  const entryViews = events.map(nEvent => {
    const EntryType = EventClassEntryViewMap[nEvent.eventClassification.category];
    const key = nEvent.pubSubMsgId;

    return <EntryType key={key} normalizedEvent={nEvent} />;
  });

  const {
    classes: { PanelList }
  } = StyledEventViewer();

  //!FIXME Add virtualized scroller!

  return (
    <Group direction="column" className={PanelList}>
      {entryViews}
    </Group>
  );
};
