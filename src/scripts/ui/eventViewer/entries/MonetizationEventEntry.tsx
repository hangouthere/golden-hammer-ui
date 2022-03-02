import type { MonetizationEventData, NormalizedMessagingEvent } from 'golden-hammer-shared';
import React from 'react';
import type { EntryViewProps } from '../panel/EventEntryFactory';

export default function MonetizationEventEntry({ normalizedEvent }: EntryViewProps): JSX.Element | null {
  const {
    eventData: { sourceUserName, targetUserName, estimatedValue, duration },
    eventClassification: { subCategory }
  } = normalizedEvent as NormalizedMessagingEvent & { eventData: MonetizationEventData };

  const prefix = <span className="userName">{targetUserName || sourceUserName}</span>;
  const estValTxt = estimatedValue?.toFixed(2);

  if ('Tip' === subCategory) {
    return (
      <>
        {prefix} has Tipped <span className="estimatedValue">${estValTxt}</span>
      </>
    );
  }

  const monthTxt = Number(duration) > 1 ? 'months' : 'month';

  return (
    <>
      {prefix} has Subscribed for{' '}
      <span className="duration">
        {duration || 1} {monthTxt}
      </span>
      &nbsp;
      <span className="estimatedValue">(${estValTxt})</span>
    </>
  );
}
