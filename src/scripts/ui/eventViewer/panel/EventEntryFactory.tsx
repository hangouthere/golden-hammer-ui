import { NormalizedMessagingEvent } from '-/store/PubSubMessaging';
import React from 'react';
import AdministrativeEventEntry from '../entries/AdministrativeEventEntry';
import MonetizationEventEntry from '../entries/MonetizationEventEntry';
import UserChatEventEntry from '../entries/UserChatEventEntry';

const EventClassEntryMap: { [eventClass: string]: ({ normalizedEvent: NormalizedMessagingEvent }) => JSX.Element } = {
  UserChat: UserChatEventEntry,
  Administration: AdministrativeEventEntry,
  Monetization: MonetizationEventEntry
};

type Props = {
  events: NormalizedMessagingEvent[];
};

export const EventEntryFactory = ({ events }: Props) => {
  const entryViews = events.map(nEvent => {
    const EntryType = EventClassEntryMap[nEvent.eventClassification.category];

    return <EntryType normalizedEvent={nEvent} />;
  });

  //!FIXME Add virtualized scroller!

  return <>{entryViews}</>;
};
