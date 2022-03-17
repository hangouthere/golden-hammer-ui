import type { MonetizationEventData, NormalizedMessagingEvent } from 'golden-hammer-shared';
import React from 'react';
import type { EntryViewProps } from '../EventEntryFactory';

export default function MonetizationEventEntry({ normalizedEvent }: EntryViewProps): JSX.Element | null {
  const {
    platform: { name: platformName },
    eventData: { sourceUserName, targetUserName, estimatedValue, duration },
    eventClassification
  } = normalizedEvent as NormalizedMessagingEvent & { eventData: MonetizationEventData };

  const prefix = <span className="userName">{targetUserName || sourceUserName}</span>;
  const estValTxt = estimatedValue?.toFixed(2);

  if ('Monetization.Tip' === eventClassification) {
    return (
      <>
        {prefix} has Tipped <span className="estimatedValue">${estValTxt}</span>
      </>
    );
  }

  const monthTxt = Number(duration) > 1 ? 'months' : 'month';

  let subAction = 'Subscribed';

  if ('twitch' === platformName) {
    if ('resub' === normalizedEvent.platform.eventName) {
      subAction = 'Resubscribed';
    }

    if ('submysterygift' === normalizedEvent.platform.eventName) {
      return (
        <>
          {prefix} has Gifted <span className="duration">{normalizedEvent.platform.eventData[1]}</span> Subs{' '}
          <span className="estimatedValue">(${estValTxt})</span>
        </>
      );
    }

    if ('subgift' === normalizedEvent.platform.eventName) {
      return (
        <>
          {prefix} was Gifted a sub by {sourceUserName}
        </>
      );
    }
  }

  return (
    <>
      {prefix} has {subAction} for{' '}
      <span className="duration">
        {duration || 1} {monthTxt}
      </span>
      &nbsp;
      <span className="estimatedValue">(${estValTxt})</span>
    </>
  );
}
